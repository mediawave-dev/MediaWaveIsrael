// The route (D191): the journey through the blueprint world. A red line runs the whole sheet, turning at
// right angles from chapter to chapter like a route drawn on a plan, with a station mark and a mono label at
// each chapter; it draws itself as you scroll, and a red square rides its tip with a live Y readout: you are
// here. Under the still tier the whole route is drawn.
import { useEffect, useRef, useState } from 'react'
import type { Tier } from '../motion'
import { setText } from '../../utils/set-text'

const LABELS: Record<string, string> = { hero: 'START', services: 'SERVICES', work: 'WORK', process: 'PROCESS', faq: 'FAQ', contact: 'CONTACT' }

interface Stop { id: string; y: number; x: number }

export default function Route({ tier }: { tier: Tier }) {
  const svg = useRef<SVGSVGElement>(null)
  const line = useRef<SVGPathElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  const read = useRef<HTMLSpanElement>(null)
  const [geo, setGeo] = useState<{ h: number; d: string; stops: Stop[] } | null>(null)

  // the route's shape: down the margin, stepping in and out at each chapter
  useEffect(() => {
    const root = svg.current?.parentElement
    if (!root) return
    const build = () => {
      const top = root.getBoundingClientRect().top + window.scrollY
      const h = root.scrollHeight
      const wide = window.innerWidth >= 900
      const xs = wide ? [34, 96] : [7, 19]
      const chapters = [...root.querySelectorAll<HTMLElement>('[data-ch]')]
      const stops: Stop[] = chapters.map((el, i) => ({ id: el.dataset.ch ?? '', y: el.getBoundingClientRect().top + window.scrollY - top + (i === 0 ? 120 : 40), x: xs[i % 2] }))
      let d = `M ${stops[0]?.x ?? xs[0]} ${stops[0]?.y ?? 0}`
      for (let i = 1; i < stops.length; i++) {
        const a = stops[i - 1]
        const b = stops[i]
        const mid = b.y - 60
        d += ` V ${mid} H ${b.x} V ${b.y}`
        void a
      }
      d += ` V ${h - 40}`
      setGeo({ h, d, stops })
    }
    build()
    const ro = new ResizeObserver(build)
    ro.observe(root)
    return () => ro.disconnect()
  }, [])

  // drawing it with the scroll: the tip sits a little below the middle of the screen
  useEffect(() => {
    const path = line.current
    const root = svg.current?.parentElement
    if (!path || !root || !geo) return
    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`
    // (D199) the path is sampled once (every 6 px of its length) and the sheet's top read once, so a
    // scroll frame only searches an array: it used to read the sheet's box (a forced layout after the
    // scroll scenes' writes) and ask the path for 19 points, every frame
    const n = Math.max(2, Math.ceil(len / 6))
    const L = new Float32Array(n + 1)
    const X = new Float32Array(n + 1)
    const Y = new Float32Array(n + 1)
    for (let i = 0; i <= n; i++) { const l = (len * i) / n; const q = path.getPointAtLength(l); L[i] = l; X[i] = q.x; Y[i] = q.y }
    const top = root.getBoundingClientRect().top + window.scrollY
    let sy = window.scrollY
    let vh = window.innerHeight
    let lastOff = -1
    let lastRead = ''
    let raf = 0
    const paint = () => {
      raf = 0
      const target = tier === 'still' ? geo.h : sy - top + vh * 0.62
      // the last sample above the target height (the route only ever goes down), then between it and the next
      let lo = 0
      let hi = n
      while (lo < hi) { const m = (lo + hi + 1) >> 1; if (Y[m] < target) lo = m; else hi = m - 1 }
      const j = Math.min(n, lo + 1)
      const f = Y[j] > Y[lo] ? Math.min(1, Math.max(0, (target - Y[lo]) / (Y[j] - Y[lo]))) : 0
      const at = L[lo] + (L[j] - L[lo]) * f
      const px = X[lo] + (X[j] - X[lo]) * f
      const py = Math.min(target, Y[lo] + (Y[j] - Y[lo]) * f)
      const off = Math.round((len - at) * 2) / 2
      if (off !== lastOff) { lastOff = off; path.style.strokeDashoffset = `${off}` }
      if (dot.current) dot.current.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`
      const r = `Y:${Math.round(py)}PX`
      if (r !== lastRead) { lastRead = r; setText(read.current, r) }
    }
    const onScroll = () => { sy = window.scrollY; vh = window.innerHeight; if (!raf) raf = requestAnimationFrame(paint) }
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [geo, tier])

  return (
    <>
      <svg className="bp-route" ref={svg} aria-hidden="true" focusable="false" style={{ height: geo?.h ?? 0 }}>
        {geo && (
          <>
            <path className="bp-route__ghost" d={geo.d} />
            <path className="bp-route__line" ref={line} d={geo.d} />
            {geo.stops.map((s) => (
              <g key={s.id} className="bp-route__stop" transform={`translate(${s.x} ${s.y})`}>
                <rect x="-4.5" y="-4.5" width="9" height="9" />
                <text x="12" y="4">{LABELS[s.id] ?? s.id.toUpperCase()}</text>
              </g>
            ))}
          </>
        )}
      </svg>
      <span className="bp-route__here" ref={dot} aria-hidden="true"><b /><span ref={read} dir="ltr" /></span>
    </>
  )
}
