// Direction E · יום ולילה (day to night). Dev-only style board. direction-bank.md D-10.
// The page is lit by the time of day. Scrolling moves the sun: the sky behind everything
// goes from dawn to noon to a golden afternoon, dusk and night, the hero video of the desk
// is graded to match, and at night a desk lamp comes on. In the services hold, the light
// from a window travels across the wall and lights one service at a time.

import { useState, type ReactNode } from 'react'
import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, STRIP, STATE_LABEL, HeroMedia, ServiceArt, BoardNav, useButtonMachine, useDocBackground, type BtnState, type BtnForce } from './shared'
import './fonts.css'
import './board-e.css'

/** The day as keyframes over the whole page's scroll. Luminance passes the text-flip band
    (0.17 to 0.24) inside 3% of the scroll, so text stays readable on both sides of it. */
const DAY = [
  { at: 0.0, sky: [234, 219, 208], hour: 7.0, f: [0.3, 1.0, 0.9, 0] },
  { at: 0.3, sky: [245, 244, 239], hour: 12.0, f: [0.0, 1.05, 1.0, 0] },
  { at: 0.58, sky: [236, 190, 140], hour: 17.0, f: [0.45, 0.95, 1.25, -8] },
  { at: 0.68, sky: [201, 142, 114], hour: 18.3, f: [0.4, 0.78, 1.05, -6] },
  { at: 0.71, sky: [122, 78, 92], hour: 19.0, f: [0.35, 0.6, 0.9, 0] },
  { at: 0.8, sky: [75, 51, 70], hour: 20.5, f: [0.3, 0.42, 0.8, 0] },
  { at: 1.0, sky: [18, 22, 32], hour: 23.5, f: [0.2, 0.32, 0.7, 0] },
] as const

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
function sample(p: number) {
  let k = 0
  while (k < DAY.length - 2 && p > DAY[k + 1].at) k++
  const A = DAY[k], B = DAY[k + 1]
  const t = Math.min(1, Math.max(0, (p - A.at) / (B.at - A.at)))
  const sky = A.sky.map((v, i) => Math.round(lerp(v, B.sky[i], t)))
  const f = A.f.map((v, i) => lerp(v, B.f[i], t))
  return { sky, f, hour: lerp(A.hour, B.hour, t) }
}
const lum = ([r, g, b]: number[]) => {
  const c = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b)
}
const clock = (h: number) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')}`

/* ───────────────────────── the window-light button ───────────────────────── */

interface LiteProps { href?: string; state?: BtnState; force?: BtnForce; size?: 'sm' | 'lg'; onClick?: () => void; children: ReactNode }

/** Rest: a thin outline. Hover: a patch of window light slides in from the reading side.
    Press: the light fills the whole button. */
export function LiteButton({ href, state = 'idle', force, size = 'lg', onClick, children }: LiteProps) {
  const [pressed, setPressed] = useState(false)
  const label = state === 'idle' ? children : STATE_LABEL[state]
  const shared = {
    className: 'lite',
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
  const inner = <span className="lite__label" aria-live="polite">{state === 'sent' && <span aria-hidden="true">✓ </span>}{label}</span>
  return href ? <a href={href} {...shared}>{inner}</a> : <button type="button" {...shared}>{inner}</button>
}

/* ───────────────────────── page ───────────────────────── */

export default function BoardE() {
  useDocBackground('#F5F4EF')

  // The whole page is one day: sky, text mode, the video's grade, the lamp and the clock
  const rootRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const sky = root.querySelector<HTMLElement>('.e-sky')!
    const media = root.querySelector<HTMLElement>('.e-film__grade')
    const lamp = root.querySelector<HTMLElement>('.e-film__lamp')
    const time = root.querySelector<HTMLElement>('[data-clock]')
    const sun = root.querySelector<HTMLElement>('.e-sun i')
    let dark: boolean | null = null
    const paint = (p: number) => {
      const s = sample(p)
      sky.style.backgroundColor = `rgb(${s.sky.join(',')})`
      document.documentElement.style.background = `rgb(${s.sky.join(',')})`
      const isDark = lum(s.sky) < 0.2
      if (isDark !== dark) { dark = isDark; root.toggleAttribute('data-dark', isDark) }
      if (media) media.style.filter = `sepia(${s.f[0].toFixed(2)}) brightness(${s.f[1].toFixed(2)}) saturate(${s.f[2].toFixed(2)}) hue-rotate(${s.f[3].toFixed(1)}deg)`
      if (lamp) lamp.style.opacity = Math.max(0, (p - 0.74) / 0.26).toFixed(3)
      if (time) time.textContent = clock(s.hour)
      // the sun climbs and sets along the arc; after dusk it is the moon
      if (sun) sun.style.transform = `rotate(${(90 - Math.min(1, p / 0.74) * 180).toFixed(1)}deg)`
    }
    const st = e.ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => paint(self.progress), onRefresh: (self) => paint(self.progress) })
    return () => st.kill()
  })

  return (
    <div className="bd-e" dir="rtl" lang="he" ref={rootRef}>
      <div className="e-sky" aria-hidden="true" />
      <header className="e-head">
        <a href="/board/e" className="e-head__logo" aria-label="MediaWave">
          <img className="e-logo-ink" src="/logo-lockup-ink.svg" alt="MediaWave" width="150" height="30" />
          <img className="e-logo-white" src="/logo-lockup-white.svg" alt="" aria-hidden="true" width="150" height="30" />
        </a>
        <nav className="e-head__nav" aria-label="ראשי">
          {NAV.map((n) => <a key={n} href="#services">{n}</a>)}
        </nav>
        <LiteButton href="#lab" size="sm">{HERO.headerCta}</LiteButton>
      </header>

      <p className="e-clock" aria-hidden="true">
        <span className="e-sun"><i /></span>
        <span data-clock dir="ltr">12:00</span>
      </p>

      <main>
        <section className="e-hero" aria-label="ראשי">
          <h1 className="e-hero__title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1>
          <div className="e-hero__aside">
            <p className="e-hero__sub">{HERO.sub}</p>
            <LiteButton href="#lab">{HERO.cta}</LiteButton>
          </div>
          <figure className="e-film" aria-hidden="true">
            <div className="e-film__grade"><HeroMedia className="e-film__media" /></div>
            <span className="e-film__lamp" />
          </figure>
        </section>

        <WindowLight />
        <ButtonLab />
      </main>
      <BoardNav tone="light" />
    </div>
  )
}

/* ───────────── signature: window light across the wall ───────────── */

function WindowLight() {
  const engine = useMotionEngine()
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const stage = root.querySelector<HTMLElement>('.e-wall__stage')!
    const n = SERVICES.length
    let last = -1
    const tl = e.holdTimeline(root, {
      id: 'e-wall',
      scrub: e.CALM ? true : 0.5,
      onUpdate: (self) => {
        const p = self.progress
        // the patch enters from the reading side and leaves on the far side; long and slanted
        // in the morning, upright at noon, long the other way in the evening
        stage.style.setProperty('--x', `${(8 + p * 84).toFixed(2)}%`)
        stage.style.setProperty('--skew', `${(-26 + p * 52).toFixed(1)}deg`)
        const i = Math.min(n - 1, Math.floor(p * n))
        if (i !== last) { stage.dataset.active = String(i); last = i }
      },
    })
    tl.to({}, { duration: 1 })
  })

  return (
    <section id="services" className={`e-wall${engine?.REDUCE ? ' e-wall--still' : ''}`} aria-labelledby="e-wall-h">
      <div className="e-wall__intro">
        <h2 id="e-wall-h">מה אנחנו עושים</h2>
        <p>יום עבודה אחד ליד השולחן. האור עובר על הקיר ומאיר כל פעם דבר אחר.</p>{/* [קופי: נתי] */}
      </div>
      <div className="e-wall__hold" ref={holdRef}>
        <div className="e-wall__stage" data-active="0">
          <div className="e-patch" aria-hidden="true" />
          {SERVICES.map((s, i) => (
            <article className="e-lit" data-i={i} key={s.id}>
              <div className="e-lit__art"><ServiceArt service={s} size={250} /></div>
              <div className="e-lit__text">
                <h3>{s.title}</h3>
                <p>{s.line}</p>
                <a href={`/services/${s.slug}`}>לפרטים</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── button lab ───────────────────────── */

function ButtonLab() {
  const m = useButtonMachine()
  return (
    <section id="lab" className="e-lab" aria-labelledby="e-lab-h">
      <h2 id="e-lab-h">הכפתור: אור מהחלון</h2>
      <p className="e-lab__note">ריחוף: כתם אור נכנס מצד הקריאה. לחיצה: האור ממלא את הכפתור. הכפתור משנה צבעים יחד עם שעת היום. בטלפון יש רק את הלחיצה.</p>
      <div className="e-lab__live">
        <LiteButton state={m.state} onClick={() => m.state === 'idle' && m.run()}>{HERO.cta}</LiteButton>
        <button type="button" className="e-lab__fail" onClick={() => m.run(true)}>להדגים שגיאה</button>
      </div>
      <ul className="e-lab__strip">
        {STRIP.map((s) => (
          <li key={s.label}>
            <LiteButton state={s.state} force={s.force}>{HERO.cta}</LiteButton>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
