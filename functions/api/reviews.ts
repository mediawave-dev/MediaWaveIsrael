/**
 * Cloudflare Pages Function: GET /api/reviews (D299), the studio's Google reviews for the home page.
 *
 * Asks the Places API (New) for the MediaWaveIsrael profile: its rating, how many reviews it has, and the
 * reviews Google hands out (five at most, in Google's order). The answer is kept at the edge for a day, so a
 * new review reaches the site within a day and Google is asked about once a day per data centre, far under
 * the free 1,000 calls a month. Each review keeps what Google's terms ask the site to show: the author's name
 * and profile link, the rating, the text as written, and a link back to the review on Google Maps.
 *
 * Settings on the Pages project: GOOGLE_PLACES_KEY (secret, a key limited to Places API (New)).
 * Locally: the same name in .dev.vars; vite.config.ts serves this function in dev.
 *
 * The place id was built from the profile's Maps feature id (0xa28488a3fdad2e09:0xea94ee99e6825a1), because a
 * new profile is not yet found by the Places text search.
 */

interface Env {
  GOOGLE_PLACES_KEY?: string
}

/** the part of the Pages context this function uses (the repo has no workers types installed) */
type Handler = (context: { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void }) => Response | Promise<Response>
/** Cloudflare's edge cache; absent in the dev server */
type EdgeCache = { match: (r: Request) => Promise<Response | undefined>; put: (r: Request, res: Response) => Promise<void> }

const PLACE_ID = 'ChIJCS6t_aOIhKIRoSVonulOqQ4'
const FIELDS = 'rating,userRatingCount,googleMapsUri,googleMapsLinks,reviews'
const DAY = 86400

interface PlaceReview {
  rating?: number
  relativePublishTimeDescription?: string
  publishTime?: string
  text?: { text?: string }
  originalText?: { text?: string }
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string }
  googleMapsUri?: string
}
interface Place {
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  googleMapsLinks?: { reviewsUri?: string; writeAReviewUri?: string }
  reviews?: PlaceReview[]
}

/** What the site reads. The text is the author's own words (originalText), never Google's translation. */
export interface ReviewsAnswer {
  rating: number
  count: number
  url: string
  write?: string
  reviews: { author: string; authorUrl?: string; photo?: string; rating: number; when: string; time?: string; text: string; url?: string }[]
}

const json = (body: unknown, status: number, cache: string) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': cache } })

function shape(p: Place): ReviewsAnswer {
  return {
    rating: p.rating ?? 0,
    count: p.userRatingCount ?? 0,
    url: p.googleMapsLinks?.reviewsUri ?? p.googleMapsUri ?? '',
    write: p.googleMapsLinks?.writeAReviewUri,
    reviews: (p.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? '',
        authorUrl: r.authorAttribution?.uri,
        photo: r.authorAttribution?.photoUri,
        rating: r.rating ?? 0,
        when: r.relativePublishTimeDescription ?? '',
        time: r.publishTime,
        text: (r.originalText?.text ?? r.text?.text ?? '').trim(),
        url: r.googleMapsUri,
      }))
      .filter((r) => r.author && r.text),
  }
}

export const onRequestGet: Handler = async ({ request, env, waitUntil }) => {
  const edge = (globalThis as { caches?: { default?: EdgeCache } }).caches?.default
  const key = new Request(new URL('/api/reviews', request.url).toString())
  const hit = await edge?.match(key)
  if (hit) return hit

  if (!env.GOOGLE_PLACES_KEY) return json({ error: 'GOOGLE_PLACES_KEY is not set' }, 503, 'no-store')
  let res: Response
  try {
    res = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=he`, {
      headers: { 'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY, 'X-Goog-FieldMask': FIELDS },
    })
  } catch {
    return json({ error: 'Google did not answer' }, 502, 'no-store')
  }
  if (!res.ok) return json({ error: `Google answered ${res.status}` }, 502, 'no-store')

  const out = json(shape(await res.json() as Place), 200, `public, max-age=3600, s-maxage=${DAY}`)
  if (edge) waitUntil(edge.put(key, out.clone()))
  return out
}
