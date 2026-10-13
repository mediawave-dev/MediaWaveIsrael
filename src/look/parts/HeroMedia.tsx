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

/** A film and its first frame, for desktops and for phones. */
export interface HeroFilm {
  video: string
  videoMobile: string
  poster: string
  posterMobile: string
  /** the phone poster's width, for srcset */
  posterMobileWidth: number
  width: number
  height: number
}

/** The launch film (K and M looks): a top-down desk, 1920 x 1028. */
export const DESK_FILM: HeroFilm = {
  video: '/videos/hero-bg.mp4', videoMobile: '/videos/hero-bg-m.mp4',
  poster: '/images/hero-poster.webp', posterMobile: '/images/hero-poster-m.webp', posterMobileWidth: 720,
  width: 1920, height: 1028,
}

/** The KM lens's film (DECISIONS #64): someone browsing an online store on a round table, cut
    square around the laptop and the hand and looped forward and back (7.6 s, seamless). Source:
    Pexels 5585952 (RDNE Stock project, Pexels licence). */
export const LENS_FILM: HeroFilm = {
  video: '/videos/lens.mp4', videoMobile: '/videos/lens-m.mp4',
  poster: '/images/lens-poster.webp', posterMobile: '/images/lens-m-poster.webp', posterMobileWidth: 600,
  width: 720, height: 720,
}

/** The file to play, or null while the video must not run. */
export function useHeroVideo(film: HeroFilm = DESK_FILM): string | null {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const reduced = useReducedMotion()
  const ambient = useAmbientMotion()
  const ready = useLoadedIdle()
  if (!ready || !ambient || (reduced && !forceFull()) || saveData()) return null
  return isDesktop ? film.video : film.videoMobile
}

export function HeroMedia({ className = '', sizes = '(max-width: 860px) 45vw, 504px', film = DESK_FILM }: { className?: string; sizes?: string; film?: HeroFilm }) {
  const src = useHeroVideo(film)
  const ref = useScene<HTMLSpanElement>((e, root) => {
    const video = root.querySelector('video')
    if (video) e.playInView(video)
  }, [src])
  return (
    <span ref={ref} className={`hero-media ${className}`}>
      {/* fetchpriority low: the H1 is the LCP (the KM opener's film fills the hero, #62) */}
      <img
        src={film.poster}
        srcSet={`${film.posterMobile} ${film.posterMobileWidth}w, ${film.poster} ${film.width}w`}
        sizes={sizes}
        alt=""
        aria-hidden="true"
        width={film.width}
        height={film.height}
        decoding="async"
        {...{ fetchpriority: 'low' }}
      />
      {src && <video key={src} muted loop playsInline preload="none" aria-hidden="true" data-src={src} />}
    </span>
  )
}
