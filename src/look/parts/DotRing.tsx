// The ring of dots around a button (D200, Nati: "some dots small, some big"). The old ring was a square
// grid of dots cut out by a mask, so the capsule's curve sliced some dots in half and spaced the rest
// unevenly. This one is an SVG path along the capsule itself, started at the top centre, with round dots
// at exactly equal steps (pathLength = the dot count, rounded to an even number so the ring mirrors on
// both axes). It redraws when the button changes size. Every dot is the same dot.
import { useLayoutEffect, useRef } from 'react'
import './dot-ring.css'
import { listenHaptics } from './haptics'

/** the gap between dots, centre to centre, in px */
const GAP = 6.2

function capsule(w: number, h: number, inset: number): { d: string; length: number } {
  const r = Math.max(1, Math.min(w, h) / 2 - inset)
  const x0 = inset
  const x1 = w - inset
  const y0 = inset
  const y1 = h - inset
  const cx = w / 2
  if (w >= h) {
    const run = Math.max(0, x1 - x0 - 2 * r)
    return {
      d: `M ${cx} ${y0} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`,
      length: 2 * run + 2 * Math.PI * r,
    }
  }
  const run = Math.max(0, y1 - y0 - 2 * r)
  return {
    d: `M ${cx} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} V ${y1 - r} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} V ${y0 + r} A ${r} ${r} 0 0 1 ${cx} ${y0} Z`,
    length: 2 * run + 2 * Math.PI * r,
  }
}

export default function DotRing({ className = '', inset = 1.6, gap = GAP }: { className?: string; inset?: number; gap?: number }) {
  const svg = useRef<SVGSVGElement>(null)
  const path = useRef<SVGPathElement>(null)
  useLayoutEffect(() => {
    const s = svg.current
    const p = path.current
    if (!s || !p) return
    listenHaptics()
    let last = ''
    const draw = (w: number, h: number) => {
      if (w < 6 || h < 6) return
      const key = `${w.toFixed(1)}x${h.toFixed(1)}`
      if (key === last) return
      last = key
      const { d, length } = capsule(w, h, inset)
      let n = Math.max(8, Math.round(length / gap))
      if (n % 2) n += 1
      s.setAttribute('viewBox', `0 0 ${w} ${h}`)
      p.setAttribute('d', d)
      p.setAttribute('pathLength', String(n))
    }
    const r = s.getBoundingClientRect()
    draw(r.width, r.height)
    const ro = new ResizeObserver(([e]) => draw(e.contentRect.width, e.contentRect.height))
    ro.observe(s)
    return () => ro.disconnect()
  }, [inset, gap])
  return (
    <svg ref={svg} className={`dot-ring ${className}`.trim()} aria-hidden="true" focusable="false">
      <path ref={path} />
    </svg>
  )
}
