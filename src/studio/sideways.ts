// Sideways (D195): the services travel across the screen while the page scrolls down. The chapter holds
// (a sticky stage inside a wrapper as tall as the track is wide), and the vertical scroll moves the track
// horizontally; in RTL the next service comes in from the left, so the track moves right. Each world gets
// every frame's progress and each card's distance from the middle, and choreographs its own way. Keyboard
// focus on a card scrolls the page to where that card sits in the middle. Without JS or under the still
// tier the services simply wrap (the CSS of each world), so the content is always there.
import { useEffect, type RefObject } from 'react'
import type { Tier } from './motion'

export interface SidewaysFrame {
  /** 0..1 through the chapter */
  p: number
  /** px/frame the track moved (for tilt and stretch) */
  v: number
  /** how far the track has moved (px) */
  x: number
  /** each card's centre from the screen's centre, in screen widths (0 = in the middle) */
  d: number[]
}

const PRERENDER = typeof window !== 'undefined' && !!(window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__

export function useSideways(wrap: RefObject<HTMLElement | null>, track: RefObject<HTMLElement | null>, tier: Tier, opts: { ease?: number; onFrame?: (f: SidewaysFrame) => void } = {}) {
  useEffect(() => {
    const w = wrap.current
    const t = track.current
    if (!w || !t || tier === 'still' || PRERENDER) return
    w.classList.add('is-sideways')
    const cards = [...t.children] as HTMLElement[]
    let dist = 0
    let lefts: number[] = []
    const measure = () => {
      t.style.transform = 'none'
      const stage = t.parentElement as HTMLElement
      dist = Math.max(0, t.scrollWidth - stage.clientWidth)
      w.style.height = `${dist + window.innerHeight}px`
      const sr = stage.getBoundingClientRect()
      lefts = cards.map((c) => { const r = c.getBoundingClientRect(); return r.left - sr.left + r.width / 2 })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(t)
    window.addEventListener('resize', measure)

    let cur = 0
    let x = 0
    let raf = 0
    let seen = false
    const ease = opts.ease ?? 0.16
    const frame = () => {
      raf = 0
      const r = w.getBoundingClientRect()
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - window.innerHeight)))
      cur += (p - cur) * (tier === 'calm' ? 1 : ease)
      const nx = cur * dist
      const v = nx - x
      x = nx
      t.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`
      const vw = window.innerWidth
      opts.onFrame?.({ p: cur, v, x, d: lefts.map((l) => (l + x - vw / 2) / vw) })
      if (seen && Math.abs(p - cur) > 0.0005) raf = requestAnimationFrame(frame)
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame) }
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen) kick() }, { rootMargin: '20% 0px' })
    io.observe(w)
    window.addEventListener('scroll', kick, { passive: true })
    frame()

    // a keyboard visitor tabbing through the services lands on each one in the middle of the screen
    const focus = (e: FocusEvent) => {
      const i = cards.findIndex((c) => c.contains(e.target as Node))
      if (i < 0 || !dist) return
      const want = Math.max(0, Math.min(1, (window.innerWidth / 2 - lefts[i]) / dist))
      const top = w.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top + want * (w.offsetHeight - window.innerHeight) })
    }
    t.addEventListener('focusin', focus)
    return () => {
      ro.disconnect(); io.disconnect(); cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure); window.removeEventListener('scroll', kick)
      t.removeEventListener('focusin', focus)
      w.classList.remove('is-sideways'); w.style.height = ''; t.style.transform = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrap, track, tier])
}
