// sun · the mark, alive (D263). The logo is a disc with a sea line through it. Here the same disc holds moving water:
// the line runs like a slow swell, and the water walks through the logo's colours (the keyframes of D262).
// Two uses, one drawing:
//   <Buoy>  the mark as a button that floats on the wave between two sections and takes the visitor to the next one.
//           It bobs on the seam like a buoy; under a pointer or a finger its water rises.
//   <Tide>  the water alone, inside a ring. In the steps it stands higher at each step and is full at the last.
// Everything that moves is a transform or a fill on a small SVG. The accessibility panel's "ללא אנימציות" stops it.
import { useEffect, useId, useRef, type CSSProperties } from 'react'
import { track } from '../utils/analytics'
import { IconChevrons } from './icons'
import './tide.css'

/** `level`: 0 is an empty disc, 1 a full one. `deep` draws the dark upper half (the mark itself); without it the
    water stands in whatever the ring is made of. */
export function Tide({ level = 0.5, deep = false }: { level?: number; deep?: boolean }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="tide" viewBox="0 0 64 64" aria-hidden="true" focusable="false" style={{ '--lvl': level } as CSSProperties}>
      <defs><clipPath id={id}><circle cx="32" cy="32" r="32" /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        {deep && <rect className="tide__deep" width="64" height="64" />}
        <g className="tide__rise">
          {/* two wave lengths wider than the disc on each side: sliding it by one length loops without a seam */}
          <g className="tide__run">
            <path className="tide__water" d="M-64 0Q-48 -6 -32 0T0 0T32 0T64 0T96 0T128 0V80H-64Z" />
            {deep && <path className="tide__line" d="M-64 0Q-48 -6 -32 0T0 0T32 0T64 0T96 0T128 0" />}
          </g>
        </g>
      </g>
    </svg>
  )
}

/** The mark as a button on the seam between two sections. `at`: which edge of its section it rides. */
export function Buoy({ to, label, at }: { to: string; label: string; at: 'top' | 'bottom' | 'foot' }) {
  return (
    <a className={`buoy buoy--${at}`} href={`#${to}`} aria-label={label} onClick={() => track('cta_click', { placement: `buoy_${to}` })}>
      <Tide level={at === 'foot' ? 0.36 : 0.5} deep />
      <IconChevrons className="buoy__arrow" width={18} height={18} />
    </a>
  )
}

/** Marks a block once it has come into view (class is-in), so the water in its rings rises from empty then.
    Before the script runs, and with scripts off, the rings already stand at their levels. */
export function useRise<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    // already on the screen when the page wakes (a link to /#process): the rings stay at their levels, no second rise
    const r = el.getBoundingClientRect()
    if (r.top < innerHeight && r.bottom > 0) return
    el.classList.add('tide-wait')
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect() } }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
