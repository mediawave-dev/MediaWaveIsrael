// sea · the colour round (D154): colour enters only through content, as in Lama Lama's logic (design/
// harvest/lamalama-deep.rtl.md §4-5): a quiet dark ground, no accent in the interface, and saturated
// light out of the dark from MediaWave's world (the sunset on the logo's horizon, tape reels, a desk at
// night, a phone, city lights, light running through fibres, an edit, a darkroom). Every clip shows
// first in the sea's dots and develops into colour. Source: Pexels (licence: commercial use, no credit
// required); each file is in design/media-ledger.rtl.md. Encoded by G:/tmp/mw-media/enc.sh into
// public/media/<key>{,-m}.{mp4,webm}, <key>-poster{,-m}.webp, <key>-poster.avif and <key>-tile.webp.

export interface Clip {
  /** the files' base name in /media */
  key: string
  /** the desktop encode's size (the phone's is half or two thirds) */
  w: number
  h: number
  /** the phone poster's width */
  mw: number
  /** what it shows, for the ledger and the review (the media are decorative: alt="") */
  what: string
}

const clip = (key: string, w: number, h: number, mw: number, what: string): Clip => ({ key, w, h, mw, what })

export const CLIPS = {
  'hero-sea': clip('hero-sea', 720, 720, 480, 'the sun on the horizon over the sea'),
  // the grounds (D156): wide on desktop, a portrait slice on phones
  'hero-veil': clip('hero-veil', 1280, 520, 360, 'the sun on the horizon over the sea, wide'),
  'film-veil': clip('film-veil', 1280, 720, 480, 'tape reels turning in orange light, wide'),
  'film-tapes': clip('film-tapes', 960, 720, 640, 'tape reels turning in orange light'),
  'svc-websites': clip('svc-websites', 1280, 720, 640, 'code on two monitors, a desk at night'),
  'svc-landing': clip('svc-landing', 1280, 720, 640, 'a finger taps a phone under a lamp'),
  'svc-landing-2': clip('svc-landing-2', 1280, 720, 640, 'hands hold a phone in red and green light'),
  'svc-seo': clip('svc-seo', 1280, 720, 640, 'city lights at night, out of focus'),
  'svc-chat': clip('svc-chat', 1280, 720, 640, 'light running through fibres, magenta'),
  'svc-video': clip('svc-video', 1280, 720, 640, 'an edit on a timeline'),
  'svc-video-2': clip('svc-video-2', 1280, 720, 640, 'an editing desk with two monitors'),
  'svc-video-3': clip('svc-video-3', 1280, 720, 640, 'a tape inside an open video recorder'),
  'svc-memories': clip('svc-memories', 960, 720, 640, 'a print developing in a darkroom tray'),
  'svc-memories-2': clip('svc-memories-2', 1280, 720, 640, 'a wall of video tapes'),
  // D172: a clip of its own for four more pages (G:/tmp/mw-media/enc-d172.sh)
  'svc-websites-2': clip('svc-websites-2', 1280, 720, 640, 'colourful code on a monitor, close'),
  'svc-seo-2': clip('svc-seo-2', 1280, 720, 640, 'gold lights glittering at night'),
  'svc-chat-2': clip('svc-chat-2', 960, 540, 540, 'a burst of glowing pink fibres'),
  'svc-memories-3': clip('svc-memories-3', 1280, 675, 640, 'film hanging to dry in a red darkroom'),
} as const

export type ClipKey = keyof typeof CLIPS

/** Each service's clips: the first opens its page and fills its row on the home page. */
export const SERVICE_MEDIA: Record<string, ClipKey[]> = {
  websites: ['svc-websites', 'svc-websites-2'],
  landing: ['svc-landing', 'svc-landing-2'],
  seo: ['svc-seo', 'svc-seo-2'],
  chatbots: ['svc-chat', 'svc-chat-2'],
  'video-editing': ['svc-video', 'svc-video-3', 'svc-video-2'],
  'memory-videos': ['svc-memories', 'svc-memories-2', 'svc-memories-3'],
}

const base = (c: Clip) => `/media/${c.key}`
export const posterOf = (c: Clip, phone = false) => `${base(c)}-poster${phone ? '-m' : ''}.webp`
export const posterSet = (c: Clip) => `${base(c)}-poster-m.webp ${c.mw}w, ${base(c)}-poster.webp ${c.w}w`
export const avifOf = (c: Clip) => `${base(c)}-poster.avif`
export const tileOf = (c: Clip) => `${base(c)}-tile.webp`

let webm: boolean | null = null
/** The loop to play: VP9 WebM where the browser plays it, H.264 MP4 elsewhere; the light encode on phones
    (`hi`: the desktop encode everywhere, for a ground cut out of a 16:9 clip on a phone). */
export function videoOf(c: Clip, hi = false): string {
  if (webm === null) webm = typeof document !== 'undefined' && document.createElement('video').canPlayType('video/webm; codecs="vp9"') === 'probably'
  const phone = !hi && typeof window !== 'undefined' && !window.matchMedia('(min-width: 768px)').matches
  return `${base(c)}${phone ? '-m' : ''}.${webm ? 'webm' : 'mp4'}`
}
