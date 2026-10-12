// Direction C · גלריה (the gallery). Dev-only style board.
// White-cube walls and generous margins; the hero video hangs as a framed work with a
// museum wall label. The services hold walks the visitor from the white room into the
// salon-red room and along a wall of six framed exhibits (the Lotties are the works).

import { useState, type ReactNode } from 'react'
import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, STRIP, STATE_LABEL, HeroMedia, ServiceArt, BoardNav, useButtonMachine, useDocBackground, type BtnState, type BtnForce } from './shared'
import './fonts.css'
import './board-c.css'

/* ───────────────────────── the label-plate button ───────────────────────── */

interface PlateProps {
  href?: string
  state?: BtnState
  force?: BtnForce
  size?: 'sm' | 'lg'
  onClick?: () => void
  children: ReactNode
}

/** Rest: an outlined label plate. Hover: the fill slides in from the reading side.
    Press: the plate settles. Loading, sent and error keep the same plate. */
export function PlateButton({ href, state = 'idle', force, size = 'lg', onClick, children }: PlateProps) {
  const [pressed, setPressed] = useState(false)
  const label = state === 'idle' ? children : STATE_LABEL[state]
  const shared = {
    className: 'plate',
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
    <span className="plate__label" aria-live="polite">
      {state === 'sent' && <span aria-hidden="true">✓</span>}
      {label}
      {state === 'loading' && <span className="plate__dots" aria-hidden="true" />}
    </span>
  )
  return href ? <a href={href} {...shared}>{inner}</a> : <button type="button" {...shared}>{inner}</button>
}

/* ───────────────────────── page ───────────────────────── */

export default function BoardC() {
  useDocBackground('#F4F5F2')
  return (
    <div className="bd-c" dir="rtl" lang="he">
      <header className="c-head">
        <a href="/board/c" className="c-head__logo" aria-label="MediaWave">
          <img src="/logo-lockup-ink.svg" alt="MediaWave" width="150" height="30" />
        </a>
        <nav className="c-head__nav" aria-label="ראשי">
          {NAV.map((n) => <a key={n} href="#services">{n}</a>)}
        </nav>
        <PlateButton href="#lab" size="sm">{HERO.headerCta}</PlateButton>
      </header>

      <main>
        <section className="c-hero" aria-label="ראשי">
          <div className="c-hero__copy">
            <h1 className="c-hero__title">
              <span>{HERO.line1}</span>
              <span>{HERO.line2}</span>
            </h1>
            <p className="c-hero__sub">{HERO.sub}</p>
            <PlateButton href="#lab">{HERO.cta}</PlateButton>
          </div>
          <figure className="c-work">
            <div className="c-frame">
              <div className="c-mat">
                <div className="c-work__screen"><HeroMedia className="c-work__media" /></div>
              </div>
            </div>
            {/* The wall label states only facts about the clip */}
            <figcaption className="c-walllabel">
              <b>MediaWave</b>
              <span>סרטון הפתיחה, 2026</span>
              <span>וידאו בלולאה, 8 שניות</span>
            </figcaption>
          </figure>
        </section>

        <WallWalk />
        <ButtonLab />
      </main>
      <BoardNav tone="light" />
    </div>
  )
}

/* ───────────── signature: walk along the salon-red wall ───────────── */

function WallWalk() {
  const engine = useMotionEngine()
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    const stage = root.querySelector<HTMLElement>('.c-svc__stage')!
    const track = root.querySelector<HTMLElement>('.c-wall')!
    const exhibits = [...root.querySelectorAll<HTMLElement>('.c-exhibit')]
    const lights = exhibits.map((x) => x.querySelector<HTMLElement>('.c-light')!)
    const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth)

    const tl = e.holdTimeline(root, { id: 'c-svc', scrub: e.CALM ? true : 0.7 })
    // Walking in: the white room turns into the red room, then the wall travels past
    tl.fromTo(stage, { backgroundColor: '#F4F5F2', color: '#1B1A19' }, { backgroundColor: '#6B1A26', color: '#F6EFE9', duration: 0.12, ease: 'power1.inOut' }, 0)
      .fromTo(root.querySelector('.c-svc__roomname'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.08)
      .fromTo(track, { x: 0 }, { x: () => distance() * e.DIR, duration: 0.84, ease: 'none' }, 0.14)

    // The gallery lights: each work is lit as the visitor stands in front of it. Centres are
    // read from layout once per refresh; per frame only the track's x is read (no reflow).
    let centres: number[] = []
    const measure = () => { centres = exhibits.map((x) => x.offsetLeft + x.offsetWidth / 2) }
    const lightUp = () => {
      const x = Number(e.gsap.getProperty(track, 'x')) || 0
      const mid = stage.clientWidth / 2
      centres.forEach((c, i) => {
        const d = Math.abs(c + x - mid) / stage.clientWidth
        lights[i].style.opacity = Math.max(0.12, 1 - d * 1.9).toFixed(3)
      })
    }
    measure()
    lightUp()
    tl.eventCallback('onUpdate', lightUp)
    e.ScrollTrigger.addEventListener('refresh', measure)
    return () => e.ScrollTrigger.removeEventListener('refresh', measure)
  })

  const reduce = engine?.REDUCE

  return (
    <section id="services" className={`c-svc${reduce ? ' c-svc--still' : ''}`} aria-labelledby="c-svc-h">
      <div className="c-svc__intro">
        <h2 id="c-svc-h">מה אנחנו עושים</h2>
        <p>שש עבודות על קיר אחד. גוללים והולכים לאורכו.</p>{/* [קופי: נתי] */}
      </div>
      <div className="c-svc__hold" ref={holdRef}>
        <div className="c-svc__stage">
          <p className="c-svc__roomname" aria-hidden="true">החדר האדום</p>
          <ol className="c-wall">
            {SERVICES.map((s) => (
              <li className="c-exhibit" key={s.id}>
                <span className="c-light" aria-hidden="true" />
                <div className="c-frame c-frame--work">
                  <div className="c-mat"><ServiceArt service={s} size={260} /></div>
                </div>
                <div className="c-label">
                  <h3>{s.title}</h3>
                  <p>{s.line}</p>
                  <a href={`/services/${s.slug}`}>לפרטים</a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── button lab ───────────────────────── */

function ButtonLab() {
  const m = useButtonMachine()
  return (
    <section id="lab" className="c-lab" aria-labelledby="c-lab-h">
      <h2 id="c-lab-h">הכפתור: לוחית</h2>
      <p className="c-lab__note">ריחוף: המילוי נכנס מצד הקריאה. לחיצה: הלוחית מתיישבת. בטלפון יש רק את הלחיצה.</p>
      <div className="c-lab__live">
        <PlateButton state={m.state} onClick={() => m.state === 'idle' && m.run()}>{HERO.cta}</PlateButton>
        <button type="button" className="c-lab__fail" onClick={() => m.run(true)}>להדגים שגיאה</button>
      </div>
      <ul className="c-lab__strip">
        {STRIP.map((s) => (
          <li key={s.label}>
            <PlateButton state={s.state} force={s.force}>{HERO.cta}</PlateButton>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
      <div className="c-lab__room">
        <p>אותה לוחית על הקיר האדום</p>
        <PlateButton>{HERO.cta}</PlateButton>
        <PlateButton force="hover">{HERO.cta}</PlateButton>
      </div>
    </section>
  )
}
