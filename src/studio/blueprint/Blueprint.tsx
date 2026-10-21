// "שרטוט" (after Heron AI, Bearplus): one paper ground, graphite lines a pixel thick, one red with one
// meaning (here: what we check, and the way to act), modest heavy headlines, mono labels everywhere, and
// motion that is either scrubbed or 1:1. Their world is architecture; ours is the site itself: the hero
// is a technical drawing of a laptop, a phone and a cassette, the process is a page's plan being built.
import { useEffect, useRef, useState } from 'react'
import '@fontsource/ibm-plex-sans-hebrew/hebrew-600.css'
import '@fontsource/ibm-plex-sans-hebrew/hebrew-700.css'
import '@fontsource/ibm-plex-sans-hebrew/latin-600.css'
import '@fontsource/ibm-plex-sans-hebrew/latin-700.css'
import '@fontsource/geist-mono/latin-500.css'
import { useScene } from '../../motion/ScrollEngineProvider'
import { C, CLIPS } from '../content'
import { waForStyle } from '../lead'
import type { StyleProps } from '../registry'
import LeadForm from '../LeadForm'
import { finePointer } from '../motion'
import Drawing from './Drawing'
import Plan, { Steps } from './Plan'
import './blueprint.css'

export const prepare = () => Promise.all([document.fonts.load('700 40px "IBM Plex Sans Hebrew"', 'אבג'), document.fonts.load('500 12px "Geist Mono"', 'AB')])

const PRERENDER = typeof window !== 'undefined' && !!(window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__
let OPENED = false

/** [קופי: נתי] the loader's log and the sheet's metadata (facts from data/site.ts only) */
const LOG = ['LOAD SHEET', 'DRAW GRID', 'PLACE LAPTOP', 'CHECK 390 PX', 'CHECK SPEED', 'LINK WHATSAPP', 'READY']
const META: [string, string][] = [['STUDIO', 'MEDIAWAVE'], ['CRAFT', 'WEB · VIDEO · TAPES'], ['TEL', C.contact.phone], ['REPLY', '< 24H']]
const NAV = [['#bp-services', 'SERVICES'], ['#bp-work', 'WORK'], ['#bp-process', 'PROCESS'], ['#bp-faq', 'FAQ']]
const TICKER = ['FAST ON PHONES', 'LEADS TO WHATSAPP', 'FOUND ON GOOGLE', 'WEBSITES', 'VIDEO', 'TAPES']

function Loader({ onDone }: { onDone: () => void }) {
  const [pc, setPc] = useState(0)
  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const q = Math.min(1, (now - t0) / 1700)
      setPc(Math.round(q * 100))
      if (q < 1) raf = requestAnimationFrame(tick)
      else window.setTimeout(onDone, 260)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])
  return (
    <div className="bp-load" aria-hidden="true" style={{ ['--p' as string]: pc / 100 }}>
      <i className="bp-load__line" />
      <span className="bp-load__pc" dir="ltr">{pc}%</span>
      <dl className="bp-load__meta" dir="ltr">{META.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <ol className="bp-load__log" dir="ltr">{LOG.map((l, i) => <li key={l} data-on={pc >= (i + 1) * 13 || undefined}>{String(i + 1).padStart(3, '0')} {l}</li>)}</ol>
    </div>
  )
}

function Ink() {
  const photo = '/media/work-life-3.webp'
  return (
    <svg className="bp-inksvg" viewBox="0 0 480 360" aria-hidden="true" focusable="false">
      <defs>
        <filter id="bp-sketch" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
          <feComponentTransfer><feFuncR type="linear" slope="-3.2" intercept="0.98" /><feFuncG type="linear" slope="-3.2" intercept="0.98" /><feFuncB type="linear" slope="-3.2" intercept="0.95" /></feComponentTransfer>
        </filter>
        <filter id="bp-render" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncR type="linear" slope="1.25" intercept="-0.08" /><feFuncG type="linear" slope="1.25" intercept="-0.08" /><feFuncB type="linear" slope="1.22" intercept="-0.09" /></feComponentTransfer>
        </filter>
        {/* Heron's ink edge (case): turbulence 0.045 0.055, displacement 100, blur 1.8, alpha 2.2 / -0.6; 3 octaves here */}
        <filter id="bp-edge" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045 0.055" numOctaves={3} seed={5} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={100} xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="1.8" />
          <feComponentTransfer><feFuncA type="linear" slope="2.2" intercept="-0.6" /></feComponentTransfer>
        </filter>
        <mask id="bp-inkm" maskUnits="userSpaceOnUse" x="-60" y="-80" width="600" height="520">
          <path className="bp-ink__mask" filter="url(#bp-edge)" fill="#fff" d="M-60 -80H540V420Q240 480 -60 420Z" />
        </mask>
      </defs>
      <image href={photo} width="480" height="360" filter="url(#bp-sketch)" preserveAspectRatio="xMidYMid slice" />
      <image href={photo} width="480" height="360" filter="url(#bp-render)" mask="url(#bp-inkm)" preserveAspectRatio="xMidYMid slice" />
    </svg>
  )
}

export default function Blueprint({ tier, def }: StyleProps) {
  const [loading, setLoading] = useState(() => !PRERENDER && tier !== 'still' && !OPENED)
  const fine = typeof window !== 'undefined' && finePointer()
  useEffect(() => { OPENED = true }, [])

  // the cursor: a 9 px square that follows at lerp 0.18 (fine pointers)
  const cur = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!fine || tier === 'still' || PRERENDER) return
    const el = cur.current
    if (!el) return
    let x = -40, y = -40, tx = -40, ty = -40, raf = 0
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY }
    const tick = () => { x += (tx - x) * 0.18; y += (ty - y) * 0.18; el.style.transform = `translate3d(${x - 4.5}px, ${y - 4.5}px, 0)`; raf = requestAnimationFrame(tick) }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [fine, tier])

  const ref = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE || tier === 'still') return
    const g = e.gsap
    // the intro paragraph inks itself word by word, grey #B4B4B0 to ink (scrub)
    root.querySelectorAll<HTMLElement>('[data-bp-ink]').forEach((p) => {
      const words = p.querySelectorAll('span')
      g.fromTo(words, { color: '#b4b4b0' }, { color: '#282828', ease: 'none', stagger: 0.08, scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 45%', scrub: true } })
    })
    // elements arrive: scale and alpha, 1.6 s expo.out (their reveal)
    root.querySelectorAll<HTMLElement>('[data-bp-in]').forEach((el) => {
      g.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
    })
    // the ink: the sketch turns into the photo, top to bottom, the edge deepening (scrub)
    const mask = root.querySelector<SVGPathElement>('.bp-ink__mask')
    const work = root.querySelector<HTMLElement>('.bp-work__hold')
    if (mask && work) {
      const st = { h: -120, d: 20 }
      g.to(st, {
        h: 480, d: 90, ease: 'none',
        onUpdate: () => mask.setAttribute('d', `M-60 -80H540V${st.h}Q240 ${st.h + st.d} -60 ${st.h}Z`),
        scrollTrigger: { trigger: work, start: 'top top', end: 'bottom bottom', scrub: true },
      })
    }
    // the plan assembles, its dimensions arrive, then the markers and the steps, one by one (scrub)
    const plan = root.querySelector<HTMLElement>('.bp-proc__hold')
    if (plan) {
      const tl = g.timeline({ scrollTrigger: { trigger: plan, start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
      plan.querySelectorAll<SVGGElement>('.bp-blk').forEach((b, i) => {
        const [x, y, r] = (b.dataset.f ?? '0,0,0').split(',').map(Number)
        tl.from(b, { x, y, rotation: r, svgOrigin: '180 300', opacity: 0.25, stroke: '#b4b4b0', duration: 1, ease: 'power2.out' }, i * 0.18)
      })
      tl.from(plan.querySelectorAll('.bp-dims'), { opacity: 0, duration: 0.5 }, '>')
      plan.querySelectorAll<SVGGElement>('.bp-mark').forEach((m, i) => {
        const step = plan.querySelector(`.bp-step[data-i="${i}"]`)
        tl.from(m, { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2)' }, '>+0.2')
        if (step) tl.fromTo(step, { opacity: 0.18 }, { opacity: 1, duration: 0.35 }, '<')
      })
    }
  }, [tier])

  const words = (text: string) => text.split(' ').map((w, i) => <span key={i}>{w} </span>)

  return (
    <div className="bp" ref={ref} data-loading={loading || undefined}>
      <i className="bp-frame" aria-hidden="true" />
      <span className="bp-cursor" ref={cur} aria-hidden="true" />

      <section className="bp-hero" data-ch="hero" aria-labelledby="bp-h1">
        <nav className="bp-nav" aria-label="פרקים">
          {NAV.map(([href, t]) => <a key={href} href={href} lang="en" dir="ltr">{t}</a>)}
          <a href="#bp-contact" className="bp-nav__go" lang="en" dir="ltr">CONTACT <span aria-hidden="true">→</span></a>
        </nav>
        <div className="bp-sheet">
          <span className="bp-plus bp-plus--a" aria-hidden="true" /><span className="bp-plus bp-plus--b" aria-hidden="true" />
          <span className="bp-plus bp-plus--c" aria-hidden="true" /><span className="bp-plus bp-plus--d" aria-hidden="true" />
          <i className="bp-ruler bp-ruler--top" aria-hidden="true" /><i className="bp-ruler bp-ruler--side" aria-hidden="true" />
          {/* [קופי: נתי] */}
          <p className="bp-hint" lang="en" dir="ltr">{fine ? 'CLICK AND DRAG ACROSS THE DRAWING TO SEE WHAT WE CHECK' : 'TAP A RED SQUARE TO SEE WHAT WE CHECK'}</p>
          <Drawing fine={fine} />
          {loading && <Loader onDone={() => setLoading(false)} />}
        </div>
        <div className="bp-hero__foot">
          <h1 id="bp-h1" className="bp-h1">{C.hero.line1} {C.hero.line2}</h1>
          <p className="bp-body">{C.hero.sub} {C.hero.sub2}</p>
          <a className="bp-more" href={waForStyle(def)} target="_blank" rel="noopener noreferrer">{C.hero.cta} <span aria-hidden="true">←</span></a>
        </div>
        <div className="bp-ticker" aria-hidden="true"><div>{[0, 1].map((k) => <span key={k}>{TICKER.map((t) => <b key={t}>{t} <i>⬡</i> </b>)}</span>)}</div></div>
      </section>

      <section className="bp-sec bp-svc" id="bp-services" data-ch="services" aria-labelledby="bp-svc-t">
        <p className="bp-k" dir="ltr">[ SERVICES · 06 ]</p>
        <h2 id="bp-svc-t" className="bp-h2">{C.services.title}</h2>
        <p className="bp-lede" data-bp-ink>{words(`${C.hero.sub} ${C.hero.sub2}`)}</p>
        <ul className="bp-grid">
          {C.services.items.map((s, i) => (
            <li key={s.id} className="bp-cell" data-bp-in>
              <a href={s.href}>
                <span className="bp-cell__k" dir="ltr">[{String(i + 1).padStart(2, '0')}]</span>
                <span className="bp-cell__pic"><video src={`${CLIPS[s.id]}-m.mp4`} poster={`${CLIPS[s.id]}-poster-m.webp`} muted loop playsInline preload="none" aria-hidden="true"
                  onMouseEnter={(e) => { void e.currentTarget.play().catch(() => {}) }} onMouseLeave={(e) => e.currentTarget.pause()} /></span>
                <span className="bp-cell__t">{s.title}</span>
                <span className="bp-cell__l">{s.line}</span>
                <span className="bp-cell__go" dir="ltr">DETAILS →</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="bp-work" id="bp-work" data-ch="work" aria-labelledby="bp-work-t">
        <div className="bp-work__hold">
          <div className="bp-work__stage">
            <p className="bp-k" dir="ltr">[ WORK · REAL ]</p>
            <h2 id="bp-work-t" className="bp-h2 bp-h2--quiet">{C.work.name}</h2>
            <div className="bp-work__pic"><Ink /><span className="bp-work__tag" dir="ltr">SKETCH → FILM</span></div>
            <p className="bp-body">{C.work.line} <a className="bp-more" href={C.work.href} lang="en" aria-label={`${C.work.name} - צפייה`}>{C.work.linkLabel} <span aria-hidden="true">←</span></a></p>
          </div>
        </div>
      </section>

      <section className="bp-proc" id="bp-process" data-ch="process" aria-labelledby="bp-proc-t">
        <div className="bp-proc__hold">
          <div className="bp-proc__stage">
            <div className="bp-proc__head"><p className="bp-k" dir="ltr">[ PROCESS · 04 ]</p><h2 id="bp-proc-t" className="bp-h2">{C.process.title}</h2></div>
            <Plan />
            <Steps />
          </div>
        </div>
      </section>

      <section className="bp-sec bp-faq" id="bp-faq" data-ch="faq" aria-labelledby="bp-faq-t">
        <p className="bp-k" dir="ltr">[ FAQ ]</p>
        <h2 id="bp-faq-t" className="bp-h2">{C.faq.title}</h2>
        <div className="bp-qs">
          {C.faq.items.map((f) => (
            <details key={f.id} className="bp-q">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bp-sec bp-contact" id="bp-contact" data-ch="contact" aria-labelledby="bp-contact-t">
        <p className="bp-k" dir="ltr">[ CONTACT ]</p>
        <h2 id="bp-contact-t" className="bp-h2">{C.contact.title}</h2>
        <p className="bp-body">{C.contact.lead}</p>
        <LeadForm def={def} className="bp-form" />
        <p className="bp-alt" dir="ltr"><a href={`tel:${C.contact.phone}`}>{C.contact.phone}</a><a href={`mailto:${C.contact.email}`}>{C.contact.email}</a></p>
      </section>
    </div>
  )
}
