/**
 * Cloudflare Pages Function: /api/lead (D218, refitted to the two-field form of the statement site)
 *
 * GET  answers { ready }: whether this deployment can mail an enquiry. The form asks once and decides
 *      at run time; until the settings exist it keeps handing its message to WhatsApp, as before.
 * POST mails one enquiry to the studio through Cloudflare Email Sending (REST API). A send to a verified
 *      destination address is free on every plan and needs no third party.
 *
 * Settings on the Pages project (never in the code, never from the request):
 *   CF_ACCOUNT_ID   the account id (32 hex characters)
 *   LEAD_TOKEN      secret: an API token that may send email. Its own variable, so setting up the
 *                   dashboard (/api/stats has STATS_TOKEN) never switches the form over by accident
 *   LEAD_TO         the address that receives the enquiries: a verified destination address
 *                   (Email Routing > Destination Addresses)
 *   LEAD_FROM       optional, default leads@mediawave.co.il (a domain of the same account)
 *   EVENTS          optional Analytics Engine binding: one anonymous data point per outcome
 *
 * Guards a real visitor never notices: the request must come from this site's own pages, a hidden
 * field stays empty, at least 1.5 s passed on the form, every field is validated again here, the body
 * is capped while it is read, one address sends at most five enquiries in ten minutes and all addresses
 * together at most twenty in an hour (both counted in this isolate's memory only).
 * When the mail service refuses three sends in a row (a revoked token, sending paused), GET answers
 * "not ready" for ten minutes, so new visitors get the WhatsApp button at once and not a failure line.
 * Nothing is stored: the enquiry exists only in the email.
 */

interface AnalyticsEngineDataset {
  writeDataPoint(point: { indexes?: string[]; blobs?: string[]; doubles?: number[] }): void
}

interface Env {
  CF_ACCOUNT_ID?: string
  LEAD_TOKEN?: string
  LEAD_TO?: string
  LEAD_FROM?: string
  EVENTS?: AnalyticsEngineDataset
}

/** the part of the Pages context this function uses (the repo has no workers types installed) */
type Handler = (context: { request: Request; env: Env }) => Response | Promise<Response>

const MAX_BODY_BYTES = 2048
const MIN_FILL_MS = 1500
const RATE_WINDOW_MS = 10 * 60_000
const RATE_MAX = 5
/** all addresses together: a small studio never gets twenty real enquiries in an hour */
const HOUR_MS = 60 * 60_000
const HOUR_MAX = 20
/** this many sends refused by the mail service in a row, and the form rests on WhatsApp for this long */
const FAILS_MAX = 3
const REST_MS = 10 * 60_000
const SEND_TIMEOUT_MS = 8000
const DEFAULT_FROM = 'leads@mediawave.co.il'
/** the hidden field's name (keep in step with src/utils/lead.ts): nothing a browser would autofill */
const TRAP = 'mw_hp7'

const ACCOUNT_RE = /^[0-9a-f]{32}$/i
/** one plain address: no list separators and no display-name characters */
const EMAIL_RE = /^[^\s@,;<>"()]{1,64}@[^\s@,;<>"()]{1,190}\.[^\s@,;<>"()]{2,24}$/
/** a link or markup in a name or in the sentence did not come from our form: a scheme, www., angle
    brackets, or a bare domain such as bit.ly or t.me, which a mail reader turns into a link */
const LINKISH_RE = /:\/\/|www\.|<|>|[a-z0-9-]\.[a-z]{2,}/i
/** a plain path of this site. No percent sign (an encoded name would hide in it) and, as in
    functions/api/event.ts, fewer than seven digits, so a phone number never rides in as a path */
const PATH_RE = /^\/(?!\/)[A-Za-z0-9/_.-]{0,199}$/
const pathOf = (v: unknown): string =>
  typeof v === 'string' && PATH_RE.test(v) && (v.match(/\d/g)?.length ?? 0) < 7 ? v : ''

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

const refuse = (error: string, status: number) => json({ ok: false, error }, status)

/** one line of plain text: no control characters (C0 and C1, so NEL too), no invisible or bidi marks,
    single spaces, trimmed, capped. The class is written with escapes only: a raw invisible character
    in the source is one nobody can review. */
// eslint-disable-next-line no-control-regex -- removing control characters is what this class is for
const UNSEEN_RE = /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/g
const line = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(UNSEEN_RE, ' ').replace(/\s+/g, ' ').trim().slice(0, max) : ''

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/** 0521234567 from "+972 52-123 4567", '' for anything that is not an Israeli number: the same rule as
    isValidPhone in src/utils/validation.ts, so the server never refuses what the form accepted */
function phoneDigits(v: string): string {
  const d = v.replace(/[\s\-().]/g, '').replace(/^(?:\+|00)?9720?/, '0')
  return /^0\d{8,9}$/.test(d) || /^1\d{9}$/.test(d) ? d : ''
}

/** the settings, or null while any of them is missing or malformed (the form then stays on WhatsApp) */
function settings(env: Env) {
  const account = (env.CF_ACCOUNT_ID ?? '').trim()
  const token = (env.LEAD_TOKEN ?? '').trim()
  const to = (env.LEAD_TO ?? '').trim()
  const from = (env.LEAD_FROM ?? '').trim() || DEFAULT_FROM
  const wrong = [
    !ACCOUNT_RE.test(account) && 'CF_ACCOUNT_ID',
    !token && 'LEAD_TOKEN',
    !EMAIL_RE.test(to) && 'LEAD_TO',
    !EMAIL_RE.test(from) && 'LEAD_FROM',
  ].filter(Boolean) as string[]
  // half a setup is worth a line in the live logs (names only, never a value); no setup at all is silent
  if (wrong.length && (account || token || to)) console.log(JSON.stringify({ type: 'lead_not_ready', check: wrong }))
  return wrong.length ? null : { account, token, to, from }
}

/** a browser sends Origin on every POST; ours must name the host this function answers on */
function fromOurPages(request: Request): boolean {
  const site = request.headers.get('sec-fetch-site')
  if (site && site !== 'same-origin') return false
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

const hits = new Map<string, number[]>()

function limited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < RATE_WINDOW_MS)
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent)
    return true
  }
  hits.set(ip, [...recent, now])
  if (hits.size > 5000) hits.clear()
  return false
}

/** when each enquiry of the last hour went on to the mail service, whatever its address */
let lately: number[] = []

function full(): boolean {
  const now = Date.now()
  lately = lately.filter((at) => now - at < HOUR_MS)
  return lately.length >= HOUR_MAX
}

/** sends the mail service refused in a row, and when the last of them was */
let failedInARow = 0
let failedAt = 0
const resting = () => failedInARow >= FAILS_MAX && Date.now() - failedAt < REST_MS

/** The body, read piece by piece and dropped the moment it passes the cap. A streamed body declares no
    length, so checking the declared one alone would let any amount into memory. null = too big. */
async function bodyWithin(request: Request, max: number): Promise<Uint8Array | null> {
  if (Number(request.headers.get('content-length') ?? 0) > max) return null
  const reader = request.body?.getReader()
  const bytes = new Uint8Array(max)
  let size = 0
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    if (size + value.byteLength > max) {
      await reader.cancel().catch(() => {})
      return null
    }
    bytes.set(value, size)
    size += value.byteLength
  }
  return bytes.subarray(0, size)
}

/** one anonymous data point per outcome (layout in functions/api/event.ts): never a name or a phone */
const note = (env: Env, outcome: string, path = '') => {
  try {
    env.EVENTS?.writeDataPoint({ indexes: ['lead_mail'], blobs: ['lead_mail', '', path, outcome, '', ''], doubles: [1] })
  } catch {
    // measurement never decides whether an enquiry goes out
  }
}

const DAY: Record<string, string> = { Sun: 'ראשון', Mon: 'שני', Tue: 'שלישי', Wed: 'רביעי', Thu: 'חמישי', Fri: 'שישי', Sat: 'שבת' }

/** "יום חמישי, 12.11.2026, 21:40" in Israel time. Put together from the numeric parts, so it reads the
    same whether or not the runtime carries Hebrew locale data. */
function when(now = new Date()): string {
  try {
    const part = Object.fromEntries(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jerusalem', weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
      }).formatToParts(now).map((p) => [p.type, p.value]),
    )
    return `${DAY[part.weekday] ? `יום ${DAY[part.weekday]}, ` : ''}${part.day}.${part.month}.${part.year}, ${part.hour}:${part.minute}`
  } catch {
    return `${now.toISOString().slice(0, 16).replace('T', ' ')} UTC`
  }
}

interface SendResult {
  success?: boolean
  result?: { delivered?: string[]; queued?: string[]; permanent_bounces?: string[] } | null
  errors?: { code?: number }[]
}

/** ready = the settings exist, the mail service is not refusing every send, and the hour is not full */
export const onRequestGet: Handler = ({ env }) => json({ ready: settings(env) !== null && !resting() && !full() })

export const onRequestPost: Handler = async ({ request, env }) => {
  const set = settings(env)
  if (!set) return refuse('not_configured', 503)
  if (!fromOurPages(request)) return refuse('origin', 403)
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) return refuse('type', 415)

  const bytes = await bodyWithin(request, MAX_BODY_BYTES)
  if (!bytes) return refuse('too_big', 413)

  let body: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return refuse('bad_json', 400)
    body = parsed as Record<string, unknown>
  } catch {
    return refuse('bad_json', 400)
  }

  const page = pathOf(body.page)

  // Refused out loud, never a pretended "sent": if a person's browser ever filled the hidden field,
  // the form tells them the truth and offers WhatsApp, and the dashboard shows it happened.
  if (body[TRAP] !== undefined && body[TRAP] !== '') {
    note(env, 'trap', page)
    return refuse('refused', 400)
  }
  if (typeof body.t !== 'number' || !Number.isFinite(body.t) || body.t < MIN_FILL_MS) {
    note(env, 'fast', page)
    return refuse('too_fast', 400)
  }

  const name = line(body.name, 61)
  const phone = phoneDigits(line(body.phone, 25))
  const ask = line(body.ask, 201)
  if (name.length < 2 || name.length > 60 || /\d/.test(name) || LINKISH_RE.test(name)) return refuse('name', 400)
  if (!phone) return refuse('phone', 400)
  // the sentence is one of the site's own and no visitor types it, so a slash has no business in it either
  if (ask.length > 200 || ask.includes('/') || LINKISH_RE.test(ask)) return refuse('ask', 400)

  // one answer for both ceilings: the form then says the send failed and offers WhatsApp
  if (full()) {
    note(env, 'flood', page)
    return refuse('rate', 429)
  }
  if (limited(request.headers.get('cf-connecting-ip') ?? 'unknown')) {
    note(env, 'rate', page)
    return refuse('rate', 429)
  }
  lately.push(Date.now())

  const site = new URL(request.url).origin
  const at = when()
  // 0521234567 is 972521234567 for WhatsApp; a 1-700 style number has no WhatsApp
  const waLink = phone.startsWith('0') ? `https://wa.me/972${phone.slice(1)}` : ''
  const text = [ask, `${name}, ${phone}`, '', page ? `נשלח מהעמוד ${site}${page}` : null, at]
    .filter((l) => l !== null).join('\n').trim()
  const html = `<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:#13241F">${
    ask ? `<p style="margin:0 0 14px;font-size:18px">${escapeHtml(ask)}</p>` : ''
  }<p style="margin:0 0 14px;font-size:18px"><b>${escapeHtml(name)}</b><br><a href="tel:${phone}" dir="ltr" style="color:#0F8478">${phone}</a>${
    waLink ? ` &nbsp;·&nbsp; <a href="${waLink}" style="color:#0F8478">לענות בוואטסאפ</a>` : ''
  }</p><p style="margin:0;font-size:14px;color:#4A5A55">${
    page ? `נשלח מהעמוד <a href="${escapeHtml(site + page)}" dir="ltr" style="color:#4A5A55">${escapeHtml(page)}</a><br>` : ''
  }${escapeHtml(at)}</p></div>`

  let status = 0
  let out: SendResult | null = null
  const abort = new AbortController()
  const timer = setTimeout(() => abort.abort(), SEND_TIMEOUT_MS)
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${set.account}/email/sending/send`, {
      method: 'POST',
      headers: { authorization: `Bearer ${set.token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        to: set.to,
        from: { address: set.from, name: 'פנייה מהאתר' },
        // who and how to reach them, readable in a phone's inbox without opening the mail
        subject: `${name}, ${phone}`,
        text,
        html,
      }),
      signal: abort.signal,
    })
    status = res.status
    out = (await res.json().catch(() => null)) as SendResult | null
  } catch {
    // no answer from the mail service: reported below as a failed send
  } finally {
    clearTimeout(timer)
  }

  const accepted = (out?.result?.delivered?.length ?? 0) + (out?.result?.queued?.length ?? 0)
  const sent = status >= 200 && status < 300 && out?.success === true && accepted > 0
  // the reason goes to the live logs, never the enquiry itself
  if (!sent) console.log(JSON.stringify({ type: 'lead_failed', status, codes: out?.errors?.map((e) => e.code ?? 0) ?? [] }))
  note(env, sent ? 'sent' : 'failed', page)
  if (sent) failedInARow = 0
  else {
    failedInARow++
    failedAt = Date.now()
  }

  return sent ? json({ ok: true }) : refuse('send', 502)
}
