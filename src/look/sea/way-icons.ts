// sea · the header's mark in dots (the wayfinder): one 13 x 13 halftone icon per chapter, drawn from
// the same objects the field draws (shader.ts), small. Each icon is a list of dots [x, y, r, blue] in
// a 0..13 box; the header morphs from one list to the next by letting each dot travel (SeaWay.tsx).
// The colour code: 0 cream, 1 the logo's blue; 2-5 the search engine's mark (red, yellow, green, blue).
export type Dot = [number, number, number, number]
export const DOT_COLOURS = ['#EDE7DA', '#79A0C5', '#EA4335', '#FBBC05', '#34A853', '#4285F4']
type Fn = (x: number, y: number) => [number, number]

const G = 13
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const box = (x: number, y: number, cx: number, cy: number, hx: number, hy: number) => Math.abs(x - cx) <= hx && Math.abs(y - cy) <= hy
const ring = (x: number, y: number, cx: number, cy: number, r: number, w: number) => Math.abs(Math.hypot(x - cx, y - cy) - r) <= w
const disc = (x: number, y: number, cx: number, cy: number, r: number) => Math.hypot(x - cx, y - cy) <= r

/** x, y in -1..1, y up; returns [value 0..1, blue 0|1] */
const SHAPES: Record<string, Fn> = {
  // the Horizon disc with its sea
  horizon: (x, y) => {
    if (!disc(x, y, 0, 0, 0.95)) return [0, 0]
    const sea = y < -0.06 + 0.06 * Math.sin(x * 4)
    return [sea ? 0.62 : 0.92, sea ? 1 : 0]
  },
  // the laptop, open
  laptop: (x, y) => {
    if (box(x, y, 0, 0.22, 0.72, 0.5)) return [box(x, y, 0, 0.22, 0.56, 0.36) ? (box(x, y, -0.05, 0.38, 0.4, 0.06) ? 0.9 : 0.34) : 0.92, box(x, y, 0.15, 0.06, 0.25, 0.06) ? 1 : 0]
    if (box(x, y, 0, -0.5, 0.95, 0.1)) return [0.9, 0]
    return [0, 0]
  },
  // the cassette, its two reels
  reels: (x, y) => {
    if (!box(x, y, 0, 0, 0.96, 0.62)) return [0, 0]
    if (disc(x, y, -0.42, 0.08, 0.22) || disc(x, y, 0.42, 0.08, 0.22)) return [ring(x, y, -0.42, 0.08, 0.2, 0.06) || ring(x, y, 0.42, 0.08, 0.2, 0.06) ? 0.9 : 0, 0]
    return [box(x, y, 0, -0.45, 0.5, 0.12) ? 0.5 : 0.82, box(x, y, 0, 0.08, 0.2, 0.08) ? 1 : 0]
  },
  // a chat bubble with three dots
  bubble: (x, y) => {
    const inB = box(x, y, 0, 0.15, 0.9, 0.55)
    const tail = x > 0.25 && x < 0.65 && y < -0.4 && y > -0.85 && (y + 0.4) > -(x - 0.25) * 1.2
    if (!inB && !tail) return [0, 0]
    const dots = [-0.4, 0, 0.4].some((cx) => disc(x, y, cx, 0.15, 0.13))
    return [dots ? 0 : 0.86, 0]
  },
  // a phone with one page and one button
  landing: (x, y) => {
    if (!box(x, y, 0, 0, 0.5, 0.95)) return [0, 0]
    if (box(x, y, 0, -0.55, 0.32, 0.12)) return [0.95, 1]
    return [box(x, y, 0, 0.05, 0.36, 0.7) ? (box(x, y, 0, 0.45, 0.3, 0.12) ? 0.8 : 0.3) : 0.92, 0]
  },
  // the search engine's mark (the services' Google row and page): its ring and bar in its colours
  seo: (x, y) => {
    const r = Math.hypot(x, y)
    const a = Math.atan2(y, x)
    const ring = r >= 0.5 && r <= 0.97 && !(a > -0.05 && a < 0.62)
    const bar = Math.abs(y) <= 0.17 && x >= -0.04 && x <= 0.97
    if (!ring && !bar) return [0, 0]
    if (bar && !ring) return [0.95, 5]
    const c = a > 0.62 && a <= 2.5 ? 2 : a > 2.5 || a <= -2.35 ? 3 : a > -2.35 && a <= -0.72 ? 4 : 5
    return [0.95, c]
  },
  // the chatbots: the AI's spark, a four-pointed star and a small one beside it
  chat: (x, y) => {
    const sv = (cx: number, cy: number, s: number) => 1 - (Math.sqrt(Math.abs((x - cx) / s)) + Math.sqrt(Math.abs((y - cy) / s)))
    const big = sv(-0.12, -0.12, 0.92)
    const small = sv(0.64, 0.64, 0.34)
    if (big > 0.04) return [Math.min(1, big * 1.7), 1]
    if (small > 0.04) return [Math.min(1, small * 1.7), 0]
    return [0, 0]
  },
  // a print developing, in the logo's blue
  memory: (x, y) => {
    if (!box(x, y, 0, 0, 0.8, 0.92)) return [0, 0]
    if (!box(x, y, 0, 0.12, 0.62, 0.62)) return [0.75, 0]
    if (disc(x, y, -0.25, 0.42, 0.16)) return [0.95, 0]
    return [y < -0.05 + 0.15 * Math.sin(x * 3) ? 0.85 : 0.45, 1]
  },
  // why us: a mark of something done right
  why: (x, y) => {
    const d1 = Math.abs((y + 0.15) + (x + 0.35)) / Math.SQRT2
    const d2 = Math.abs((y + 0.55) - (x + 0.15) * 1.25) / 1.6
    const on1 = d1 < 0.17 && x > -0.75 && x < -0.12
    const on2 = d2 < 0.17 && x > -0.2 && x < 0.85
    return on1 || on2 ? [0.95, 0] : [0, 0]
  },
  // the process: three steps
  process: (x, y) => {
    if (box(x, y, -0.6, -0.55, 0.22, 0.3)) return [0.6, 0]
    if (box(x, y, 0, -0.3, 0.22, 0.55)) return [0.78, 0]
    if (box(x, y, 0.6, 0, 0.22, 0.85)) return [0.95, 1]
    return [0, 0]
  },
  // the questions: a question mark in a bubble
  faq: (x, y) => {
    const q = ring(x, y, 0, 0.35, 0.36, 0.13) && !(x < 0 && y < 0.35)
    const stem = box(x, y, 0.02, -0.18, 0.12, 0.17)
    const dot = disc(x, y, 0.02, -0.7, 0.14)
    return q || stem || dot ? [0.95, 0] : [0, 0]
  },
}

function sample(fn: Fn): Dot[] {
  const out: Dot[] = []
  for (let j = 0; j < G; j++) {
    for (let i = 0; i < G; i++) {
      const x = ((i + 0.5) / G) * 2 - 1
      const y = 1 - ((j + 0.5) / G) * 2
      const [v, b] = fn(x, y)
      if (v < 0.05) continue
      out.push([i + 0.5, j + 0.5, 0.5 * Math.pow(clamp01(v), 0.62), b])
    }
  }
  return out
}

const cache = new Map<string, Dot[]>()
export function icon(name: string): Dot[] {
  if (!cache.has(name)) cache.set(name, sample(SHAPES[name] ?? SHAPES.horizon))
  return cache.get(name)!
}
export const GRID = G
