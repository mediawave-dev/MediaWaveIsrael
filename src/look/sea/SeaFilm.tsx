// sea · the film develops (harvest lamalama-deep.rtl.md §3 #4, translated into our world): the studio's
// own film (the desk, the hero film) plays in its own slot (D139) drawn in the sea's dots, light as
// cream and shadow as the logo's blue; the finger's ripple moves it like water, and it develops into
// the real film cell by cell, like a print in a tray (the memories' cyanotype, tape to screen).
// Gate `film` (lab.ts): touch = it develops under the pointer, and a tap develops all of it; scroll =
// it develops as it reaches the middle of the screen; time = by itself, a moment after it is in view.
// The video loads only near the slot (the phone's light encode on phones) and plays only on screen,
// in full motion. Calm: the poster in dots, developing with the scroll or a tap; still or no WebGL: the
// poster as a plain image. [קופי: נתי] the heading, the line, the hint and the cursor's label.
import { useEffect, useRef, useState } from 'react'
import * as field from './field'
import { opt } from './lab'
import { Lines, Tag } from './parts'
import { DESK_FILM } from '../parts/HeroMedia'

export default function SeaFilm() {
  const slot = useRef<HTMLSpanElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const poster = useRef<HTMLImageElement>(null)
  const how = opt('film')
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (how === 'off') return
    const el = slot.current
    if (!el) return
    const html = document.documentElement.classList
    const full = field.tier() === 'full'
    let alive = true
    let attached = false
    void field.ready.then((ok) => {
      if (!alive || !ok) return
      attached = true
      html.add('sea-film-gl')
      field.setFilm(el, full ? video.current : null, poster.current, how)
    })
    // the film's file only when the slot comes near, and only where it may play
    const io = new IntersectionObserver(([e]) => {
      const v = video.current
      if (!e.isIntersecting || !v || v.getAttribute('src') || !full) return
      v.src = window.matchMedia('(min-width: 768px)').matches ? DESK_FILM.video : DESK_FILM.videoMobile
      v.load()
      io.disconnect()
    }, { rootMargin: '60% 0px' })
    io.observe(el)
    return () => {
      alive = false
      io.disconnect()
      if (attached) field.setFilm(null, null, null)
      html.remove('sea-film-gl')
    }
  }, [how])

  if (how === 'off') return null
  const hint = how === 'touch' ? 'געו בסרט, והוא מתפתח' : how === 'scroll' ? 'גללו, והסרט מתפתח' : 'רגע, והסרט מתפתח'
  return (
    <section className="sea-ch sea-film" aria-labelledby="film-title" data-chapter="film">
      <span ref={slot} className="sea-spot sea-spot--film" data-cursor={how === 'touch' ? 'הזיזו כאן, והסרט מתפתח' : undefined}>
        <img
          ref={poster}
          className="sea-film__poster"
          src={DESK_FILM.posterMobile}
          srcSet={`${DESK_FILM.posterMobile} ${DESK_FILM.posterMobileWidth}w, ${DESK_FILM.poster} ${DESK_FILM.width}w`}
          sizes="(min-width: 1100px) 40vw, 100vw"
          alt=""
          aria-hidden="true"
          width={DESK_FILM.width}
          height={DESK_FILM.height}
          decoding="async"
          loading="lazy"
        />
        <video ref={video} className="sea-film__video" muted loop playsInline preload="none" aria-hidden="true" />
        {how === 'touch' && (
          <button
            type="button"
            className="sea-film__tap"
            aria-pressed={on}
            onClick={() => { field.tapFilm(); setOn((v) => !v) }}
          >
            <span className="sr-only">{on ? 'הסרט בנקודות' : 'הסרט בצבע'}</span>
          </button>
        )}
      </span>
      <div className="sea-in" data-reveal="">
        <Tag className="sea-fade">VIDEO · TAPES</Tag>
        <h2 id="film-title" className="sea-h2" data-zone="text"><Lines lines={['סרטון לעסק,', 'וקלטות לזיכרון.']} /></h2>
        <p className="sea-sub sea-fade" data-zone="text">עורכים את הסרטונים של העסק, ומעבירים קלטות ישנות לקובץ שאפשר לשמור ולשתף.</p>
        <Tag className="sea-fade sea-film__hint" he>{hint}</Tag>
      </div>
    </section>
  )
}
