// sea · the opening (D129 in the dot field): the page opens quietly, once per visit. A dark screen runs
// a second of timecode; dots from every side of the screen converge onto the grid of the field and
// become the Horizon disc; the screen lifts and the field spreads out from the mark; then the H1 rises
// line by line, and the line under it, the key and the header follow.
// index.html decides before first paint (home page, motion allowed, not ?reduce=1, not a prerender,
// not seen this visit) and sets html.sea-opening; the CSS alone runs a short version from first paint
// (sea.css), so a slow boot never leaves the veil up. When the app boots in time, this component holds
// the CSS (html.sea-hold), lets the dots converge on a 2D canvas over the veil (landing on the same
// cells the WebGL field draws), and hands over to the field. Any tap, key or wheel skips it.
// The H1 is painted under the veil from the first frame and only moves (transform): it stays the LCP.
// CALM (OS reduced motion): the timecode, the disc fades in, the veil fades; nothing travels or rises.
import { useEffect, useRef } from 'react'
import * as field from './field'

/** the CSS-only version takes over if the app is not up by then (ms since navigation) */
const JS_DEADLINE = 1500
const GATHER_MS = 1050
const OUT_MS = 1300
/** decided once per page load, so StrictMode's second mount continues the same path */
let jsPath: boolean | null = null

interface Dot { sx: number; sy: number; tx: number; ty: number; r: number; blue: boolean; a: number; delay: number }

/** The Horizon disc on the field's grid at time 0 (shader.ts, horizon()), in CSS px. */
function discDots(w: number, h: number): Dot[] {
  const dpr = field.dprCap()
  const cell = field.cellCss(w)
  const s = field.heroSpot()
  const dots: Dot[] = []
  const hDev = Math.round(h * dpr)
  const cDev = cell * dpr
  const far = Math.hypot(w, h) * 0.75
  for (let j = Math.floor((hDev - (s.y + s.r) * dpr) / cDev) - 1; (j + 0.5) * cDev < hDev - (s.y - s.r) * dpr + cDev; j++) {
    for (let i = Math.floor(((s.x - s.r) * dpr) / cDev) - 1; (i + 0.5) * cDev < (s.x + s.r) * dpr + cDev; i++) {
      const cx = (i + 0.5) * cDev
      const cy = (j + 0.5) * cDev
      const x = cx / dpr
      const y = (hDev - cy) / dpr
      const qx = (x - s.x) / s.r
      const qy = (s.y - y) / s.r
      if (Math.hypot(qx, qy) > 0.99) continue
      const sea = qy - (-0.04 + Math.sin(cx * 0.013) * 0.045 + Math.sin(cx * 0.031 + cy * 0.004) * 0.022)
      const under = sea < 0
      const depth = Math.min(1, Math.max(0, -sea))
      const v = under ? 0.42 + 0.38 * (0.5 + 0.5 * Math.sin(cx * 0.05 + depth * 9)) * (1 - depth * 0.4) : 0.88
      const ang = Math.atan2(qy, qx) + (Math.random() - 0.5) * 1.2
      const dist = far * (0.55 + Math.random() * 0.6)
      dots.push({
        sx: s.x + Math.cos(ang) * dist, sy: s.y - Math.sin(ang) * dist, tx: x, ty: y,
        r: Math.pow(v, 0.62) * cell * 0.5, blue: under, a: 0.35 + 0.65 * v,
        delay: Math.random() * 260 + (1 - Math.hypot(qx, qy)) * 140,
      })
    }
  }
  return dots
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)

/** Draw the dots converging; resolves when every dot has landed. Calm: they fade in where they belong. */
function gather(cv: HTMLCanvasElement, calm: boolean): Promise<void> {
  const ctx = cv.getContext('2d')
  const w = window.innerWidth
  const h = window.innerHeight
  const dpr = field.dprCap()
  if (!ctx) return Promise.resolve()
  cv.width = Math.round(w * dpr)
  cv.height = Math.round(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const dots = discDots(w, h)
  const travel = calm ? 0 : 640
  return new Promise((resolve) => {
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = now - t0
      ctx.clearRect(0, 0, w, h)
      let done = true
      for (const d of dots) {
        const k = calm ? Math.min(1, t / 700) : easeOut(Math.min(1, Math.max(0, (t - d.delay) / travel)))
        if (k < 1) done = false
        const x = d.sx + (d.tx - d.sx) * (calm ? 1 : k)
        const y = d.sy + (d.ty - d.sy) * (calm ? 1 : k)
        ctx.globalAlpha = d.a * (calm ? k : 0.25 + 0.75 * k)
        ctx.fillStyle = d.blue ? '#79A0C5' : '#EDE7DA'
        ctx.beginPath()
        ctx.arc(x, y, Math.max(0.6, d.r * (calm ? 1 : 0.35 + 0.65 * k)), 0, Math.PI * 2)
        ctx.fill()
      }
      if (done || t > GATHER_MS + 400) { resolve(); return }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

export default function SeaIntro() {
  const veil = useRef<HTMLDivElement>(null)
  const dots = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const html = document.documentElement.classList
    if (!html.contains('sea-opening')) return
    const calm = html.contains('sea-opening-calm')
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const
    const timers: number[] = []
    let ended = false
    const end = () => {
      if (ended) return
      ended = true
      html.remove('sea-opening', 'sea-opening-calm', 'sea-hold', 'sea-out')
      events.forEach((e) => window.removeEventListener(e, skip))
      field.arrive()
      field.refresh()
    }
    const out = (ms = OUT_MS) => {
      html.add('sea-out')
      field.arrive()
      timers.push(window.setTimeout(end, ms))
    }
    const skip = () => {
      if (veil.current) { veil.current.style.transition = 'opacity 0.3s ease'; veil.current.style.opacity = '0' }
      if (!html.contains('sea-out')) out(900)
    }
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }))

    // too late for the dots: the CSS version is already on its way out
    // StrictMode mounts twice in dev: a cleanup only drops this run's timers and listeners (index.html
    // removes the classes after 7s if nothing ends the opening)
    const drop = () => { timers.forEach(clearTimeout); events.forEach((e) => window.removeEventListener(e, skip)) }
    if (jsPath === null) jsPath = performance.now() <= JS_DEADLINE
    if (!jsPath) { timers.push(window.setTimeout(end, Math.max(0, 3000 - performance.now()))); return drop }

    html.add('sea-hold')
    field.holdAmbient()
    let alive = true
    const cap = new Promise<void>((r) => timers.push(window.setTimeout(r, 1300)))
    // the timecode runs its second first; the dots start as it ends
    const tcDone = new Promise<void>((r) => timers.push(window.setTimeout(r, Math.max(0, 700 - performance.now()))))
    Promise.all([tcDone, Promise.race([field.ready, cap])]).then(() => {
      if (!alive || ended || !dots.current) return
      return gather(dots.current, calm)
    }).then(() => {
      if (!alive || ended) return
      timers.push(window.setTimeout(() => out(), 160))
    })
    return () => { alive = false; drop() }
  }, [])

  return (
    <div ref={veil} className="sea-intro" aria-hidden="true">
      <canvas ref={dots} className="sea-intro__dots" />
      <p className="sea-intro__tc"><span className="sea-intro__run" /><span className="sea-intro__end">00:00:01:00</span></p>
    </div>
  )
}
