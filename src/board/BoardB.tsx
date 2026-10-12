// Direction B · פוסטר עברי (the Hebrew poster). Dev-only style board.
// Type used as image: giant Hebrew words fill the width, every act is one flat field of
// colour, and at each act boundary the next field is pasted over the whole screen from the
// reading side, like a new poster over the old one. No cards: a strict grid, white discs
// for the Lotties.

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, STRIP, STATE_LABEL, HeroMedia, ServiceArt, BoardNav, useButtonMachine, useDocBackground, type BtnState, type BtnForce } from './shared'
import './fonts.css'
import './board-b.css'

type Field = 'saffron' | 'magenta' | 'green'
const ACT_FIELDS: Field[] = ['magenta', 'green', 'saffron', 'magenta', 'green', 'saffron']

/** The poster face is only requested once something uses it, so document.fonts.ready can
    resolve before it arrives; fitting against the fallback would size every line wrong. */
const posterFont = () => document.fonts.load("700 100px 'MW Poster'", 'העסק').catch(() => [])

/** Size each [data-fit] line so it fills its parent's width (type as image). */
function fitLines(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
    const box = el.parentElement!
    const max = Number(el.dataset.fit) || 1
    el.style.fontSize = '100px'
    const w = el.getBoundingClientRect().width
    const target = box.clientWidth * max
    if (w > 0) el.style.fontSize = `${Math.min(520, (100 * target) / w).toFixed(1)}px`
  })
}

/* ───────────────────────── the stamp button ───────────────────────── */

interface StampProps {
  href?: string
  state?: BtnState
  force?: BtnForce
  size?: 'sm' | 'lg'
  onClick?: () => void
  children: ReactNode
}

/** Rest: a solid ink block. Hover: the next colour floods in from the side the pointer
    entered. Press: the block sinks into the paper (a deboss). Everything stays inside it. */
export function StampButton({ href, state = 'idle', force, size = 'lg', onClick, children }: StampProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const [pressed, setPressed] = useState(false)
  const origin = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--ex', `${e.clientX - r.left}px`)
    el.style.setProperty('--ey', `${e.clientY - r.top}px`)
  }
  const label = state === 'idle' ? children : STATE_LABEL[state]
  const shared = {
    ref,
    className: 'stamp',
    'data-state': state,
    'data-force': force,
    'data-size': size,
    'data-pressed': pressed || force === 'pressed' ? '' : undefined,
    onPointerEnter: origin,
    onPointerLeave: (e: React.PointerEvent) => { origin(e); setPressed(false) },
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') setPressed(true) },
    onKeyUp: () => setPressed(false),
    onBlur: () => setPressed(false),
    onClick,
  }
  const inner = (
    <>
      <span className="stamp__flood" aria-hidden="true" />
      <span className="stamp__label" aria-live="polite">{state === 'sent' && <span aria-hidden="true">✓ </span>}{label}</span>
    </>
  )
  return href ? <a href={href} {...shared}>{inner}</a> : <button type="button" {...shared}>{inner}</button>
}

/* ───────────────────────── page ───────────────────────── */

export default function BoardB() {
  useDocBackground('#F5B700')
  const engine = useMotionEngine()
  const live = !!engine && !engine.REDUCE && !engine.PRERENDER

  const rootRef = useScene<HTMLDivElement>((e, root) => {
    const layers = [...root.querySelectorAll<HTMLElement>('.b-fields i')]
    let current: string | null = null
    let z = 1
    let timer = 0
    const apply = (f: string) => {
      if (f === current) return
      const first = current === null
      current = f
      const layer = layers.find((l) => l.dataset.f === f)
      if (!layer) return
      layer.style.zIndex = String(++z)
      // The paste: the new field sweeps in from the reading side over the old one
      e.gsap.fromTo(layer, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: first ? 0 : e.CALM ? 0.2 : 0.55, ease: 'power3.inOut', overwrite: true })
      clearTimeout(timer)
      timer = window.setTimeout(() => { root.dataset.field = f }, first ? 0 : e.CALM ? 80 : 230)
    }
    const pick = () => {
      const mid = innerHeight / 2
      for (const s of root.querySelectorAll<HTMLElement>('[data-field-section]')) {
        const r = s.getBoundingClientRect()
        if (r.top <= mid && r.bottom > mid) { apply(s.dataset.fieldSection!); return }
      }
    }
    const st = e.ScrollTrigger.create({ start: 0, end: 'max', onUpdate: pick, onRefresh: pick })

    // Giant words travel in the reading direction as their act passes
    const words = root.querySelectorAll<HTMLElement>('.b-act__word span')
    Promise.all([e.fontsReady, posterFont()]).then(() => {
      fitLines(root)
      e.ScrollTrigger.refresh()
    })
    words.forEach((w) => {
      e.gsap.fromTo(w, { xPercent: e.CALM ? 4 : 16 * e.DIR }, {
        xPercent: e.CALM ? -2 : -10 * e.DIR,
        ease: 'none',
        scrollTrigger: { trigger: w.closest('.b-act')!, start: 'top bottom', end: 'bottom top', scrub: e.CALM ? true : 0.6 },
      })
    })
    pick()
    return () => { st.kill(); clearTimeout(timer) }
  })

  // Without the engine (reduced, prerender) the lines still get fitted once
  useEffect(() => {
    if (live || !rootRef.current) return
    const root = rootRef.current
    posterFont().then(() => fitLines(root))
    const onResize = () => fitLines(root)
    addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [live, rootRef])
  useEffect(() => {
    if (!live || !rootRef.current) return
    const root = rootRef.current
    let w = innerWidth
    const onResize = () => { if (innerWidth !== w) { w = innerWidth; fitLines(root); engine?.ScrollTrigger.refresh() } }
    addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [live, rootRef, engine])

  return (
    <div className={`bd-b${live ? ' b-live' : ''}`} dir="rtl" lang="he" ref={rootRef} data-field="saffron">
      {live && (
        <div className="b-fields" aria-hidden="true">
          <i data-f="saffron" /><i data-f="magenta" /><i data-f="green" />
        </div>
      )}

      <header className="b-head">
        <a href="/board/b" className="b-head__logo" aria-label="MediaWave">
          <img className="b-logo-ink" src="/logo-lockup-ink.svg" alt="MediaWave" width="150" height="30" />
          <img className="b-logo-white" src="/logo-lockup-white.svg" alt="" aria-hidden="true" width="150" height="30" />
        </a>
        <nav className="b-head__nav" aria-label="ראשי">
          {NAV.map((n) => <a key={n} href="#services">{n}</a>)}
        </nav>
        <StampButton href="#lab" size="sm">{HERO.headerCta}</StampButton>
      </header>

      <main>
        <section className="b-hero" data-field-section="saffron" aria-label="ראשי">
          <div className="b-hero__copy">
            <h1 className="b-hero__title">
              <span className="b-line"><span data-fit="1">{HERO.line1}</span></span>
              <span className="b-line"><span data-fit="1">{HERO.line2}</span></span>
            </h1>
            <div className="b-hero__foot">
              <p className="b-hero__sub">{HERO.sub}</p>
              <StampButton href="#lab">{HERO.cta}</StampButton>
            </div>
          </div>
          <figure className="b-print" aria-hidden="true">
            <HeroMedia className="b-print__media" />
          </figure>
        </section>

        <section id="services" className="b-svc" aria-labelledby="b-svc-h">
          <header className="b-svc__intro" data-field-section="magenta">
            <h2 id="b-svc-h">מה אנחנו עושים</h2>
            <p>שישה שירותים. כל אחד פוסטר משלו.</p>{/* [קופי: נתי] */}
          </header>
          {SERVICES.map((s, i) => (
            <article className="b-act" key={s.id} data-field-section={ACT_FIELDS[i]}>
              <h3 className="b-act__word"><span data-fit="0.94">{s.title}</span></h3>
              <div className="b-act__text">
                <p>{s.line}</p>
                <a href={`/services/${s.slug}`}>לפרטים</a>
              </div>
              <div className="b-disc"><ServiceArt service={s} size={260} /></div>
            </article>
          ))}
        </section>

        <ButtonLab />
      </main>
      <BoardNav />
    </div>
  )
}

/* ───────────────────────── button lab ───────────────────────── */

function ButtonLab() {
  const m = useButtonMachine()
  return (
    <section id="lab" className="b-lab" data-field-section="saffron" aria-labelledby="b-lab-h">
      <h2 id="b-lab-h">הכפתור: חותמת</h2>
      <p className="b-lab__note">ריחוף: הצבע הבא מציף מהצד שממנו נכנס העכבר. לחיצה: הבלוק נלחץ לתוך הנייר. בטלפון יש רק את הלחיצה.</p>
      <div className="b-lab__live">
        <StampButton state={m.state} onClick={() => m.state === 'idle' && m.run()}>{HERO.cta}</StampButton>
        <button type="button" className="b-lab__fail" onClick={() => m.run(true)}>להדגים שגיאה</button>
      </div>
      <ul className="b-lab__strip">
        {STRIP.map((s) => (
          <li key={s.label}>
            <StampButton state={s.state} force={s.force}>{HERO.cta}</StampButton>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
