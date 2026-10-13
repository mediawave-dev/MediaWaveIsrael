// The hero lens (DECISIONS #64; design/rive/lens/CONTRACT.md). A camera lens under the H1: a
// film of someone browsing an online store plays inside it (LENS_FILM), seen through an iris of
// Klein-blue blades in a dark barrel.
// Rive draws the lens (lens.riv, canvas-lite); this component moves the iris through data
// binding: blade 0's corners and light (the other eight blades are blade 0 turned) and the
// barrel's focus turn. The geometry is shared with the static frames (lens-geometry.js).
//
// First visit with motion (index.html adds html.hero-iris before the first paint): the lens
// paints closed (lens-closed.svg), and once Rive is ready the iris snaps fully open and stops
// down to its rest aperture, the barrel turning as it focuses. After that the iris opens wider
// when the pointer comes over the lens, blinks shut and open on a click or tap (a shutter), and
// opens all the way as the hero scrolls away. It draws only while it moves and is on screen.
// Repeat visits and CALM start at rest (lens-rest.svg, the same pose); REDUCE, the prerender and
// no-JS show the rest frame only.

import { useEffect, useRef, useState } from 'react'
import type { MotionEngine } from '../../motion/motion-engine.js'
// inline markup, not an <img>: an inline SVG is never an LCP candidate, so the H1 stays the LCP
import restSvg from './lens-rest.svg?raw'
import closedSvg from './lens-closed.svg?raw'
import rivUrl from './lens.riv?url'
import wasmUrl from '@rive-app/canvas-lite/rive.wasm?url'
import { LENS, blade, twistFor } from './lens-geometry.js'
import { HeroMedia, LENS_FILM } from './HeroMedia'

type Rive = import('@rive-app/canvas-lite').Rive
type Num = { value: number }

const endIntro = () => document.documentElement.classList.remove('hero-iris')
const remember = () => { try { sessionStorage.setItem('mw-hero-iris', '1') } catch { /* private mode */ } }

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

const NAMES = ['v0x', 'v0y', 'e0x', 'e0y', 'e1x', 'e1y', 'g0x', 'g0y', 'g1x', 'g1y'] as const

export function Lens({ engine }: { engine: MotionEngine | null }) {
  const box = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = box.current, cv = canvas.current
    if (!engine || !el || !cv) return
    const intro = document.documentElement.classList.contains('hero-iris')
    if (engine.PRERENDER || engine.REDUCE) { endIntro(); return }
    const hero = el.closest('section') as HTMLElement

    let rive: Rive | null = null, gone = false, gaveUp = false
    let raf = 0, awake = false, visible = true, phase: 'wait' | 'intro' | 'live' = 'wait'
    let props: Record<string, Num> = {}
    let focus: Num | null = null
    // the iris: aperture a (0 closed, 1 open) on a spring, and a small turn toward the pointer
    let a = intro ? 0 : LENS.rest, va = 0, turn = 0, turnTo = 0, t0 = 0, last = 0
    let hover = false, blinkUntil = 0, scrollP = 0

    const write = () => {
      const b = blade(a, twistFor(a, turn))
      const vals = [b.v[0], b.v[1], b.e0[0], b.e0[1], b.e1[0], b.e1[1], b.g0[0], b.g0[1], b.g1[0], b.g1[1]]
      NAMES.forEach((k, i) => { props[k].value = vals[i] })
      if (focus) focus.value = 0.35 * (a - LENS.rest) + scrollP * 0.7 + turn * 0.6
    }
    const target = (now: number) => {
      if (phase === 'intro') {
        const t = (now - t0) / 1000
        if (t < 0.28) return { to: 0, k: 300 }
        if (t < 0.95) return { to: 1, k: 260 }
        phase = 'live'
        remember()
      }
      if (now < blinkUntil) return { to: 0.03, k: 900 }
      const open = LENS.rest + (1 - LENS.rest) * Math.min(1, scrollP * 1.5)
      return { to: Math.max(hover ? 0.92 : LENS.rest, open), k: 150 }
    }

    const frame = (now: number) => {
      raf = 0
      if (!rive || gone) return
      const dt = Math.min(0.04, (now - last) / 1000)
      last = now
      const { to, k } = target(now)
      // a damped spring, a little under critical: the blades land with a mechanical settle
      const c = 2 * 0.78 * Math.sqrt(k)
      let left = dt
      while (left > 0) {
        const h = Math.min(left, 1 / 240)
        va += (k * (to - a) - c * va) * h
        a += va * h
        left -= h
      }
      a = Math.max(0, Math.min(1.04, a))
      turn += (turnTo - turn) * Math.min(1, dt * 7)
      write()
      const still = Math.abs(to - a) < 0.0008 && Math.abs(va) < 0.003 && Math.abs(turnTo - turn) < 0.0005
      if (phase === 'live' && still && now >= blinkUntil) { sleep(); return }
      raf = requestAnimationFrame(frame)
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
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2), dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      const inside = dx * dx + dy * dy < 1.1
      if (inside !== hover) { hover = inside; wake() }
      const next = inside ? dx * 0.14 : 0
      if (Math.abs(next - turnTo) > 0.002) { turnTo = next; wake() }
    }
    const onLeave = () => { hover = false; turnTo = 0; wake() }
    const onDown = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2)
      if (dx * dx + dy * dy > (r.width / 2) ** 2) return
      // a shutter: shut and open again
      blinkUntil = performance.now() + 150
      wake()
    }

    const start = async () => {
      const { Rive, Layout, Fit, Alignment, RuntimeLoader } = await import('@rive-app/canvas-lite')
      if (gone) return
      RuntimeLoader.setWasmUrl(wasmUrl)
      const r = new Rive({
        src: rivUrl, canvas: cv, artboard: 'Lens', stateMachines: 'Main',
        autoplay: true, autoBind: true, shouldDisableRiveListeners: true, isTouchScrollEnabled: true,
        layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
        onLoad: () => {
          if (gone) return
          if (gaveUp) { r.cleanup(); return }
          clearTimeout(fallback)
          rive = r
          r.resizeDrawingSurfaceToCanvas(Math.min(2, window.devicePixelRatio || 1))
          const v = r.viewModelInstance
          props = Object.fromEntries(NAMES.map((k) => [k, v?.number(k) as Num | null])) as Record<string, Num>
          focus = (v?.number('focus') as Num | null) ?? null
          if (NAMES.some((k) => !props[k])) { r.cleanup(); rive = null; endIntro(); return }
          // the opening needs the lens on screen (a reload further down starts at rest)
          const onScreen = el.getBoundingClientRect().top < window.innerHeight
          const opening = intro && onScreen && !engine.CALM
          if (!opening) a = LENS.rest
          write()
          // writes apply on the next advance: show the canvas once that frame is drawn
          requestAnimationFrame(() => requestAnimationFrame(() => {
            if (gone) return
            setLive(true)
            endIntro()
            if (opening) {
              phase = 'intro'
              t0 = performance.now()
              awake = true
              last = t0
              raf = requestAnimationFrame(frame)
            } else {
              phase = 'live'
              r.stopRendering()
            }
          }))
        },
        onLoadError: () => { clearTimeout(fallback); endIntro() },
      })
    }

    // the opening must not start late: if Rive is not there in time the lens shows at rest
    const fallback = window.setTimeout(() => { if (!rive) { gaveUp = true; endIntro() } }, intro ? 4500 : 1e9)
    let cancelIdle = () => {}
    let raf0 = 0
    if (intro) raf0 = requestAnimationFrame(() => { start().catch(() => endIntro()) })
    else cancelIdle = afterLoadAndIdle(() => { start().catch(() => {}) })

    // the scroll opens the iris all the way as the hero leaves
    const st = engine.ScrollTrigger.create({
      trigger: hero, start: 'top top', end: 'bottom top',
      onUpdate: (self) => { scrollP = self.progress; wake() },
    })
    const seen = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (!visible && awake) { cancelAnimationFrame(raf); raf = 0; awake = false; rive?.stopRendering() }
      else if (visible) wake()
    })
    seen.observe(el)
    const resize = new ResizeObserver(() => {
      if (!rive) return
      rive.resizeDrawingSurfaceToCanvas(Math.min(2, window.devicePixelRatio || 1))
      if (!awake) { write(); rive.startRendering(); sleep() }
    })
    resize.observe(cv)
    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })
    el.addEventListener('pointerdown', onDown, { passive: true })
    if (import.meta.env.DEV) (window as unknown as { __lens: unknown }).__lens = { a: () => a, phase: () => phase, awake: () => awake }

    return () => {
      gone = true
      cancelAnimationFrame(raf); cancelAnimationFrame(raf0)
      clearTimeout(fallback); cancelIdle()
      st.kill(); seen.disconnect(); resize.disconnect()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onDown)
      rive?.cleanup()
      rive = null
      setLive(false)
    }
  }, [engine])

  return (
    <div ref={box} className="kl__lens" data-live={live ? '' : undefined} data-zone="art">
      <div className="kl__film" aria-hidden="true"><HeroMedia film={LENS_FILM} sizes="(max-width: 860px) 62vw, 440px" /></div>
      <div className="kl__still kl__still--rest" aria-hidden="true" dangerouslySetInnerHTML={{ __html: restSvg }} />
      <div className="kl__still kl__still--closed" aria-hidden="true" dangerouslySetInnerHTML={{ __html: closedSvg }} />
      <canvas ref={canvas} className="kl__rive" aria-hidden="true" />
    </div>
  )
}
