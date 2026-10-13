// Direction J · הרחוב (down the street). Dev-only. direction-bank.md D-12 (Bruno Simon's drive
// through the portfolio, as a light side-scroller). An Israeli high street on a hamsin day:
// plaster fronts, shop signs in a sign-painter's serif, solar water heaters on the roofs.
// The hero is MediaWave's own shop front, the video playing behind its window. In the
// services hold the visitor walks down the street: six shops, one per service, in parallax.

import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, HeroMedia, ServiceArt, BoardNav, useDocBackground, StateButton, ButtonLab, type StateButtonProps } from './shared'
import './fonts.css'
import './lab.css'
import './board-j.css'

/** The lightbox sign: hover switches its light on, a press makes the hanging sign dip. */
function SignButton(p: StateButtonProps) {
  return (
    <StateButton {...p} cls="lbx" render={(label, state) => (
      <span className="lbx__panel" aria-live="polite">{state === 'sent' && <span aria-hidden="true">✓ </span>}{label}</span>
    )} />
  )
}

const SIGN_COLORS = ['#B8322A', '#2F6B45', '#C99417', '#5B2A4E', '#1F1F1F', '#8A4B22']
/** Lettering colour per sign, chosen for AA (mustard takes ink, the rest take paper) */
const SIGN_FG = ['#F7F1E6', '#F7F1E6', '#22201C', '#F7F1E6', '#F7F1E6', '#F7F1E6']

/** Distant roofs with solar water heaters (the Israeli roofline), repeated along the street */
function Roofline() {
  const h = [62, 48, 74, 55, 68, 44, 80, 58, 66, 50, 72, 46, 60, 77, 52, 69]
  return (
    <div className="j-roofs" aria-hidden="true">
      {h.map((v, i) => (
        <span key={i} className="j-roof" style={{ height: `${v}%` }}>
          {i % 2 === 0 && <i className="j-boiler" />}
        </span>
      ))}
    </div>
  )
}

export default function BoardJ() {
  useDocBackground('#EFE3C2')
  return (
    <div className="bd-j" dir="rtl" lang="he">
      <header className="j-head">
        <a href="/board/j" className="j-head__logo" aria-label="MediaWave">
          <img src="/logo-lockup-ink.svg" alt="MediaWave" width="150" height="30" />
        </a>
        <nav className="j-head__nav" aria-label="ראשי">{NAV.map((n) => <a key={n} href="#services">{n}</a>)}</nav>
        <SignButton href="#lab" size="sm">{HERO.headerCta}</SignButton>
      </header>

      <main>
        <section className="j-hero" aria-label="ראשי">
          <div className="j-front">
            <div className="j-front__sign"><h1 className="j-front__title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1></div>
            <div className="j-front__awning" aria-hidden="true" />
            <div className="j-front__body">
              <div className="j-front__window" aria-hidden="true">
                <HeroMedia className="j-front__media" />
                <span className="j-front__glass" />
                <span className="j-front__decal">סטודיו MediaWave</span>
              </div>
              <div className="j-front__door">
                <p className="j-front__sub">{HERO.sub}</p>
                <SignButton href="#lab">{HERO.cta}</SignButton>
              </div>
            </div>
          </div>
          <div className="j-sidewalk" aria-hidden="true" />
        </section>

        <Street />
        <ButtonLab Btn={SignButton} title="הכפתור: שלט מואר" note="ריחוף: האור בשלט נדלק. לחיצה: השלט התלוי שוקע מעט. בטלפון יש רק את הלחיצה." />
      </main>
      <BoardNav tone="light" />
    </div>
  )
}

/* ───────────── signature: a walk down the street ───────────── */

function Street() {
  const engine = useMotionEngine()
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const stage = root.querySelector<HTMLElement>('.j-street__stage')!
    const mid = root.querySelector<HTMLElement>('.j-layer--shops')!
    const back = root.querySelector<HTMLElement>('.j-layer--roofs')!
    const front = root.querySelector<HTMLElement>('.j-layer--front')!
    const shops = [...root.querySelectorAll<HTMLElement>('.j-shop')]
    const dist = () => Math.max(0, mid.scrollWidth - stage.clientWidth)
    let centres: number[] = []
    const measure = () => { centres = shops.map((s) => s.offsetLeft + s.offsetWidth / 2) }
    let last = -1
    const light = () => {
      const x = Number(e.gsap.getProperty(mid, 'x')) || 0
      const mid0 = stage.clientWidth / 2
      let best = 0, bestD = Infinity
      centres.forEach((c, i) => { const d = Math.abs(c + x - mid0); if (d < bestD) { bestD = d; best = i } })
      if (best !== last) { stage.dataset.active = String(best); last = best }
    }
    const tl = e.holdTimeline(root, { id: 'j-street', scrub: e.CALM ? true : 0.7 })
    tl.fromTo(mid, { x: 0 }, { x: () => dist() * e.DIR, duration: 1 }, 0)
      .fromTo(back, { x: 0 }, { x: () => dist() * 0.35 * e.DIR, duration: 1 }, 0)
      .fromTo(front, { x: 0 }, { x: () => dist() * 1.5 * e.DIR, duration: 1 }, 0)
    tl.eventCallback('onUpdate', light)
    measure(); light()
    e.ScrollTrigger.addEventListener('refresh', measure)
    return () => e.ScrollTrigger.removeEventListener('refresh', measure)
  })

  return (
    <section id="services" className={`j-street${engine?.REDUCE ? ' j-street--still' : ''}`} aria-labelledby="j-street-h">
      <div className="j-street__intro">
        <h2 id="j-street-h">מה אנחנו עושים</h2>
        <p>שש חנויות ברחוב אחד. גוללים, והולכים לאורכו.</p>{/* [קופי: נתי] */}
      </div>
      <div className="j-street__hold" ref={holdRef}>
        <div className="j-street__stage" data-active="0">
          <div className="j-layer j-layer--roofs"><Roofline /><Roofline /></div>
          <div className="j-layer j-layer--shops">
            {SERVICES.map((s, i) => (
              <article className="j-shop" key={s.id} data-i={i} style={{ ['--sign' as string]: SIGN_COLORS[i], ['--sign-fg' as string]: SIGN_FG[i] }}>
                <div className="j-shop__sign"><h3>{s.title}</h3></div>
                <div className="j-shop__awning" aria-hidden="true" />
                <div className="j-shop__front">
                  <div className="j-shop__window"><ServiceArt service={s} size={200} /></div>
                  <div className="j-shop__door">
                    <p>{s.line}</p>
                    <a href={`/services/${s.slug}`}>לפרטים</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="j-layer j-layer--front" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => <span key={i} className={i % 3 === 1 ? 'j-tree' : 'j-lamp'} />)}
          </div>
          <div className="j-road" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
