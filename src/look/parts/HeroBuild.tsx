// The hero's stage screen (DECISIONS #60): a website builds itself on it (Rive), and when the
// site's button is clicked the launch film starts inside the site's hero slot.
//
// Layers, back to front: the finished frame (hero-built.svg, the scene's last frame generated
// from the same numbers), the Rive canvas, and the film (HeroMedia) placed exactly over the
// slot rectangle. Without JS, under the stop switch, in the prerender, or if Rive does not load
// in time, the finished frame and the film simply show. With motion, index.html adds
// html.hero-build before the first paint: the finished frame and the film start hidden, so the
// screen opens empty (the H1 stays the LCP) and nothing flashes when the build begins.

import { useEffect, useRef, useState } from 'react'
import type { MotionEngine } from '../../motion/motion-engine.js'
import { HeroMedia } from './HeroMedia'
// inline markup, not an <img>: an inline SVG is never an LCP candidate, so the H1 stays the LCP
import builtSvg from './hero-built.svg?raw'
import rivUrl from './hero.riv?url'
import wasmUrl from '@rive-app/canvas-lite/rive.wasm?url'
import slot from './hero-slot.json'

type Rive = import('@rive-app/canvas-lite').Rive

const pct = (v: number, of: number) => `${(v / of) * 100}%`
const SLOT_STYLE = {
  left: pct(slot.slot.x, slot.artboard.w),
  top: pct(slot.slot.y, slot.artboard.h),
  width: pct(slot.slot.w, slot.artboard.w),
  height: pct(slot.slot.h, slot.artboard.h),
  borderRadius: `${pct(slot.slot.r, slot.slot.w)} / ${pct(slot.slot.r, slot.slot.h)}`,
}

const showStatic = () => document.documentElement.classList.remove('hero-build')

export function HeroBuild({ engine }: { engine: MotionEngine | null }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!engine) return
    // the decision was made before the first paint (index.html): reduced motion, a repeat visit
    // or ?reduce=1 leave no hero-build class, and the finished frame shows as it is
    if (!document.documentElement.classList.contains('hero-build')) return
    if (engine.PRERENDER || engine.REDUCE) { showStatic(); return }
    const cv = canvas.current, el = box.current
    if (!cv || !el) return
    let rive: Rive | null = null, gone = false, gaveUp = false, seen: IntersectionObserver | null = null
    // the film starts from its first frame at the moment the site launches
    const reveal = () => {
      if (gone) return
      setLive(true)
      try { sessionStorage.setItem('mw-hero-build', '1') } catch { /* private mode */ }
      const v = el.querySelector('video')
      if (v && v.readyState > 0) v.currentTime = 0
    }
    // too slow to arrive (a slow phone or network): show the finished frame and never start late
    const fallback = window.setTimeout(() => { if (!rive) { gaveUp = true; showStatic() } }, 4000)

    const start = async () => {
      const { Rive, Layout, Fit, Alignment, RuntimeLoader, EventType } = await import('@rive-app/canvas-lite')
      if (gone) return
      RuntimeLoader.setWasmUrl(wasmUrl)
      const r = new Rive({
        src: rivUrl, canvas: cv, artboard: 'Hero', stateMachines: 'Main',
        autoplay: false, autoBind: true, shouldDisableRiveListeners: true, isTouchScrollEnabled: true,
        layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
        onLoad: () => {
          if (gone) return
          if (gaveUp) { r.cleanup(); return }
          clearTimeout(fallback)
          rive = r
          r.resizeDrawingSurfaceToCanvas()
          // the build starts once most of the screen is in view (on a desktop: at the first scroll), and
          // the canvas stops drawing whenever the screen is off screen
          let started = false
          seen = new IntersectionObserver(([e]) => {
            if (e.intersectionRatio >= 0.6 && !started) { started = true; r.play() }
            if (!started) return
            if (e.isIntersecting) r.startRendering(); else r.stopRendering()
          }, { threshold: [0, 0.6] })
          seen.observe(el)
        },
        onLoadError: () => { clearTimeout(fallback); showStatic() },
      })
      r.on(EventType.RiveEvent, (e) => { if ((e.data as { name?: string })?.name === 'reveal') reveal() })
    }
    // above the fold: start right after the first frame, not at idle
    const raf = requestAnimationFrame(() => { start().catch(() => showStatic()) })
    const resize = new ResizeObserver(() => rive?.resizeDrawingSurfaceToCanvas())
    resize.observe(cv)
    return () => {
      gone = true
      cancelAnimationFrame(raf)
      clearTimeout(fallback)
      seen?.disconnect(); resize.disconnect()
      rive?.cleanup()
      rive = null
    }
  }, [engine])

  return (
    <div ref={box} className="kh__build" data-live={live ? '' : undefined}>
      <div className="kh__built" aria-hidden="true" dangerouslySetInnerHTML={{ __html: builtSvg }} />
      <canvas ref={canvas} className="kh__rive" aria-hidden="true" />
      <div className="kh__slot" style={SLOT_STYLE}><HeroMedia /></div>
    </div>
  )
}
