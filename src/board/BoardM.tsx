// Direction M · עצמים מרחפים (flight through floating objects). Dev-only. direction-bank.md D-03
// (Igloo Inc by Abeto and Bureaux, with its lesson: all text stays HTML).
// A soft lavender void where MediaWave's tools hang in the air: a laptop, a phone, a lens,
// a chat bubble, a cassette, a photo frame. The hero video plays on a floating screen.
// In the services hold the camera flies into one object after another; inside each, its
// service. The button is a lens that inverts whatever it passes over.

import type { ReactNode } from 'react'
import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, HeroMedia, ServiceArt, BoardNav, useDocBackground, StateButton, ButtonLab, type StateButtonProps } from './shared'
import Logo from '../components/ui/Logo'
import './fonts.css'
import './lab.css'
import './board-m.css'

/** The lens button: a disc follows the pointer and inverts the label under it. */
function LensButton(p: StateButtonProps) {
  return (
    <StateButton {...p} track cls="lens" render={(label, state) => (
      <>
        <span className="lens__disc" aria-hidden="true" />
        <span className="lens__label" aria-live="polite">{state === 'sent' && <span aria-hidden="true">✓ </span>}{label}</span>
      </>
    )} />
  )
}

const KINDS = ['laptop', 'phone', 'loupe', 'bubble', 'cassette', 'frame'] as const

/** An object drawn in CSS; `face` is the area that becomes the window into its service */
function Thing({ kind, children }: { kind: (typeof KINDS)[number]; children?: ReactNode }) {
  return (
    <span className={`m-thing m-thing--${kind}`}>
      <span className="m-thing__body">
        <span className="m-thing__face">{children}</span>
        {kind === 'cassette' && <><i className="m-reel" /><i className="m-reel" /></>}
        {kind === 'loupe' && <i className="m-handle" />}
      </span>
    </span>
  )
}

export default function BoardM() {
  useDocBackground('#E6E1F2')
  return (
    <div className="bd-m" dir="rtl" lang="he">
      <header className="m-head">
        <a href="/board/m" className="m-head__logo" aria-label="MediaWave">
          <Logo variant="compact" decorative />
        </a>
        <nav className="m-head__nav" aria-label="ראשי">{NAV.map((n) => <a key={n} href="#services">{n}</a>)}</nav>
        <LensButton href="#lab" size="sm">{HERO.headerCta}</LensButton>
      </header>

      <main>
        <section className="m-hero" aria-label="ראשי">
          <div className="m-hero__copy">
            <h1 className="m-hero__title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1>
            <p className="m-hero__sub">{HERO.sub}</p>
            <LensButton href="#lab">{HERO.cta}</LensButton>
          </div>
          <div className="m-hero__void" aria-hidden="true">
            <span className="m-float m-float--screen"><span className="m-screen"><HeroMedia className="m-screen__media" /></span></span>
            <span className="m-float m-float--a"><Thing kind="phone" /></span>
            <span className="m-float m-float--b"><Thing kind="cassette" /></span>
            <span className="m-float m-float--c"><Thing kind="bubble" /></span>
            <span className="m-float m-float--d"><Thing kind="loupe" /></span>
          </div>
        </section>

        <Flight />
        <ButtonLab Btn={LensButton} title="הכפתור: עדשה" note="ריחוף: עדשה עגולה עוקבת אחרי העכבר והופכת את הצבעים שמתחתיה. לחיצה: העדשה מתרחבת וממלאת את הכפתור. בטלפון יש רק את הלחיצה." />
      </main>
      <BoardNav tone="light" />
    </div>
  )
}

/* ───────────── signature: fly into each object ───────────── */

function Flight() {
  const engine = useMotionEngine()
  const n = SERVICES.length
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const stage = root.querySelector<HTMLElement>('.m-flight__stage')!
    const things = [...root.querySelectorAll<HTMLElement>('.m-fly')]
    let last = -2
    const tl = e.holdTimeline(root, {
      id: 'm-flight',
      scrub: e.CALM ? true : 0.5,
      onUpdate: (self) => {
        const span = n + 0.4
        let active = -1
        things.forEach((el, i) => {
          // t < 0: still ahead in the distance; t = 0: in front of us; t > 0: we fly through it
          const t = self.progress * span - i - 0.5
          let s: number, o: number, y: number
          if (t < 0) { const a = Math.max(0, 1 + t / 1.4); s = 0.18 + 0.82 * a * a; o = Math.min(1, a * 1.4); y = (1 - a) * (i % 2 ? -18 : 14) }
          else { s = 1 + (t / 0.55) ** 2 * 3.2; o = Math.max(0, 1 - t / 0.55); y = 0 }
          el.style.transform = `translate(-50%, calc(-50% + ${y.toFixed(1)}vh)) scale(${s.toFixed(3)})`
          el.style.opacity = o.toFixed(3)
          el.style.zIndex = String(100 - i)
          if (Math.abs(t) < 0.32) active = i
        })
        if (active !== last) { stage.dataset.active = String(active); last = active }
      },
    })
    tl.to({}, { duration: 1 })
  })

  return (
    <section id="services" className={`m-flight${engine?.REDUCE ? ' m-flight--still' : ''}`} aria-labelledby="m-flight-h">
      <div className="m-flight__intro">
        <h2 id="m-flight-h">מה אנחנו עושים</h2>
        <p>שישה כלים מרחפים. גוללים, וטסים לתוך כל אחד.</p>{/* [קופי: נתי] */}
      </div>
      <div className="m-flight__hold" ref={holdRef}>
        <div className="m-flight__stage" data-active="-1">
          {SERVICES.map((s, i) => (
            <div className="m-fly" key={s.id} data-i={i}>
              <Thing kind={KINDS[i]}><ServiceArt service={s} size={190} /></Thing>
            </div>
          ))}
          <div className="m-captions">
            {SERVICES.map((s, i) => (
              <div className="m-caption" data-i={i} key={s.id}>
                <h3>{s.title}</h3>
                <p>{s.line}</p>
                <a href={`/services/${s.slug}`}>לפרטים</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
