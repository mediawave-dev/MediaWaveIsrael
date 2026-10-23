// sea · the style studio (D185): the invitation from the home page. Five portrait previews (D215), each a few
// seconds filmed from the style itself (public/media/styles/*, recorded from /styles/), each opening that
// style; the visitor sees that one site can wear very different clothes, picks one, and the pick rides into
// WhatsApp. Previews play only while seen (at rest under ?calm=1 they play too; under the stop switch and
// ?reduce=1 the posters only). Placed after "how we work", before the questions. [קופי: נתי] the heading,
// the lede and the link.
import { useEffect, useRef } from 'react'
import { LookButton } from '@look/button'
import { Lines, Tag } from './parts'
import { tier } from './field'
import { track } from '../../utils/analytics'
import { STYLE_META } from '../../studio/styles-meta'

function usePreviews(row: React.RefObject<HTMLUListElement | null>) {
  useEffect(() => {
    const el = row.current
    if (!el || tier() === 'still') return
    const vids = [...el.querySelectorAll<HTMLVideoElement>('video')]
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      vids.forEach((v) => { if (!v.src) { v.src = v.dataset.src ?? ''; v.load() } })
      near.disconnect()
    }, { rootMargin: '70% 0px' })
    near.observe(el)
    const seen = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target as HTMLVideoElement
      if (e.isIntersecting && !document.documentElement.classList.contains('disable-animations')) void v.play().catch(() => {})
      else v.pause()
    }), { threshold: 0.6 })
    // the film shows only once it plays: its first frame (an empty sheet) never covers the poster
    const on = (e: Event) => { (e.target as HTMLVideoElement).dataset.on = '1' }
    vids.forEach((v) => { seen.observe(v); v.addEventListener('playing', on) })
    return () => { near.disconnect(); seen.disconnect(); vids.forEach((v) => v.removeEventListener('playing', on)) }
  }, [row])
}

export default function SeaStyles() {
  const row = useRef<HTMLUListElement>(null)
  usePreviews(row)
  return (
    <section id="styles" className="sea-ch sea-styles" aria-labelledby="styles-title">
      <header className="sea-head" data-reveal="">
        <Tag className="sea-fade">STYLE STUDIO</Tag>
        <h2 id="styles-title" className="sea-h2" data-zone="text"><Lines lines={['אותו אתר,', 'חמישה סגנונות.']} /></h2>
      </header>
      <p className="sea-lede sea-fade" data-reveal="" data-zone="text">
        בוחרים סגנון, רואים את האתר משתנה מול העיניים, ושולחים לנו הודעה עם הכיוון שאהבתם.
      </p>
      <ul ref={row} className="sea-styles__row">
        {STYLE_META.map((s, i) => (
          <li key={s.id} className="sea-styles__item" data-reveal="" style={{ ['--i' as string]: i }}>
            <a className="sea-style" href={`/styles/?s=${s.id}`} onClick={() => track('cta_click', { placement: `home_styles_${s.id}` })}
              aria-label={`הסגנון ${s.name}: ${s.feel}`}>
              <span className="sea-style__pic" aria-hidden="true">
                <img src={`/media/styles/${s.id}.webp`} width={360} height={640} alt="" loading="lazy" decoding="async" />
                <video muted loop playsInline preload="none" data-src={`/media/styles/${s.id}.mp4`} />
              </span>
              <span className="sea-style__meta" aria-hidden="true">
                <span className="sea-style__n">0{i + 1}</span>
                <span className="sea-style__name">{s.name}</span>
                <span className="sea-style__by">{s.feel}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      {/* (D217) the visitor's own name in the five styles: the chapter's real invitation [קופי: נתי] */}
      <div className="sea-styles__own" data-reveal="">
        <p className="sea-styles__own-l sea-fade" data-zone="text">ומה עם האתר שלכם? כותבים את שם העסק, ורואים אותו בכל אחד מהסגנונות.</p>
        <LookButton href="/your-site/" zone="text" onClick={() => track('cta_click', { placement: 'home_styles_yoursite' })}>
          האתר שלכם ב-60 שניות
        </LookButton>
      </div>
      <a className="sea-go sea-styles__all" href="/styles/" lang="en" dir="ltr" onClick={() => track('cta_click', { placement: 'home_styles_all' })}>
        Enter the Style Studio
      </a>
    </section>
  )
}
