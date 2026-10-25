/**
 * Cloudflare Pages Function: GET /api/stats (D218), the studio's private dashboard.
 *
 * Reads the Analytics Engine dataset that /api/event writes (blob layout in functions/api/event.ts)
 * through the SQL API and answers the three questions of the blog brief: how many reached
 * /your-site/ and how far they went, which spot on the site brings the WhatsApp clicks, and which
 * blog post sent people on. Behind HTTP Basic auth: any user name, the password is STATS_KEY.
 *
 * Settings on the Pages project: STATS_KEY (secret: a long ASCII password), CF_ACCOUNT_ID, STATS_TOKEN
 * (secret, "Account Analytics: Read"; its own variable, so the form's LEAD_TOKEN never depends on it).
 * Ten wrong passwords from one address in ten minutes and it stops answering for a while.
 * Optional ?days=7|30|90 (default 30).
 */

interface Env {
  STATS_KEY?: string
  CF_ACCOUNT_ID?: string
  STATS_TOKEN?: string
}

interface Row { event: string; placement: string; path: string; src: string; ref: string; n: number }

const DATASET = 'mediawave_events'

const page = (body: string, status = 200, extra: Record<string, string> = {}) =>
  new Response(`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>MediaWave · מדידה</title><style>
body{margin:0;padding:24px 16px 48px;background:#0f1011;color:#ede7da;font:16px/1.6 system-ui,Arial,sans-serif}
main{max-width:880px;margin:0 auto}h1{font-size:28px;margin:0 0 4px}h2{font-size:20px;margin:36px 0 10px}
p{color:#a39d90;margin:0 0 12px}a{color:#9dbcd8}table{width:100%;border-collapse:collapse}
td,th{padding:9px 6px;border-top:1px solid rgba(237,231,218,.14);text-align:start;vertical-align:top}
th{color:#a39d90;font-weight:600;font-size:14px}td.n{text-align:end;font-variant-numeric:tabular-nums;white-space:nowrap}
.bar{display:block;height:6px;margin-top:6px;background:#79a0c5;border-radius:3px}nav a{margin-inline-end:14px}
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
  const sql = `SELECT blob1 AS event, blob2 AS placement, blob3 AS path, blob5 AS src, blob6 AS ref, SUM(_sample_interval) AS n
FROM ${DATASET} WHERE timestamp > NOW() - INTERVAL '${days}' DAY
GROUP BY event, placement, path, src, ref ORDER BY n DESC LIMIT 5000 FORMAT JSON`
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/analytics_engine/sql`, {
    method: 'POST',
    headers: { authorization: `Bearer ${env.STATS_TOKEN}` },
    body: sql,
  })
  if (!res.ok) throw new Error(`Analytics Engine SQL answered ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const out = (await res.json()) as { data?: Record<string, unknown>[] }
  return (out.data ?? []).map((r) => ({
    event: String(r.event ?? ''), placement: String(r.placement ?? ''), path: String(r.path ?? ''),
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
  if (!rows.length) return `<p>${empty}</p>`
  const max = Math.max(...rows.map((r) => r[1]), 1)
  return `<table><tr><th>${head[0]}</th><th class="n">${head[1]}</th></tr>${rows
    .map(([k, n]) => `<tr><td>${esc(k || '(ללא)')}<span class="bar" style="width:${Math.round((n / max) * 100)}%"></span></td><td class="n">${Math.round(n)}</td></tr>`)
    .join('')}</table>`
}

const isS60 = (r: Row) => r.path.startsWith('/your-site')

function render(rows: Row[], days: number): string {
  const funnel: [string, number][] = [
    ['נכנסו ל-/your-site/', sum(rows, (r) => r.event === 'page_view' && isS60(r))],
    ['בחרו תחום', sum(rows, (r) => r.event === 'cta_click' && r.placement.startsWith('s60_field_'))],
    ['כתבו שם', sum(rows, (r) => r.event === 'cta_click' && r.placement === 's60_name')],
    ['בחרו סגנון', sum(rows, (r) => r.event === 'cta_click' && r.placement.startsWith('s60_style_'))],
    ['בחרו מה בונים', sum(rows, (r) => r.event === 'cta_click' && r.placement.startsWith('s60_build_'))],
    ['שלחו בוואטסאפ', sum(rows, (r) => r.event === 'whatsapp_click' && r.placement === 's60_send')],
  ]
  const contact = (r: Row) => r.event === 'whatsapp_click' || r.event === 'tel_click' || r.event === 'mailto_click' || r.event === 'form_submit' || r.event === 'lead_submit'
  const blog = (r: Row) => r.path.startsWith('/blog/') && r.path.length > 6
  const posts = group(rows, (r) => blog(r) && r.event === 'page_view', (r) => r.path)
  const postOut = new Map(group(rows, (r) => blog(r) && (contact(r) || r.event === 'cta_click'), (r) => r.path))
  const fromPosts = group(rows, (r) => r.src.startsWith('blog-') && r.event === 'whatsapp_click', (r) => r.src.slice(5))
  return `<h1>מדידה</h1><p>${days} הימים האחרונים. בלי עוגיות ובלי מזהים: כל שורה היא פעולה, לא אדם.</p>
<nav><a href="?days=7">7 ימים</a><a href="?days=30">30 ימים</a><a href="?days=90">90 ימים</a></nav>
<h2>האתר שלכם ב-60 שניות</h2>${table(['שלב', 'פעמים'], funnel)}
<h2>מאיפה מגיעות לחיצות הוואטסאפ</h2>${table(['מקום באתר', 'לחיצות'], group(rows, (r) => r.event === 'whatsapp_click', (r) => r.placement))}
<h2>כל דרכי הפנייה, לפי עמוד</h2>${table(['עמוד', 'פניות'], group(rows, contact, (r) => r.path))}
<h2>הבלוג: צפיות</h2>${table(['פוסט', 'צפיות'], posts)}
<h2>הבלוג: יצאו מהפוסט לפנייה או ל-60 שניות</h2>${table(['פוסט', 'לחיצות'], [...postOut.entries()].sort((a, b) => b[1] - a[1]))}
<h2>שלחו וואטסאפ אחרי שהגיעו מפוסט</h2>${table(['פוסט', 'הודעות'], fromPosts)}
<h2>מאיפה הגיעו</h2>${table(['אתר מפנה', 'כניסות'], group(rows, (r) => r.event === 'page_view' && !!r.ref, (r) => r.ref))}
<h2>כל האירועים</h2>${table(['אירוע', 'פעמים'], group(rows, () => true, (r) => r.event))}`
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.STATS_KEY) return page('<h1>מדידה</h1><p>הדשבורד עוד לא הוגדר: חסר STATS_KEY בהגדרות של Cloudflare Pages.</p>', 503)
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
