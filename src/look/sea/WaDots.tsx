// sea · the WhatsApp mark drawn in the field's dots (D138), for every WhatsApp control: the corner card,
// the WhatsApp keys and the phone dock. On hover its dots burst a little apart and snap back into the
// mark (sea-site.css), and at rest a slow ripple runs through them every few seconds, as through the field.
// The ripple (D198) is one shared clock, not an endless CSS animation per dot: every seven seconds the marks
// on screen get `is-ripple` for one pass and lose it after, so between passes nothing animates (378 endless
// dot animations kept the browser recalculating styles on every frame). A mark is one path until something
// animates its dots (a pass, or a pointer on its key): 126 circles a mark were half of the page's elements, and
// every one of them paid style and layout at first paint and again when React mounts.
import { useEffect, useRef, useState } from 'react'
import { WA_DOTS } from './wa-dots-data'

const EVERY = 7000
// the first pass waits one whole beat: at 2.4 s it fell inside the load, 126 dot restyles a frame per mark
const FIRST = EVERY
// one pass: 0.98 s for a dot, plus the widest stagger (9.9 x 45 ms)
const PASS = 1500
/** the marks and how to wake each one's dots */
const marks = new Map<SVGSVGElement, () => void>()
const inView = new Set<SVGSVGElement>()
let io: IntersectionObserver | null = null
/** every dot as two arcs, the same dots a circle draws */
const STILL = WA_DOTS.map(([x, y, r]) => `M${(x - r).toFixed(3)} ${y}a${r} ${r} 0 1 0 ${(2 * r).toFixed(3)} 0a${r} ${r} 0 1 0 ${(-2 * r).toFixed(3)} 0`).join('')
let clock = 0
// (D199) no pass while the page is being scrolled: it would add 126 dot restyles to every scroll frame
let scrolledAt = 0
const onScroll = () => { scrolledAt = performance.now() }

function pass() {
  if (document.hidden) return
  if (performance.now() - scrolledAt < 600) { window.setTimeout(pass, 700); return }
  const now = [...inView]
  now.forEach((m) => marks.get(m)?.())
  // a frame later: the dots of a mark woken just now are in the DOM by then
  requestAnimationFrame(() => now.forEach((m) => m.classList.add('is-ripple')))
  window.setTimeout(() => now.forEach((m) => m.classList.remove('is-ripple')), PASS)
}

/** a pointer on a key wakes its dots before they burst (sea-site.css) */
const onOver = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  const key = (e.target as Element | null)?.closest?.('.key, .sea-card')
  key?.querySelectorAll('svg.wa-dots').forEach((m) => marks.get(m as SVGSVGElement)?.())
}

function watch(m: SVGSVGElement, wake: () => void) {
  marks.set(m, wake)
  io ??= new IntersectionObserver((es) => es.forEach((e) => {
    const t = e.target as SVGSVGElement
    if (e.isIntersecting) inView.add(t)
    else inView.delete(t)
  }))
  io.observe(m)
  // never in the prerender: a snapshot taken during a pass shipped `is-ripple` to every visitor's first paint
  if (!clock && !(window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) {
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    clock = window.setTimeout(function tick() { pass(); clock = window.setTimeout(tick, EVERY) }, FIRST)
  }
  return () => {
    marks.delete(m)
    inView.delete(m)
    io?.unobserve(m)
    if (!marks.size) { window.clearTimeout(clock); clock = 0; window.removeEventListener('scroll', onScroll); document.removeEventListener('pointerover', onOver) }
  }
}

export default function WaDots({ className = '' }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null)
  const [live, setLive] = useState(false)
  useEffect(() => (svg.current ? watch(svg.current, () => setLive(true)) : undefined), [])
  return (
    <svg ref={svg} className={`wa-dots ${className}`.trim()} viewBox="0 0 15 15" aria-hidden="true" focusable="false">
      {live ? WA_DOTS.map(([x, y, r, d], i) => (
        <circle key={i} cx={x} cy={y} r={r} style={{ ['--d' as string]: d, ['--dx' as string]: ((x - 7.5) / 7.5).toFixed(2), ['--dy' as string]: ((y - 7.5) / 7.5).toFixed(2) }} />
      )) : <path d={STILL} />}
    </svg>
  )
}
