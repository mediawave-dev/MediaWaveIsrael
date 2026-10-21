// "זמזום" (after Buzz): an acid-yellow sheet under a fixed dot grid that turns pale blue as you read,
// one huge fuzzy headline (blur + noise displacement, the grain re-rolled every 0.4 s), and a swarm.
// Their bees are their logo; ours are chat bubbles with wings, the inquiries a site brings in. They fly
// in after the opening, dart across the screen in turn, flee the mouse, and gather at the form.
import { useEffect, useRef, useState } from 'react'
import '@fontsource/heebo/hebrew-400.css'
import '@fontsource/heebo/hebrew-700.css'
import '@fontsource/heebo/latin-400.css'
import '@fontsource/heebo/latin-700.css'
import { C, CLIPS } from '../content'
import { waForStyle } from '../lead'
import type { StyleProps } from '../registry'
import LeadForm from '../LeadForm'
import { finePointer } from '../motion'
import { createSwarm, placeStill } from './swarm'
import { useSideways } from '../sideways'
import './buzz.css'

export const prepare = () => Promise.all([document.fonts.load('700 80px Heebo', 'אבג'), document.fonts.load('400 20px Heebo', 'אבג')])

const PRERENDER = typeof window !== 'undefined' && !!(window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__
let OPENED = false

/** [קופי: נתי] the end lines are the site's own sentences */
const LINES = [`${C.hero.line1} ${C.hero.line2}`, C.hero.sub, C.hero.sub2, 'מדברים ישירות עם המפתח, בלי מתווכים.']

type Stage = 'mark' | 'word' | 'reveal' | 'done'

/** the scroll's wind: how fast the page moves (px/s, smoothed), so the escort streams against it */
let wind = 0
let windY = 0
let windT = 0
function trackWind() {
  const now = performance.now()
  const y = window.scrollY
  if (windT) wind = wind * 0.8 + (-(y - windY) / Math.max(0.008, (now - windT) / 1000)) * 0.2
  windY = y
  windT = now
}

function useSwarm(ref: React.RefObject<HTMLDivElement>, count: number, tier: StyleProps['tier'], delay: number, run: boolean, windy = false) {
  useEffect(() => {
    const host = ref.current
    if (!host || PRERENDER || !run) return
    const n = window.innerWidth < 640 ? Math.round(count / 2) : count
    if (tier === 'still') return placeStill(host, n)
    const sw = createSwarm(host, { count: n, pointer: finePointer() && tier === 'full', delay, wind: windy && tier === 'full' ? () => { wind *= 0.96; return Math.max(-2400, Math.min(2400, wind)) } : undefined })
    const io = new IntersectionObserver(([e]) => sw.pause(!e.isIntersecting), { rootMargin: '120px' })
    io.observe(host)
    return () => { io.disconnect(); sw.stop() }
  }, [ref, count, tier, delay, run, windy])
}

function Typer({ tier }: { tier: StyleProps['tier'] }) {
  const [text, setText] = useState(LINES[0])
  useEffect(() => {
    if (tier === 'still' || PRERENDER) return
    let line = 0
    let pos = LINES[0].length
    let mode: 'hold' | 'del' | 'type' = 'hold'
    let id = 0
    const tick = () => {
      const full = LINES[line]
      if (mode === 'hold') { mode = 'del'; id = window.setTimeout(tick, 1500); return }
      if (mode === 'del') {
        pos -= 1
        setText(full.slice(0, Math.max(0, pos)))
        if (pos <= 0) { mode = 'type'; line = (line + 1) % LINES.length; id = window.setTimeout(tick, 350); return }
        id = window.setTimeout(tick, 28); return
      }
      const next = LINES[line]
      pos += 1
      setText(next.slice(0, pos))
      if (pos >= next.length) mode = 'hold'
      id = window.setTimeout(tick, 55)
    }
    id = window.setTimeout(tick, 1500)
    return () => clearTimeout(id)
  }, [tier])
  return <p className="bz-typer" aria-hidden="true">{text}<span className="bz-caret" /></p>
}

export default function Buzz({ tier, def }: StyleProps) {
  const root = useRef<HTMLDivElement>(null)
  const back = useRef<HTMLDivElement>(null)
  const front = useRef<HTMLDivElement>(null)
  const formSw = useRef<HTMLDivElement>(null)
  const endSw = useRef<HTMLDivElement>(null)
  const escort = useRef<HTMLDivElement>(null)
  // the services ride across on an arc while the page scrolls (D195): the middle card rises, the others dip
  // and lean away, and the whole row leans into the scroll's speed
  const swWrap = useRef<HTMLDivElement>(null)
  const swTrack = useRef<HTMLUListElement>(null)
  useSideways(swWrap, swTrack, tier, {
    ease: 0.12,
    onFrame: ({ v, d }) => {
      const cards = swTrack.current?.querySelectorAll<HTMLElement>('.bz-card > a')
      cards?.forEach((a, i) => {
        const k = d[i] ?? 0
        const lean = Math.max(-10, Math.min(10, -k * 14 + v * 0.35))
        a.style.transform = `translate3d(0, ${(k * k * 140).toFixed(1)}px, 0) rotate(${lean.toFixed(2)}deg) scale(${(1 - Math.min(0.12, Math.abs(k) * 0.12)).toFixed(3)})`
        // the card in the middle plays its film
        const vid = a.querySelector('video')
        if (vid && tier === 'full') { if (Math.abs(k) < 0.22) { if (vid.paused) void vid.play().catch(() => {}) } else if (!vid.paused) vid.pause() }
      })
    },
  })
  const quick = OPENED
  const [stage, setStage] = useState<Stage>(PRERENDER || tier === 'still' ? 'done' : quick ? 'word' : 'mark')

  // the opening (their timings, from the bundle): the mark 1.76 s, the word in, the reveal at 2.71 s,
  // the bees at 3.51 s; a second visit in the same session starts at the word, twice as fast
  useEffect(() => {
    if (stage === 'done') return
    OPENED = true
    const k = quick ? 0.5 : 1
    const at = (s: Stage, ms: number) => window.setTimeout(() => setStage(s), ms * k)
    const ids = quick ? [at('reveal', 950 * 2 * 0.5), at('done', 1750 * 2 * 0.5)] : [at('word', 1760), at('reveal', 2710), at('done', 3510)]
    return () => ids.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // the word arrives in the middle of the screen, then slides to its place (their x tween, 0.8 s)
  useEffect(() => {
    const el = root.current
    const w = el?.querySelector<HTMLElement>('.bz-word')
    if (!el || !w || stage !== 'mark') return
    const r = w.getBoundingClientRect()
    el.style.setProperty('--bz-cx0', `${Math.round(window.innerWidth / 2 - (r.left + r.width / 2))}px`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bees = stage === 'done'
  useSwarm(back, 44, tier, 0, bees)
  useSwarm(front, 50, tier, 120, bees)
  useSwarm(formSw, 14, tier, 0, bees)
  useSwarm(endSw, 52, tier, 0, bees)
  // the escort (D191): a few bubbles travel down the page with the visitor and stream against the scroll
  useSwarm(escort, 16, tier, 600, bees, true)
  useEffect(() => {
    const on = () => trackWind()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // the fuzz: fully soft while the word arrives, then 60% (their 16/24 to 9.6/14.4, scaled to our size)
  useEffect(() => {
    const el = root.current
    const word = el?.querySelector<HTMLElement>('.bz-word')
    const blur = el?.querySelector('.bz-blur')
    const disp = el?.querySelector('.bz-disp')
    if (!el || !word || !blur || !disp) return
    const fs = parseFloat(getComputedStyle(word).fontSize) || 120
    const to = stage === 'mark' || stage === 'word' ? 1 : 0.32
    const from = Number(el.dataset.fz ?? (stage === 'done' ? 0.32 : 1))
    const set = (k: number) => {
      blur.setAttribute('stdDeviation', (fs * 0.075 * k).toFixed(2))
      disp.setAttribute('scale', (fs * 0.115 * k).toFixed(2))
      el.dataset.fz = String(k)
    }
    if (tier === 'still' || from === to) { set(to); return }
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const q = Math.min(1, (now - t0) / 800)
      const e = 1 - Math.pow(1 - q, 4)
      set(from + (to - from) * e)
      if (q < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stage, tier])

  // the sheet's colour follows the scroll: yellow, pale blue through the middle, yellow again at the end
  // (their fixed gradient, c(scrollY + 12vh) to c(scrollY + 88vh)); the hero lifts 44 px and fades
  useEffect(() => {
    const el = root.current
    if (!el || PRERENDER) return
    const Y = [215, 215, 46]
    const B = [215, 231, 246]
    let marks: { id: string; top: number; h: number }[] = []
    const measure = () => {
      marks = [...el.querySelectorAll<HTMLElement>('[data-ch]')].map((s) => { const r = s.getBoundingClientRect(); return { id: s.dataset.ch!, top: r.top + window.scrollY, h: r.height } })
    }
    const blueAt = (y: number) => {
      const m = (id: string) => marks.find((x) => x.id === id)
      const svc = m('services')
      const con = m('contact')
      if (!svc || !con) return 0
      const a = Math.min(1, Math.max(0, (y - svc.top - svc.h * 0.05) / (svc.h * 0.87)))
      const b = Math.min(1, Math.max(0, (y - con.top - con.h * 0.08) / (con.h * 0.3)))
      return a * (1 - b)
    }
    const mix = (k: number) => Y.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')
    let raf = 0
    const paint = () => {
      raf = 0
      const y = window.scrollY
      const vh = window.innerHeight
      el.style.setProperty('--bz-top', `rgb(${mix(blueAt(y + vh * 0.12))})`)
      el.style.setProperty('--bz-bot', `rgb(${mix(blueAt(y + vh * 0.88))})`)
      const hero = Math.min(1, y / (vh * 0.9))
      el.style.setProperty('--bz-hero', String(hero))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint) }
    measure(); paint()
    const ro = new ResizeObserver(() => { measure(); paint() })
    ro.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { ro.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // every block rises in when it comes into view, and again each time (their whileInView, once: false)
  useEffect(() => {
    const el = root.current
    if (!el || PRERENDER || tier === 'still') return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-in', e.isIntersecting)), { threshold: 0.25 })
    el.querySelectorAll('[data-bz]').forEach((n) => { n.classList.add('bz-rise'); io.observe(n) })
    return () => io.disconnect()
  }, [tier])

  // the grain re-rolls every 0.4 s on fine pointers (phones keep one seed, like their mobile)
  useEffect(() => {
    if (tier !== 'full' || PRERENDER || !finePointer()) return
    const seeds = [7, 19, 11, 25]
    let i = 0
    const id = window.setInterval(() => {
      i = (i + 1) % seeds.length
      root.current?.querySelectorAll('.bz-noise').forEach((n) => n.setAttribute('seed', String(seeds[i])))
    }, 400)
    return () => clearInterval(id)
  }, [tier])

  // the cursor: a 16 px white dot in difference blend, glued to the mouse (fine pointers only)
  const dot = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!finePointer() || tier === 'still' || PRERENDER) return
    const d = dot.current
    if (!d) return
    const move = (e: PointerEvent) => { d.style.transform = `translate3d(${e.clientX - 8}px, ${e.clientY - 8}px, 0)`; d.style.opacity = '1' }
    const over = (e: Event) => { d.dataset.hide = (e.target as Element)?.closest?.('input, textarea') ? '1' : '' }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over) }
  }, [tier])

  return (
    <div className="bz" ref={root} data-stage={stage}>
      <div className="bz-sheet" aria-hidden="true" />
      <svg className="bz-defs" aria-hidden="true" focusable="false">
        <filter id="bz-fuzz" x="-10%" y="-30%" width="120%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" className="bz-blur" result="b" />
          <feTurbulence className="bz-noise" type="fractalNoise" baseFrequency="0.68" numOctaves={4} seed={7} result="n" />
          <feDisplacementMap in="b" in2="n" scale={14} xChannelSelector="R" yChannelSelector="G" className="bz-disp" />
        </filter>
        <filter id="bz-fuzz-soft" x="-10%" y="-30%" width="120%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
          <feTurbulence className="bz-noise" type="fractalNoise" baseFrequency="0.68" numOctaves={4} seed={7} result="n" />
          <feDisplacementMap in="b" in2="n" scale={24} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <span className="bz-cursor" ref={dot} aria-hidden="true" />
      <div className="bz-swarm bz-swarm--escort" ref={escort} aria-hidden="true" />

      <section className="bz-hero" data-ch="hero" aria-labelledby="bz-h1">
        <div className="bz-swarm bz-swarm--back" ref={back} aria-hidden="true" />
        <div className="bz-openmark" aria-hidden="true">
          <svg viewBox="0 0 40 32"><g className="w"><ellipse cx="14" cy="8.5" rx="7.2" ry="4.6" transform="rotate(-24 14 8.5)" /><ellipse cx="26" cy="8.5" rx="7.2" ry="4.6" transform="rotate(24 26 8.5)" /></g><path className="b" d="M12.5 10.5h15a8.5 8.5 0 0 1 0 17h-13.2l-6.1 3.6 1.6-4.6a8.5 8.5 0 0 1 2.7-16z" /><g className="d"><circle cx="13.6" cy="19" r="2" /><circle cx="20" cy="19" r="2" /><circle cx="26.4" cy="19" r="2" /></g></svg>
        </div>
        <div className="bz-hero__in">
          <h1 id="bz-h1" className="bz-h1">
            <span className="bz-h1__lead">{C.hero.line1}</span>
            <span className="bz-word">{C.hero.line2}</span>
          </h1>
          {/* [קופי: נתי] the label: the studio's three crafts */}
          <p className="bz-label" dir="ltr">WEBSITES · VIDEO · TAPES</p>
          <div className="bz-tag">
            <p>{C.hero.sub} {C.hero.sub2}</p>
            <a className="bz-pill" href={waForStyle(def)} target="_blank" rel="noopener noreferrer">{C.hero.cta}</a>
          </div>
        </div>
        <div className="bz-swarm bz-swarm--front" ref={front} aria-hidden="true" />
        <span className="bz-down" aria-hidden="true" />
      </section>

      <section className="bz-sec bz-svc" data-ch="services" aria-labelledby="bz-svc-t">
        <div className="sw bz-sw" ref={swWrap}>
        <div className="sw__stage bz-sw__stage">
        <h2 id="bz-svc-t" className="bz-h2">{C.services.title}</h2>
        <p className="bz-p">{C.hero.sub}</p>
        <ul className="bz-cards" ref={swTrack}>
          {C.services.items.map((s, i) => (
            <li key={s.id} className="bz-card" style={{ ['--i' as string]: i }}>
              <a href={s.href}>
                <span className="bz-card__pic">
                  <video src={`${CLIPS[s.id]}-m.mp4`} poster={`${CLIPS[s.id]}-poster-m.webp`} muted loop playsInline preload="none" aria-hidden="true"
                    onMouseEnter={(e) => { void e.currentTarget.play().catch(() => {}) }} onMouseLeave={(e) => e.currentTarget.pause()} />
                </span>
                <span className="bz-card__t">{s.title}</span>
                <span className="bz-card__l">{s.line}</span>
              </a>
            </li>
          ))}
        </ul>
        </div>
        </div>
      </section>

      <section className="bz-sec bz-work" data-ch="work" aria-labelledby="bz-work-t">
        <h2 id="bz-work-t" className="bz-h2" data-bz>{C.work.name}</h2>
        <p className="bz-p" data-bz>{C.work.line}</p>
        <div className="bz-device" data-bz>
          <video src="/media/svc-memories-2.mp4" poster="/media/svc-memories-2-poster.webp" muted loop playsInline autoPlay preload="metadata" aria-hidden="true" />
        </div>
        <a className="bz-pill bz-pill--line" href={C.work.href} data-bz lang="en" aria-label={`${C.work.name} - צפייה`}>{C.work.linkLabel}</a>
      </section>

      <section className="bz-sec bz-proc" data-ch="process" aria-labelledby="bz-proc-t">
        <h2 id="bz-proc-t" className="bz-h2" data-bz>{C.process.title}</h2>
        <ol className="bz-steps">
          {C.process.steps.map((s, i) => (
            <li key={s.id} className="bz-step" data-bz style={{ ['--i' as string]: i }}>
              <span className="bz-step__n" aria-hidden="true">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.line}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bz-sec bz-faq" data-ch="faq" aria-labelledby="bz-faq-t">
        <h2 id="bz-faq-t" className="bz-h2" data-bz>{C.faq.title}</h2>
        <div className="bz-qs" data-bz>
          {C.faq.items.map((f) => (
            <details key={f.id} className="bz-q">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bz-sec bz-contact" data-ch="contact" aria-labelledby="bz-contact-t">
        <div className="bz-formbox">
          <h2 id="bz-contact-t" className="bz-h3" data-bz>{C.contact.title}</h2>
          <p className="bz-p" data-bz>{C.contact.lead}</p>
          <LeadForm def={def} className="bz-form" send="שליחה" />
          <div className="bz-swarm bz-swarm--form" ref={formSw} aria-hidden="true" />
        </div>
        <div className="bz-end">
          <Typer tier={tier} />
          <p className="bz-end__word" aria-hidden="true">פניות</p>
          <div className="bz-swarm bz-swarm--end" ref={endSw} aria-hidden="true" />
        </div>
      </section>
    </div>
  )
}
