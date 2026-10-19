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

/** Nati's picks (20.10): the island, the film that develops by itself, both grounds, the cream turn. */
const DEFAULTS: { [G in Gate]: Choice<G> } = { head: 'island', film: 'time', ground: 'both', turn: 'cream' }

export function opt<G extends Gate>(g: G): Choice<G> {
  return (chosen[g] ?? DEFAULTS[g]) as Choice<G>
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
