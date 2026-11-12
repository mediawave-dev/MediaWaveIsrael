/**
 * First-party conversion tracking: no cookies, no personal data, no third-party script.
 *
 * Every way to reach the studio calls track() with an event name and the spot it sits in, so the
 * owner can tell which one brings enquiries. Events post to /api/event (a Pages Function), which
 * stores them in Workers Analytics Engine when its binding is set (D218) and logs them either way.
 * A caller passes labels only (a placement, a mode): never what a visitor typed.
 */

export type TrackEvent =
  | 'page_view'
  | 'whatsapp_click'
  | 'tel_click'
  | 'mailto_click'
  | 'instagram_click'
  | 'cta_click'
  | 'form_view'
  | 'form_start'
  | 'form_submit'
  | 'lead_submit'
  | 'lead_modal_open'
  | 'chat_open'
  | 'chat_handoff'
  | 'share_click'

/** Where the visit came from, so every event of the visit can say it. Both are read once when the page
    loads and kept in memory only:
    src  the campaign tag of the link that brought the visitor (?src=... or ?utm_source=...)
    ref  the referring site's host (google.com, an ad, a chat answer): never a full address */
const CAME_FROM = (() => {
  const from: Record<string, string> = {}
  try {
    const q = new URLSearchParams(window.location.search)
    const src = (q.get('src') ?? q.get('utm_source') ?? '').toLowerCase()
    // the server's own rule (functions/api/event.ts): a tag with seven digits or more could be a phone number
    if (/^[a-z0-9_.-]{1,60}$/.test(src) && (src.match(/\d/g)?.length ?? 0) < 7) from.src = src
    const host = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''
    if (host && host !== window.location.hostname.replace(/^www\./, '') && /^[a-z0-9.-]{1,60}$/.test(host)) from.ref = host
  } catch {
    // an unreadable address or referrer is no source
  }
  return from
})()

export function track(event: TrackEvent, props: Record<string, string> = {}): void {
  try {
    const payload = JSON.stringify({
      event,
      props: { ...CAME_FROM, ...props },
      path: window.location.pathname,
      ts: Date.now(),
    })

    // sendBeacon survives page navigation (tel:/wa.me links leave the page)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/event', new Blob([payload], { type: 'application/json' }))
    } else {
      void fetch('/api/event', { method: 'POST', body: payload, keepalive: true }).catch(() => {})
    }
  } catch {
    // Analytics must never break the UI
  }
}

let landed = false

/** One page_view per route the visitor sees: call it whenever the route changes. The first of a visit is
    marked "landing", so visits can be counted apart from pages. The prerender and a page shown inside a
    frame are not visits. */
export function trackView(): void {
  if ((window as { __PRERENDER__?: boolean }).__PRERENDER__ || window.parent !== window) return
  track('page_view', landed ? {} : { mode: 'landing' })
  landed = true
}
