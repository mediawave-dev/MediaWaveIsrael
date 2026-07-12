/**
 * Cloudflare Pages Function — POST /api/event
 *
 * First-party conversion-event collector. Validates and logs each event as a
 * single structured JSON line (visible in the Pages real-time logs). No IP,
 * no cookies, no PII is stored. A durable sink (GA4 Measurement Protocol /
 * Analytics Engine binding) can be added here later — see PROPOSALS.md #3.
 */

const ALLOWED_EVENTS = new Set([
  'whatsapp_click',
  'tel_click',
  'mailto_click',
  'instagram_click',
  'cta_click',
  'form_submit',
  'lead_submit',
  'chat_open',
  'chat_handoff',
  'share_click',
])

const MAX_BODY_BYTES = 1024

interface EventPayload {
  event: string
  props?: Record<string, string>
  path?: string
  ts?: number
}

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const raw = await context.request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return new Response(null, { status: 413 })
    }

    const data = JSON.parse(raw) as EventPayload
    if (typeof data.event !== 'string' || !ALLOWED_EVENTS.has(data.event)) {
      return new Response(null, { status: 400 })
    }

    console.log(
      JSON.stringify({
        type: 'conversion_event',
        event: data.event,
        props: data.props ?? {},
        path: typeof data.path === 'string' ? data.path.slice(0, 200) : '',
        ts: typeof data.ts === 'number' ? data.ts : Date.now(),
      })
    )

    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 400 })
  }
}
