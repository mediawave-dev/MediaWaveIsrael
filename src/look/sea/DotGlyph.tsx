// sea · small glyphs in the field's material (Nati, 20.10: "everywhere it can be built in dots, build it
// in dots, beautifully animated"): the tick, the plus, the phone, the envelope, the camera and the
// chapters' objects, each sampled on a small grid with every dot sized by how much of its cell the shape
// covers (like the WhatsApp mark, D138). Static SVG, so it prerenders; the motion is CSS (sea-site.css):
// the dots arrive from the centre outward when their block arrives, and on hover they burst a little
// apart and settle, like the WhatsApp mark. Decorative: aria-hidden, the text beside it says it.
import { useEffect, useRef } from 'react'
import { icon, GRID, DOT_COLOURS } from './way-icons'

// one observer for every glyph: a glyph arrives (its dots grow from the centre out) when it comes into
// view; the menu's and the dock's are already in view when they mount
let io: IntersectionObserver | null = null
function arrive(el: Element) {
  if (typeof IntersectionObserver === 'undefined') { el.classList.add('on'); return }
  io ??= new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return
    e.target.classList.add('on')
    io?.unobserve(e.target)
  }), { rootMargin: '0px 0px -8% 0px' })
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
  check: (x, y) => seg(x, y, -0.72, 0.02, -0.22, -0.5) < 0.17 || seg(x, y, -0.22, -0.5, 0.74, 0.56) < 0.17,
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
    cache.set(key, { n: own ? n : GRID, dots: own ? sample(name, n) : icon(name) })
  }
  return cache.get(key)!
}

export default function DotGlyph({ name, n = 11, className = '', colour = false }: { name: string; n?: number; className?: string; colour?: boolean }) {
  const g = glyph(name, n)
  const c = g.n / 2
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => { if (ref.current) arrive(ref.current) }, [])
  return (
    <svg ref={ref} className={`dot-glyph ${className}`.trim()} viewBox={`0 0 ${g.n} ${g.n}`} aria-hidden="true" focusable="false">
      {g.dots.map(([x, y, r, b], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill={colour && b ? DOT_COLOURS[b] : undefined}
          style={{ ['--d' as string]: Math.hypot(x - c, y - c).toFixed(2), ['--dx' as string]: ((x - c) / c).toFixed(2), ['--dy' as string]: ((y - c) / c).toFixed(2) }}
        />
      ))}
    </svg>
  )
}
