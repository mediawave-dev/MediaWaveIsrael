/**
 * The site's own form endpoint (/api/lead, D218). The site asks once per page load whether mail is set
 * up on the server. Until it is, and wherever there is no Pages Function (the dev server, a local
 * preview, the prerender), the form keeps handing its message to WhatsApp, which works today.
 */

export interface Lead {
  name: string
  phone: string
  /** the sentence that says what the visitor wants (the page's own; see LeadForm) */
  ask: string
  /** ms the visitor has spent on the form */
  t: number
  /** the hidden field's value: empty for a person */
  trap: string
}

/** the server refuses a send that comes sooner than this after the form was first seen (functions/api/lead.ts) */
export const MIN_FILL_MS = 1500
/** the hidden field's name (keep in step with functions/api/lead.ts): nothing a browser would autofill */
export const TRAP_FIELD = 'mw_hp7'

const READY_TIMEOUT_MS = 4000
const SEND_TIMEOUT_MS = 12000

/** fetch that gives up: a hung request must not leave the form waiting for ever */
async function request(input: string, init: RequestInit, ms: number): Promise<Response> {
  const abort = new AbortController()
  const timer = window.setTimeout(() => abort.abort(), ms)
  try {
    return await fetch(input, { ...init, signal: abort.signal })
  } finally {
    window.clearTimeout(timer)
  }
}

let ready: Promise<boolean> | null = null

/** true only when /api/lead answers, as JSON, that it can send mail. Asked once, the answer is shared. */
export function leadReady(): Promise<boolean> {
  ready ??= request('/api/lead', { headers: { accept: 'application/json' } }, READY_TIMEOUT_MS)
    .then((r) => (r.ok && (r.headers.get('content-type') ?? '').includes('json') ? r.json() : null))
    .then((d: { ready?: unknown } | null) => d?.ready === true)
    .catch(() => false)
  return ready
}

/** Posts the enquiry. ok only when the server says the mail went out; otherwise `error` is the server's
    reason ('name' or 'phone' when its check refused a field), or undefined when there was no answer. */
export async function sendLead(lead: Lead): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await request('/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: lead.name, phone: lead.phone, ask: lead.ask, t: lead.t, [TRAP_FIELD]: lead.trap, page: window.location.pathname }),
    }, SEND_TIMEOUT_MS)
    const out = (await res.json().catch(() => null)) as { ok?: unknown; error?: unknown } | null
    return res.ok && out?.ok === true ? { ok: true } : { ok: false, error: typeof out?.error === 'string' ? out.error : undefined }
  } catch {
    return { ok: false }
  }
}
