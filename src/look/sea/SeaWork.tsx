// sea · work rows (lamalama-deep.rtl.md §6 "rows": name | tags in boxes | ( view + ) | a strip of
// pictures; D155, gate `work`). Only real work, nothing invented: this very site (its own pages, shot
// from the build) and the memories film made for a 60th birthday (the sample already on the site).
// The strip's frames are live pictures (SeaImage): their grey material until the row is hovered (or, on
// a phone, crosses the middle of the screen), then colour from where the pointer came in. The
// opening paragraph is Lama's big lede with a small tag in its first-line indent (gate `type`; in
// Hebrew the indent is on the right). [קופי: נתי] the heading, the lede, the rows' tags and actions.
import { Lines, Tag } from './parts'
import SeaImage from './SeaImage'
import { track } from '../../utils/analytics'

interface Still { src: string; w: number; h: number }

const frame = (src: string): Still => ({ src, w: 480, h: 300 })

const ROWS = [
  {
    id: 'site', title: 'האתר הזה', tags: ['אתר', 'עיצוב', 'קוד'], act: 'לבניית אתרים', href: '/services/building-websites/',
    strip: [1, 2, 3, 4].map((n) => frame(`/media/work-site-${n}.webp`)),
  },
  {
    id: 'memory', title: 'סרטון זיכרונות ליום הולדת 60', tags: ['סרטון זיכרונות', 'דוגמה'], act: 'לצפייה', href: '/portfolio/memory-videos/',
    strip: [6, 30, 56, 98].map((t) => frame(`/media/work-memory-${t}.webp`)),
  },
]

export default function SeaWork() {
  return (
    <section id="work" className="sea-ch sea-work" aria-labelledby="work-title" data-chapter="work">
      <header className="sea-head" data-reveal="">
        <Tag className="sea-fade">WORK</Tag>
        <h2 id="work-title" className="sea-h2" data-zone="text"><Lines lines={['מהעבודה.']} /></h2>
      </header>
      <p className="sea-lede sea-fade" data-reveal="" data-zone="text">
        <span className="sea-tag sea-lede__tag" aria-hidden="true">REAL WORK</span>
        שתי עבודות שאפשר לראות עכשיו: האתר שאתם גוללים בו, וסרטון זיכרונות שהכנו ליום הולדת 60.
      </p>
      <ul className="sea-work__list">
        {ROWS.map((r) => (
          <li key={r.id} className="sea-work__item" data-reveal="">
            <a className="sea-work__row" href={r.href} data-cursor={r.act} onClick={() => track('cta_click', { placement: `work_${r.id}` })}>
              <span className="sea-work__title" data-zone="text">{r.title}</span>
              <span className="sea-work__tags" data-zone="text">{r.tags.map((t) => <span key={t} className="sea-box">{t}</span>)}</span>
              <span className="sea-work__view" aria-hidden="true">( {r.act} + )</span>
              <span className="sea-work__strip" aria-hidden="true">
                {r.strip.map((s) => <SeaImage key={s.src} src={s.src} w={s.w} h={s.h} when="hover" />)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
