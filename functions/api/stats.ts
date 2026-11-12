/**
 * Cloudflare Pages Function: GET /api/stats (D218), the studio's private page of numbers.
 *
 * Reads the Analytics Engine dataset that /api/event and /api/lead write (blob layout in
 * functions/api/event.ts) through the SQL API and answers what the owner asks: how many saw the form,
 * started it and sent it, whether the mails went out, which spot on the site brings the WhatsApp, phone
 * and mail clicks, which page they came from, and which site sent the visitors.
 *
 * Behind HTTP Basic auth: any user name, the password is STATS_KEY. Ten wrong passwords from one
 * address in ten minutes and it stops answering that address for a while.
 *
 * Settings on the Pages project: STATS_KEY (secret: a long ASCII password), CF_ACCOUNT_ID, STATS_TOKEN
 * (secret, "Account Analytics: Read"; its own variable, so the form's LEAD_TOKEN never depends on it).
 * Optional ?days=7|30|90 (default 30).
 */

interface Env {
  STATS_KEY?: string
  CF_ACCOUNT_ID?: string
  STATS_TOKEN?: string
}

/** the part of the Pages context this function uses (the repo has no workers types installed) */
type Handler = (context: { request: Request; env: Env }) => Response | Promise<Response>

interface Row { event: string; placement: string; path: string; mode: string; src: string; ref: string; n: number }

const DATASET = 'mediawave_events'

/** the site's own names for its spots and outcomes, in the owner's words; an unknown one is shown as it is */
const SPOT: Record<string, string> = {
  hero: 'הפתיחה', hero_process: 'הפתיחה, איך זה עובד', header: 'הסרגל העליון', menu: 'התפריט', corner: 'הפינה הקבועה',
  wheel_next: 'גלגל האתרים', process: 'איך זה עובד', contact: 'אזור יצירת הקשר', contact_form: 'הטופס', footer: 'תחתית העמוד',
}
const SENT_AS: Record<string, string> = {
  mail: 'נשלח במייל', mail_failed: 'המייל לא יצא', whatsapp: 'נפתח וואטסאפ עם ההודעה', whatsapp_after_fail: 'וואטסאפ אחרי מייל שלא יצא',
}
const MAIL: Record<string, string> = {
  sent: 'יצא', failed: 'נכשל אצל Cloudflare', trap: 'נעצר, השדה הנסתר מולא', fast: 'נעצר, נשלח מהר מדי', rate: 'נעצר, יותר מדי פניות מכתובת אחת',
  flood: 'נעצר, יותר מ-20 פניות בשעה',
}

const page = (body: string, status = 200, extra: Record<string, string> = {}) =>
  new Response(`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>MediaWave · מדידה</title><style>
body{margin:0;padding:24px 16px 56px;background:#fff;color:#13241F;font:16px/1.7 system-ui,Arial,sans-serif}
main{max-width:760px;margin:0 auto}h1{font-size:28px;margin:0 0 4px}h2{font-size:20px;margin:40px 0 8px}
p{color:#3F524C;margin:0 0 12px}a{color:#0F8478}table{width:100%;border-collapse:collapse}
td,th{padding:9px 4px;border-top:1px solid #D5E3DF;text-align:start;vertical-align:top}
th{color:#3F524C;font-weight:600;font-size:14px}td.n,th.n{text-align:end;font-variant-numeric:tabular-nums;white-space:nowrap}
.bar{display:block;height:6px;margin-top:6px;background:#C9E8E2}nav a{display:inline-block;padding:10px 0;margin-inline-end:18px}
code{direction:ltr;unicode-bidi:isolate}</style></head><body><main>${body}</main></body></html>`, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...extra },
  })

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** constant-time string compare */
function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let d = 0
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return d === 0
}

/** wrong passwords per address (per isolate, in memory only) */
const misses = new Map<string, number[]>()
const MISS_WINDOW_MS = 10 * 60_000
function blocked(ip: string): boolean {
  const now = Date.now()
  const recent = (misses.get(ip) ?? []).filter((at) => now - at < MISS_WINDOW_MS)
  misses.set(ip, recent)
  if (misses.size > 2000) misses.clear()
  return recent.length >= 10
}
const miss = (ip: string) => misses.set(ip, [...(misses.get(ip) ?? []), Date.now()])

function authorised(request: Request, key: string): boolean {
  const h = request.headers.get('authorization') ?? ''
  if (!h.startsWith('Basic ')) return false
  try {
    const decoded = atob(h.slice(6))
    return same(decoded.slice(decoded.indexOf(':') + 1), key)
  } catch {
    return false
  }
}

async function query(env: Env, days: number): Promise<Row[]> {
  const sql = `SELECT blob1 AS event, blob2 AS placement, blob3 AS path, blob4 AS mode, blob5 AS src, blob6 AS ref, SUM(_sample_interval) AS n
FROM ${DATASET} WHERE timestamp > NOW() - INTERVAL '${days}' DAY
GROUP BY event, placement, path, mode, src, ref ORDER BY n DESC LIMIT 5000 FORMAT JSON`
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${(env.CF_ACCOUNT_ID ?? '').trim()}/analytics_engine/sql`, {
    method: 'POST',
    headers: { authorization: `Bearer ${(env.STATS_TOKEN ?? '').trim()}` },
    body: sql,
  })
  if (!res.ok) throw new Error(`Analytics Engine SQL answered ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const out = (await res.json()) as { data?: Record<string, unknown>[] }
  return (out.data ?? []).map((r) => ({
    event: String(r.event ?? ''), placement: String(r.placement ?? ''), path: String(r.path ?? ''), mode: String(r.mode ?? ''),
    src: String(r.src ?? ''), ref: String(r.ref ?? ''), n: Number(r.n ?? 0),
  }))
}

const sum = (rows: Row[], keep: (r: Row) => boolean) => rows.filter(keep).reduce((a, r) => a + r.n, 0)

function group(rows: Row[], keep: (r: Row) => boolean, key: (r: Row) => string): [string, number][] {
  const m = new Map<string, number>()
  rows.filter(keep).forEach((r) => m.set(key(r), (m.get(key(r)) ?? 0) + r.n))
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

function table(head: [string, string], rows: [string, number][], empty = 'עוד אין נתונים.'): string {
  if (!rows.some((r) => r[1] > 0)) return `<p>${empty}</p>`
  const max = Math.max(...rows.map((r) => r[1]), 1)
  return `<table><tr><th>${head[0]}</th><th class="n">${head[1]}</th></tr>${rows
    .map(([k, n]) => `<tr><td>${esc(k || '(ללא)')}<span class="bar" style="width:${Math.round((n / max) * 100)}%"></span></td><td class="n">${Math.round(n)}</td></tr>`)
    .join('')}</table>`
}

const is = (...events: string[]) => (r: Row) => events.includes(r.event)
/** only the map's own names: a stored label such as "constructor" must not find Object's built-ins */
const named = (map: Record<string, string>, k: string) => (Object.hasOwn(map, k) ? map[k] : k)

function render(rows: Row[], days: number): string {
  const form: [string, number][] = [
    ['ראו את הטופס', sum(rows, is('form_view'))],
    ['התחילו לכתוב', sum(rows, is('form_start'))],
    ['לחצו על שליחה', sum(rows, is('form_submit'))],
  ]
  const reached = is('whatsapp_click', 'tel_click', 'mailto_click', 'form_submit')
  const source = (r: Row) => r.ref || 'בלי אתר מפנה'
  const landings = group(rows, (r) => r.event === 'page_view' && r.mode === 'landing', source)
  return `<h1>מדידה</h1><p>${days} הימים האחרונים. בלי עוגיות ובלי מזהים. כל שורה סופרת פעולות, לא אנשים.</p>
<nav><a href="?days=7">7 ימים</a><a href="?days=30">30 ימים</a><a href="?days=90">90 ימים</a></nav>
<h2>הטופס</h2>${table(['שלב', 'פעמים'], form)}
<h2>מה קרה אחרי הלחיצה על שליחה</h2>${table(['תוצאה', 'פעמים'], group(rows, is('form_submit'), (r) => named(SENT_AS, r.mode)))}
<h2>המיילים שהשרת שלח</h2>${table(['תוצאה', 'מיילים'], group(rows, is('lead_mail'), (r) => named(MAIL, r.mode)), 'עוד לא נשלח מייל מהטופס.')}
<h2>מאיזה מקום באתר לוחצים על וואטסאפ</h2>${table(['מקום', 'לחיצות'], group(rows, is('whatsapp_click'), (r) => named(SPOT, r.placement)))}
<h2>מאיזה מקום לוחצים על הטלפון ועל המייל</h2>${table(['מקום', 'לחיצות'], group(rows, is('tel_click', 'mailto_click'), (r) => `${r.event === 'tel_click' ? 'טלפון' : 'מייל'}, ${named(SPOT, r.placement)}`))}
<h2>מאיזה עמוד פונים</h2>${table(['עמוד', 'פניות'], group(rows, reached, (r) => r.path))}
<h2>מאיזה אתר הגיעו מי שפנו</h2>${table(['אתר מפנה', 'פניות'], group(rows, reached, source))}
<h2>מאיזה קמפיין הגיעו מי שפנו</h2>${table(['התג בקישור', 'פניות'], group(rows, (r) => reached(r) && !!r.src, (r) => r.src), 'עוד לא הגיעה פנייה מקישור עם תג.')}
${landings.length ? `<h2>כניסות לאתר, לפי האתר המפנה</h2>${table(['אתר מפנה', 'כניסות'], landings)}` : ''}
<h2>כל האירועים</h2>${table(['אירוע', 'פעמים'], group(rows, () => true, (r) => r.event))}`
}

export const onRequestGet: Handler = async ({ request, env }) => {
  if (!env.STATS_KEY) return page('<h1>מדידה</h1><p>העמוד עוד לא הוגדר. חסר STATS_KEY בהגדרות של Cloudflare Pages.</p>', 503)
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown'
  if (blocked(ip)) return page('<h1>מדידה</h1><p>יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.</p>', 429)
  if (!authorised(request, env.STATS_KEY)) {
    if (request.headers.get('authorization')) miss(ip)
    return page('<h1>מדידה</h1><p>צריך סיסמה.</p>', 401, { 'www-authenticate': 'Basic realm="MediaWave stats", charset="UTF-8"' })
  }
  if (!env.CF_ACCOUNT_ID || !env.STATS_TOKEN) return page('<h1>מדידה</h1><p>חסרים CF_ACCOUNT_ID או STATS_TOKEN בהגדרות.</p>', 503)
  const asked = Number(new URL(request.url).searchParams.get('days'))
  const days = [7, 30, 90].includes(asked) ? asked : 30
  try {
    return page(render(await query(env, days), days))
  } catch (e) {
    return page(`<h1>מדידה</h1><p>הקריאה מ-Analytics Engine נכשלה.</p><p><code>${esc(String((e as Error).message))}</code></p>`, 502)
  }
}
