// The hero video, sacred in every look (REDESIGN-PROMPT §2). The poster is always there (it
// is the first frame). Since DECISIONS #51 the video plays on phones too (Nati: live motion
// adds a lot): phones get a light encode of the same clip (hero-bg-m.mp4, 640 px, 189 KB
// against 2.9 MB), mounted only after the page has loaded and the browser is idle, never
// with Data Saver on. Still never under OS reduced motion (unless ?motion=full for review)
// and never with the widget's "stop animations". Once mounted, engine.playInView owns it:
// src on approach, play while visible, pause out of view, shown once a frame is painting.

import { useEffect, useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useAmbientMotion, useReducedMotion } from '../../hooks/useReducedMotion'
import { useScene } from '../../motion/ScrollEngineProvider'

const forceFull = () => new URLSearchParams(window.location.search).get('motion') === 'full'
const saveData = () => Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)

/** After load, then idle: the video never competes with the first paint for bandwidth. */
function useLoadedIdle(): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let idleId = 0
    let timer = 0
    const idle = () => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
      else timer = setTimeout(() => setReady(true), 400) as unknown as number
    }
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })
    return () => {
      window.removeEventListener('load', idle)
      if (idleId) window.cancelIdleCallback(idleId)
      clearTimeout(timer)
    }
  }, [])
  return ready
}

/** The file to play, or null while the video must not run. */
export function useHeroVideo(): string | null {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const reduced = useReducedMotion()
  const ambient = useAmbientMotion()
  const ready = useLoadedIdle()
  if (!ready || !ambient || (reduced && !forceFull()) || saveData()) return null
  return isDesktop ? '/videos/hero-bg.mp4' : '/videos/hero-bg-m.mp4'
}

export function HeroMedia({ className = '' }: { className?: string }) {
  const src = useHeroVideo()
  const ref = useScene<HTMLSpanElement>((e, root) => {
    const video = root.querySelector('video')
    if (video) e.playInView(video)
  }, [src])
  return (
    <span ref={ref} className={`hero-media ${className}`}>
      {/* fetchpriority low: the LCP is the H1 text, not this frame */}
      <img
        src="/images/hero-poster.webp"
        srcSet="/images/hero-poster-m.webp 720w, /images/hero-poster.webp 1920w"
        sizes="(max-width: 860px) 92vw, 860px"
        alt=""
        aria-hidden="true"
        width="1920"
        height="1028"
        decoding="async"
        {...{ fetchpriority: 'low' }}
      />
      {src && <video key={src} muted loop playsInline preload="none" aria-hidden="true" data-src={src} />}
    </span>
  )
}
