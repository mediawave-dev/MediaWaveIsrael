// sun · a section whose parts enter with the visitor's scroll (D290; the principle of D273: nothing waits for a
// threshold and plays on its own). From the moment the section's top comes up past `from` of the screen's height,
// progress runs 0 to 1 over `span` of it, lightly smoothed, back and forth with the finger. `paint` turns the progress
// into CSS variables on the section (written only when they change); the stylesheet reads them as var(--x, 1), so
// without scripts, in the prerender, with ?calm=1 and with "ללא אנימציות" the section stands finished.
import { useEffect, useRef } from 'react'

export const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)))
/** soft at both ends: a part never leaps at the first pixels of scroll nor stops dead */
export const soft = (k: number) => k * k * (3 - 2 * k)
/** a throw that passes its place a little and settles */
export const back = (k: number, over = 0.08) => { const s = soft(k); return s + over * Math.sin(Math.PI * s) * s }

export type Put = (name: string, value: number) => void

export function useStage<T extends HTMLElement>(paint: (p: number, put: Put, el: T) => void, { from = 0.95, span = 0.8 } = {}) {
  const ref = useRef<T>(null)
  const draw = useRef(paint)
  draw.current = paint
  useEffect(() => {
    const el = ref.current
    if (!el || (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    const html = document.documentElement
    const still = () => /[?&]calm=1(&|$)/.test(location.search) || html.classList.contains('disable-animations')
    const last: Record<string, string> = {}
    const put: Put = (k, v) => { const s = v.toFixed(4); if (last[k] !== s) { last[k] = s; el.style.setProperty(k, s) } }
    const measure = () => (still() ? 1 : seg(innerHeight * from - el.getBoundingClientRect().top, 0, innerHeight * span))
    let target = measure()
    let shown = target
    let raf = 0
    const tick = () => {
      raf = 0
      shown += (target - shown) * 0.22
      if (Math.abs(target - shown) < 0.0015) shown = target
      draw.current(shown, put, el)
      if (shown !== target) raf = requestAnimationFrame(tick)
    }
    const onScroll = () => { target = measure(); if (!raf) raf = requestAnimationFrame(tick) }
    draw.current(shown, put, el)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const mo = new MutationObserver(onScroll)
    mo.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); mo.disconnect() }
  }, [from, span])
  return ref
}
