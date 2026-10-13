// Direction K · ההשקה (the keynote launch). Dev-only. direction-bank.md D-01 (Oryzo AI by
// Lusion: an ordinary thing launched like a flagship product). Black stage, thin type, one
// object. The object is a laptop showing the hero video. In the services hold its lid opens,
// then it turns a little for each service while the screen and the announcement change.

import type { ReactNode } from 'react'
import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, HeroMedia, ServiceArt, BoardNav, useDocBackground, StateButton, ButtonLab, type StateButtonProps } from './shared'
import './fonts.css'
import './lab.css'
import './board-k.css'

/** The product button: it tips toward the pointer like an object on a turntable. */
function ProductButton(p: StateButtonProps) {
  return (
    <StateButton {...p} track cls="kbtn" render={(label, state) => (
      <span className="kbtn__label" aria-live="polite">
        {state === 'sent' && <span aria-hidden="true">✓ </span>}{label}
        {state === 'loading' && <span className="kbtn__dots" aria-hidden="true">...</span>}
      </span>
    )} />
  )
}

function Laptop({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`k-laptop ${className}`} aria-hidden="true">
      <div className="k-lid"><div className="k-screen">{children}</div><span className="k-cam" /></div>
      <div className="k-base"><span className="k-notch" /></div>
    </div>
  )
}

export default function BoardK() {
  useDocBackground('#000000')
  return (
    <div className="bd-k" dir="rtl" lang="he">
      <header className="k-head">
        <a href="/board/k" className="k-head__logo" aria-label="MediaWave">
          <img src="/logo-lockup-white.svg" alt="MediaWave" width="150" height="30" />
        </a>
        <nav className="k-head__nav" aria-label="ראשי">{NAV.map((n) => <a key={n} href="#services">{n}</a>)}</nav>
        <ProductButton href="#lab" size="sm">{HERO.headerCta}</ProductButton>
      </header>

      <main>
        <section className="k-hero" aria-label="ראשי">
          <h1 className="k-hero__title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1>
          <p className="k-hero__sub">{HERO.sub}</p>
          <ProductButton href="#lab">{HERO.cta}</ProductButton>
          <div className="k-hero__object">
            <Laptop><HeroMedia className="k-screen__media" /></Laptop>
          </div>
        </section>

        <Keynote />
        <ButtonLab Btn={ProductButton} title="הכפתור: מוצר על במה" note="ריחוף: הכפתור נוטה מעט לכיוון העכבר, כמו מוצר על פטיפון. לחיצה: הוא נלחץ פנימה. בטלפון יש רק את הלחיצה." />
      </main>
      <BoardNav />
    </div>
  )
}

/* ───────────── signature: the launch ───────────── */

function Keynote() {
  const engine = useMotionEngine()
  const n = SERVICES.length
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const stage = root.querySelector<HTMLElement>('.k-stage')!
    let last = -2
    const tl = e.holdTimeline(root, {
      id: 'k-launch',
      scrub: e.CALM ? true : 0.6,
      onUpdate: (self) => {
        const p = self.progress
        const open = Math.min(1, p / 0.14) // the lid opens over the first stretch
        const eased = 1 - (1 - open) ** 3
        stage.style.setProperty('--lid', `${(-88 + eased * 78).toFixed(1)}deg`)
        const q = Math.max(0, (p - 0.16) / 0.8)
        const i = p < 0.16 ? -1 : Math.min(n - 1, Math.floor(q * n))
        // a quarter turn of the turntable per announcement, alternating sides
        const turn = p < 0.16 ? -24 + eased * 24 : Math.sin(q * n * Math.PI) * 9
        stage.style.setProperty('--ry', `${turn.toFixed(2)}deg`)
        if (i !== last) { stage.dataset.active = String(i); last = i }
      },
    })
    tl.to({}, { duration: 1 })
  })

  return (
    <section id="services" className={`k-svc${engine?.REDUCE ? ' k-svc--still' : ''}`} aria-labelledby="k-svc-h">
      <div className="k-svc__intro">
        <h2 id="k-svc-h">מה אנחנו עושים</h2>
        <p>שש הכרזות קטנות.</p>{/* [קופי: נתי] */}
      </div>
      <div className="k-hold" ref={holdRef}>
        <div className="k-stage" data-active="-1">
          <div className="k-specs">
            <div className="k-spec k-spec--intro" data-i="-1"><p className="k-spec__kicker">הכירו את</p><h3>האתר שלכם</h3></div>
            {SERVICES.map((s, i) => (
              <div className="k-spec" data-i={i} key={s.id}>
                <p className="k-spec__kicker" dir="ltr">{i + 1} / {n}</p>
                <h3>{s.title}</h3>
                <p>{s.line}</p>
                <a href={`/services/${s.slug}`}>לפרטים</a>
              </div>
            ))}
          </div>
          <div className="k-turntable">
            <Laptop className="k-laptop--big">
              {SERVICES.map((s, i) => (
                <div className="k-shot" data-i={i} key={s.id}><ServiceArt service={s} size={220} /></div>
              ))}
              <div className="k-shot k-shot--intro" data-i="-1"><img src="/logo-lockup-ink.svg" alt="" /></div>
            </Laptop>
          </div>
        </div>
      </div>
    </section>
  )
}
