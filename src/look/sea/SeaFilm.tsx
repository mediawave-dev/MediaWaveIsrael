// sea · the film develops (harvest lamalama-deep.rtl.md §3 #4, translated into our world): tape reels
// turning in orange light (D154, Pexels 855412) play in their own slot (D139) drawn in the sea's dots,
// light as cream and shadow as the logo's blue; the finger's ripple moves them like water, and they
// develop into the real colour cell by cell, like a print in a tray (the memories' cyanotype, tape to
// screen). Gate `film` (lab.ts): touch = it develops under the pointer, and a tap develops all of it;
// scroll = it develops as it reaches the middle of the screen; time = by itself, a moment after it is in
// view (Nati's pick, D153). The video loads only near the slot (the phone's light encode on phones) and
// plays only on screen, in full motion. Calm: the poster in dots, developing as in full; still or no
// WebGL: the poster as a plain image. [קופי: נתי] the heading, the line, the hint and the cursor's label.
import { useEffect, useRef, useState } from 'react'
import * as field from './field'
import { opt } from './lab'
import { Lines, Tag } from './parts'
import { CLIPS, avifOf, posterOf, posterSet, videoOf } from './media'
import { GroundSource, useGround } from './SeaGround'

const FILM = CLIPS['film-tapes']

export default function SeaFilm() {
  const section = useRef<HTMLElement>(null)
  const source = useRef<HTMLVideoElement>(null)
  // the reels as the chapter's ground (D156, gate `bleed`): across the chapter, breaking into dots
  // above the words; otherwise in their own slot
  const veil = opt('bleed') === 'veil'
  useGround(section, source, 'film-veil', { on: veil && opt('film') !== 'off', top: 0.16, style: 1, text: () => section.current?.querySelector<HTMLElement>('.sea-in') ?? null })
  const slot = useRef<HTMLSpanElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const poster = useRef<HTMLImageElement>(null)
  const id = useRef<number | null>(null)
  const how = opt('film')
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (how === 'off' || veil) return
    const el = slot.current
    if (!el) return
    const html = document.documentElement.classList
    const full = field.tier() === 'full'
    let alive = true
    void field.ready.then((ok) => {
      if (!alive || !ok) return
      html.add('sea-film-gl')
      id.current = field.addFilm(el, full ? video.current : null, poster.current, { mode: how })
    })
    // the film's file only when the slot comes near, and only where it may play
    const io = new IntersectionObserver(([e]) => {
      const v = video.current
      if (!e.isIntersecting || !v || v.getAttribute('src') || !full) return
      v.src = videoOf(FILM)
      v.load()
      io.disconnect()
    }, { rootMargin: '60% 0px' })
    io.observe(el)
    return () => {
      alive = false
      io.disconnect()
      field.dropFilm(id.current)
      id.current = null
      html.remove('sea-film-gl')
    }
  }, [how, veil])

  if (how === 'off') return null
  const hint = how === 'touch' ? 'געו בסרט, והוא מתפתח' : how === 'scroll' ? 'גללו, והסרט מתפתח' : 'רגע, והסרט מתפתח'
  return (
    <section ref={section} className={`sea-ch sea-film${veil ? ' sea-film--veil' : ''}`} aria-labelledby="film-title" data-chapter="film">
      {veil && <GroundSource video={source} />}
      {!veil && <span ref={slot} className="sea-spot sea-spot--film" data-cursor={how === 'touch' ? 'הזיזו כאן, והסרט מתפתח' : undefined}>
        <picture>
          <source type="image/avif" srcSet={avifOf(FILM)} media="(min-width: 768px)" />
          <img
            ref={poster}
            className="sea-film__poster"
            src={posterOf(FILM, true)}
            srcSet={posterSet(FILM)}
            sizes="(min-width: 1100px) 40vw, 100vw"
            alt=""
            aria-hidden="true"
            width={FILM.w}
            height={FILM.h}
            decoding="async"
            loading="lazy"
          />
        </picture>
        <video ref={video} className="sea-film__video" muted loop playsInline preload="none" aria-hidden="true" />
        {how === 'touch' && (
          <button
            type="button"
            className="sea-film__tap"
            aria-pressed={on}
            onClick={() => { field.tapFilm(id.current); setOn((v) => !v) }}
          >
            <span className="sr-only">{on ? 'הסרט בנקודות' : 'הסרט בצבע'}</span>
          </button>
        )}
      </span>}
      <div className="sea-in" data-reveal="">
        <Tag className="sea-fade">VIDEO · TAPES</Tag>
        <h2 id="film-title" className="sea-h2" data-zone="text"><Lines lines={['סרטון לעסק,', 'וקלטות לזיכרון.']} /></h2>
        <p className="sea-sub sea-fade" data-zone="text">עורכים את הסרטונים של העסק, ומעבירים קלטות ישנות לקובץ שאפשר לשמור ולשתף.</p>
        <Tag className="sea-fade sea-film__hint" he>{hint}</Tag>
      </div>
    </section>
  )
}
