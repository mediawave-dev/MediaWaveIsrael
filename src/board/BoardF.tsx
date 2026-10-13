// Direction F · שרטוט מפורק (the exploded drawing). Dev-only style board. direction-bank.md D-09.
// The page is a technical drawing sheet: a frame with zone marks, a title block, dimension
// lines around the hero video. In the services hold the website comes apart into its six
// layers in isometric view, each layer is called out in turn with a detail circle (the real
// Lottie at 2:1), and at the end the layers go back together into one site.

import { useState, type ReactNode } from 'react'
import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, STRIP, STATE_LABEL, HeroMedia, ServiceArt, BoardNav, useButtonMachine, useDocBackground, type BtnState, type BtnForce } from './shared'
import './fonts.css'
import './board-f.css'

const LETTERS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו']

/* ───────────────────────── the dimensioned box button ───────────────────────── */

interface BoxProps { href?: string; state?: BtnState; force?: BtnForce; size?: 'sm' | 'lg'; onClick?: () => void; children: ReactNode }

/** Rest: one outlined box. Hover: the face lifts off its outline, an exploded view of the
    button itself. Press: it snaps back together. Everything stays inside the element. */
export function BoxButton({ href, state = 'idle', force, size = 'lg', onClick, children }: BoxProps) {
  const [pressed, setPressed] = useState(false)
  const label = state === 'idle' ? children : STATE_LABEL[state]
  const shared = {
    className: 'dbox',
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
      <span className="dbox__back" aria-hidden="true" />
      <span className="dbox__face" aria-live="polite">{state === 'sent' && <span aria-hidden="true">✓ </span>}{state === 'error' && <span aria-hidden="true">! </span>}{label}</span>
    </>
  )
  return href ? <a href={href} {...shared}>{inner}</a> : <button type="button" {...shared}>{inner}</button>
}

/* ───────────────────────── page ───────────────────────── */

export default function BoardF() {
  useDocBackground('#F2F2EE')
  return (
    <div className="bd-f" dir="rtl" lang="he">
      <header className="f-head">
        <a href="/board/f" className="f-head__logo" aria-label="MediaWave">
          <img src="/logo-lockup-ink.svg" alt="MediaWave" width="150" height="30" />
        </a>
        <nav className="f-head__nav" aria-label="ראשי">
          {NAV.map((n) => <a key={n} href="#services">{n}</a>)}
        </nav>
        <BoxButton href="#lab" size="sm">{HERO.headerCta}</BoxButton>
      </header>

      <main>
        <section className="f-sheet" aria-label="ראשי">
          {/* the sheet's frame and zone marks */}
          <div className="f-frame" aria-hidden="true">
            <div className="f-zones f-zones--top">{[1, 2, 3, 4, 5, 6].map((n) => <span key={n}>{n}</span>)}</div>
            <div className="f-zones f-zones--side">{LETTERS.slice(0, 4).map((l) => <span key={l}>{l}</span>)}</div>
          </div>

          <div className="f-hero">
            <div className="f-hero__copy">
              <h1 className="f-hero__title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1>
              <p className="f-hero__sub">{HERO.sub}</p>
              <BoxButton href="#lab">{HERO.cta}</BoxButton>
            </div>

            <figure className="f-part" aria-hidden="true">
              <span className="f-dim f-dim--h"><b dir="ltr">1280</b></span>
              <span className="f-dim f-dim--v"><b dir="ltr">720</b></span>
              <div className="f-part__screen"><HeroMedia className="f-part__media" /></div>
              <figcaption className="f-part__label">פרט מס׳ 1: סרטון הפתיחה</figcaption>
            </figure>
          </div>

          <dl className="f-titleblock">
            <div><dt>שם השרטוט</dt><dd>האתר שלכם</dd></div>
            <div><dt>שרטט</dt><dd>נתי</dd></div>
            <div><dt>קנ״מ</dt><dd dir="ltr">1:1</dd></div>
            <div><dt>גיליון</dt><dd>1 מתוך 1</dd></div>
          </dl>
        </section>

        <Exploded />
        <ButtonLab />
      </main>
      <BoardNav tone="light" />
    </div>
  )
}

/* ───────────── signature: the site comes apart into its layers ───────────── */

/** A tiny sketch of what each layer holds, drawn on its plate */
function LayerSketch({ i }: { i: number }) {
  return <span className={`f-sketch f-sketch--${i}`} aria-hidden="true"><i /><i /><i /><i /></span>
}

function Exploded() {
  const engine = useMotionEngine()
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const stage = root.querySelector<HTMLElement>('.f-ex__stage')!
    const n = SERVICES.length
    let last = -2
    const tl = e.holdTimeline(root, {
      id: 'f-ex',
      scrub: e.CALM ? true : 0.5,
      onUpdate: (self) => {
        const p = self.progress
        // 0-0.16 explode, 0.16-0.88 call out each layer, 0.88-1 back together
        const explode = p < 0.16 ? p / 0.16 : p > 0.88 ? Math.max(0, 1 - (p - 0.88) / 0.12) : 1
        stage.style.setProperty('--explode', explode.toFixed(3))
        const i = p < 0.16 || p > 0.88 ? -1 : Math.min(n - 1, Math.floor(((p - 0.16) / 0.72) * n))
        if (i !== last) { stage.dataset.active = String(i); last = i }
      },
    })
    tl.to({}, { duration: 1 })
  })

  const still = engine?.REDUCE
  return (
    <section id="services" className={`f-ex${still ? ' f-ex--still' : ''}`} aria-labelledby="f-ex-h">
      <div className="f-ex__intro">
        <h2 id="f-ex-h">מה אנחנו עושים</h2>
        <p>אתר טוב בנוי משכבות. גוללים, והוא מתפרק לחלקים שלו.</p>{/* [קופי: נתי] */}
      </div>
      <div className="f-ex__hold" ref={holdRef}>
        <div className="f-ex__stage" data-active={still ? '' : '-1'} style={{ ['--explode' as string]: still ? 1 : 0 }}>
          <div className="f-iso-wrap" aria-hidden="true">
            <div className="f-iso">
              {SERVICES.map((s, i) => (
                <div className="f-layer" data-i={i} key={s.id} style={{ ['--k' as string]: SERVICES.length - 1 - i }}>
                  <LayerSketch i={i} />
                  <span className="f-layer__no">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <ol className="f-callouts">
            {SERVICES.map((s, i) => (
              <li key={s.id} data-i={i}>
                <span className="f-balloon" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.line}</p>
                  <a href={`/services/${s.slug}`}>לפרטים</a>
                </div>
              </li>
            ))}
          </ol>

          <div className="f-detail" aria-hidden="true">
            {SERVICES.map((s, i) => (
              <div className="f-detail__art" data-i={i} key={s.id}><ServiceArt service={s} size={210} /></div>
            ))}
            <p className="f-detail__label">
              {SERVICES.map((s, i) => <span key={s.id} data-i={i}>פרט {LETTERS[i]}׳, קנ״מ 2:1</span>)}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── button lab ───────────────────────── */

function ButtonLab() {
  const m = useButtonMachine()
  return (
    <section id="lab" className="f-lab" aria-labelledby="f-lab-h">
      <h2 id="f-lab-h">הכפתור: קופסה משורטטת</h2>
      <p className="f-lab__note">ריחוף: החזית מתרוממת מעל קו המתאר, מבט מפורק של הכפתור עצמו. לחיצה: הוא נסגר בחזרה לגוש אחד. בטלפון יש רק את הלחיצה.</p>
      <div className="f-lab__live">
        <BoxButton state={m.state} onClick={() => m.state === 'idle' && m.run()}>{HERO.cta}</BoxButton>
        <button type="button" className="f-lab__fail" onClick={() => m.run(true)}>להדגים שגיאה</button>
      </div>
      <ul className="f-lab__strip">
        {STRIP.map((s) => (
          <li key={s.label}>
            <BoxButton state={s.state} force={s.force}>{HERO.cta}</BoxButton>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
