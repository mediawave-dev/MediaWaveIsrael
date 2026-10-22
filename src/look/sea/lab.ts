// sea · the Lama Lama lab's switches (design/harvest/lamalama-deep.rtl.md §9). Each gate has its
// options in the URL, so Nati can compare them on the real page (?lab=1 shows the panel; the choices
// stay for the visit, so a page turn keeps them). The defaults are the recommendations; when Nati
// picks, the picked option becomes the only one and its switch goes.
const KEY = 'mw-sea-lab'

export const GATES = {
  /** the header past the opening: an island the visitor opens or pins, away (back on scroll up), sticky */
  head: ['island', 'away', 'sticky'],
  /** the film: develops under the finger (touch), when it is centred (scroll), by itself (time) */
  film: ['touch', 'scroll', 'time', 'off'],
  /** a chapter with its own ground: under the horizon in the logo's blue (deep), paper (paper), both */
  ground: ['deep', 'paper', 'both', 'none'],
  /** the page turn's cover: cream (the inverse), the logo's blue, or none */
  turn: ['cream', 'blue', 'off'],
  // ── the colour round (D154) ──
  /** the hero's disc: the sunset develops by itself after the opening, under the pointer, or no sunset */
  sun: ['time', 'touch', 'off'],
  /** the services' rows: a picture per row that develops while its service is on the stage, or none */
  rows: ['tile', 'none'],
  // ── the remaining Lama Lama gaps (D155) ──
  /** work rows with real work only (this site, the memories sample), or none */
  work: ['rows', 'off'],
  /** type: the tag beside the heading and the big lede with a tag in its indent, or as now */
  type: ['lama', 'now'],
  /** the menu: a card under the pill over a blurred page, or the full sheet as now */
  menu: ['card', 'sheet'],
  /** wide screens: the corner stack under the contact card collects what you passed, or none */
  stack: ['on', 'off'],
  /** the meta bar (line, labels, live clock): at the opening and again at the end, or the opening only */
  bar: ['ends', 'start'],
  // ── the clips as grounds (D156, Nati: "they really build the videos into the background") ──
  /** veil: the clip across its chapter, breaking into dots at its bottom edge; slot: in its own frame */
  bleed: ['veil', 'slot'],
  // ── Lama Lama, followed closely (D157) ──
  /** the hero: a showreel that never repeats, the one sunset as a ground, or the sunset in the disc */
  hero: ['reel', 'sea', 'disc'],
  /** the quiet dot grain over the whole site: off (Lama's plain ground) or on */
  grain: ['off', 'on'],
  /** the pointer's trail: Lama's ribbon of small squares, a hairline, or the field's ripple */
  trail: ['squares', 'line', 'ripple'],
  /** the finger on a phone: the mouse's squares, thinner (D168), the streak of light (D166-D167), the water
      drop with ripples, or nothing */
  finger: ['squares', 'line', 'drop', 'none'],
  /** pictures in rows and pages: in colour from the start, or in dots that develop */
  media: ['colour', 'develop'],
  /** the relief under the pointer and the finger (D170, after immersive-g.com), or the plain wake */
  relief: ['on', 'off'],
} as const

export type Gate = keyof typeof GATES
type Choice<G extends Gate> = (typeof GATES)[G][number]

function read(): Partial<Record<Gate, string>> {
  if (typeof window === 'undefined') return {}
  let saved: Partial<Record<Gate, string>> = {}
  try { saved = JSON.parse(sessionStorage.getItem(KEY) ?? '{}') } catch { /* private mode */ }
  const q = new URLSearchParams(window.location.search)
  const out = { ...saved }
  for (const g of Object.keys(GATES) as Gate[]) {
    const v = q.get(g)
    if (v && (GATES[g] as readonly string[]).includes(v)) out[g] = v
  }
  try { sessionStorage.setItem(KEY, JSON.stringify(out)) } catch { /* private mode */ }
  return out
}

const chosen = read()

/** Nati's picks (20.10): the island, the film that develops by itself, both grounds, the cream turn.
    The colour round's gates start on the recommendations. */
const DEFAULTS: { [G in Gate]: Choice<G> } = { head: 'island', film: 'time', ground: 'deep', turn: 'cream', sun: 'time', rows: 'tile', work: 'off', type: 'lama', menu: 'card', stack: 'off', bar: 'ends', bleed: 'veil', hero: 'reel', grain: 'off', trail: 'squares', finger: 'squares', media: 'colour', relief: 'on' }

export function opt<G extends Gate>(g: G): Choice<G> {
  return (chosen[g] ?? DEFAULTS[g]) as Choice<G>
}

// the gates the CSS reads, on the root from the start (type, menu, bar)
if (typeof document !== 'undefined') {
  document.documentElement.classList.add(`sea-type-${opt('type')}`, `sea-menu-${opt('menu')}`, `sea-bar-${opt('bar')}`, `sea-bleed-${opt('bleed')}`, `sea-hero-${opt('hero')}`, `sea-grain-${opt('grain')}`, `sea-trail-${opt('trail')}`, `sea-finger-${opt('finger')}`, `sea-media-${opt('media')}`, `sea-relief-${opt('relief')}`)
}

export const labOpen = () => typeof window !== 'undefined' && /[?&]lab=1(&|$)/.test(window.location.search)

/** Switch one gate and reload the page in place (the field, the header and the turn read it at boot). */
export function pick(g: Gate, v: string) {
  const u = new URL(window.location.href)
  u.searchParams.set(g, v)
  u.searchParams.set('lab', '1')
  if (!u.searchParams.has('motion')) u.searchParams.set('motion', 'full')
  sessionStorage.setItem('mw-sea-lab-y', String(window.scrollY))
  window.location.replace(u.toString())
}
