/**
 * First-party conversion tracking — no cookies, no PII, no third-party script.
 *
 * Every conversion path on the site calls track() with a distinct event name
 * and placement, so the owner can tell which CTA produces inquiries. Events
 * post to /api/event (a Pages Function), which stores them in Workers Analytics
 * Engine when its binding is set (D218) and logs them either way.
 */

export type TrackEvent =
  | 'page_view'
  | 'whatsapp_click'
  | 'tel_click'
  | 'mailto_click'
  | 'instagram_click'
  | 'cta_click'
  | 'form_submit'
  | 'lead_submit'
  | 'lead_modal_open'
  | 'chat_open'
  | 'chat_handoff'
  | 'share_click'

/** (D218) where the visit came from inside the site, e.g. a blog post's link to /your-site/?src=blog-<slug>.
    Read once from the landing URL and kept in memory only (no storage): every event of the visit carries it. */
const SRC = (() => {
  try {
    const s = new URLSearchParams(window.location.search).get('src') ?? ''
    return /^[a-z0-9-]{1,60}$/.test(s) ? s : ''
  } catch {
    return ''
  }
})()

export function track(event: TrackEvent, props: Record<string, string> = {}): void {
  try {
    const payload = JSON.stringify({
      event,
      props: SRC && !props.src ? { ...props, src: SRC } : props,
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

let viewed = false

/** (D218) One page_view per route the visitor sees. The first one carries the referring site's host
    (google.com, an ad, a chat answer), never a full URL; the prerender and the preview frame inside
    /your-site/ are not visits. */
export function trackView(): void {
  if ((window as { __PRERENDER__?: boolean }).__PRERENDER__ || window.parent !== window) return
  let ref = ''
  if (!viewed) {
    try {
      const host = document.referrer ? new URL(document.referrer).hostname : ''
      if (host && host !== window.location.hostname) ref = host.replace(/^www\./, '').slice(0, 60)
    } catch {
      // an unreadable referrer is no referrer
    }
  }
  viewed = true
  track('page_view', ref ? { ref } : {})
}
