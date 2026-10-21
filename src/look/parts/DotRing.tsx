// The ring of dots around a button (D200, Nati: "some dots small, some big"). The old ring was a square
// grid of dots cut out by a mask, so the capsule's curve sliced some dots in half and spaced the rest
// unevenly. This one is an SVG path along the capsule itself, started at the top centre, with round dots
// at exactly equal steps (pathLength = the dot count, rounded to an even number so the ring mirrors on
// both axes). It redraws when the button changes size. Every dot is the same dot.
import { useLayoutEffect, useRef } from 'react'
import './dot-ring.css'

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

// a light tap under the finger when a ringed button goes down (Android; nothing elsewhere)
let haptics = false
function listenHaptics() {
  if (haptics || typeof navigator === 'undefined' || !('vibrate' in navigator)) return
  haptics = true
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch') return
    if (document.documentElement.classList.contains('disable-animations')) return
    const b = (e.target as Element | null)?.closest?.('a, button')
    if (b?.querySelector('.dot-ring')) { try { navigator.vibrate(7) } catch { /* not allowed yet */ } }
  }, { passive: true, capture: true })
}

// the glass's sheen follows a mouse across a ringed button (D200): one value on that button only
let glare = false
function listenGlare() {
  if (glare || typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  glare = true
  let raf = 0
  let at: { el: HTMLElement; x: number } | null = null
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return
    const b = (e.target as Element | null)?.closest?.('a, button') as HTMLElement | null
    if (!b || !b.querySelector('.dot-ring')) return
    const host = b.querySelector<HTMLElement>('.key__cap') ?? b
    const r = host.getBoundingClientRect()
    at = { el: host, x: Math.max(0, Math.min(100, ((e.clientX - r.left) / Math.max(1, r.width)) * 100)) }
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (at) at.el.style.setProperty('--gx', `${at.x.toFixed(1)}%`) })
  }, { passive: true })
}

export default function DotRing({ className = '', inset = 1.6, gap = GAP }: { className?: string; inset?: number; gap?: number }) {
  const svg = useRef<SVGSVGElement>(null)
  const path = useRef<SVGPathElement>(null)
  useLayoutEffect(() => {
    const s = svg.current
    const p = path.current
    if (!s || !p) return
    listenHaptics()
    listenGlare()
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
