// Direction A · חדר העריכה (the edit suite). Dev-only style board.
// The page behaves like an editing timeline: a timecode ruler tracks the scroll, the hero
// video plays in the program monitor, and the services hold scrubs a playhead across six
// clips while the monitor hard-cuts between them.

import { useRef, useState, type ReactNode } from 'react'
import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, STRIP, STATE_LABEL, HeroMedia, ServiceArt, BoardNav, useButtonMachine, useDocBackground, type BtnState, type BtnForce } from './shared'
import './fonts.css'
import './board-a.css'

const FPS = 25

/** HH:MM:SS:FF from seconds */
function tc(seconds: number) {
  const f = Math.floor((seconds % 1) * FPS)
  const s = Math.floor(seconds) % 60
  const m = Math.floor(seconds / 60) % 60
  const h = 1 + Math.floor(seconds / 3600) // programmes start at 01:00:00:00
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`
}

/* ───────────────────────── the cut button ───────────────────────── */

interface CutProps {
  href?: string
  state?: BtnState
  force?: BtnForce
  size?: 'sm' | 'lg'
  onClick?: () => void
  children: ReactNode
}

/** Rest: one clip. Hover: a playhead follows the pointer and the played part darkens.
    Press: a razor cut at the playhead splits the clip. All contained in the element. */
export function CutButton({ href, state = 'idle', force, size = 'lg', onClick, children }: CutProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const [pressed, setPressed] = useState(false)
  const setCut = (clientX: number) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--cut', `${Math.max(6, Math.min(r.width - 6, clientX - r.left))}px`)
  }
  const label = state === 'idle' ? children : STATE_LABEL[state]
  const icon = state === 'sent' ? <span className="cut__mark" aria-hidden="true">✓</span> : null
  const shared = {
    ref,
    className: 'cut',
    'data-state': state,
    'data-force': force,
    'data-size': size,
    'data-pressed': pressed || force === 'pressed' ? '' : undefined,
    onPointerEnter: (e: React.PointerEvent) => setCut(e.clientX),
    onPointerMove: (e: React.PointerEvent) => setCut(e.clientX),
    onPointerDown: (e: React.PointerEvent) => { setCut(e.clientX); setPressed(true) },
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => { setPressed(false); ref.current?.style.removeProperty('--cut') },
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') setPressed(true) },
    onKeyUp: () => setPressed(false),
    onBlur: () => setPressed(false),
    onClick,
  }
  const inner = (
    <>
      <span className="cut__half cut__half--start" aria-hidden="true">{icon}{label}</span>
      <span className="cut__half cut__half--end" aria-hidden="true">{icon}{label}</span>
      <span className="cut__head" aria-hidden="true" />
      <span className="sr-only" aria-live="polite">{label}</span>
    </>
  )
  return href ? <a href={href} {...shared}>{inner}</a> : <button type="button" {...shared}>{inner}</button>
}

/* ───────────────────────── page ───────────────────────── */

export default function BoardA() {
  useDocBackground('#18191B')
  const engine = useMotionEngine()

  // The page ruler: playhead and timecode follow the whole page's scroll
  const rulerRef = useScene<HTMLDivElement>((e, root) => {
    const code = root.querySelector<HTMLElement>('[data-tc]')
    const st = e.ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        root.style.setProperty('--p', self.progress.toFixed(4))
        if (code) code.textContent = tc(self.scroll() / 160)
      },
    })
    return () => st.kill()
  })

  return (
    <div className="bd-a" dir="rtl" lang="he">
      <header className="a-head">
        <a href="/board/a" className="a-head__logo" aria-label="MediaWave">
          <img src="/logo-lockup-white.svg" alt="MediaWave" width="150" height="30" />
        </a>
        <nav className="a-head__nav" aria-label="ראשי">
          {NAV.map((n) => <a key={n} href="#services">{n}</a>)}
        </nav>
        <CutButton href="#lab" size="sm">{HERO.headerCta}</CutButton>
      </header>

      <div className="a-ruler" ref={rulerRef} aria-hidden="true">
        <span className="a-ruler__tc" dir="ltr"><b>TC</b> <span data-tc>01:00:00:00</span></span>
        <div className="a-ruler__track"><span className="a-ruler__head" /></div>
      </div>

      <main>
        <section className="a-hero" aria-label="ראשי">
          <div className="a-hero__copy">
            <h1 className="a-hero__title">
              <span>{HERO.line1}</span>
              <span>{HERO.line2}</span>
            </h1>
            <p className="a-hero__sub">{HERO.sub}</p>
            <CutButton href="#lab">{HERO.cta}</CutButton>
          </div>

          <figure className="a-monitor" aria-hidden="true">
            <div className="a-monitor__bar" dir="ltr">
              <span className="a-chip">PGM</span>
              <span className="a-monitor__name">mediawave_open.mp4</span>
              <span className="a-rec"><i />REC</span>
            </div>
            <div className="a-monitor__screen">
              <HeroMedia className="a-monitor__media" />
              <span className="a-safe" />
            </div>
          </figure>

          <ol className="a-minitrack" aria-label="השירותים על ציר הזמן">
            {SERVICES.map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => {
                  const st = engine?.ScrollTrigger.getById('a-svc')
                  if (st && engine) engine.scrollTo(st.start + (st.end - st.start) * ((i + 0.5) / SERVICES.length))
                  else document.getElementById('services')?.scrollIntoView()
                }}>{s.title}</button>
              </li>
            ))}
          </ol>
        </section>

        <ServicesHold />
        <ButtonLab />
      </main>
      <BoardNav />
    </div>
  )
}

/* ───────────── signature: the services hold scrubs six clips ───────────── */

function ServicesHold() {
  const engine = useMotionEngine()
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    const stage = root.querySelector<HTMLElement>('.a-svc__stage')!
    const clock = root.querySelector<HTMLElement>('[data-clock]')
    const n = SERVICES.length
    let last = -1
    const tl = e.holdTimeline(root, {
      id: 'a-svc',
      scrub: e.CALM ? true : 0.5,
      onUpdate: (self) => {
        const p = self.progress
        stage.style.setProperty('--p', p.toFixed(4))
        // A hard cut: the monitor switches the moment the playhead crosses a clip edge
        const i = Math.min(n - 1, Math.floor(p * n))
        if (i !== last) { stage.dataset.active = String(i); last = i }
        if (clock) clock.textContent = tc(p * n * 4)
      },
    })
    tl.to({}, { duration: 1 }) // the hold's length is the wrapper; the timeline only reads it
  })

  if (engine?.REDUCE) return <ContactSheet />

  return (
    <section id="services" className="a-svc" aria-labelledby="a-svc-h">
      <div className="a-svc__intro">
        <h2 id="a-svc-h">מה אנחנו עושים</h2>
        <p>שישה דברים, כל אחד קליפ על הציר. גוללים והסמן עובר ביניהם.</p>{/* [קופי: נתי] */}
      </div>
      <div className="a-svc__hold" ref={holdRef}>
        <div className="a-svc__stage" data-active="0">
          <figure className="a-svc__monitor" aria-hidden="true">
            <div className="a-monitor__bar" dir="ltr">
              <span className="a-chip">PGM</span>
              <span className="a-monitor__name" data-clock>01:00:00:00</span>
              <span className="a-rec"><i />REC</span>
            </div>
            <div className="a-svc__screen">
              {SERVICES.map((s, i) => (
                <div className="a-svc__shot" data-i={i} key={s.id}><ServiceArt service={s} size={300} /></div>
              ))}
              <span className="a-safe" />
            </div>
          </figure>

          <div className="a-svc__copy">
            {SERVICES.map((s, i) => (
              <div className="a-svc__item" data-i={i} key={s.id}>
                <h3>{s.title}</h3>
                <p>{s.line}</p>
                <a href={`/services/${s.slug}`}>לפרטים</a>
              </div>
            ))}
          </div>

          <div className="a-svc__timeline" aria-hidden="true">
            <div className="a-svc__ticks" />
            <div className="a-svc__clips">
              {SERVICES.map((s, i) => (
                <span className="a-svc__clip" data-i={i} key={s.id}><b>{s.title}</b></span>
              ))}
              <span className="a-svc__head" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Reduced motion: the hold's last frame is a contact sheet of all six clips. */
function ContactSheet() {
  return (
    <section id="services" className="a-svc a-svc--sheet" aria-labelledby="a-svc-h">
      <div className="a-svc__intro"><h2 id="a-svc-h">מה אנחנו עושים</h2></div>
      <ul className="a-sheet">
        {SERVICES.map((s) => (
          <li key={s.id}>
            <div className="a-sheet__screen"><ServiceArt service={s} size={180} /></div>
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
    <section id="lab" className="a-lab" aria-labelledby="a-lab-h">
      <h2 id="a-lab-h">הכפתור: חיתוך</h2>
      <p className="a-lab__note">ריחוף: סמן הניגון עוקב אחרי העכבר. לחיצה: חיתוך במקום הסמן. בטלפון יש רק את הלחיצה.</p>
      <div className="a-lab__live">
        <CutButton state={m.state} onClick={() => m.state === 'idle' && m.run()}>{HERO.cta}</CutButton>
        <button type="button" className="a-lab__fail" onClick={() => m.run(true)}>להדגים שגיאה</button>
      </div>
      <ul className="a-lab__strip">
        {STRIP.map((s) => (
          <li key={s.label}>
            <CutButton state={s.state} force={s.force}>{HERO.cta}</CutButton>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
