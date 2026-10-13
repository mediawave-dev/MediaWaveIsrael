// Direction D · המקלט (the radio tuner). Dev-only style board. direction-bank.md D-17.
// The page is a 1960s tube radio: walnut cabinet, a backlit glass dial, a red needle and a
// "magic eye" tuning indicator. The hero video plays behind the dial glass. In the services
// hold, scrolling turns the dial: between stations there is static and the eye opens; on a
// station the signal comes in clear and the eye closes.

import { useState, type ReactNode } from 'react'
import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, STRIP, STATE_LABEL, HeroMedia, ServiceArt, BoardNav, useButtonMachine, useDocBackground, type BtnState, type BtnForce } from './shared'
import './fonts.css'
import './board-d.css'

const BAND = [88, 108] as const
/** Each service gets a station in the middle of its slice of the band */
const freq = (i: number) => BAND[0] + ((i + 0.5) * (BAND[1] - BAND[0])) / SERVICES.length
const TICKS = Array.from({ length: 21 }, (_, k) => BAND[0] + k)

/* ───────────────────────── the preset key ───────────────────────── */

interface KeyProps { href?: string; state?: BtnState; force?: BtnForce; size?: 'sm' | 'lg'; onClick?: () => void; children: ReactNode }

/** A radio preset key. Hover lights its lamp, press pushes the key down into the cabinet. */
export function PresetKey({ href, state = 'idle', force, size = 'lg', onClick, children }: KeyProps) {
  const [pressed, setPressed] = useState(false)
  const label = state === 'idle' ? children : STATE_LABEL[state]
  const shared = {
    className: 'key',
    'data-state': state,
    'data-force': force,
    'data-size': size,
    'data-pressed': pressed || force === 'pressed' ? '' : undefined,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') setPressed(true) },
    onKeyUp: () => setPressed(false),
    onBlur: () => setPressed(false),
    onClick,
  }
  const inner = (
    <>
      <span className="key__lamp" aria-hidden="true" />
      <span className="key__label" aria-live="polite">{state === 'sent' && <span aria-hidden="true">✓ </span>}{label}</span>
    </>
  )
  return href ? <a href={href} {...shared}>{inner}</a> : <button type="button" {...shared}>{inner}</button>
}

/* ───────────────────────── page ───────────────────────── */

export default function BoardD() {
  useDocBackground('#241912')
  // The hero needle drifts a little as the page starts to move (the set warming up)
  const heroRef = useScene<HTMLElement>((e, root) => {
    if (e.REDUCE) return
    e.gsap.fromTo(root.querySelector('.d-dialwin .d-needle'), { left: '46%' }, {
      left: '38%', ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: e.CALM ? true : 0.5 },
    })
  })

  return (
    <div className="bd-d" dir="rtl" lang="he">
      <header className="d-head">
        <a href="/board/d" className="d-head__logo" aria-label="MediaWave">
          <img src="/logo-lockup-white.svg" alt="MediaWave" width="150" height="30" />
        </a>
        <nav className="d-head__nav" aria-label="ראשי">
          {NAV.map((n) => <a key={n} href="#services">{n}</a>)}
        </nav>
        <PresetKey href="#lab" size="sm">{HERO.headerCta}</PresetKey>
      </header>

      <main>
        <section className="d-hero" aria-label="ראשי" ref={heroRef}>
          <div className="d-hero__copy">
            <h1 className="d-hero__title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1>
            <p className="d-hero__sub">{HERO.sub}</p>
            <PresetKey href="#lab">{HERO.cta}</PresetKey>
          </div>
          <figure className="d-dialwin" aria-hidden="true">
            <div className="d-dialwin__screen">
              <HeroMedia className="d-dialwin__media" />
              <span className="d-dialwin__glass" />
              <div className="d-scale">
                {TICKS.map((t) => <i key={t} data-major={t % 4 === 0 ? '' : undefined} />)}
              </div>
              <div className="d-scale__nums">{[88, 92, 96, 100, 104, 108].map((n) => <span key={n}>{n}</span>)}</div>
              <span className="d-needle" />
            </div>
            <figcaption className="d-dialwin__label"><span className="d-eye d-eye--hero"><i /></span><span dir="ltr">FM · MediaWave</span></figcaption>
          </figure>
        </section>

        <Tuner />
        <ButtonLab />
      </main>
      <BoardNav />
    </div>
  )
}

/* ───────────── signature: scroll turns the dial ───────────── */

function Tuner() {
  const engine = useMotionEngine()
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const stage = root.querySelector<HTMLElement>('.d-tuner__stage')!
    const readout = root.querySelector<HTMLElement>('[data-freq]')
    const n = SERVICES.length
    let last = -1
    const tl = e.holdTimeline(root, {
      id: 'd-tune',
      scrub: e.CALM ? true : 0.35,
      onUpdate: (self) => {
        const p = self.progress
        const pos = p * n - 0.5 // station i sits at pos === i
        const i = Math.max(0, Math.min(n - 1, Math.round(pos)))
        const detune = Math.min(1, Math.abs(pos - i) * 2.2) // 0 on the station, 1 halfway between
        stage.style.setProperty('--p', p.toFixed(4))
        stage.style.setProperty('--detune', detune.toFixed(3))
        if (i !== last) { stage.dataset.active = String(i); last = i }
        if (readout) readout.textContent = (BAND[0] + p * (BAND[1] - BAND[0])).toFixed(1)
      },
    })
    tl.to({}, { duration: 1 })
  })

  if (engine?.REDUCE) return <StationList />

  return (
    <section id="services" className="d-tuner" aria-labelledby="d-tuner-h">
      <div className="d-tuner__intro">
        <h2 id="d-tuner-h">מה אנחנו עושים</h2>
        <p>שש תחנות. גוללים כדי לכוון ביניהן.</p>{/* [קופי: נתי] */}
      </div>
      <div className="d-tuner__hold" ref={holdRef}>
        <div className="d-tuner__stage" data-active="0" style={{ ['--detune' as string]: 0 }}>
          <div className="d-speaker">
            {SERVICES.map((s, i) => (
              <article className="d-station" data-i={i} key={s.id}>
                <div className="d-station__disc"><ServiceArt service={s} size={230} /></div>
                <div className="d-station__text">
                  <p className="d-station__freq" dir="ltr">{freq(i).toFixed(1)} FM</p>
                  <h3>{s.title}</h3>
                  <p>{s.line}</p>
                  <a href={`/services/${s.slug}`}>לפרטים</a>
                </div>
              </article>
            ))}
            <span className="d-static" aria-hidden="true" />
          </div>

          <div className="d-dial" aria-hidden="true">
            <div className="d-dial__glass">
              <div className="d-dial__names">
                {SERVICES.map((s, i) => (
                  <span key={s.id} data-i={i} style={{ insetInlineStart: `${((i + 0.5) / SERVICES.length) * 100}%` }}>{s.title}</span>
                ))}
              </div>
              <div className="d-scale d-scale--big">
                {TICKS.map((t) => <i key={t} data-major={t % 4 === 0 ? '' : undefined} />)}
              </div>
              <div className="d-scale__nums">{[88, 92, 96, 100, 104, 108].map((n) => <span key={n}>{n}</span>)}</div>
              <span className="d-needle d-needle--tune" />
            </div>
            <div className="d-dial__side">
              <span className="d-eye d-eye--tune"><i /></span>
              <p className="d-readout" dir="ltr"><b>FM</b> <span data-freq>88.0</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Reduced motion: the dial's last frame, every station printed on the glass. */
function StationList() {
  return (
    <section id="services" className="d-tuner d-tuner--still" aria-labelledby="d-tuner-h">
      <div className="d-tuner__intro"><h2 id="d-tuner-h">מה אנחנו עושים</h2></div>
      <ul className="d-list">
        {SERVICES.map((s, i) => (
          <li key={s.id}>
            <div className="d-station__disc"><ServiceArt service={s} size={170} /></div>
            <p className="d-station__freq" dir="ltr">{freq(i).toFixed(1)} FM</p>
            <h3>{s.title}</h3>
            <p>{s.line}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ───────────────────────── button lab ───────────────────────── */

function ButtonLab() {
  const m = useButtonMachine()
  return (
    <section id="lab" className="d-lab" aria-labelledby="d-lab-h">
      <h2 id="d-lab-h">הכפתור: מקש תחנה</h2>
      <p className="d-lab__note">ריחוף: נורית התחנה נדלקת. לחיצה: המקש נכנס פנימה לתוך המקלט. בטלפון יש רק את הלחיצה.</p>
      <div className="d-lab__live">
        <PresetKey state={m.state} onClick={() => m.state === 'idle' && m.run()}>{HERO.cta}</PresetKey>
        <button type="button" className="d-lab__fail" onClick={() => m.run(true)}>להדגים שגיאה</button>
      </div>
      <ul className="d-lab__strip">
        {STRIP.map((s) => (
          <li key={s.label}>
            <PresetKey state={s.state} force={s.force}>{HERO.cta}</PresetKey>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
