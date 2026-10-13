// Direction G · כוכב קטן (the tiny planet). Dev-only. direction-bank.md D-02 (Messenger, Abeto).
// MediaWave lives on a small pistachio planet in plum space. The hero video plays on a little
// drive-in screen standing on the planet's horizon. In the services hold, scrolling turns the
// planet: six buildings ride its rim, and the one that reaches the top raises its sign.

import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, HeroMedia, ServiceArt, BoardNav, useDocBackground, StateButton, ButtonLab, type StateButtonProps } from './shared'
import './fonts.css'
import './lab.css'
import './board-g.css'

/** The orbit button: a moon circles the label on hover; a press squashes it like a soft planet. */
function OrbitButton(p: StateButtonProps) {
  return (
    <StateButton {...p} cls="orb" render={(label, state) => (
      <>
        <span className="orb__path" aria-hidden="true"><span className="orb__arm"><i /></span></span>
        <span className="orb__label" aria-live="polite">{state === 'sent' && <span aria-hidden="true">✓ </span>}{label}</span>
      </>
    )} />
  )
}

/** One building per service, drawn in CSS; `kind` picks its silhouette */
function Building({ i }: { i: number }) {
  return (
    <span className={`g-bld g-bld--${i}`} aria-hidden="true">
      <i /><i /><i /><b />
    </span>
  )
}

export default function BoardG() {
  useDocBackground('#1F1530')
  return (
    <div className="bd-g" dir="rtl" lang="he">
      <header className="g-head">
        <a href="/board/g" className="g-head__logo" aria-label="MediaWave">
          <img src="/logo-lockup-white.svg" alt="MediaWave" width="150" height="30" />
        </a>
        <nav className="g-head__nav" aria-label="ראשי">{NAV.map((n) => <a key={n} href="#services">{n}</a>)}</nav>
        <OrbitButton href="#lab" size="sm">{HERO.headerCta}</OrbitButton>
      </header>

      <main>
        <section className="g-hero" aria-label="ראשי">
          <div className="g-hero__copy">
            <h1 className="g-hero__title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1>
            <p className="g-hero__sub">{HERO.sub}</p>
            <OrbitButton href="#lab">{HERO.cta}</OrbitButton>
          </div>
          <div className="g-world" aria-hidden="true">
            <div className="g-screen">
              <div className="g-screen__frame"><HeroMedia className="g-screen__media" /></div>
              <span className="g-screen__leg" /><span className="g-screen__leg" />
            </div>
            <span className="g-world__planet" />
            <span className="g-world__sun" />
          </div>
        </section>

        <PlanetHold />
        <ButtonLab Btn={OrbitButton} title="הכפתור: מסלול" note="ריחוף: ירח קטן מקיף את הכיתוב. לחיצה: הכפתור נמעך כמו כוכב רך. בטלפון יש רק את הלחיצה." />
      </main>
      <BoardNav />
    </div>
  )
}

/* ───────────── signature: the planet turns ───────────── */

function PlanetHold() {
  const engine = useMotionEngine()
  const n = SERVICES.length
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const stage = root.querySelector<HTMLElement>('.g-orbit__stage')!
    const planet = root.querySelector<HTMLElement>('.g-orbit__planet')!
    let last = -1
    const tl = e.holdTimeline(root, {
      id: 'g-orbit',
      scrub: e.CALM ? true : 0.6,
      onUpdate: (self) => {
        // counter-clockwise, so the next building rises from the reading side (right)
        const turn = self.progress * (n - 1)
        planet.style.transform = `rotate(${(-turn * (360 / n)).toFixed(2)}deg)`
        const i = Math.min(n - 1, Math.round(turn))
        if (i !== last) { stage.dataset.active = String(i); last = i }
      },
    })
    tl.to({}, { duration: 1 })
  })

  if (engine?.REDUCE) {
    return (
      <section id="services" className="g-orbit g-orbit--still" aria-labelledby="g-orbit-h">
        <div className="g-orbit__intro"><h2 id="g-orbit-h">מה אנחנו עושים</h2></div>
        <ul className="g-still">
          {SERVICES.map((s) => (
            <li key={s.id}><div className="g-sign__disc"><ServiceArt service={s} size={170} /></div><h3>{s.title}</h3><p>{s.line}</p></li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section id="services" className="g-orbit" aria-labelledby="g-orbit-h">
      <div className="g-orbit__intro">
        <h2 id="g-orbit-h">מה אנחנו עושים</h2>
        <p>על הכוכב שלנו יש שישה בניינים. גוללים, והכוכב מסתובב.</p>{/* [קופי: נתי] */}
      </div>
      <div className="g-orbit__hold" ref={holdRef}>
        <div className="g-orbit__stage" data-active="0">
          <div className="g-sign">
            {SERVICES.map((s, i) => (
              <article className="g-sign__item" data-i={i} key={s.id}>
                <div className="g-sign__disc"><ServiceArt service={s} size={230} /></div>
                <div className="g-sign__text">
                  <h3>{s.title}</h3>
                  <p>{s.line}</p>
                  <a href={`/services/${s.slug}`}>לפרטים</a>
                </div>
              </article>
            ))}
          </div>
          <div className="g-orbit__planet" aria-hidden="true">
            {SERVICES.map((s, i) => (
              <span className="g-orbit__slot" key={s.id} style={{ transform: `rotate(${(i * 360) / n}deg)` }}>
                <Building i={i} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
