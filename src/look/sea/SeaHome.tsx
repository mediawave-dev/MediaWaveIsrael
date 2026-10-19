// sea · the home page (D131, "the sea of dots"; prototype design/eye/premium/template.html). A dark
// ground and one living halftone field behind the whole site (SeaField, in Layout). Each chapter tells
// the field which shape its dots gather into (data-scene): the Horizon disc with its blue sea at the
// opening, a laptop that opens with the scroll and builds a small site on its screen until a lead
// arrives (D133), the six services in one held stage, each wound into its own object (a phone page, a
// results page, a chat, the cassette, a developing print), a chat bubble that types while the visitor
// types, and the disc again at the end of the tape. Lama Lama's structure in our words: a title pill, a contact card, bracketed mono labels, a live
// clock, type revealed in lines. Few words at the opening: two lines, one line, the WhatsApp key.
// The H1 is the LCP and paints at first paint from the entry stylesheet (sea.css is eager).
// Anchors kept: #why-us #services #process #faq #contact (Header, Footer and inner pages link to them).
// [קופי: נתי] every new line: the hero's tag, the laptop chapter's line, the end of the tape.
import { useEffect } from 'react'
import { LookButton } from '@look/button'
import { HERO, STEPS } from '../data'
import { WHY_ITEMS } from '../sections/WhyUs'
import Faq from '../sections/Faq'
import Contact from '../sections/Contact'
import { track } from '../../utils/analytics'
import { WHATSAPP_URLS } from '../../utils/whatsapp'
import SeaIntro from './SeaIntro'
import SeaLaptop from './SeaLaptop'
import SeaServices from './SeaServices'
import SeaRewind from './SeaRewind'
import { Clock, DiscStill, Lines, Tag, useReveals } from './parts'
import * as field from './field'
import '../shot/shot-base.css'
import '../shot/shot-dock.css' // the dock's skin (ShotDock is mounted by Layout)
import './sea.css'
import './sea-site.css'

function Hero() {
  return (
    <section id="hero" className="sea-ch sea-hero" aria-labelledby="hero-title" data-chapter="hero">
      {/* the disc's slot (D139): above the words on a phone, beside them when wide; never under them */}
      <span className="sea-spot sea-spot--hero" data-spot="horizon" aria-hidden="true"><DiscStill /></span>
      <div className="sea-in">
        <Tag he className="sea-up">סטודיו לאתרים ולווידאו · ישראל</Tag>
        {/* one block, two lines through <br>: one LCP text candidate; each line only moves */}
        <h1 id="hero-title" className="sea-h1" data-zone="text" tabIndex={-1}>
          <span className="sea-h1__ln" style={{ ['--i' as string]: 0 }}>{HERO.line1}</span>{' '}<br />
          <span className="sea-h1__ln" style={{ ['--i' as string]: 1 }}>{HERO.line2}</span>
        </h1>
        <div className="sea-row">
          <p className="sea-sub sea-up" data-zone="text" style={{ ['--d' as string]: '0.1s' }}>{HERO.sub}</p>
          <div className="sea-up" style={{ ['--d' as string]: '0.2s' }} data-dock-hide="">
            <LookButton href={WHATSAPP_URLS.general} target="_blank" rel="noopener noreferrer" zone="text" onClick={() => track('whatsapp_click', { placement: 'hero' })}>
              {HERO.cta}
            </LookButton>
          </div>
        </div>
        <div className="sea-meta sea-up" style={{ ['--d' as string]: '0.32s' }}>
          <Clock />
          <Tag className="sea-meta__mid">WEBSITES · VIDEO · MEMORIES</Tag>
          <Tag>SCROLL ↓</Tag>
        </div>
      </div>
    </section>
  )
}

function Websites() {
  return (
    <section className="sea-ch sea-web" aria-labelledby="web-title" data-chapter="websites">
      <SeaLaptop>
        <div className="sea-in" data-reveal="">
          <Tag className="sea-fade">01 · WEBSITES</Tag>
          <h2 id="web-title" className="sea-h2" data-zone="text"><Lines lines={['אתר שנבנה בשבילכם,', 'ונשאר שלכם.']} /></h2>
          <p className="sea-sub sea-fade" data-zone="text">מאפס ובלי תבנית. אחרי התשלום העיצוב, הקוד והתכנים עוברים אליכם.</p>
        </div>
      </SeaLaptop>
    </section>
  )
}

function Why() {
  return (
    <section id="why-us" className="sea-ch sea-why" aria-labelledby="why-title" data-chapter="why">
      <header className="sea-head" data-reveal="">
        <Tag className="sea-fade">WHY</Tag>
        <h2 id="why-title" className="sea-h3" data-zone="text"><Lines lines={['למה לעבוד איתנו?']} /></h2>
      </header>
      <ul className="sea-list">
        {WHY_ITEMS.map((it, i) => (
          <li key={it.id} className="sea-list__item" data-reveal="">
            <span className="sea-list__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="sea-list__title sea-fade" data-zone="text">{it.title}</h3>
            <p className="sea-list__line sea-fade" data-zone="text">{it.line}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Process() {
  return (
    <section id="process" className="sea-ch sea-proc" aria-labelledby="how-we-work-title" data-chapter="process">
      <header className="sea-head" data-reveal="">
        <Tag className="sea-fade">03 · PROCESS</Tag>
        <h2 id="how-we-work-title" className="sea-h2" data-zone="text"><Lines lines={['איך אנחנו', 'עובדים']} /></h2>
      </header>
      <ol className="sea-list sea-list--steps">
        {STEPS.map((s, i) => (
          <li key={s.id} className="sea-list__item" data-reveal="">
            <span className="sea-list__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="sea-list__title sea-fade" data-zone="text">{s.title}</h3>
            <p className="sea-list__line sea-fade" data-zone="text">{s.line}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function SeaHome() {
  useReveals()

  // the bubble types while the visitor types in the contact form
  useEffect(() => {
    const onInput = (e: Event) => { if ((e.target as Element | null)?.closest?.('#contact')) field.typed() }
    document.addEventListener('input', onInput)
    return () => document.removeEventListener('input', onInput)
  }, [])

  return (
    <div className="sea">
      <SeaIntro />
      <Hero />
      <Websites />
      <Why />
      <SeaServices />
      <Process />
      <div className="sea-ch sea-faq">
        <Faq chapter="faq" kicker={<Tag>04 · FAQ</Tag>} />
      </div>
      <div className="sea-ch sea-contact">
        <span className="sea-spot sea-spot--contact" data-spot="bubble" aria-hidden="true" />
        <Contact chapter="contact" art={false} kicker={<Tag>05 · CONTACT</Tag>} />
      </div>
      <SeaRewind />
    </div>
  )
}
