// sea · small glyphs in the field's material (Nati, 20.10: "everywhere it can be built in dots, build it
// in dots, beautifully animated"): the tick, the plus, the phone, the envelope, the camera and the
// chapters' objects, each sampled on a small grid with every dot sized by how much of its cell the shape
// covers (like the WhatsApp mark, D138). Static SVG, so it prerenders, and one path per colour (not a
// node per dot: hundreds of dot nodes cost the first paint a second on a phone). The motion is CSS
// (sea-site.css): the dots are revealed from the centre outward when their block arrives, and the glyph
// pops a little on hover. Decorative: aria-hidden, the text beside it says it.
import { useEffect, useRef } from 'react'
import { icon, pix, V11, GRID, DOT_COLOURS } from './way-icons'
import { WA_DOTS } from './wa-dots-data'

// a glyph arrives (its dots grow from the centre out) when it comes into view: on the page once it
// passes a line a little above the bottom of the screen; in fixed chrome (the dock, the menu) as soon
// as it shows, since the dock sits under that line for good and its AI spark never arrived (D168)
let io: IntersectionObserver | null = null
let ioFixed: IntersectionObserver | null = null
const seen = (obs: () => IntersectionObserver | null) => (entries: IntersectionObserverEntry[]) => entries.forEach((e) => {
  if (!e.isIntersecting) return
  e.target.classList.add('on')
  obs()?.unobserve(e.target)
})
function inFixed(el: Element) {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).position === 'fixed') return true
  return false
}
function arrive(el: Element) {
  if (typeof IntersectionObserver === 'undefined') { el.classList.add('on'); return }
  if (inFixed(el)) {
    ioFixed ??= new IntersectionObserver(seen(() => ioFixed))
    ioFixed.observe(el)
    return
  }
  io ??= new IntersectionObserver(seen(() => io), { rootMargin: '0px 0px -8% 0px' })
  io.observe(el)
}

type Sdf = (x: number, y: number) => boolean
const seg = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const vx = bx - ax, vy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy)))
  return Math.hypot(px - ax - vx * t, py - ay - vy * t)
}
const rbox = (x: number, y: number, hx: number, hy: number, r: number) => {
  const qx = Math.abs(x) - hx + r, qy = Math.abs(y) - hy + r
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}

const SHAPES: Record<string, Sdf> = {
  plus: (x, y) => (Math.abs(x) < 0.15 && Math.abs(y) < 0.82) || (Math.abs(y) < 0.15 && Math.abs(x) < 0.82),
  phone: (x, y) => (Math.abs(rbox(x, y, 0.5, 0.9, 0.16)) < 0.12) || Math.hypot(x, y + 0.62) < 0.11,
  mail: (x, y) => Math.abs(rbox(x, y, 0.88, 0.62, 0.08)) < 0.11 || ((seg(x, y, -0.8, 0.54, 0, -0.08) < 0.11 || seg(x, y, 0.8, 0.54, 0, -0.08) < 0.11) && y > -0.6),
  insta: (x, y) => Math.abs(rbox(x, y, 0.86, 0.86, 0.32)) < 0.11 || Math.abs(Math.hypot(x, y) - 0.38) < 0.11 || Math.hypot(x - 0.52, y - 0.52) < 0.11,
}

/** halftone shapes: each dot's size is the shape's value at its cell (the AI's spark: a glow along
    four thin points, big at the heart and fading to the tips, and a small one beside it) */
const sparkV = (x: number, y: number, cx: number, cy: number, s: number) =>
  1 - (Math.pow(Math.abs((x - cx) / s), 0.62) + Math.pow(Math.abs((y - cy) / s), 0.62))
const VALUES: Record<string, (x: number, y: number) => number> = {
  ai: (x, y) => Math.max(sparkV(x, y, -0.12, -0.12, 0.92), sparkV(x, y, 0.64, 0.64, 0.34)),
}

type Dot = [number, number, number, number]
const cache = new Map<string, { n: number; dots: Dot[] }>()

function sample(name: string, n: number): Dot[] {
  const out: Dot[] = []
  const val = VALUES[name]
  if (val) {
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const v = val(((i + 0.5) / n) * 2 - 1, 1 - ((j + 0.5) / n) * 2)
      if (v > 0.03) out.push([i + 0.5, j + 0.5, 0.5 * Math.pow(Math.min(1, v * 2.3), 0.6), 0])
    }
    return out
  }
  const f = SHAPES[name]
  const S = 4
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      let hit = 0
      for (let sj = 0; sj < S; sj++) for (let si = 0; si < S; si++) {
        const x = ((i + (si + 0.5) / S) / n) * 2 - 1
        const y = 1 - ((j + (sj + 0.5) / S) / n) * 2
        if (f(x, y)) hit++
      }
      const cov = hit / (S * S)
      if (cov < 0.12) continue
      out.push([i + 0.5, j + 0.5, 0.5 * Math.sqrt(cov) * 0.92, 0])
    }
  }
  return out
}

function glyph(name: string, n: number) {
  const key = `${name}:${n}`
  if (!cache.has(key)) {
    // the chapters' objects come from the header's icons (way-icons.ts)
    const own = Boolean(SHAPES[name] || VALUES[name])
    if (name === 'wa') cache.set(key, { n: 15, dots: WA_DOTS.map(([x, y, r]) => [x, y, r, 0] as Dot) })
    // the tick is the V, dot by dot (D167)
    else if (name === 'check') cache.set(key, { n: 11, dots: pix(V11, 0.46) })
    else cache.set(key, { n: own ? n : GRID, dots: own ? sample(name, n) : icon(name) })
  }
  return cache.get(key)!
}

export default function DotGlyph({ name, n = 11, className = '', colour = false }: { name: string; n?: number; className?: string; colour?: boolean }) {
  const g = glyph(name, n)
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => { if (ref.current) arrive(ref.current) }, [])
  // one path per colour: every dot is two arcs
  const groups = new Map<number, string>()
  for (const [x, y, r, b] of g.dots) {
    const k = colour ? b : 0
    const d = `M${(x - r).toFixed(2)} ${y.toFixed(2)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`
    groups.set(k, (groups.get(k) ?? '') + d)
  }
  return (
    <svg ref={ref} className={`dot-glyph ${className}`.trim()} viewBox={`0 0 ${g.n} ${g.n}`} aria-hidden="true" focusable="false">
      {[...groups].map(([k, d]) => <path key={k} d={d} fill={k ? DOT_COLOURS[k] : undefined} />)}
    </svg>
  )
}
