/**
 * The site's own form endpoint (/api/lead, D218). The site asks once per visit whether mail is set
 * up on the server; until it is (and wherever there is no Pages Function, as in a local preview),
 * every form keeps handing its message to WhatsApp, which is honest and works today.
 */

export interface Lead {
  kind: 'contact' | 'callback'
  name: string
  email?: string
  phone?: string
  message?: string
  /** the hidden field (bots fill it, people never see it; a name no browser autofills) */
  mw_hp7?: string
  /** ms from the first keystroke to the send */
  t: number
}

let ready: Promise<boolean> | null = null

/** true when /api/lead answers that it can send mail (a JSON { ready: true }) */
export function leadReady(): Promise<boolean> {
  ready ??= fetch('/api/lead', { headers: { accept: 'application/json' } })
    .then((r) => (r.ok && (r.headers.get('content-type') ?? '').includes('json') ? r.json() : null))
    .then((d: { ready?: unknown } | null) => d?.ready === true)
    .catch(() => false)
  return ready
}

/** sends the lead; ok only when the server says the mail went. `error` is the server's reason
    ('email' when its stricter address check refused what the browser accepted) */
export async function sendLead(lead: Lead): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...lead, page: window.location.href }),
    })
    const out = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
    return res.ok && out?.ok === true ? { ok: true } : { ok: false, error: out?.error }
  } catch {
    return { ok: false }
  }
}
