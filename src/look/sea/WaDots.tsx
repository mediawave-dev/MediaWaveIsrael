// sea · the WhatsApp mark drawn in the field's dots (D138), for every WhatsApp control: the corner card,
// the WhatsApp keys and the phone dock. On hover its dots burst a little apart and snap back into the
// mark (sea-site.css), and at rest a slow ripple runs through them every few seconds, as through the field.
// The ripple (D198) is one shared clock, not an endless CSS animation per dot: every seven seconds the marks
// on screen get `is-ripple` for one pass and lose it after, so between passes nothing animates (378 endless
// dot animations kept the browser recalculating styles on every frame).
import { useEffect, useRef } from 'react'
import { WA_DOTS } from './wa-dots-data'

const EVERY = 7000
const FIRST = 2400
// one pass: 0.98 s for a dot, plus the widest stagger (9.9 x 45 ms)
const PASS = 1500
const marks = new Set<SVGSVGElement>()
const inView = new Set<SVGSVGElement>()
let io: IntersectionObserver | null = null
let clock = 0
// (D199) no pass while the page is being scrolled: it would add 126 dot restyles to every scroll frame
let scrolledAt = 0
const onScroll = () => { scrolledAt = performance.now() }

function pass() {
  if (document.hidden) return
  if (performance.now() - scrolledAt < 600) { window.setTimeout(pass, 700); return }
  const now = [...inView]
  now.forEach((m) => m.classList.add('is-ripple'))
  window.setTimeout(() => now.forEach((m) => m.classList.remove('is-ripple')), PASS)
}

function watch(m: SVGSVGElement) {
  marks.add(m)
  io ??= new IntersectionObserver((es) => es.forEach((e) => {
    const t = e.target as SVGSVGElement
    if (e.isIntersecting) inView.add(t)
    else inView.delete(t)
  }))
  io.observe(m)
  if (!clock) {
    window.addEventListener('scroll', onScroll, { passive: true })
    clock = window.setTimeout(function tick() { pass(); clock = window.setTimeout(tick, EVERY) }, FIRST)
  }
  return () => {
    marks.delete(m)
    inView.delete(m)
    io?.unobserve(m)
    if (!marks.size) { window.clearTimeout(clock); clock = 0; window.removeEventListener('scroll', onScroll) }
  }
}

export default function WaDots({ className = '' }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null)
  useEffect(() => (svg.current ? watch(svg.current) : undefined), [])
  return (
    <svg ref={svg} className={`wa-dots ${className}`.trim()} viewBox="0 0 15 15" aria-hidden="true" focusable="false">
      {WA_DOTS.map(([x, y, r, d], i) => (
        <circle key={i} cx={x} cy={y} r={r} style={{ ['--d' as string]: d, ['--dx' as string]: ((x - 7.5) / 7.5).toFixed(2), ['--dy' as string]: ((y - 7.5) / 7.5).toFixed(2) }} />
      ))}
    </svg>
  )
}
