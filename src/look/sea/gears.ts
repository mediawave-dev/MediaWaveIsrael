// sea · the gears: how one scroll number (0..1) winds each object in the field. Shared by the home's
// laptop chapter, its services stage and each service's own page, so an object plays the same take
// wherever it appears (D133).
import * as field from './field'
import * as sound from './sound'

const OPEN = (102 * Math.PI) / 180
export const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** The field's scene for each service. */
export const SCENE: Record<string, string> = {
  websites: 'laptop', landing: 'landing', seo: 'seo', chatbots: 'chat', 'video-editing': 'reels', 'memory-videos': 'memory',
}

/** The laptop's take: the lid opens, code types itself, the site arrives, scrolls, its key is tapped, a lead rises. */
let leadWas = 0
export function laptopAt(p: number) {
  const lead = smooth(0.88, 0.98, p)
  if (lead > 0.5 && leadWas <= 0.5) sound.chime()
  leadWas = lead
  field.set({
    lid: OPEN * smooth(0.02, 0.3, p),
    scr: [smooth(0.28, 0.46, p), smooth(0.48, 0.58, p), smooth(0.6, 0.78, p), smooth(0.78, 0.9, p)],
    lead,
  })
}

/** The cassette: the tape is conserved, so the emptying pack turns faster (harvest mr-pandas.md). */
const R0 = 0.2
const R1 = 0.46
const TAPE = 46
export function reels() {
  const st = { l: 0, r: 0, last: -1 }
  /** returns the step since the last call (> 0 playing, < 0 rewinding) */
  return (p: number): number => {
    const dv = st.last < 0 ? 0 : p - st.last
    st.last = p
    const rl = Math.sqrt(R0 * R0 + (1 - p) * (R1 * R1 - R0 * R0))
    const rr = Math.sqrt(R0 * R0 + p * (R1 * R1 - R0 * R0))
    st.l -= (dv * TAPE) / rl
    st.r -= (dv * TAPE) / rr
    field.set({ reel: [st.l, st.r, rl, rr] })
    return dv
  }
}

const GEAR_AT: Record<string, number> = { landing: 0, seo: 1, chatbots: 2, 'memory-videos': 3 }
const gears: [number, number, number, number] = [0, 0, 0, 0]

/** Wind one service's object to p (the cassette is wound by its own reels() driver). */
export function serviceAt(id: string, p: number) {
  if (id === 'websites') { laptopAt(p); return }
  const i = GEAR_AT[id]
  if (i === undefined) return
  gears[i] = clamp01(p)
  field.set({ gear: [gears[0], gears[1], gears[2], gears[3]] })
}
