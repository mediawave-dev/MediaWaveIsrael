// Direction H · קומיקס (the photo comic). Dev-only. direction-bank.md D-05 (Ponpon Mania;
// NYT "Tomato Can Blues"). The page is a comic book made from MediaWave's real footage: the
// hero video is the first panel, stills from the other videos follow, narration sits in yellow
// boxes and the button is a speech balloon. In the services hold the page fills panel by panel,
// in reading order, until the whole page is drawn.

import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, HeroMedia, ServiceArt, BoardNav, useDocBackground, StateButton, ButtonLab, type StateButtonProps } from './shared'
import codeStill from './assets/comic-code-2.webp'
import memStill from './assets/comic-mem.webp'
import './fonts.css'
import './lab.css'
import './board-h.css'

/** The balloon button: hover fills it like a narration box, loading types "...", a press squeezes it. */
function BalloonButton(p: StateButtonProps) {
  return (
    <StateButton {...p} cls="bln" render={(label, state) => (
      <span className="bln__body" aria-live="polite">
        {state === 'sent' && <span aria-hidden="true">✓ </span>}
        {label}
        {state === 'loading' && <span className="bln__dots" aria-hidden="true"><i /><i /><i /></span>}
      </span>
    )} />
  )
}

/** One balloon per panel: the question a customer brings, never a result or a quote (no
    invented proof). [קופי: נתי] */
const BUBBLES = ['אפשר שהאתר יהיה שלי לגמרי?', 'ושהפניות יגיעו ישר לוואטסאפ?', 'איך מגיעים לעמוד הראשון בגוגל?', 'ומי עונה כשאני בפגישה?', 'יש לי שעה של חומר גלם. מה עושים איתו?', 'יש לנו קופסה של תמונות מהאלבום.']

export default function BoardH() {
  useDocBackground('#FFFFFF')
  return (
    <div className="bd-h" dir="rtl" lang="he">
      <header className="h-head">
        <a href="/board/h" className="h-head__logo" aria-label="MediaWave">
          <img src="/logo-lockup-ink.svg" alt="MediaWave" width="150" height="30" />
        </a>
        <nav className="h-head__nav" aria-label="ראשי">{NAV.map((n) => <a key={n} href="#services">{n}</a>)}</nav>
        <BalloonButton href="#lab" size="sm">{HERO.headerCta}</BalloonButton>
      </header>

      <main>
        <section className="h-cover" aria-label="ראשי">
          <div className="h-titlepanel">
            <h1 className="h-title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1>
            <p className="h-narr">{HERO.sub}</p>
            <BalloonButton href="#lab">{HERO.cta}</BalloonButton>
          </div>
          <figure className="h-panel h-panel--video" aria-hidden="true">
            <HeroMedia className="h-panel__img" />
            <figcaption className="h-narr h-narr--corner">כל אתר מתחיל בשולחן הזה.</figcaption>{/* [קופי: נתי] */}
          </figure>
          <figure className="h-panel" aria-hidden="true">
            <img className="h-panel__img" src={codeStill} alt="" />
            <figcaption className="h-narr h-narr--corner">קוד אמיתי, לא תבנית.</figcaption>
          </figure>
          <figure className="h-panel" aria-hidden="true">
            <img className="h-panel__img" src={memStill} alt="" />
            <figcaption className="h-narr h-narr--corner">ותמונות ישנות שחוזרות לזוז.</figcaption>
          </figure>
        </section>

        <ComicPage />
        <ButtonLab Btn={BalloonButton} title="הכפתור: בועת דיבור" note="ריחוף: הבועה מתמלאת בצהוב של תיבת קריינות. לחיצה: היא נלחצת פנימה. בזמן שליחה מופיעות שלוש נקודות, כמו מישהו שמקליד. בטלפון יש רק את הלחיצה." />
      </main>
      <BoardNav tone="light" />
    </div>
  )
}

/* ───────────── signature: the page fills panel by panel ───────────── */

function ComicPage() {
  const engine = useMotionEngine()
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const panels = root.querySelectorAll<HTMLElement>('.h-grid .h-svc')
    const tl = e.holdTimeline(root, { id: 'h-page', scrub: e.CALM ? true : 0.5 })
    panels.forEach((p, i) => {
      // each panel is slapped onto the page from the reading side, then settles
      tl.fromTo(p, { autoAlpha: 0, xPercent: e.CALM ? 6 : 34 * e.DIR, yPercent: e.CALM ? 0 : -8, rotate: e.CALM ? 0 : 5 * e.DIR, scale: 1.06 },
        { autoAlpha: 1, xPercent: 0, yPercent: 0, rotate: 0, scale: 1, duration: 1, ease: 'power3.out' }, i * 1.15)
    })
    tl.to({}, { duration: 1.4 }) // a beat with the whole page drawn
  })

  return (
    <section id="services" className={`h-svcsec${engine?.REDUCE ? ' h-svcsec--still' : ''}`} aria-labelledby="h-svc-h">
      <div className="h-svcsec__intro">
        <h2 id="h-svc-h" className="h-narr h-narr--title">מה אנחנו עושים, בשישה ריבועים</h2>{/* [קופי: נתי] */}
      </div>
      <div className="h-hold" ref={holdRef}>
        <div className="h-stage">
          <div className="h-grid">
            {SERVICES.map((s, i) => (
              <article className="h-svc" key={s.id}>
                <p className="h-narr h-narr--corner"><b>{s.title}</b></p>
                <div className="h-svc__art"><ServiceArt service={s} size={210} /></div>
                <p className="h-bubble">{BUBBLES[i]}</p>
                <p className="h-svc__line">{s.line} <a href={`/services/${s.slug}`}>לפרטים</a></p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
