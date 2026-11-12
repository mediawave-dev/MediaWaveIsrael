/**
 * Cloudflare Pages Function: POST /api/event
 *
 * The site's own event collector. Each event is validated, written as one JSON line to the Pages
 * live logs and, when the Analytics Engine binding EVENTS is set on the project (D218), stored as a
 * data point that /api/stats reads back. Without the binding everything works and only the log line
 * is written.
 *
 * What an event can hold: its name, the spot on the site, the page's path, the send mode, a campaign
 * tag and the referring site's host. Nothing else gets in: only these keys are read and each value is
 * a short label of Latin letters, digits and joiners. Hebrew, a space, an @, a percent sign or seven
 * digits (anywhere in the value, so 052-123-4567 counts) drop the value: a phone, an email address or
 * a name in Hebrew is not stored even if a caller passes it by mistake. A single Latin word cannot be
 * told from a label, so the rule stays "callers pass labels only". No IP, no country, no cookie, no identifier.
 *
 * Data point layout (keep in step with functions/api/stats.ts and functions/api/lead.ts):
 *   index1 = event
 *   blob1 event · blob2 placement · blob3 path · blob4 mode · blob5 src · blob6 ref
 *   double1 = 1
 */

interface AnalyticsEngineDataset {
  writeDataPoint(point: { indexes?: string[]; blobs?: string[]; doubles?: number[] }): void
}

interface Env {
  EVENTS?: AnalyticsEngineDataset
}

/** the part of the Pages context this function uses (the repo has no workers types installed) */
type Handler = (context: { request: Request; env: Env }) => Response | Promise<Response>

const ALLOWED_EVENTS = new Set([
  'page_view',
  'whatsapp_click',
  'tel_click',
  'mailto_click',
  'instagram_click',
  'cta_click',
  'form_view',
  'form_start',
  'form_submit',
  'lead_submit',
  'lead_modal_open',
  'chat_open',
  'chat_handoff',
  'share_click',
])

const MAX_BODY_BYTES = 1024

/** a phone number has seven digits or more, with or without dashes and dots between them */
const fewDigits = (v: string) => (v.match(/\d/g)?.length ?? 0) < 7

/** a label: letters, digits and a few joiners, capped; anything else, or seven digits, is nothing */
const label = (v: unknown, max = 60): string =>
  typeof v === 'string' && v.length <= max && /^[A-Za-z0-9_.:-]+$/.test(v) && fewDigits(v) ? v : ''

/** the path alone: the query and the fragment never arrive, and are cut here if they do. No percent
    sign, so an encoded name does not pass as a path (the site's own paths are plain Latin). */
const pathOf = (v: unknown): string => {
  const p = typeof v === 'string' ? v.split(/[?#]/)[0] : ''
  return /^\/(?!\/)[A-Za-z0-9/_.-]{0,199}$/.test(p) && fewDigits(p) ? p : ''
}

/** The body, read piece by piece and dropped the moment it passes the cap. A streamed body declares no
    length, so checking the declared one alone would let any amount into memory. null = too big.
    (The same few lines as in functions/api/lead.ts: every file in this folder is a route of its own.) */
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

/** events from another site's pages are refused; a request with no Origin (an old browser's beacon) passes */
function foreign(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).host !== new URL(request.url).host
  } catch {
    return true
  }
}

export const onRequestPost: Handler = async ({ request, env }) => {
  if (foreign(request)) return new Response(null, { status: 403 })
  try {
    const bytes = await bodyWithin(request, MAX_BODY_BYTES)
    if (!bytes) return new Response(null, { status: 413 })

    const data: unknown = JSON.parse(new TextDecoder().decode(bytes))
    if (!data || typeof data !== 'object' || Array.isArray(data)) return new Response(null, { status: 400 })
    const { event, props: rawProps, path: rawPath } = data as { event?: unknown; props?: unknown; path?: unknown }
    if (typeof event !== 'string' || !ALLOWED_EVENTS.has(event)) return new Response(null, { status: 400 })

    const props = (rawProps && typeof rawProps === 'object' && !Array.isArray(rawProps) ? rawProps : {}) as Record<string, unknown>
    // the site names the spot "placement" (most calls) or "location" (two older ones)
    const placement = label(props.placement) || label(props.location)
    const mode = label(props.mode, 40)
    const src = label(props.src)
    const ref = label(props.ref)
    const path = pathOf(rawPath)

    console.log(JSON.stringify({ type: 'conversion_event', event, placement, path, mode, src, ref, ts: Date.now() }))

    try {
      env.EVENTS?.writeDataPoint({ indexes: [event], blobs: [event, placement, path, mode, src, ref], doubles: [1] })
    } catch {
      // a storage hiccup must not turn a counted click into an error
    }

    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 400 })
  }
}
