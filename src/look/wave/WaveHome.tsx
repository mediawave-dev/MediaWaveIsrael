// wave · the home page (D118-D122, design/eye/): a gallery on cream. One thin Prussian line, the wave
// of the Horizon logo, runs from the laptop at the top to the letter at the end, drawn by the scroll
// (WaveLine); the laptop opens on the way down (WaveLaptop), the cassette's reels turn in step with
// the reader (WaveTape), three services hide a small surprise (WaveServices), and going back to the
// top rewinds the page like a tape (WaveRewind). Everything is geared to native scroll by one clock
// (clock.ts) and is still under reduced motion, ?reduce=1, the prerender and no JS.
// The H1 is the LCP and paints at first paint, in the entry stylesheet (wave.css is eager).
// Anchors kept: #why-us #services #process #faq #contact (Header, Footer and inner pages link to them).
import { useRef, useState } from 'react'
import { LookButton } from '@look/button'
import { HERO, SERVICES, STEPS } from '../data'
import { WHY_ITEMS } from '../sections/WhyUs'
import Faq from '../sections/Faq'
import Contact from '../sections/Contact'
import { useMotionEngine } from '../../motion/ScrollEngineProvider'
import { track } from '../../utils/analytics'
import { WHATSAPP_URLS } from '../../utils/whatsapp'
import WaveIntro from './WaveIntro'
import WaveLine from './WaveLine'
import WaveLaptop from './WaveLaptop'
import WaveTape from './WaveTape'
import WaveServices from './WaveServices'
import { isCalm, isStill } from './clock'
import '../shot/shot-base.css'
import '../shot/shot-dock.css' // the dock's skin (ShotDock is mounted by Layout)
import './wave.css'

const TAPE_SERVICE = SERVICES.find((s) => s.id === 'video-editing')

function Hero() {
  return (
    <section id="hero" className="wv-hero" aria-labelledby="hero-title" data-chapter="hero">
      <div className="wv-hero__copy">
        {/* one block, two lines through <br>: one LCP text candidate */}
        <h1 id="hero-title" className="wv-h1" data-zone="text" tabIndex={-1}>{HERO.line1}{' '}<br />{HERO.line2}</h1>
        <p className="wv-hero__sub" data-zone="text">{HERO.sub}</p>
        <div className="wv-hero__ctas" data-dock-hide="">
          <LookButton href={WHATSAPP_URLS.general} target="_blank" rel="noopener noreferrer" zone="text" onClick={() => track('whatsapp_click', { placement: 'hero' })}>
            {HERO.cta}
          </LookButton>
        </div>
      </div>
      <div className="wv-hero__art">
        <WaveLaptop />
        <i className="wv-pt wv-pt--lap" aria-hidden="true" />
      </div>
    </section>
  )
}

function Why() {
  return (
    <section id="why-us" className="wv-ch wv-why" aria-labelledby="why-title" data-chapter="why">
      <i className="wv-pt wv-pt--end" aria-hidden="true" />
      <header className="wv-head">
        <span className="wv-num" aria-hidden="true">01</span>
        <h2 id="why-title" className="wv-h2" data-zone="text">למה לעבוד איתנו?</h2>
      </header>
      <ul className="wv-why__list">
        {WHY_ITEMS.map((it) => (
          <li key={it.id} className="wv-why__item">
            <h3 className="wv-why__title" data-zone="text">{it.title}</h3>
            <p className="wv-why__line" data-zone="text">{it.line}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Tape() {
  return (
    <section className="wv-ch wv-tapech" aria-labelledby="tape-title" data-chapter="tape">
      <i className="wv-pt wv-pt--end" aria-hidden="true" />
      <header className="wv-head">
        <span className="wv-num" aria-hidden="true">03</span>
        <h2 id="tape-title" className="wv-h2" data-zone="text">מקלטות ישנות לקובץ</h2>
        {TAPE_SERVICE && <p className="wv-lead" data-zone="text">{TAPE_SERVICE.line}</p>}
      </header>
      <WaveTape />
      {TAPE_SERVICE?.href && (
        <a className="wv-link wv-link--go" href={TAPE_SERVICE.href} data-zone="text" onClick={() => track('cta_click', { placement: 'tape_service' })}>{TAPE_SERVICE.hrefLabel}</a>
      )}
      <i className="wv-pt wv-pt--end" aria-hidden="true" />
    </section>
  )
}

function Process() {
  return (
    <section id="process" className="wv-ch wv-proc" aria-labelledby="process-title" data-chapter="process">
      <header className="wv-head">
        <span className="wv-num" aria-hidden="true">04</span>
        <h2 id="process-title" className="wv-h2" data-zone="text">איך זה עובד</h2>
      </header>
      <ol className="wv-proc__list">
        {STEPS.map((s, i) => (
          <li key={s.id} className="wv-proc__item">
            <i className="wv-pt wv-pt--start" aria-hidden="true" />
            <span className="wv-proc__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="wv-proc__title" data-zone="text">{s.title}</h3>
            <p className="wv-proc__line" data-zone="text">{s.line}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** S5: back to the top plays the page backwards like a tape (the line draws itself back). */
function Rewind() {
  const engine = useMotionEngine()
  const [on, setOn] = useState(false)
  const count = useRef<HTMLSpanElement>(null)
  const go = () => {
    track('cta_click', { placement: 'rewind' })
    const focusTop = () => document.getElementById('hero-title')?.focus({ preventScroll: true })
    if (isStill() || isCalm() || !engine) { window.scrollTo(0, 0); focusTop(); return }
    const from = window.scrollY
    const duration = Math.min(1.8, 0.7 + from / 9000)
    setOn(true)
    const tick = () => {
      if (count.current) count.current.textContent = String(Math.round(window.scrollY / 8)).padStart(4, '0')
      if (window.scrollY > 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    engine.scrollTo(0, { duration, easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), onComplete: () => { window.setTimeout(() => setOn(false), 380); focusTop() } } as never)
    window.setTimeout(() => setOn(false), duration * 1000 + 900)
  }
  return (
    <div className="wv-end">
      <i className="wv-pt wv-pt--center" aria-hidden="true" />
      <button type="button" className="wv-rew" onClick={go}>
        <svg viewBox="0 0 20 12" aria-hidden="true" focusable="false"><path d="M10 1 1 6l9 5zM19 1l-9 5 9 5z" /></svg>
        חזרה להתחלה
      </button>
      <div className={`wv-rew__fx${on ? ' is-on' : ''}`} aria-hidden="true">
        <span className="wv-rew__hud">◀◀ REW <span ref={count}>0000</span></span>
      </div>
    </div>
  )
}

export default function WaveHome() {
  return (
    <div className="wv">
      <WaveIntro />
      <WaveLine />
      <Hero />
      <Why />
      <WaveServices />
      <Tape />
      <Process />
      <div className="wv-ch wv-faq">
        <i className="wv-pt wv-pt--end" aria-hidden="true" />
        <Faq chapter="faq" kicker={<span className="wv-num" aria-hidden="true">05</span>} />
      </div>
      <div className="wv-ch wv-contact">
        <i className="wv-pt wv-pt--end" aria-hidden="true" />
        <Contact chapter="contact" art={false} kicker={<span className="wv-num" aria-hidden="true">06</span>} />
      </div>
      <Rewind />
    </div>
  )
}
