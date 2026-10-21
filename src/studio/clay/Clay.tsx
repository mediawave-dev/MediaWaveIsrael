// "חימר" (after Léo Parpeix): a soft clay room in morning light, a yellow pill on the pointer that asks for
// one click to start the sound, then a light paper page that rises over the room with huge condensed dark
// green type, a little creature on the headline, and the work on devices in front of giant letters.
// Ours: the creature in the room is a clay cassette whose reels are its eyes; the click plays the tape.
import { useEffect, useRef, useState } from 'react'
import { C, CLIPS } from '../content'
import { waForStyle } from '../lead'
import type { StyleProps } from '../registry'
import LeadForm from '../LeadForm'
import { finePointer } from '../motion'
import Pill from './Pill'
import type { Tape } from './tape'
import '../../look/shot/shot-fonts.css'
import './clay.css'

export const prepare = () => Promise.all([document.fonts.load('700 80px "MW Noto"', 'אבג'), document.fonts.load('600 16px "MW Text"', 'אבג')])

const PRERENDER = typeof window !== 'undefined' && !!(window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__
/** the headline's second line flips through the crafts when the reel is fed [קופי: נתי] */
const FLIP = ['אתרים', 'דפי נחיתה', 'וידאו', 'קלטות']
const GROUNDS = ['peach', 'green', 'yellow', 'stone']

/** The sound button: four bars, dots when off, a wave when on (their equaliser). */
function Eq({ on, onToggle, level }: { on: boolean; onToggle: () => void; level: () => number }) {
  const bars = useRef<HTMLSpanElement[]>([])
  useEffect(() => {
    let raf = 0
    let amt = 0
    const tick = (t: number) => {
      amt += ((on ? 1 : 0) - amt) * 0.08
      const lv = on ? 0.4 + level() * 0.9 : 0
      bars.current.forEach((b, i) => { if (b) b.style.transform = `scaleY(${(((Math.sin(t * 0.005 + i) + 1) / 2) * amt * (0.6 + lv) + 0.1).toFixed(3)})` })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, level])
  return (
    <button type="button" className="cl-eq" aria-pressed={on} aria-label={on ? 'השתקת הצליל' : 'הפעלת הצליל'} onClick={onToggle}>
      {[0, 1, 2, 3].map((i) => <span key={i} ref={(el) => { if (el) bars.current[i] = el }} />)}
    </button>
  )
}

/** The little reel that wanders along the headline; feed it (click) and the words change for a moment. */
function Reel({ onFeed }: { onFeed: () => void }) {
  const el = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const b = el.current
    if (!b) return
    let x = 0.2, y = 0, tx = 0.7, ty = 0, raf = 0, next = 0, a = 0
    const tick = (t: number) => {
      if (t > next) { tx = 0.05 + Math.random() * 0.9; ty = -0.3 + Math.random() * 0.6; next = t + 1800 + Math.random() * 1600 }
      x += (tx - x) * 0.018
      y += (ty - y) * 0.03
      a += (tx > x ? 1 : -1) * 4
      b.style.left = `${(x * 100).toFixed(2)}%`
      b.style.transform = `translate(-50%, ${(y * 40 + Math.sin(t / 260) * 5).toFixed(1)}px) rotate(${a}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <button type="button" className="cl-reel" ref={el} onClick={onFeed} aria-label="החליפו את המילים בכותרת" data-pill="האכילו אותי">
      <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" /><circle className="h" cx="20" cy="20" r="5" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} className="t" x="18.5" y="6" width="3" height="6" rx="1.5" transform={`rotate(${i * 60} 20 20)`} />)}</svg>
    </button>
  )
}

export default function Clay({ tier, def }: StyleProps) {
  const hero = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const room = useRef<{ setPlaying: (on: boolean) => void } | null>(null)
  const tape = useRef<Tape | null>(null)
  const [sound, setSound] = useState(false)
  const [asked, setAsked] = useState(false)
  const [pill, setPill] = useState<string | null>(null)
  const [flip, setFlip] = useState<number | null>(null)
  const [live, setLive] = useState(false)
  const fine = typeof window !== 'undefined' && finePointer()

  useEffect(() => {
    if (PRERENDER || !canvas.current || !hero.current) return
    let alive = true
    let stop = () => {}
    import('./room').then(({ startRoom }) => {
      if (!alive || !canvas.current || !hero.current) return
      try { const r = startRoom(canvas.current, hero.current, tier); room.current = r; stop = r.stop; setLive(true) } catch { /* the CSS room stays */ }
    })
    return () => { alive = false; stop() }
  }, [tier])

  const toggle = async (on: boolean) => {
    setAsked(true)
    if (!tape.current) { const { createTape } = await import('./tape'); tape.current = createTape() }
    tape.current.setOn(on)
    room.current?.setPlaying(on)
    setSound(on)
  }
  // the first click anywhere plays the tape (their first click enables the sound), never by itself
  useEffect(() => {
    if (asked || PRERENDER) return
    const first = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.('a, button, input, textarea, summary, .st-pick, label')) return
      void toggle(true)
    }
    document.documentElement.classList.add('cl-asking')
    window.addEventListener('click', first)
    return () => { window.removeEventListener('click', first); document.documentElement.classList.remove('cl-asking') }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asked])
  useEffect(() => () => tape.current?.dispose(), [])

  // the pill speaks over whatever answers to it (data-pill)
  useEffect(() => {
    const over = (e: PointerEvent) => setPill((e.target as Element)?.closest?.('[data-pill]')?.getAttribute('data-pill') ?? null)
    window.addEventListener('pointerover', over, { passive: true })
    return () => window.removeEventListener('pointerover', over)
  }, [])

  // headline lines rise from below with a little sideways swing, alternating (their reveal, 1 s, .115 stagger)
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el || PRERENDER || tier === 'still') return
    const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) x.target.classList.add('is-in') }), { threshold: 0.2 })
    el.querySelectorAll('[data-cl]').forEach((n) => { n.classList.add('cl-rise'); io.observe(n) })
    return () => io.disconnect()
  }, [tier])

  // clips play only while on screen; the room's words fade as the paper rises (20% to 45% of the hero)
  useEffect(() => {
    const el = root.current
    const h = hero.current
    if (!el || !h || PRERENDER) return
    const io = new IntersectionObserver((es) => es.forEach((x) => {
      const v = x.target as HTMLVideoElement
      if (x.isIntersecting && tier !== 'still') void v.play().catch(() => {})
      else v.pause()
    }), { rootMargin: '80px' })
    el.querySelectorAll('video').forEach((v) => io.observe(v))
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = h.getBoundingClientRect()
        const k = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)))
        h.style.setProperty('--cl-fg', String(1 - Math.min(1, Math.max(0, (k - 0.08) / 0.17))))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [tier])

  const feed = () => {
    if (flip !== null) return
    let i = 0
    setFlip(0)
    const id = window.setInterval(() => { i += 1; if (i >= FLIP.length) { clearInterval(id); window.setTimeout(() => setFlip(null), 1100) } else setFlip(i) }, 650)
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(C.contact.email); setPill('הועתק') } catch { /* the mailto link still works */ }
  }

  const askLine: [string, string] = fine ? ['לחצו', 'כדי לנגן את הקלטת'] : ['הקישו', 'כדי לנגן את הקלטת']
  return (
    <div className="cl" ref={root} data-live={live || undefined}>
      {fine && tier !== 'still' && <Pill text={pill} line={!asked && !pill ? askLine : undefined} />}
      <Eq on={sound} onToggle={() => void toggle(!sound)} level={() => tape.current?.level() ?? 0} />

      <section className="cl-hero" data-ch="hero" ref={hero} aria-labelledby="cl-h1">
        <div className="cl-room">
          <canvas className="cl-canvas" ref={canvas} aria-hidden="true" />
          <div className="cl-room__fg">
            <p className="cl-room__line">{C.hero.sub}<br />{C.hero.sub2}</p>
            <p className="cl-room__scroll" aria-hidden="true">( גללו )</p>
            {!fine && !asked && (
              <button type="button" className="cl-tap" onClick={() => void toggle(true)}>{askLine[0]}<i />{askLine[1]}</button>
            )}
          </div>
        </div>
        <div className="cl-paper cl-intro">
          <h1 id="cl-h1" className="cl-h1">
            <span className="cl-ln" data-cl><span>{C.hero.line1}</span></span>
            <span className="cl-ln" data-cl data-flip={flip !== null || undefined}><span key={flip ?? 'base'}>{flip === null ? C.hero.line2 : FLIP[flip]}</span></span>
            <Reel onFeed={feed} />
          </h1>
          <div className="cl-intro__row">
            <p className="cl-hello" data-cl>{C.hero.sub} {C.hero.sub2}</p>
            <div className="cl-intro__side" data-cl>
              <p>מדברים ישירות עם המפתח, בלי מתווכים.</p>
              <a className="cl-btn" href={waForStyle(def)} target="_blank" rel="noopener noreferrer" data-pill="וואטסאפ">{C.hero.cta}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="cl-paper cl-svc" data-ch="services" aria-labelledby="cl-svc-t">
        <h2 id="cl-svc-t" className="cl-h2" data-cl><span>{C.services.title}</span></h2>
        <ul className="cl-cards">
          {C.services.items.map((s, i) => (
            <li key={s.id} className="cl-card" data-g={GROUNDS[i % GROUNDS.length]} data-cl>
              <a href={s.href} data-pill="צפייה">
                <span className="cl-card__stage">
                  <span className="cl-card__letter" aria-hidden="true">{s.title.charAt(0)}</span>
                  <span className={i % 3 === 1 ? 'cl-dev cl-dev--phone' : 'cl-dev'}>
                    <video src={`${CLIPS[s.id]}-m.mp4`} poster={`${CLIPS[s.id]}-poster-m.webp`} muted loop playsInline preload="none" aria-hidden="true" />
                  </span>
                </span>
                <span className="cl-card__row">
                  <span className="cl-card__n" aria-hidden="true">0{i + 1}</span>
                  <span className="cl-card__t">{s.title}</span>
                  <span className="cl-card__l">{s.line}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="cl-paper cl-work" data-ch="work" aria-labelledby="cl-work-t">
        <a className="cl-feature" href={C.work.href} data-pill="צפייה">
          <span className="cl-feature__letter" aria-hidden="true">ז</span>
          <span className="cl-dev cl-dev--wide"><video src="/media/svc-memories-2.mp4" poster="/media/svc-memories-2-poster.webp" muted loop playsInline preload="none" aria-hidden="true" /></span>
        </a>
        <div className="cl-work__row" data-cl>
          <p className="cl-k">{C.work.title}</p>
          <h2 id="cl-work-t" className="cl-h3">{C.work.name}</h2>
          <p className="cl-p">{C.work.line}</p>
        </div>
      </section>

      <section className="cl-paper cl-proc" data-ch="process" aria-labelledby="cl-proc-t">
        <h2 id="cl-proc-t" className="cl-h2" data-cl><span>{C.process.title}</span></h2>
        <ol className="cl-steps">
          {C.process.steps.map((s, i) => (
            <li key={s.id} className="cl-step" data-cl>
              <span className="cl-step__n" aria-hidden="true">0{i + 1}</span>
              <h3 className="cl-step__t">{s.title}</h3>
              <p className="cl-p">{s.line}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="cl-paper cl-faq" data-ch="faq" aria-labelledby="cl-faq-t">
        <h2 id="cl-faq-t" className="cl-h2" data-cl><span>{C.faq.title}</span></h2>
        <div className="cl-qs">
          {C.faq.items.map((f) => (
            <details key={f.id} className="cl-q">
              <summary data-pill="פתיחה">{f.q}</summary>
              <p className="cl-p">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cl-paper cl-contact" data-ch="contact" aria-labelledby="cl-contact-t">
        <h2 id="cl-contact-t" className="cl-h2" data-cl><span>{C.contact.title}</span></h2>
        <p className="cl-p">{C.contact.lead}</p>
        <LeadForm def={def} className="cl-form" />
        <div className="cl-alt">
          <button type="button" className="cl-copy" onClick={() => void copy()} data-pill="העתקה" aria-label={`העתקת הכתובת ${C.contact.email}`}><span dir="ltr">{C.contact.email}</span></button>
          <a href={`tel:${C.contact.phone}`} dir="ltr" data-pill="חיוג">{C.contact.phone}</a>
        </div>
      </section>
    </div>
  )
}
