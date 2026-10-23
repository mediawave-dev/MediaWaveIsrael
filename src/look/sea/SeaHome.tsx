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
import { Fragment, useEffect, useRef, type RefObject } from 'react'
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
import SeaFilm from './SeaFilm'
import SeaWork from './SeaWork'
import SeaStyles from './SeaStyles'
import { opt } from './lab'
import { CLIPS, posterOf, videoOf } from './media'
import { useGround } from './SeaGround'
import { Clock, DiscStill, Lines, Tag, useReveals } from './parts'
import * as field from './field'
import '../shot/shot-base.css'
import '../shot/shot-dock.css' // the dock's skin (ShotDock is mounted by Layout)
import './sea.css'
import './sea-site.css'
import './sea-craft.css' // the finish (D211): hairlines that draw in, rolling labels

/** The sunset on the horizon (D154, Pexels 11335978): the disc's own sea becomes a real one. The field
    draws it inside the disc in dots and develops it into colour a moment after the opening hands over
    (gate `sun`). Its poster and loop load after the page has loaded and gone idle, never before the H1
    (the LCP); the poster never enters the DOM and the video is a 2 px source for the texture, so neither
    can become a paint candidate. Calm: the poster only; still or no WebGL: the dotted disc as before. */
function useSun(spot: RefObject<HTMLSpanElement | null>, video: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const how = opt('sun')
    if (opt('hero') !== 'disc' || how === 'off' || field.tier() === 'still') return
    const full = field.tier() === 'full'
    const sun = CLIPS['hero-sea']
    let alive = true
    let id: number | null = null
    let idle = 0
    const go = () => {
      const el = spot.current
      if (!alive || !el) return
      const img = new Image()
      img.decoding = 'async'
      img.src = posterOf(sun, !window.matchMedia('(min-width: 768px)').matches)
      img.onload = () => {
        if (!alive) return
        const v = full ? video.current : null
        if (v) { v.src = videoOf(sun); v.load() }
        id = field.addFilm(el, v, img, { mode: how === 'touch' ? 'touch' : 'time', disc: true, after: true })
      }
    }
    void field.ready.then((ok) => {
      if (!alive || !ok) return
      const later = () => { idle = window.requestIdleCallback ? window.requestIdleCallback(go, { timeout: 2500 }) : window.setTimeout(go, 600) }
      if (document.readyState === 'complete') later()
      else window.addEventListener('load', later, { once: true })
    })
    return () => {
      alive = false
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
      field.dropFilm(id)
    }
  }, [spot, video])
}

/** The promise (D161, Nati: "each word arriving after the other, beautifully and elegantly"): its own
    line under the two sentences, a little larger and in cream; once the headline has landed each word
    rises out of a soft blur, one after another, and a soft light runs across the words from the right
    when the last one is in. Calm, the widget's stop, ?reduce=1 or no script: the line stands. */
function Promise() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const html = document.documentElement.classList
    if (!html.contains('sea-reveal')) { el.classList.add('is-on'); return }
    let t = 0
    const go = (ms: number) => { window.clearTimeout(t); t = window.setTimeout(() => el.classList.add('is-on'), ms) }
    // after the opening hands over, or a moment after a return visit's first paint
    let mo: MutationObserver | null = null
    if (html.contains('sea-opening')) {
      mo = new MutationObserver(() => {
        if (html.contains('sea-out') || !html.contains('sea-opening')) { mo?.disconnect(); go(1150) }
      })
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    } else go(700)
    // (D210) the loop holds while the words are off screen
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-off', !e.isIntersecting))
    io.observe(el)
    return () => { mo?.disconnect(); io.disconnect(); window.clearTimeout(t) }
  }, [])
  const words = HERO.pro.split(' ')
  return (
    <span ref={ref} className="sea-lead__pro">
      {words.map((w, i) => (
        <Fragment key={i}><span className="sea-word" style={{ ['--w' as string]: i }}>{w}</span>{i < words.length - 1 ? ' ' : ''}</Fragment>
      ))}
    </span>
  )
}

/** The showreel's takes (public/media/reel, G:/tmp/mw-media/reel-clips.sh); the sea opens it. */
// the showreel's own pool (D172): clips that appear nowhere else on the site, so nothing shows twice
const REEL = ['sea', 'sunset', 'burn', 'glow', 'library', 'code', 'lights', 'darkroom', 'tank', 'scroll']

/** The hero's showreel (D157, gate `hero`): Lama Lama's hero, our takes. The field plays it across the
    hero behind the words, a take after a take, never the same change twice in a row (field.ts). It
    loads after the page has loaded and gone idle, never before the H1 (the LCP); the poster never
    enters the DOM and the two videos are 2 px sources for the textures. Calm: the first poster. */
function useReel(section: RefObject<HTMLElement | null>, a: RefObject<HTMLVideoElement | null>, b: RefObject<HTMLVideoElement | null>, on: boolean) {
  useEffect(() => {
    if (!on || field.tier() === 'still') return
    const full = field.tier() === 'full'
    const phone = !window.matchMedia('(min-width: 768px)').matches
    const webm = document.createElement('video').canPlayType('video/webm; codecs="vp9"') === 'probably'
    const pool = REEL.map((n) => `/media/reel/${n}${phone ? '-m' : ''}.${webm ? 'webm' : 'mp4'}`)
    let alive = true
    let idle = 0
    const go = () => {
      const el = section.current
      if (!alive || !el) return
      const img = new Image()
      img.decoding = 'async'
      img.src = `/media/reel/sea-poster${phone ? '-m' : ''}.webp`
      img.onload = () => {
        if (!alive) return
        field.setReel(el, full && a.current && b.current ? [a.current, b.current] : null, img, pool)
      }
    }
    void field.ready.then((ok) => {
      if (!alive || !ok) return
      const later = () => { idle = window.requestIdleCallback ? window.requestIdleCallback(go, { timeout: 2500 }) : window.setTimeout(go, 600) }
      if (document.readyState === 'complete') later()
      else window.addEventListener('load', later, { once: true })
    })
    return () => {
      alive = false
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
      field.setReel(null, null, null)
    }
  }, [section, a, b, on])
}

function Hero() {
  const section = useRef<HTMLElement>(null)
  const spot = useRef<HTMLSpanElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  // the sea as the hero's ground (D156, gate `bleed`): the real sea above the words breaks into the
  // sea of dots at its bottom edge; otherwise the sunset inside the disc (useSun)
  const take = useRef<HTMLVideoElement>(null)
  const hero = opt('hero')
  const veil = hero === 'sea'
  useSun(spot, video)
  useReel(section, video, take, hero === 'reel')
  useGround(section, video, 'hero-veil', { on: veil, after: true, text: () => section.current?.querySelector<HTMLElement>('.sea-in') ?? null, focus: [0.6, 0.5] })
  return (
    <section ref={section} id="hero" className="sea-ch sea-hero" aria-labelledby="hero-title" data-chapter="hero">
      {/* the disc's slot (D139): above the words on a phone, beside them when wide; never under them.
          With the ground the field draws no disc here; the opening still gathers its dots into it */}
      <span ref={spot} className="sea-spot sea-spot--hero" data-spot={hero === 'disc' ? 'horizon' : undefined} data-intro="" aria-hidden="true">
        <DiscStill />
        <video ref={video} className="sea-sun" muted loop playsInline preload="none" />
        {hero === 'reel' && <video ref={take} className="sea-sun" muted loop playsInline preload="none" />}
      </span>
      <div className="sea-in">
        {/* one block, two lines through <br>: one LCP text candidate; each line only moves */}
        <h1 id="hero-title" className="sea-h1" data-zone="text" tabIndex={-1}>
          <span className="sea-h1__ln" style={{ ['--i' as string]: 0 }}>{HERO.line1}</span>{' '}<br />
          <span className="sea-h1__ln" style={{ ['--i' as string]: 1 }}>{HERO.line2}</span>
        </h1>
        <div className="sea-row">
          <p className="sea-sub sea-lead sea-up" data-zone="text" style={{ ['--d' as string]: '0.1s' }}>
            <span className="sea-lead__ln">{HERO.sub}</span>{' '}
            <span className="sea-lead__ln">{HERO.sub2}</span>{' '}
            <Promise />
          </p>
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

function Steps({ steps, label }: { steps: { id: string; title: string; line: string }[]; label: string }) {
  return (
    <ol className="sea-list sea-list--steps" aria-label={label}>
      {steps.map((s, i) => (
        <li key={s.id} className="sea-list__item" data-reveal="">
          <span className="sea-list__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="sea-list__title sea-fade" data-zone="text">{s.title}</h3>
          <p className="sea-list__line sea-fade" data-zone="text">{s.line}</p>
        </li>
      ))}
    </ol>
  )
}

// how we work (D173): building a site, a landing page or a bot. [קופי: נתי] the track line. The second
// track (video, a memories film, tapes) left (22.10, "crowded on a phone, and a bit unrelated"): its lede
// closes the services chapter (SeaServices), its steps live on the two service pages.
// what is always in the offer (D212): the honest proof the research found buried in the Terms and the FAQ
// (Terms 2, 3.2, 3.4, 4.2, 7.1, 8.1): a written quote, VAT in, a 50% deposit, two rounds, year one of hosting,
// 30 days of fixes. Nobody in the Israeli sample shows these together. [קופי: נתי] every line.
const INCLUDED = [
  'הצעת מחיר בכתב: מה נבנה, עד מתי, וכמה.',
  'המחיר כולל מע"מ. בלי הפתעות בסוף.',
  'מתחילים במקדמה של 50%.',
  'עד שני סבבי תיקונים, בלי תוספת.',
  'שנה ראשונה של אחסון, דומיין וגיבויים.',
  '30 יום אחרי ההשקה: תיקונים עלינו.',
]

function Included() {
  return (
    <aside className="sea-incl" aria-labelledby="incl-title" data-reveal="">
      <div className="sea-incl__head">
        <Tag className="sea-fade">INCLUDED</Tag>
        <h3 id="incl-title" className="sea-incl__h sea-fade" data-zone="text">מה כלול, תמיד</h3>
      </div>
      <ul className="sea-incl__list">
        {INCLUDED.map((t, i) => (
          <li key={i} className="sea-incl__row sea-fade" data-zone="text" style={{ ['--i' as string]: i }}>
            <span className="sea-incl__n" aria-hidden="true">( {String(i + 1).padStart(2, '0')} )</span>
            <span className="sea-incl__t">{t}</span>
          </li>
        ))}
      </ul>
      <a className="sea-go sea-incl__more sea-fade" href="/terms/">הכל כתוב בתנאי השירות</a>
    </aside>
  )
}

function Process() {
  return (
    <section id="process" className="sea-ch sea-proc" aria-labelledby="how-we-work-title" data-chapter="process">
      <header className="sea-head" data-reveal="">
        <Tag className="sea-fade">03 · PROCESS</Tag>
        <h2 id="how-we-work-title" className="sea-h2" data-zone="text"><Lines lines={['איך אנחנו', 'עובדים']} /></h2>
        <p className="sea-proc__for sea-fade" data-zone="text">( כשבאים לבנות עבורכם אתר, דף נחיתה או בוט לעסק )</p>
      </header>
      <Steps steps={STEPS} label="אתר, דף נחיתה או בוט" />
      <Included />
    </section>
  )
}

export default function SeaHome() {
  useReveals()

  // the bubble types while the visitor types in the contact form: its three dots hop, and that is all (D201,
  // Nati: the words written in the bubble's dots, D171, and their copy over the form on phones, D175, are
  // gone; the form is a plain form, apart from the bubble)
  useEffect(() => {
    const onInput = (e: Event) => { if ((e.target as Element | null)?.closest?.('#contact')) field.typed() }
    document.addEventListener('input', onInput)
    return () => document.removeEventListener('input', onInput)
  }, [])

  // a chapter with its own ground (lab gate `ground`): the services under the horizon, the letter on paper
  useEffect(() => {
    const g = opt('ground')
    const html = document.documentElement.classList
    const deep = g === 'deep' || g === 'both'
    const paper = g === 'paper' || g === 'both'
    html.toggle('sea-gnd-deep', deep)
    html.toggle('sea-gnd-paper', paper)
    let alive = true
    void field.ready.then((ok) => {
      if (!alive || !ok) return
      const list: { el: HTMLElement; kind: 1 | 2 }[] = []
      const svc = document.getElementById('services')
      const letter = document.querySelector<HTMLElement>('.sea-contact')
      if (deep && svc) list.push({ el: svc, kind: 1 })
      if (paper && letter) list.push({ el: letter, kind: 2 })
      field.setGrounds(list)
    })
    return () => { alive = false; field.setGrounds([]); html.remove('sea-gnd-deep', 'sea-gnd-paper') }
  }, [])

  return (
    <div className="sea">
      <SeaIntro />
      <Hero />
      <Websites />
      <SeaFilm />
      <Why />
      <SeaServices />
      {opt('work') === 'rows' && <SeaWork />}
      <Process />
      <SeaStyles />
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
