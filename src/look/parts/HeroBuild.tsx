// The hero's stage screen (DECISIONS #60): a website builds itself on it (Rive), and when the
// site's button is clicked the launch film starts inside the site's hero slot.
//
// Layers, back to front: the finished frame (hero-built.svg, the scene's last frame generated
// from the same numbers), the Rive canvas, and the film (HeroMedia) placed exactly over the
// slot rectangle. Without JS, under the stop switch, in the prerender, or if Rive does not load
// in time, the finished frame and the film simply show. With motion, index.html adds
// html.hero-build before the first paint: the finished frame and the film start hidden, so the
// screen opens empty (the H1 stays the LCP) and nothing flashes when the build begins.
//
// mode 'scrub' (shot, SPEC S4; K and KM keep the default 'play'): the build follows the scroll.
// The page drives it through the ref handle, setProgress(p) with p 0-1, from its hold timeline,
// so scrolling back unbuilds the site and nothing is played once or remembered (no html.hero-build
// gate, no sessionStorage, no reveal listener, no film: the slot holds a still of the lens film,
// cropped to a circle, from the moment the site's button is clicked). The Rive file is created
// after load + idle once the screen is within 150% of the viewport, never autoplays, and draws a
// frame only when the progress changes while the screen is in view (it claims the one Rive slot,
// rive-slot.ts). Until it is live, or if it fails, the page shows its own opening frame below
// p 0.92 and the finished frame plus the still from there. No JS, prerender and the stop switch:
// the finished frame and the still.

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { MotionEngine } from '../../motion/motion-engine.js'
import { HeroMedia } from './HeroMedia'
// inline markup, not an <img>: an inline SVG is never an LCP candidate, so the H1 stays the LCP
import builtSvg from './hero-built.svg?raw'
import rivUrl from './hero.riv?url'
import wasmUrl from '@rive-app/canvas-lite/rive.wasm?url'
import slot from './hero-slot.json'
import { claimRive, releaseRive } from '../shot/rive-slot'

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

/** The scene's numbers (design/rive/hero/build-hero.mjs): 60 fps, the click at 190, the rest at 264. */
const FPS = 60
const END = 264
const REVEAL = 190
/** scrub mode: the still shows from the click on; the fallback's finished frame from 0.92 */
const STILL_AT = (REVEAL - 1) / END
const BUILT_AT = 0.92

export interface HeroBuildHandle {
  /** scrub mode: the build's progress, 0 (an empty screen) to 1 (the finished site) */
  setProgress(p: number): void
}

export interface HeroBuildProps {
  engine: MotionEngine | null
  /** 'play' (default): the build plays once per visit when the screen comes into view. 'scrub': it follows setProgress. */
  mode?: 'play' | 'scrub'
  /** scrub mode: the Rive file (url) and the finished frame (SVG markup, imported ?raw) */
  src?: { riv: string; built: string }
  /** scrub mode: the still in the site's hero slot */
  poster?: string
}

export const HeroBuild = forwardRef<HeroBuildHandle, HeroBuildProps>(function HeroBuild(props, ref) {
  return props.mode === 'scrub' ? <ScrubBuild {...props} ref={ref} /> : <PlayBuild engine={props.engine} />
})

function PlayBuild({ engine }: { engine: MotionEngine | null }) {
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

/** After the page's load event and one idle slot (the wasm never competes with the first paint). */
function afterLoadIdle(run: () => void) {
  let idle = 0, timer = 0, done = false
  const go = () => {
    if (done) return
    if ('requestIdleCallback' in window) idle = window.requestIdleCallback(run, { timeout: 2000 })
    else timer = globalThis.setTimeout(run, 300) as unknown as number
  }
  if (document.readyState === 'complete') go()
  else window.addEventListener('load', go, { once: true })
  return () => {
    done = true
    window.removeEventListener('load', go)
    if (idle) window.cancelIdleCallback(idle)
    clearTimeout(timer)
  }
}

const ScrubBuild = forwardRef<HeroBuildHandle, HeroBuildProps>(function ScrubBuild({ engine, src, poster }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const box = useRef<HTMLDivElement>(null)
  // the scrub state lives outside React: a progress change writes two attributes and draws one frame
  const st = useRef({ p: 1, rive: null as Rive | null, inView: false, drawn: -1 })

  const apply = useCallback(() => {
    const s = st.current, el = box.current
    if (!el) return
    el.toggleAttribute('data-still', s.p >= STILL_AT)
    el.toggleAttribute('data-built', !s.rive && s.p >= BUILT_AT)
    if (s.rive && s.inView && s.p !== s.drawn) {
      s.drawn = s.p
      s.rive.scrub('Build', (s.p * END) / FPS)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    setProgress(p: number) {
      st.current.p = Math.min(1, Math.max(0, p))
      apply()
    },
  }), [apply])

  useEffect(() => {
    if (!engine || engine.PRERENDER || engine.REDUCE) return
    const cv = canvas.current, el = box.current
    if (!cv || !el) return
    const s = st.current
    let gone = false, rive: Rive | null = null
    let near: IntersectionObserver | null = null, seen: IntersectionObserver | null = null, resize: ResizeObserver | null = null
    // the drawing surface from the layout size (offsetWidth), not the projected rect: the lid is
    // rotated in 3D while it opens, which would squash a getBoundingClientRect() size
    const size = () => {
      if (!rive) return
      const d = Math.min(2, window.devicePixelRatio || 1)
      const w = Math.round(cv.offsetWidth * d), h = Math.round(cv.offsetHeight * d)
      if (!w || !h || (cv.width === w && cv.height === h)) return
      cv.width = w; cv.height = h
      rive.resizeToCanvas()
      s.drawn = -1
      apply()
    }
    const stop = () => { s.inView = false }

    const start = async () => {
      const { Rive, Layout, Fit, Alignment, RuntimeLoader } = await import('@rive-app/canvas-lite')
      if (gone) return
      RuntimeLoader.setWasmUrl(wasmUrl)
      // option A (CONTRACT.md) scrubs a named timeline on purpose: keep the console quiet about it
      Rive.suppressDeprecationWarnings = [...new Set([...Rive.suppressDeprecationWarnings, 'animations-param', 'scrub'] as const)]
      const r = new Rive({
        src: src?.riv ?? rivUrl, canvas: cv, artboard: 'Hero', animations: 'Build',
        autoplay: false, shouldDisableRiveListeners: true, isTouchScrollEnabled: true,
        layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
        onLoad: () => {
          if (gone) { r.cleanup(); return }
          rive = r
          s.rive = r
          s.drawn = -1
          el.setAttribute('data-live', '')
          size()
          apply()
          seen = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
              s.inView = true
              claimRive('hero', stop)
              s.drawn = -1
              apply()
            } else {
              s.inView = false
              releaseRive('hero')
            }
          })
          seen.observe(el)
          resize = new ResizeObserver(size)
          resize.observe(cv)
        },
      })
    }

    const cancelIdle = afterLoadIdle(() => {
      if (gone) return
      near = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return
        near?.disconnect()
        start().catch(() => { /* the fallback frames stay */ })
      }, { rootMargin: '150% 0px' })
      near.observe(el)
    })

    return () => {
      gone = true
      cancelIdle()
      near?.disconnect(); seen?.disconnect(); resize?.disconnect()
      releaseRive('hero')
      rive?.cleanup()
      rive = null
      s.rive = null
      s.inView = false
      el.removeAttribute('data-live')
      apply()
    }
  }, [engine, src, apply])

  return (
    <div ref={box} className="kh__build kh__build--scrub" data-still="" data-built="">
      <div className="kh__built" aria-hidden="true" dangerouslySetInnerHTML={{ __html: src?.built ?? builtSvg }} />
      <canvas ref={canvas} className="kh__rive" aria-hidden="true" />
      <div className="kh__slot" style={SLOT_STYLE}>
        {poster && <img className="kh__slot-still" src={poster} alt="" aria-hidden="true" loading="lazy" decoding="async" />}
      </div>
    </div>
  )
})
