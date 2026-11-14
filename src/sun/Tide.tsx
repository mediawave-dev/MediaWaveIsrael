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

/** D273: the water in a block's rings follows the visitor's scroll (Nati, 14.11: "ההנפשה צריכה להיות סופר טבעית בגלילה
    של היוזר"; it used to wait at empty and then rise on its own once a quarter of the block was in view). Each ring fills by
    its own place on the screen: empty while it is under the screen, at its level once it stands at 55% of the height, back
    and forth with the finger, lightly smoothed; so the rings fill one after another on the way down. Already in view when
    the page wakes, with no motion (?calm=1, the panel's "ללא אנימציות") or with scripts off, they stand at their levels. */
export function useRise<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    const html = document.documentElement
    const still = () => /[?&]calm=1(&|$)/.test(location.search) || html.classList.contains('disable-animations')
    const rings = [...el.querySelectorAll<SVGSVGElement>('.tide')]
    if (!rings.length) return
    const soft = (k: number) => k * k * (3 - 2 * k)
    const fillOf = (ring: Element) => {
      if (still()) return 1
      const k = (innerHeight - ring.getBoundingClientRect().top) / (innerHeight * 0.45)
      return soft(Math.min(1, Math.max(0, k)))
    }
    let target = rings.map(fillOf)
    const shown = [...target]
    const put = (i: number) => rings[i].style.setProperty('--fill', shown[i].toFixed(4))
    let raf = 0
    const tick = () => {
      raf = 0
      let moving = false
      for (let i = 0; i < rings.length; i++) {
        shown[i] += (target[i] - shown[i]) * 0.2
        if (Math.abs(target[i] - shown[i]) < 0.002) shown[i] = target[i]; else moving = true
        put(i)
      }
      if (moving) raf = requestAnimationFrame(tick)
    }
    const onScroll = () => { target = rings.map(fillOf); if (!raf) raf = requestAnimationFrame(tick) }
    el.classList.add('tide-wait')
    rings.forEach((_, i) => put(i))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const calm = new MutationObserver(onScroll)
    calm.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      calm.disconnect()
    }
  }, [])
  return ref
}
