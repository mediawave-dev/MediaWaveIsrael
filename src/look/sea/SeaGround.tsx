// sea · a chapter's ground (D156, Nati: "they really build the videos into the background, and only
// from the bottom of the video they break it into dots"): the field draws the clip across the whole
// width of its chapter, a picture above the words that breaks into the sea's dots at its bottom edge
// (shader.ts, veilLayer). The poster loads as a texture source only (never in the DOM, so it is never a
// paint candidate) and the loop through a 2 px video; both load near the chapter, or, for the hero,
// after the page has loaded and gone idle, never before the H1. Calm: the poster only; still or no
// WebGL: nothing (the page keeps its own content).
import { useEffect, type RefObject } from 'react'
import * as field from './field'
import { CLIPS, type ClipKey, posterOf, videoOf } from './media'
import { opt } from './lab'

interface Opts {
  on: boolean
  /** the words' block: the edge sits just above it */
  text?: () => HTMLElement | null
  /** a ground with no words: where its edge sits (0 bottom .. 1 top) */
  edge?: number
  /** a dotted top edge, for a ground in the middle of the page (its share of the height) */
  top?: number
  /** the hero: wait for the opening, load after idle */
  after?: boolean
  /** the desktop encode on phones too (a 16:9 clip cut to a phone's slice) */
  hi?: boolean
  focus?: [number, number]
  /** how its edges give way (D158): 0 grain, 1 ordered, 2 soft; each ground its own */
  style?: number
}

export function useGround(section: RefObject<HTMLElement | null>, video: RefObject<HTMLVideoElement | null>, key: ClipKey, o: Opts) {
  const { on, edge, top, after, hi, style } = o
  useEffect(() => {
    if (!on || field.tier() === 'still') return
    const el = section.current
    if (!el) return
    const full = field.tier() === 'full'
    const c = CLIPS[key]
    let alive = true
    let id: number | null = null
    let idle = 0
    let io: IntersectionObserver | null = null
    const go = () => {
      if (!alive) return
      const img = new Image()
      img.decoding = 'async'
      img.src = posterOf(c, !hi && !window.matchMedia('(min-width: 768px)').matches)
      img.onload = () => {
        if (!alive) return
        const v = full ? video.current : null
        if (v && !v.getAttribute('src')) { v.src = videoOf(c, hi); v.load() }
        id = field.addFilm(el, v, img, { mode: opt('media') === 'colour' && !after ? 'colour' : 'time', veil: true, text: o.text?.() ?? null, edge, after, focus: o.focus, top, style })
      }
    }
    void field.ready.then((ok) => {
      if (!alive || !ok) return
      if (after) {
        const later = () => { idle = window.requestIdleCallback ? window.requestIdleCallback(go, { timeout: 2500 }) : window.setTimeout(go, 600) }
        if (document.readyState === 'complete') later()
        else window.addEventListener('load', later, { once: true })
        return
      }
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io?.disconnect(); go() } }, { rootMargin: '60% 0px' })
      io.observe(el)
    })
    return () => {
      alive = false
      io?.disconnect()
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
      field.dropFilm(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, key, edge, top, after, hi, style])
}

/** The loop's source for the field's texture: 2 px, aria-hidden, never a paint candidate. */
export function GroundSource({ video }: { video: RefObject<HTMLVideoElement> }) {
  return <video ref={video} className="sea-sun" muted loop playsInline preload="none" aria-hidden="true" />
}
