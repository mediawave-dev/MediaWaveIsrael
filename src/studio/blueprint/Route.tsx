// The route (D191): the journey through the blueprint world. A red line runs the whole sheet, turning at
// right angles from chapter to chapter like a route drawn on a plan, with a station mark and a mono label at
// each chapter; it draws itself as you scroll, and a red square rides its tip with a live Y readout: you are
// here. Under the still tier the whole route is drawn.
import { useEffect, useRef, useState } from 'react'
import type { Tier } from '../motion'

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
    if (!path || !geo) return
    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`
    let raf = 0
    const paint = () => {
      raf = 0
      const root = svg.current?.parentElement
      if (!root) return
      const top = root.getBoundingClientRect().top
      const target = tier === 'still' ? geo.h : -top + window.innerHeight * 0.62
      // walk the path for the length whose point is at the target height (the route only ever goes down)
      let lo = 0
      let hi = len
      for (let k = 0; k < 18; k++) { const m = (lo + hi) / 2; if (path.getPointAtLength(m).y < target) lo = m; else hi = m }
      path.style.strokeDashoffset = `${len - lo}`
      const p = path.getPointAtLength(lo)
      if (dot.current) dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
      if (read.current) read.current.textContent = `Y:${Math.round(p.y)}PX`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint) }
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
