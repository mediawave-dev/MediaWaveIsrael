// sea · the focus pull's mount (C1): an empty slot in the hero until the page has loaded and gone idle, so the compile
// never lands on first paint and the H1 stays the LCP. The optics are a lazy chunk (optical/focus.ts). The still tier,
// a hero that does not fit one screen, no WebGL2, a lost context or the widget's stop all end in the plain hero, and
// the reader's place on the page is kept when the pin's scroll length goes away.
import { useEffect, useRef } from 'react'
import * as field from './field'
import './sea-focus.css'

export default function SeaFocus() {
  const lens = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = lens.current
    const wrap = el?.closest<HTMLElement>('.sea-focus')
    const hero = el?.closest<HTMLElement>('.sea-hero')
    // the prerender's snapshot keeps the hold, so the first paint and React's first commit have the same height
    if (!el || !wrap || !hero || (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    let alive = true
    let idle = 0
    let dispose: (() => void) | null = null

    const plain = () => {
      alive = false // whatever is still queued (the load, the idle, the chunk) stops here
      dispose?.()
      dispose = null
      if (wrap.classList.contains('is-plain')) return
      const pin = parseFloat(getComputedStyle(hero).top) || 0
      const gone = Math.max(0, pin - wrap.getBoundingClientRect().top)
      const after = wrap.nextElementSibling
      const was = after?.getBoundingClientRect().top ?? 0
      wrap.classList.add('is-plain')
      // where the browser's own scroll anchoring has not already kept the reader's place
      const rose = was - (after?.getBoundingClientRect().top ?? 0)
      if (gone > 0 && rose > 0) window.scrollBy(0, -Math.min(gone, rose))
      window.dispatchEvent(new Event('resize')) // the chapters below measured themselves with the pin
    }

    const tier = field.tier()
    // the pin holds the hero at the header's height: a hero taller than what is left would hide its own key
    const fits = hero.offsetHeight + (parseFloat(getComputedStyle(hero).top) || 0) <= window.innerHeight + 1
    if (tier === 'still' || (tier === 'full' && !fits)) { plain(); return }
    if (tier !== 'full') wrap.classList.add('is-calm')

    const go = () => {
      void import('./optical/focus').then((m) => {
        if (!alive) return
        dispose = m.mountFocus(el, wrap, hero, { reduce: tier !== 'full', onEnd: plain })
        if (!dispose) plain()
      }).catch(plain)
    }
    const later = () => { idle = window.requestIdleCallback ? window.requestIdleCallback(go, { timeout: 2500 }) : window.setTimeout(go, 600) }
    // the field speaks first: no GPU means the plain hero, and its compile is over before the lens asks the driver for another
    void field.ready.then((ok) => {
      if (!alive) return
      if (!ok) { plain(); return }
      if (document.readyState === 'complete') later()
      else window.addEventListener('load', later, { once: true })
    })

    return () => {
      alive = false
      window.removeEventListener('load', later)
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
      dispose?.()
    }
  }, [])

  return <div ref={lens} className="sea-focus__lens" aria-hidden="true" />
}
