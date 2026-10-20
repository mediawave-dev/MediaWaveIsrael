// sea · the work (D155, gate `work`; D169). Only real work, nothing invented: the memories film made for
// a 60th birthday. Nati (20.10): this very site left the rows ("a bit ridiculous"), the tags in cream
// boxes left ("generic"), and a long cut of the film was too much: the row as before, bigger, so a visitor
// sees at a glance what the service is, old photos that come back to life. Four photos from the film
// (G:/tmp/mw-media/enc-memory-clips.sh), each at rest an old print (faded, warm, still); one after another
// each comes to life (three seconds of the film where that photo moves, in its colour) and settles back.
// A mouse on a photo brings it to life at once. The whole row opens the film's page. Calm and still: the
// prints only. [קופי: נתי] the lede.
import { useEffect, useRef, type RefObject } from 'react'
import { Lines, Tag } from './parts'
import { tier } from './field'
import { track } from '../../utils/analytics'

const PHOTOS = [1, 2, 3, 4]
/** after one photo settles, the next wakes this much later (ms) */
const GAP = 450

let webm: boolean | null = null
function clipOf(n: number): string {
  webm ??= document.createElement('video').canPlayType('video/webm; codecs="vp9"') === 'probably'
  const phone = !window.matchMedia('(min-width: 768px)').matches
  return `/media/work-life-${n}${phone ? '-m' : ''}.${webm ? 'webm' : 'mp4'}`
}

/** One photo after another comes to life while the row is on screen; a mouse on one wakes it at once. */
function useLife(strip: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = strip.current
    if (!el || tier() !== 'full') return
    const html = document.documentElement.classList
    const frames = [...el.querySelectorAll<HTMLElement>('.sea-life')]
    const vids = frames.map((f) => f.querySelector('video'))
    let loaded = false
    let seen = false
    let cur = -1
    let held = -1
    let next = 0
    const load = () => {
      if (loaded) return
      loaded = true
      vids.forEach((v, i) => { if (v) { v.src = clipOf(i + 1); v.preload = 'auto'; v.load() } })
    }
    const sleep = (i: number) => {
      frames[i]?.removeAttribute('data-on')
      vids[i]?.pause()
    }
    const wake = (i: number) => {
      const v = vids[i]
      if (!v || html.contains('disable-animations')) return
      if (cur >= 0 && cur !== i) sleep(cur)
      cur = i
      frames[i].setAttribute('data-on', '')
      v.currentTime = 0
      v.play().catch(() => sleep(i))
    }
    // the next photo, a moment after the last one settled
    const ended = (i: number) => {
      sleep(i)
      if (cur === i) cur = -1
      if (held >= 0 || !seen) return
      window.clearTimeout(next)
      next = window.setTimeout(() => { if (seen && held < 0) wake((i + 1) % frames.length) }, GAP)
    }
    const offs = vids.map((v, i) => {
      const on = () => ended(i)
      v?.addEventListener('ended', on)
      return () => v?.removeEventListener('ended', on)
    })
    const hovers = frames.map((f, i) => {
      const enter = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; held = i; window.clearTimeout(next); wake(i) }
      const leave = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; held = -1 }
      f.addEventListener('pointerenter', enter)
      f.addEventListener('pointerleave', leave)
      return () => { f.removeEventListener('pointerenter', enter); f.removeEventListener('pointerleave', leave) }
    })
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { load(); near.disconnect() } }, { rootMargin: '60% 0px' })
    near.observe(el)
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting
      window.clearTimeout(next)
      if (seen && cur < 0) next = window.setTimeout(() => wake(0), 500)
      if (!seen && cur >= 0) { sleep(cur); cur = -1 }
    }, { threshold: 0.45 })
    io.observe(el)
    return () => { near.disconnect(); io.disconnect(); window.clearTimeout(next); offs.forEach((f) => f()); hovers.forEach((f) => f()) }
  }, [strip])
}

export default function SeaWork() {
  const strip = useRef<HTMLSpanElement>(null)
  useLife(strip)
  return (
    <section id="work" className="sea-ch sea-work" aria-labelledby="work-title" data-chapter="work">
      <header className="sea-head" data-reveal="">
        <Tag className="sea-fade">WORK</Tag>
        <h2 id="work-title" className="sea-h2" data-zone="text"><Lines lines={['מהעבודה.']} /></h2>
      </header>
      <p className="sea-lede sea-fade" data-reveal="" data-zone="text">
        <span className="sea-tag sea-lede__tag" aria-hidden="true">REAL WORK</span>
        תמונות ישנות שחוזרות לחיים: סרטון זיכרונות שהכנו ליום הולדת 60.
      </p>
      <ul className="sea-work__list">
        <li className="sea-work__item" data-reveal="">
          <a className="sea-work__row" href="/portfolio/memory-videos/" data-cursor="לצפייה" onClick={() => track('cta_click', { placement: 'work_memory' })}>
            <span className="sea-work__title" data-zone="text">סרטון זיכרונות ליום הולדת 60</span>
            <span className="sea-work__view" aria-hidden="true">( לצפייה + )</span>
            <span ref={strip} className="sea-work__strip" aria-hidden="true">
              {PHOTOS.map((n) => (
                <span key={n} className="sea-life">
                  <picture>
                    <source media="(min-width: 768px)" srcSet={`/media/work-life-${n}.webp`} />
                    <img className="sea-life__still" src={`/media/work-life-${n}-m.webp`} width={480} height={360} alt="" loading="lazy" decoding="async" />
                  </picture>
                  <video className="sea-life__clip" muted playsInline preload="none" />
                </span>
              ))}
            </span>
          </a>
        </li>
      </ul>
    </section>
  )
}
