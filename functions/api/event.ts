/**
 * Cloudflare Pages Function — POST /api/event
 *
 * First-party conversion-event collector. Validates each event, logs it as one
 * structured JSON line (the Pages real-time logs) and, when the Analytics Engine
 * binding EVENTS is set on the Pages project (D218), stores it as a data point:
 * what happened, where on the site, on which path, and the coarse country. No IP,
 * no cookies, no identifiers. /api/stats reads the dataset back.
 *
 * Data point layout (keep in step with functions/api/stats.ts):
 *   index1 = event
 *   blob1 event · blob2 placement · blob3 path · blob4 mode · blob5 src · blob6 ref · blob7 country
 *   double1 = 1
 */

interface AnalyticsEngineDataset {
  writeDataPoint(point: { indexes?: string[]; blobs?: string[]; doubles?: number[] }): void
}

interface Env {
  EVENTS?: AnalyticsEngineDataset
}

const ALLOWED_EVENTS = new Set([
  'page_view',
  'whatsapp_click',
  'tel_click',
  'mailto_click',
  'instagram_click',
  'cta_click',
  'form_submit',
  'lead_submit',
  'lead_modal_open',
  'chat_open',
  'chat_handoff',
  'share_click',
])

const MAX_BODY_BYTES = 1024

interface EventPayload {
  event: string
  props?: Record<string, unknown>
  path?: string
  ts?: number
}

/** a short plain value: strings only, no control characters, capped */
const short = (v: unknown, max = 80): string =>
  typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, max) : ''

/** (D218 review) events from another site's pages are refused; a beacon from our own pages carries our
    Origin, and a request with no Origin at all (older browsers) is let through */
function foreign(origin: string | null): boolean {
  if (!origin) return false
  try {
    const host = new URL(origin).hostname
    return !(host === 'mediawave.co.il' || host === 'www.mediawave.co.il' || host === 'mediawaveisrael.pages.dev'
      || host.endsWith('.mediawaveisrael.pages.dev') || host === 'localhost' || host === '127.0.0.1')
  } catch {
    return true
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (foreign(context.request.headers.get('origin'))) return new Response(null, { status: 403 })
  try {
    const raw = await context.request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return new Response(null, { status: 413 })
    }

    const data = JSON.parse(raw) as EventPayload
    if (typeof data.event !== 'string' || !ALLOWED_EVENTS.has(data.event)) {
      return new Response(null, { status: 400 })
    }

    const props = data.props && typeof data.props === 'object' ? data.props : {}
    // the site names the spot "placement" (most calls) or "location" (the 60-seconds flow)
    const placement = short(props.placement) || short(props.location)
    const path = short(data.path, 200)
    const country = short((context.request as Request & { cf?: { country?: string } }).cf?.country, 4)

    console.log(
      JSON.stringify({
        type: 'conversion_event',
        event: data.event,
        props,
        path,
        ts: typeof data.ts === 'number' ? data.ts : Date.now(),
      })
    )

    context.env.EVENTS?.writeDataPoint({
      indexes: [data.event],
      blobs: [data.event, placement, path, short(props.mode, 40), short(props.src, 60), short(props.ref, 60), country],
      doubles: [1],
    })

    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 400 })
  }
}
