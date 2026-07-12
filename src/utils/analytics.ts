/**
 * First-party conversion tracking — no cookies, no PII, no third-party script.
 *
 * Every conversion path on the site calls track() with a distinct event name
 * and placement, so the owner can tell which CTA produces inquiries. Events
 * post to /api/event (a Pages Function). Wiring a durable sink (GA4 / Plausible /
 * Analytics Engine) is an owner decision — see PROPOSALS.md #3.
 */

export type TrackEvent =
  | 'whatsapp_click'
  | 'tel_click'
  | 'mailto_click'
  | 'instagram_click'
  | 'cta_click'
  | 'form_submit'
  | 'lead_submit'
  | 'chat_open'
  | 'chat_handoff'
  | 'share_click'

export function track(event: TrackEvent, props: Record<string, string> = {}): void {
  try {
    const payload = JSON.stringify({
      event,
      props,
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
