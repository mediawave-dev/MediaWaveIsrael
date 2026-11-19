// sun · one of the sites we built, in a phone (D299). The same frame and the same recordings as the wheel's phones
// (Wheel.tsx, sun.css .wheel__card): the still picture is the poster, the recording lies over it once it really plays.
// The phone takes its size from --cw on whatever holds it. Decorative: the caption beside it says what it is.
import { useEffect, type CSSProperties, type RefObject } from 'react'
import { STEADY_TOP } from './Wheel'

export function Phone({ slug, play, className = '' }: { slug: string; play: boolean; className?: string }) {
  return (
    <span className={`wheel__card${STEADY_TOP.has(slug) ? '' : ' wheel__card--full'}${className ? ` ${className}` : ''}`} style={{ '--shot': `url(/work/${slug}-card-top.webp)` } as CSSProperties}>
      <span className="wheel__screen">
        {play && <video src={`/work/${slug}-card-top.mp4`} muted loop playsInline preload="none" tabIndex={-1} disablePictureInPicture disableRemotePlayback />}
        <img src={`/work/${slug}-card-top.webp`} alt="" width={528} height={1056} draggable={false} loading="lazy" decoding="async" />
      </span>
    </span>
  )
}

/** The recordings inside `box` play only while they are on the screen and only where motion is allowed (not with
    ?calm=1 or "ללא אנימציות"); `only` narrows it to the videos that match (the phone in front, by its seat's data-pos). A recording shows once
    it is really playing, fading in over its still. `on` is the page's "videos may start" (Wheel.tsx, useVideosReady). */
export function usePlayInView(box: RefObject<HTMLElement>, on: boolean, only?: string) {
  useEffect(() => {
    const el = box.current
    if (!el || !on || typeof IntersectionObserver === 'undefined') return
    const html = document.documentElement
    const calm = /[?&]calm=1(&|$)/.test(location.search)
    const run = () => !calm && !html.classList.contains('disable-animations')
    const seen = new Set<HTMLVideoElement>()
    const vids = [...el.querySelectorAll('video')]
    const sync = (v: HTMLVideoElement) => {
      if (run() && seen.has(v) && (!only || v.matches(only))) v.play().catch(() => { /* a refused start leaves the still, which is the whole picture */ })
      else if (!v.paused) v.pause()
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { const v = e.target as HTMLVideoElement; if (e.isIntersecting) seen.add(v); else seen.delete(v); sync(v) }
    }, { rootMargin: '60px', threshold: 0.05 })
    const shown = (e: Event) => (e.currentTarget as HTMLVideoElement).setAttribute('data-on', '')
    vids.forEach((v) => { io.observe(v); v.addEventListener('playing', shown) })
    const mo = new MutationObserver(() => vids.forEach(sync))
    mo.observe(html, { attributes: true, attributeFilter: ['class'] })
    mo.observe(el, { attributes: true, subtree: true, attributeFilter: ['data-pos'] })
    return () => { io.disconnect(); mo.disconnect(); vids.forEach((v) => v.removeEventListener('playing', shown)) }
  }, [box, on, only])
}
