// Direction I · האלבום (the photo album). Dev-only. direction-bank.md D-06 (David Whyte
// Experience, Immersive Garden: stills that wake up under attention).
// An old family album open on bottle-green cloth: black pages, photo corners, captions in
// white ink. Scrolling turns the pages, one spread per service. Every photo is a still from
// MediaWave's own footage; holding it (or hovering) wakes it into the real video.
// The memory-video frames show a client's family: confirm consent before any public use.

import { useRef, useState } from 'react'
import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { useAmbientMotion } from '../hooks/useReducedMotion'
import { SERVICES, HERO, NAV, HeroMedia, ServiceArt, BoardNav, useDocBackground, StateButton, ButtonLab, type StateButtonProps, type BoardService } from './shared'
import desk1 from './assets/comic-desk-1.webp'
import desk5 from './assets/comic-desk-5.webp'
import code2 from './assets/comic-code-2.webp'
import code9 from './assets/comic-code-9.webp'
import mem24 from './assets/album-24.webp'
import mem48 from './assets/album-48.webp'
import './fonts.css'
import './lab.css'
import './board-i.css'

/** One photo per spread: the still, the video it comes from, and where in it */
const PHOTOS = [
  { still: desk1, src: '/videos/hero-bg.mp4', t: 1, cap: 'השולחן, בוקר' },
  { still: code9, src: '/videos/whyus-bg.mp4', t: 9, cap: 'הקוד, שורה אחרי שורה' },
  { still: desk5, src: '/videos/hero-bg.mp4', t: 5, cap: 'עוד כוס קפה' },
  { still: code2, src: '/videos/whyus-bg.mp4', t: 2, cap: 'בדיקה אחרונה' },
  { still: mem24, src: '/videos/memory-video.mp4', t: 24, cap: 'מתוך סרטון זיכרונות' },
  { still: mem48, src: '/videos/memory-video.mp4', t: 48, cap: 'החתונה, מתוך סרטון זיכרונות' },
] // captions: [קופי: נתי]

/** The mounted-photo button: an ivory card held by four corners. */
function PhotoButton(p: StateButtonProps) {
  return (
    <StateButton {...p} cls="mph" render={(label, state) => (
      <span className="mph__card" aria-live="polite">
        <i className="mph__c mph__c--1" aria-hidden="true" /><i className="mph__c mph__c--2" aria-hidden="true" />
        <i className="mph__c mph__c--3" aria-hidden="true" /><i className="mph__c mph__c--4" aria-hidden="true" />
        {state === 'sent' && <span aria-hidden="true">✓ </span>}{label}
      </span>
    )} />
  )
}

/** A still that wakes into its video on hover or press-and-hold (never with the a11y stop). */
function WakingPhoto({ photo, eager }: { photo: (typeof PHOTOS)[number]; eager?: boolean }) {
  const ambient = useAmbientMotion()
  const [awake, setAwake] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const wake = () => { if (ambient) setAwake(true) }
  const sleep = () => { setAwake(false) }
  return (
    <figure className="i-photo" onPointerEnter={wake} onPointerLeave={sleep} onPointerDown={wake} onPointerUp={sleep} data-awake={awake || undefined}>
      <span className="i-photo__mount">
        <img src={photo.still} alt="" loading={eager ? 'eager' : 'lazy'} />
        {awake && (
          <video ref={video} muted playsInline autoPlay aria-hidden="true"
            onLoadedMetadata={(e) => { e.currentTarget.currentTime = photo.t }}>
            <source src={photo.src} type="video/mp4" />
          </video>
        )}
        <i className="i-corner i-corner--1" /><i className="i-corner i-corner--2" /><i className="i-corner i-corner--3" /><i className="i-corner i-corner--4" />
      </span>
      <figcaption>{photo.cap}</figcaption>
    </figure>
  )
}

function LeftPage({ i }: { i: number }) {
  return <div className="i-pg i-pg--photo"><WakingPhoto photo={PHOTOS[i]} /></div>
}

function RightPage({ s }: { s: BoardService }) {
  return (
    <div className="i-pg i-pg--text">
      <div className="i-card"><i className="i-corner i-corner--1" /><i className="i-corner i-corner--2" /><i className="i-corner i-corner--3" /><i className="i-corner i-corner--4" /><ServiceArt service={s} size={190} /></div>
      <h3>{s.title}</h3>
      <p>{s.line}</p>
      <a href={`/services/${s.slug}`}>לפרטים</a>
    </div>
  )
}

export default function BoardI() {
  useDocBackground('#1E2B24')
  return (
    <div className="bd-i" dir="rtl" lang="he">
      <header className="i-head">
        <a href="/board/i" className="i-head__logo" aria-label="MediaWave">
          <img src="/logo-lockup-white.svg" alt="MediaWave" width="150" height="30" />
        </a>
        <nav className="i-head__nav" aria-label="ראשי">{NAV.map((n) => <a key={n} href="#services">{n}</a>)}</nav>
        <PhotoButton href="#lab" size="sm">{HERO.headerCta}</PhotoButton>
      </header>

      <main>
        <section className="i-hero" aria-label="ראשי">
          <div className="i-spread">
            <div className="i-pg i-pg--text i-hero__copy">
              <h1 className="i-hero__title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1>
              <p className="i-hero__sub">{HERO.sub}</p>
              <PhotoButton href="#lab">{HERO.cta}</PhotoButton>
            </div>
            <div className="i-pg i-pg--photo">
              <figure className="i-photo i-photo--hero" aria-hidden="true">
                <span className="i-photo__mount">
                  <HeroMedia className="i-photo__media" />
                  <i className="i-corner i-corner--1" /><i className="i-corner i-corner--2" /><i className="i-corner i-corner--3" /><i className="i-corner i-corner--4" />
                </span>
                <figcaption>סרטון הפתיחה, 2026</figcaption>
              </figure>
            </div>
            <span className="i-spine" aria-hidden="true" />
          </div>
        </section>

        <Album />
        <ButtonLab Btn={PhotoButton} title="הכפתור: תמונה מודבקת" note="ריחוף: הכרטיס מתרומם מעט מהפינות. לחיצה: הוא נלחץ אל הדף. בזמן שליחה התמונה מתפתחת, ואם יש שגיאה אחת הפינות נופלת. בטלפון יש רק את הלחיצה." />
      </main>
      <BoardNav />
    </div>
  )
}

/* ───────────── signature: scroll turns the album's pages ───────────── */

function Album() {
  const engine = useMotionEngine()
  const n = SERVICES.length
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE || !matchMedia('(min-width: 861px)').matches) return
    const leaves = [...root.querySelectorAll<HTMLElement>('.i-leaf')]
    const tl = e.holdTimeline(root, {
      id: 'i-album',
      scrub: e.CALM ? true : 0.6,
      onUpdate: () => {
        // a leaf belongs to the right-hand stack once it is past upright
        leaves.forEach((l, k) => {
          const r = Math.abs(Number(e.gsap.getProperty(l, 'rotationY')) || 0)
          l.style.zIndex = String(r > 90 ? 10 + k : 30 - k)
        })
      },
    })
    leaves.forEach((l, k) => tl.to(l, { rotationY: 180, duration: 1, ease: 'power2.inOut' }, 0.3 + k * 1.2))
    tl.to({}, { duration: 0.6 })
  })

  if (engine?.REDUCE) return <AlbumStill />

  return (
    <section id="services" className="i-albumsec" aria-labelledby="i-album-h">
      <div className="i-albumsec__intro">
        <h2 id="i-album-h">מה אנחנו עושים</h2>
        <p>שישה עמודים באלבום. גוללים כדי לדפדף, ומחזיקים תמונה כדי שתזוז.</p>{/* [קופי: נתי] */}
      </div>
      <div className="i-hold" ref={holdRef}>
        <div className="i-stage">
          <div className="i-book">
            <div className="i-base i-base--right"><RightPage s={SERVICES[0]} /></div>
            <div className="i-base i-base--left"><LeftPage i={n - 1} /></div>
            {SERVICES.slice(0, n - 1).map((s, k) => (
              <div className="i-leaf" key={s.id} style={{ zIndex: 30 - k }}>
                <div className="i-leaf__face i-leaf__front"><LeftPage i={k} /></div>
                <div className="i-leaf__face i-leaf__back"><RightPage s={SERVICES[k + 1]} /></div>
              </div>
            ))}
            <span className="i-spine" aria-hidden="true" />
          </div>
          {/* phones: the same spreads, stacked, each photo still wakes on touch */}
          <div className="i-mobile">
            {SERVICES.map((s, i) => (
              <div className="i-spread i-spread--small" key={s.id}><RightPage s={s} /><LeftPage i={i} /></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AlbumStill() {
  return (
    <section id="services" className="i-albumsec i-albumsec--still" aria-labelledby="i-album-h">
      <div className="i-albumsec__intro"><h2 id="i-album-h">מה אנחנו עושים</h2></div>
      <div className="i-mobile i-mobile--all">
        {SERVICES.map((s, i) => (
          <div className="i-spread i-spread--small" key={s.id}><RightPage s={s} /><LeftPage i={i} /></div>
        ))}
      </div>
    </section>
  )
}
