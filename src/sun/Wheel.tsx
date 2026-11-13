// sun · the work wheel (D237). The sites we built ride a huge wheel that rises over the hero's horizon,
// the way the Horizon logo's disc sits on its line. One transform on the ring moves everything
// (compositor only). It drifts slowly, stops under a pointer, and a finger or a mouse can spin it.
// The cards are pictures only: no names and no links to the sites (D240). Decorative, so hidden from assistive tech.
// Each card is a part of a site that says something: a hero with its headline, a section with a heading and
// text (D244). So that it can be read, a tap on the wheel holds it still for a few seconds.
// Geometry lives in sun.css (--cw, --ch, --R); 36 slots at 10 degrees, and phones show every second slot.
// The opening (D241), the page's one staged moment: the wheel starts under the horizon, turned away, and
// comes up and round like a heavy wheel settling, and then the sticker is stamped on. index.html sets html.sun-open before first paint, so the prerendered page already
// shows the starting pose; this effect plays it once and removes the class.
import { useEffect, useRef, useState } from 'react'
import { PROJECTS, WA } from './content'
import { IconWhatsApp } from './icons'
import { track } from '../utils/analytics'

const SLOTS = 36
const STEP = 360 / SLOTS
/** The opening's numbers; sun.css holds the same starting pose (html.sun-open .wheel__ring). */
const OPEN = { turn: 56, below: 0.86, seconds: 1.8, rise: 1.0 }


/** `crop` names the picture: public/work/<slug>-card-<crop>.webp ("top", or a scene "s1", "s2"). */
type Shot = { kind: 'shot'; slug: string; crop: string }
type Card = Shot | { kind: 'next' }

/** The deck, set by hand (Nati, 13.11.2026): eight pictures and the "next" card. Light and dark screens take
    turns, and the two sites with a woman's face in the hero (sisters' sites) stand apart: four places on a desktop,
    two on a phone, which shows every second card. A card whose file is missing in work.json is skipped. */
const ORDER: [string, string][] = [
  ['switchon', 'top'], ['machtesh', 'top'], ['yael-levy', 'top'], ['ben-david', 'top'],
  ['switchon', 's1'], ['mediawave-2026', 'top'], ['hila', 'top'], ['machtesh', 's1'],
]
function deck(): Card[] {
  const known = new Set(PROJECTS.map((p) => p.slug))
  const unit: Card[] = [...ORDER.filter(([slug]) => known.has(slug)).map(([slug, crop]): Card => ({ kind: 'shot', slug, crop })), { kind: 'next' }]
  return Array.from({ length: SLOTS }, (_, i) => unit[i % unit.length])
}

/** D259: every card is a real recording of its site (scripts/record-work.mjs): scrolled slowly with all its own motion.
    The first screen stays as the poster; the videos are attached only once the page has loaded and gone quiet. */
const videoOf = (slug: string, crop: string) => `/work/${slug}-card-${crop}.mp4`
function useVideosReady() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    let t = 0
    const go = () => { t = window.setTimeout(() => setOn(true), 1500) }
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true })
    return () => { clearTimeout(t); window.removeEventListener('load', go) }
  }, [])
  return on
}

export default function Wheel() {
  const box = useRef<HTMLDivElement>(null)
  const videos = useVideosReady()
  // D260: a video plays only while its own phone is on the screen (the ring holds 32 phones, most of them out of
  // view), so a phone decodes three or four at a time and every one of them stays smooth. They all rest on ?calm=1
  // and with the panel's "ללא אנימציות". A video shows only once it is really playing, fading in over its still.
  useEffect(() => {
    const el = box.current
    if (!el || !videos) return
    const html = document.documentElement
    const calm = /[?&]calm=1(&|$)/.test(location.search)
    const visible = new Set<HTMLVideoElement>()
    const run = () => !calm && !html.classList.contains('disable-animations')
    const sync = (v: HTMLVideoElement) => { if (run() && visible.has(v)) v.play().catch(() => {}); else if (!v.paused) v.pause() }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { const v = e.target as HTMLVideoElement; if (e.isIntersecting) visible.add(v); else visible.delete(v); sync(v) }
    }, { rootMargin: '80px', threshold: 0.02 })
    const vids = [...el.querySelectorAll('video')]
    const shown = (e: Event) => (e.currentTarget as HTMLVideoElement).setAttribute('data-on', '')
    vids.forEach((v) => { io.observe(v); v.addEventListener('playing', shown) })
    const mo = new MutationObserver(() => vids.forEach(sync))
    mo.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => { io.disconnect(); mo.disconnect(); vids.forEach((v) => v.removeEventListener('playing', shown)) }
  }, [videos])
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    const r = ring.current
    if (!el || !r || (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    const html = document.documentElement
    const still = () => html.classList.contains('disable-animations')
    // D160: a regular visit sees the wheel turn even when the OS flag is set (Windows sets it on many machines,
    // Nati's included). What stops it: a pointer on it, the accessibility panel's "ללא אנימציות", ?reduce=1, ?calm=1.
    const calm = /[?&]calm=1(&|$)/.test(location.search)
    let a = 0
    let v = 0 // deg per second from a fling
    // the opening: seconds played (-1 = none), the extra turn still to come off, and how far below its place the ring sits
    let open = html.classList.contains('sun-open') && !still() ? 0 : -1
    let spin = open === 0 ? OPEN.turn : 0
    let lift = 0
    if (open < 0) html.classList.remove('sun-open', 'sun-play')
    const cardH = () => parseFloat(getComputedStyle(el).getPropertyValue('--ch')) || 300
    let held = false
    let rest = 0 // until this moment (ms on the frame clock) the wheel stands still: a tap asked for time to read
    let hover = false
    let seen = true
    let raf = 0
    let last = 0
    let moved = 0
    let lastX = 0
    let lastT = 0
    const radius = () => parseFloat(getComputedStyle(el).getPropertyValue('--R')) || 500
    // one card's width of travel every five seconds, whatever the wheel's size
    const drift = () => (window.matchMedia('(min-width: 900px)').matches ? STEP : STEP * 2) / 5

    const paint = () => { r.style.transform = `translateY(${lift.toFixed(1)}px) rotate(${(a + spin).toFixed(3)}deg)` }
    const tick = (t: number) => {
      // never negative: the first frame's timestamp can be a hair earlier than the clock read that started the loop
      const dt = Math.max(0, Math.min(0.05, (t - last) / 1000 || 0))
      last = t
      if (open >= 0) {
        if (open === 0) html.classList.add('sun-play') // the sticker runs on CSS, timed against this clock
        open += dt
        const k = Math.min(1, open / OPEN.seconds)
        const up = Math.min(1, open / OPEN.rise)
        spin = OPEN.turn * Math.pow(1 - k, 4) // a heavy wheel coming to rest
        lift = cardH() * OPEN.below * Math.pow(1 - up, 3)
        if (k >= 1) { open = -1; spin = 0; lift = 0; html.classList.remove('sun-open', 'sun-play') }
      }
      if (!held) {
        if (Math.abs(v) > 0.05) { a += v * dt; v *= Math.pow(0.04, dt) } // a fling eases out in about a second
        else if (!hover && !calm && !still() && t >= rest) a -= drift() * dt
      }
      paint()
      raf = seen && !document.hidden ? requestAnimationFrame(tick) : 0
    }
    const run = () => { if (!raf && seen && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick) } }

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      held = true; moved = 0; v = 0; lastX = e.clientX; lastT = e.timeStamp
    }
    const move = (e: PointerEvent) => {
      if (!held) return
      const dx = e.clientX - lastX
      const dt = Math.max(1, e.timeStamp - lastT) / 1000
      const d = (dx / radius()) * (180 / Math.PI)
      a += d; moved += Math.abs(dx); v = d / dt
      lastX = e.clientX; lastT = e.timeStamp
      if (moved > 6 && !el.hasPointerCapture(e.pointerId)) el.setPointerCapture(e.pointerId)
    }
    const up = (e: PointerEvent) => {
      // a tap (a finger that did not drag) holds the wheel for six seconds so a card can be read; a second tap
      // lets it go. Not for a mouse (it holds by hovering) and not on the WhatsApp card, which is a link.
      if (held && moved <= 6 && e.pointerType !== 'mouse' && !(e.target as Element | null)?.closest?.('a')) {
        rest = performance.now() < rest ? 0 : performance.now() + 6000
      }
      held = false; v = Math.max(-240, Math.min(240, v)); if (still()) v = 0
    }
    // a drag must not open the card it started on
    const click = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation() } }
    const enter = (e: PointerEvent) => { if (e.pointerType === 'mouse') hover = true }
    const leave = (e: PointerEvent) => { if (e.pointerType === 'mouse') hover = false }
    const vis = () => run()
    const io = new IntersectionObserver(([en]) => { seen = en.isIntersecting; run() }, { rootMargin: '80px' })

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    // on the window: a press let go outside the wheel must still end the hold, or the drift never comes back
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    el.addEventListener('click', click, true)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', vis)
    io.observe(el)
    run()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', vis)
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      el.removeEventListener('click', click, true)
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div className="wheel" ref={box} aria-hidden="true">
      <div className="wheel__ground" />
      <div className="wheel__ring" ref={ring}>
        {deck().map((c, i) => (
          <div className="wheel__slot" key={i} style={{ '--i': i } as React.CSSProperties}>
            {c.kind === 'shot' ? (
              <div className="wheel__card" data-crop={c.crop}>
                <div className="wheel__screen">
                  {videos && <video src={videoOf(c.slug, c.crop)} muted loop playsInline preload="none" tabIndex={-1} disablePictureInPicture disableRemotePlayback
                    onLoadedMetadata={(e) => { const v = e.currentTarget; v.currentTime = (i * 3.1) % (v.duration || 1) }} />}
                  <img src={`/work/${c.slug}-card-${c.crop}.webp`} alt="" width={528} height={1056} draggable={false}
                    loading={i < 3 || i > SLOTS - 3 ? 'eager' : 'lazy'} decoding="async" {...(i === 0 ? { fetchpriority: 'high' } : {})} />
                </div>
              </div>
            ) : (
              <a className="wheel__card wheel__card--next" href={WA.hero} target="_blank" rel="noopener" tabIndex={-1} draggable={false}
                onClick={() => track('whatsapp_click', { placement: 'wheel_next' })}>
                <IconWhatsApp width={30} height={30} />
                <span>האתר<br />הבא<br /><b>שלכם</b></span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
