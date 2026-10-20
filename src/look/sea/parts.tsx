// sea · small shared parts: the bracketed mono tag, a heading revealed in lines, the live clock
// (Israel time, true data), the reveal observer and the no-WebGL still of the Horizon disc.
import { useEffect, useRef, type ReactNode } from 'react'
import { tier } from './field'
import { decode, decodeTags } from './decode'

/** A Lama-style label in brackets and mono (`he`: in Hebrew, in the text face). Decorative: the heading
    beside it says the same. */
export function Tag({ children, className = '', he = false }: { children: ReactNode; className?: string; he?: boolean }) {
  return <span className={`sea-tag${he ? ' sea-tag--he' : ''} ${className}`.trim()} aria-hidden="true">{children}</span>
}

/** A heading's lines, each in its own mask so it can rise into place (sea.css, html.sea-reveal). */
export function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className="sea-ln" style={{ ['--i' as string]: i }}><span>{l}</span>{i < lines.length - 1 ? ' ' : ''}</span>
      ))}
    </>
  )
}

const FMT = typeof Intl !== 'undefined'
  ? new Intl.DateTimeFormat('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jerusalem' })
  : null

/** The live clock, Israel time. It stops with the widget's stop switch and under ?reduce=1 (WCAG 2.2.2). */
export function Clock() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ || !FMT) return
    const now = () => FMT.format(new Date()).split(':').join(' : ')
    const tick = () => {
      if (document.documentElement.classList.contains('disable-animations')) return
      if (ref.current) ref.current.textContent = now()
    }
    // the first reading develops out of dots, like every label (decode.ts)
    if (ref.current) void decode(ref.current, now(), 300)
    if (tier() === 'still') return
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className="sea-tag sea-rec" aria-hidden="true">
      <span ref={ref} className="sea-clock">-- : -- : --</span> IL
    </span>
  )
}

/** Reveal each [data-reveal] block as it arrives (html.sea-reveal is set before first paint). */
export function useReveals(deps: unknown[] = []) {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]:not(.on)')]
    if (!document.documentElement.classList.contains('sea-reveal')) { els.forEach((el) => el.classList.add('on')); return }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return
      e.target.classList.add('on')
      decodeTags(e.target)
      io.unobserve(e.target)
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.15 })
    els.forEach((el) => io.observe(el))
    // a safety net (D168): a moment after the page stops, whatever is on the screen above the arrival line
    // arrives (a fast flick can carry a block past the observer), and at the very end of a page everything
    // on the screen does (the last blocks may sit under that line for good)
    const sweep = () => {
      const end = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      const line = window.innerHeight * (end ? 1 : 0.92)
      document.querySelectorAll<HTMLElement | SVGElement>('[data-reveal]:not(.on), .dot-glyph:not(.on)').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom <= 0 || r.top >= line || (r.width === 0 && r.height === 0)) return
        el.classList.add('on')
        if (el.hasAttribute('data-reveal')) { decodeTags(el as HTMLElement); io.unobserve(el) }
      })
    }
    let settle = 0
    const onScroll = () => { window.clearTimeout(settle); settle = window.setTimeout(sweep, 160) }
    window.addEventListener('scroll', onScroll, { passive: true })
    const first = window.setTimeout(sweep, 600)
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.clearTimeout(first); window.clearTimeout(settle) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** The Horizon disc as a plain dot screen, for pages without WebGL (and before it starts). */
export function DiscStill() {
  return <span className="sea-still" aria-hidden="true"><i /></span>
}
