// The hero's sea (DECISIONS #62; design/rive/opener/CONTRACT.md). The launch film fills the
// hero behind everything; over it lies the lid: the night (CSS) and a band where Rive draws
// the night down to the water's surface, the Horizon mark's two tones on the surface and a
// haze under it. The surface is a row of water columns (sea-physics.ts) whose heights and
// slopes reach Rive through data binding every frame.
//
// First visit with motion (index.html adds html.hero-wave before the first paint): the band
// starts as plain night (the CSS veil, then the canvas drawing the same), a light draws the
// horizon from the right, and the water pours in behind a crest, sloshes off the left wall and
// settles. Afterwards the visitor plays with it: the water rises toward a pointer above it,
// splashes where the pointer crosses it, takes a drop where you tap or click, and sloshes when
// the page scrolls. It stops drawing whenever it is calm or off screen.
// Repeat visits and CALM start calm (the rest pose, sea-rest.svg, is the scene's own rest
// pose); CALM keeps the touch at half strength and no scroll slosh; REDUCE, the prerender and
// no-JS show the rest pose only.

import { useEffect, useRef, useState } from 'react'
import type { MotionEngine } from '../../motion/motion-engine.js'
// inline markup, not an <img>: an inline SVG is never an LCP candidate, so the H1 stays the LCP
import restSvg from './sea-rest.svg?raw'
import rivUrl from './sea.riv?url'
import wasmUrl from '@rive-app/canvas-lite/rive.wasm?url'
import geom from './sea.json'
import { SeaSurface, boreShape, type Bore, type SeaTuning } from './sea-physics'

type Rive = import('@rive-app/canvas-lite').Rive
type Num = { value: number }

const endIntro = () => document.documentElement.classList.remove('hero-wave')
const remember = () => { try { sessionStorage.setItem('mw-hero-wave', '1') } catch { /* private mode */ } }

function afterLoadAndIdle(cb: () => void): () => void {
  let idle = 0, timer = 0, done = false
  const go = () => {
    if (done) return
    if ('requestIdleCallback' in window) idle = window.requestIdleCallback(() => !done && cb(), { timeout: 2500 })
    else timer = setTimeout(() => !done && cb(), 300) as unknown as number
  }
  if (document.readyState === 'complete') go()
  else window.addEventListener('load', go, { once: true })
  return () => {
    done = true
    window.removeEventListener('load', go)
    if (idle) window.cancelIdleCallback?.(idle)
    clearTimeout(timer)
  }
}

// phones calm down sooner: the same energy in a narrow sea reads as chop
const tuning = (w: number): SeaTuning => ({ speed: Math.min(1000, Math.max(420, w * 0.62)), spring: 2.2, drag: w < 700 ? 1.35 : 0.85 })
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function Sea({ engine }: { engine: MotionEngine | null }) {
  const band = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = band.current, cv = canvas.current
    if (!engine || !el || !cv) return
    const intro = document.documentElement.classList.contains('hero-wave')
    if (engine.PRERENDER || engine.REDUCE) { endIntro(); return }
    const hero = el.closest('section') as HTMLElement
    const gain = engine.CALM ? 0.5 : 1

    let rive: Rive | null = null, gone = false, gaveUp = false
    let raf = 0, awake = false, visible = true, phase: 'wait' | 'intro' | 'live' = 'wait'
    let sx = 1, sy = 1, sea = 0
    let ys: Num[] = [], rs: Num[] = [], guideStart: Num | null = null, guideEnd: Num | null = null
    let lineA: Num | null = null, lineB: Num | null = null
    let surface: SeaSurface | null = null
    const n = geom.n
    const curve = geom.curve
    const outY = new Float64Array(n)
    const shape = new Float64Array(n), prev = new Float64Array(n)
    let bore: Bore | null = null, t0 = 0, last = 0, prevT = 0

    // heights (px, from the calm curve) to the band's units, and each point's slope for its handles.
    // Once the opening is over the water never rises into the copy: a rise saturates softly
    // (tanh) at the gap between the calm surface and the buttons. The opening's crest may pass
    // behind them; the limit closes in over the second after it.
    let gap = 1e4, limitFrom = 0
    const write = (h: ArrayLike<number>) => {
      const ramp = phase === 'live' ? Math.min(1, (performance.now() - limitFrom) / 900) : 0
      const c = gap + (1e4 - gap) * (1 - ramp * ramp * (3 - 2 * ramp))
      for (let i = 0; i < n; i++) {
        const v = h[i] < 0 ? -c * Math.tanh(-h[i] / c) : h[i]
        outY[i] = geom.rest + curve[i] + v / sy
      }
      for (let i = 0; i < n; i++) {
        const a = outY[i > 0 ? i - 1 : 0], b = outY[i < n - 1 ? i + 1 : n - 1]
        ys[i].value = outY[i]
        rs[i].value = Math.atan2(b - a, (i > 0 && i < n - 1 ? 2 : 1) * geom.dx)
      }
    }
    const measure = () => {
      const w = el.clientWidth, h = el.clientHeight
      sx = w / geom.w; sy = h / geom.h; sea = 400 * sy
      if (surface) surface.rescale(geom.x0 * sx, geom.dx * sx, tuning(w))
      else surface = new SeaSurface(n, geom.x0 * sx, geom.dx * sx, tuning(w))
      if (lineA) lineA.value = 2.2 / sy
      if (lineB) lineB.value = 1.4 / sy
      // the calm surface sits a sea's height above the hero's bottom (hero-sea.css)
      const ctas = hero.querySelector<HTMLElement>('.ks__ctas')
      if (ctas) gap = Math.max(24, hero.clientHeight - sea - (ctas.offsetTop + ctas.offsetHeight) - 8)
    }

    const frame = (now: number) => {
      raf = 0
      if (!rive || !surface || gone) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (phase === 'intro' && bore) {
        const t = (now - t0) / 1000
        // the light draws the horizon from the right
        if (guideStart) guideStart.value = 1 - ease(Math.min(1, t / 0.55))
        const tb = t - 0.32
        if (tb <= 0) { shape.fill(bore.depth); write(shape) }
        else {
          prev.set(shape)
          const crest = boreShape(bore, surface.x, tb, shape)
          write(shape)
          // the water swallows the guide as it passes
          const x0 = surface.x[0], x1 = surface.x[n - 1]
          if (guideEnd) guideEnd.value = Math.max(0, Math.min(1, (crest - bore.face * 0.35 - x0) / (x1 - x0)))
          // hand over to the physics as the crest meets the left wall: it reflects and sloshes back
          if (crest <= x0 + bore.width * 0.6 || tb >= bore.duration) {
            surface.adopt(shape, prev, Math.max(1 / 240, tb - prevT))
            if (guideStart) guideStart.value = 1
            if (guideEnd) guideEnd.value = 1
            phase = 'live'
            limitFrom = performance.now()
            remember()
          }
          prevT = tb
        }
      } else {
        // the page's scroll sloshes the water like a tank being carried
        const vel = engine.getVelocity()
        if (Math.abs(vel) > 40) tilt(Math.max(-3000, Math.min(3000, vel)) * 0.11 * dt)
        surface.advance(dt)
        write(surface.h)
        if (surface.resting()) { surface.settle(); write(surface.h); sleep(); return }
      }
      raf = requestAnimationFrame(frame)
    }
    const tilt = (a: number) => {
      if (!surface) return
      const span = el.clientWidth || 1
      for (let i = 0; i < n; i++) surface.v[i] += a * ((2 * surface.x[i]) / span - 1)
    }
    const wake = () => {
      if (awake || !rive || !visible || phase === 'wait') return
      awake = true
      rive.startRendering()
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    // let the last values draw, then stop the canvas
    const sleep = () => {
      awake = false
      requestAnimationFrame(() => requestAnimationFrame(() => { if (!awake && rive) rive.stopRendering() }))
    }

    // ---- the visitor's hand
    let lastP: { x: number; y: number; t: number; dy: number } | null = null
    const calmAt = (x: number) => {
      const f = Math.max(0, Math.min(n - 1.001, (x / sx - geom.x0) / geom.dx))
      const i = Math.floor(f), u = f - i
      return (geom.rest + curve[i] * (1 - u) + curve[i + 1] * u) * sy
    }
    const onMove = (e: PointerEvent) => {
      if (phase !== 'live' || !surface || e.pointerType === 'touch') return
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      const dy = y - (calmAt(x) + surface.at(x))
      const t = e.timeStamp
      if (lastP && Math.sign(dy) !== Math.sign(lastP.dy) && Math.abs(x - lastP.x) < 240) {
        // the pointer went through the surface: a splash, as hard as the pointer was moving
        const vy = ((y - lastP.y) / Math.max(8, t - lastP.t)) * 1000
        surface.kick(x, Math.max(-1800, Math.min(1800, vy * 1.1)) * gain, Math.max(36, 100 * sx))
      }
      // just above the water: it rises toward the pointer
      const reach = Math.max(110, sea * 0.65)
      if (dy < 0 && dy > -reach) surface.hold(x, -Math.min(64, sea * 0.22) * gain * (1 + dy / reach), Math.max(44, 110 * sx), 46)
      else surface.hold(0, 0, 1, 0)
      lastP = { x, y, t, dy }
      wake()
    }
    const onLeave = () => { lastP = null; surface?.hold(0, 0, 1, 0); wake() }
    const onDown = (e: PointerEvent) => {
      if (phase !== 'live' || !surface) return
      if ((e.target as Element).closest('a, button, input, textarea, select, label')) return
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      // a drop where you tap or click the water or just above it
      if (y < calmAt(x) - Math.max(140, sea * 0.6)) return
      surface.kick(x, 1600 * gain, Math.max(30, 70 * sx))
      wake()
    }
    const onScroll = () => { if (phase === 'live' && !engine.CALM) wake() }
    if (import.meta.env.DEV) (window as unknown as { __sea: unknown }).__sea = { surface: () => surface, phase: () => phase, awake: () => awake, sy: () => sy }

    const start = async () => {
      const { Rive, Layout, Fit, Alignment, RuntimeLoader } = await import('@rive-app/canvas-lite')
      if (gone) return
      RuntimeLoader.setWasmUrl(wasmUrl)
      const r = new Rive({
        src: rivUrl, canvas: cv, artboard: 'Sea', stateMachines: 'Main',
        autoplay: true, autoBind: true, shouldDisableRiveListeners: true, isTouchScrollEnabled: true,
        layout: new Layout({ fit: Fit.Fill, alignment: Alignment.Center }),
        onLoad: () => {
          if (gone) return
          if (gaveUp) { r.cleanup(); return }
          clearTimeout(fallback)
          rive = r
          r.resizeDrawingSurfaceToCanvas(Math.min(2, window.devicePixelRatio || 1))
          const v = r.viewModelInstance
          const num = (k: string) => v?.number(k) as Num | null
          ys = Array.from({ length: n }, (_, i) => num(`y${i}`)!)
          rs = Array.from({ length: n }, (_, i) => num(`r${i}`)!)
          if (ys.some((p) => !p) || rs.some((p) => !p)) { r.cleanup(); rive = null; endIntro(); return }
          guideStart = num('guideStart'); guideEnd = num('guideEnd'); lineA = num('lineA'); lineB = num('lineB')
          measure()
          const w = el.clientWidth
          // the hero must be on screen for the opening (a reload further down skips it)
          const onScreen = hero.getBoundingClientRect().top > -40
          if (intro && onScreen && !engine.CALM) {
            // a phone gets a broader, lower crest (a narrow screen turns the same numbers into a spike)
            const narrow = w < 700
            const width = narrow ? Math.max(46, w * 0.13) : Math.max(30, Math.min(80, w * 0.05))
            bore = {
              span: w, depth: (geom.h - geom.rest) * sy + 40, crest: sea * (narrow ? 0.42 : 0.6), width,
              face: Math.max(width * 2.6, w * (narrow ? 0.34 : 0.17)), duration: Math.max(1.0, Math.min(1.5, w / 1100)),
            }
            shape.fill(bore.depth)
            write(shape)
          } else {
            write(surface!.h)
            endIntro()
          }
          // writes apply on the next advance: show the canvas once that frame is drawn
          requestAnimationFrame(() => requestAnimationFrame(() => {
            if (gone) return
            setLive(true)
            if (bore) {
              phase = 'intro'
              t0 = performance.now()
              awake = true
              last = t0
              raf = requestAnimationFrame(frame)
              endIntro()
            } else {
              phase = 'live'
              r.stopRendering()
            }
          }))
        },
        onLoadError: () => { clearTimeout(fallback); endIntro() },
      })
    }

    // the opening must not start late: if Rive is not there in time the calm sea simply shows
    const fallback = window.setTimeout(() => { if (!rive) { gaveUp = true; endIntro() } }, intro ? 4500 : 1e9)
    let cancelIdle = () => {}
    let raf0 = 0
    if (intro) raf0 = requestAnimationFrame(() => { start().catch(() => endIntro()) })
    else cancelIdle = afterLoadAndIdle(() => { start().catch(() => {}) })

    const seen = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (!visible && awake) { cancelAnimationFrame(raf); raf = 0; awake = false; rive?.stopRendering() }
      else if (visible && phase === 'intro') { awake = false; wake() }
    })
    seen.observe(el)
    const resize = new ResizeObserver(() => {
      if (!rive) return
      rive.resizeDrawingSurfaceToCanvas(Math.min(2, window.devicePixelRatio || 1))
      measure()
      if (phase === 'live') { write(surface!.h); rive.startRendering(); if (!awake) sleep() }
    })
    resize.observe(el)
    hero.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('pointerleave', onLeave, { passive: true })
    hero.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      gone = true
      cancelAnimationFrame(raf); cancelAnimationFrame(raf0)
      clearTimeout(fallback); cancelIdle()
      seen.disconnect(); resize.disconnect()
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      hero.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll)
      rive?.cleanup()
      rive = null
      setLive(false)
    }
  }, [engine])

  return (
    <div className="ks__lid" aria-hidden="true">
      <div className="ks__sky" />
      <div ref={band} className="ks__band" data-live={live ? '' : undefined}>
        <div className="ks__rest" dangerouslySetInnerHTML={{ __html: restSvg }} />
        <canvas ref={canvas} className="ks__rive" />
      </div>
    </div>
  )
}
