/**
 * Cloudflare Pages Function: /api/lead (D218)
 *
 * GET  answers whether the form can send mail here ({ ready }), so the site decides at run time:
 *      no settings yet, the form keeps handing the message to WhatsApp (the honest fallback).
 * POST sends one lead to the studio's inbox through Cloudflare Email Sending (REST API).
 *
 * Settings on the Pages project (secrets, never in the code):
 *   CF_ACCOUNT_ID   the account id
 *   LEAD_TOKEN      a token with Email Sending permission. Its own variable: /api/stats has its own token,
 *                   so setting up the dashboard alone never switches the form over (review, D218)
 *   LEAD_FROM       optional, default leads@mediawave.co.il (a domain of the account with Email Routing on)
 *   LEAD_TO         optional, default mediawaveisrael@gmail.com, which must be a verified destination
 *                   address (Email Routing): sends to it are free on every plan
 *
 * Guards: same-site Origin only, a hidden field that people never fill (bots do), a minimum time
 * from the first keystroke, server-side validation, and a per-isolate rate limit. Nothing is stored:
 * the visitor's IP is used only in memory for the rate limit, and the lead exists only in the email.
 */

interface AnalyticsEngineDataset {
  writeDataPoint(point: { indexes?: string[]; blobs?: string[]; doubles?: number[] }): void
}

interface Env {
  CF_ACCOUNT_ID?: string
  LEAD_TOKEN?: string
  LEAD_FROM?: string
  LEAD_TO?: string
  EVENTS?: AnalyticsEngineDataset
}

interface LeadBody {
  kind?: unknown
  name?: unknown
  email?: unknown
  phone?: unknown
  message?: unknown
  page?: unknown
  /** the hidden field: any value means a bot (a name no browser autofills; "company" would be) */
  mw_hp7?: unknown
  /** ms from the first keystroke to the send */
  t?: unknown
}

const MAX_BODY_BYTES = 6 * 1024
const RATE_WINDOW_MS = 10 * 60_000
const RATE_MAX = 5
const MIN_FILL_MS = 1500
/** one plain address: no list separators or display-name characters, so reply_to is always one address */
const EMAIL_RE = /^[^\s@,;<>"()]{1,64}@[^\s@,;<>"()]{1,190}\.[^\s@,;<>"()]{2,24}$/

const hits = new Map<string, number[]>()

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

/** plain text: no control characters except newlines, no bidi overrides, trimmed and capped */
const clean = (v: unknown, max: number): string =>
  typeof v === 'string'
    ? v.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '').trim().slice(0, max)
    : ''

/** one line: for the name, the address, the phone and the page (the subject is built from the name) */
const line = (v: unknown, max: number): string => clean(v, max).replace(/\s+/g, ' ')

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function sameSite(origin: string | null): boolean {
  if (!origin) return false
  try {
    const host = new URL(origin).hostname
    return host === 'mediawave.co.il' || host === 'www.mediawave.co.il'
      || host.endsWith('.mediawaveisrael.pages.dev') || host === 'mediawaveisrael.pages.dev'
      || host === 'localhost' || host === '127.0.0.1'
  } catch {
    return false
  }
}

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

const ready = (env: Env) => Boolean(env.CF_ACCOUNT_ID && env.LEAD_TOKEN)

export const onRequestGet: PagesFunction<Env> = async ({ env }) => json({ ready: ready(env) })

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!ready(env)) return json({ ok: false, error: 'not_configured' }, 503)
  if (!sameSite(request.headers.get('origin'))) return json({ ok: false, error: 'origin' }, 403)

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'too_big' }, 413)
  let body: LeadBody
  try {
    body = JSON.parse(raw) as LeadBody
  } catch {
    return json({ ok: false, error: 'bad_json' }, 400)
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ ok: false, error: 'bad_json' }, 400)

  // a bot filled the field no person sees: answer as if it went, send nothing. Counted on the dashboard,
  // so a person caught by mistake would show up there.
  if (clean(body.mw_hp7, 200)) {
    env.EVENTS?.writeDataPoint({ indexes: ['lead_mail'], blobs: ['lead_mail', body.kind === 'callback' ? 'callback' : 'contact', '', 'bot', '', '', ''], doubles: [1] })
    return json({ ok: true })
  }
  if (typeof body.t !== 'number' || body.t < MIN_FILL_MS) return json({ ok: false, error: 'too_fast' }, 429)

  const kind = body.kind === 'callback' ? 'callback' : 'contact'
  const name = line(body.name, 80)
  const email = line(body.email, 254)
  const phone = line(body.phone, 20)
  const message = clean(body.message, 2000)
  const page = line(body.page, 300)
  const phoneOk = /^[+\d][\d\s-]{7,18}$/.test(phone) && phone.replace(/\D/g, '').length >= 9
  if (name.length < 2) return json({ ok: false, error: 'name' }, 400)
  if (email && !EMAIL_RE.test(email)) return json({ ok: false, error: 'email' }, 400)
  if (phone && !phoneOk) return json({ ok: false, error: 'phone' }, 400)
  if (!email && !phoneOk) return json({ ok: false, error: 'contact' }, 400)
  if (kind === 'contact' && message.length < 2) return json({ ok: false, error: 'message' }, 400)

  if (limited(request.headers.get('cf-connecting-ip') ?? 'unknown')) return json({ ok: false, error: 'rate' }, 429)

  const lines = [
    `שם: ${name}`,
    email && `אימייל: ${email}`,
    phone && `טלפון: ${phone}`,
    kind === 'callback' && 'מבקשים שנחזור אליהם בטלפון',
    message && `\n${message}`,
    page && `\nנשלח מהעמוד: ${page}`,
  ].filter(Boolean) as string[]
  const text = lines.join('\n')
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">${lines
    .map((l) => `<p style="margin:0 0 8px">${escapeHtml(l).replace(/\n/g, '<br>')}</p>`)
    .join('')}</div>`

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/email/sending/send`, {
    method: 'POST',
    headers: { authorization: `Bearer ${env.LEAD_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      to: env.LEAD_TO || 'mediawaveisrael@gmail.com',
      from: { address: env.LEAD_FROM || 'leads@mediawave.co.il', name: 'MediaWave - פנייה מהאתר' },
      ...(email ? { reply_to: email } : {}),
      subject: `${kind === 'callback' ? 'בקשה לשיחה' : 'פנייה מהאתר'}: ${name}`,
      text,
      html,
    }),
  }).catch(() => null)

  const out = res ? ((await res.json().catch(() => null)) as { success?: boolean; result?: { delivered?: string[]; queued?: string[] }; errors?: { code: number }[] } | null) : null
  const sent = Boolean(res?.ok && out?.success && ((out.result?.delivered?.length ?? 0) + (out.result?.queued?.length ?? 0) > 0))
  // the reason in the live logs, never the lead itself
  if (!sent) console.log(JSON.stringify({ type: 'lead_failed', status: res?.status ?? 0, codes: out?.errors?.map((e) => e.code) ?? [] }))
  env.EVENTS?.writeDataPoint({ indexes: ['lead_mail'], blobs: ['lead_mail', kind, page.replace(/^https?:\/\/[^/]+/, '').slice(0, 200), sent ? 'sent' : 'failed', '', '', ''], doubles: [1] })

  return sent ? json({ ok: true }) : json({ ok: false, error: 'send' }, 502)
}
