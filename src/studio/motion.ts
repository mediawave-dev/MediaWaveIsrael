// The studio's motion tier, the site's rules (D160): full by default, ?calm=1 calm, and still under
// ?reduce=1, the accessibility widget's stop (html.disable-animations / html.motion-reduced) and the
// prerender. The widget can stop motion mid-visit, so styles subscribe instead of reading once.
import { useEffect, useState } from 'react'

export type Tier = 'full' | 'calm' | 'still'

const q = () => (typeof window === 'undefined' ? '' : window.location.search)

export function tierNow(): Tier {
  if (typeof window === 'undefined') return 'still'
  const html = document.documentElement.classList
  if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ || /[?&]reduce=1(&|$)/.test(q())
    || html.contains('disable-animations') || html.contains('motion-reduced')) return 'still'
  if (/[?&]calm=1(&|$)/.test(q()) && !/[?&]motion=full(&|$)/.test(q())) return 'calm'
  return 'full'
}

export function useTier(): Tier {
  const [tier, setTier] = useState<Tier>(() => tierNow())
  useEffect(() => {
    const mo = new MutationObserver(() => setTier(tierNow()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])
  return tier
}

/** A fine pointer (a mouse): cursors and hovers only there. */
export const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Exponential damping independent of the frame rate: `keep` = the share left after one second. */
export const damp = (from: number, to: number, keep: number, dt: number) => to + (from - to) * Math.pow(keep, dt)

/** One shared clock for a style: the callback gets dt in seconds; stops itself when the page hides. */
export function loop(fn: (dt: number, t: number) => void): () => void {
  let raf = 0
  let last = performance.now()
  const t0 = last
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    fn(dt, (now - t0) / 1000)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}
