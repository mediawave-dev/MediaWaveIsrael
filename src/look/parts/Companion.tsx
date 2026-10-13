// The contact companion (design/rive/companion/CONTRACT.md): the hero's laptop on the form,
// whose screen writes the visitor's message as they type, folds it into the Horizon line while
// it is sent, and fills into the mark when it arrives. Decorative: the form's own status and
// alert messages carry the meaning, so everything here is aria-hidden.
//
// Loading never competes with the page: the CSS rest pose (companion-rest.svg, the scene's idle
// pose generated from the same numbers) paints first; the Rive runtime (canvas-lite, about
// 0.9 MB of wasm, fingerprinted by Vite) loads only after the window's load event, an idle
// slot and the form coming within 600 px of the viewport. The swap is invisible because both
// poses are the same. REDUCE (the stop switch, prerender) never loads it; CALM (the OS flag)
// loads it without loops. Off screen it stops rendering.

import { useEffect, useRef, useState } from 'react'
import type { MotionEngine } from '../../motion/motion-engine.js'
import restUrl from './companion-rest.svg'
import rivUrl from './companion.riv?url'
import wasmUrl from '@rive-app/canvas-lite/rive.wasm?url'

export type CompanionStatus = 'idle' | 'typing' | 'loading' | 'sent' | 'error'

type Rive = import('@rive-app/canvas-lite').Rive
type VMI = NonNullable<Rive['viewModelInstance']>

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

interface Props {
  engine: MotionEngine | null
  status: CompanionStatus
  /** 0-100, how much of the page the message fills */
  progress: number
  /** increments on every keystroke in the form */
  keys: number
}

export default function Companion({ engine, status, progress, keys }: Props) {
  const box = useRef<HTMLSpanElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const vmi = useRef<VMI | null>(null)
  const latest = useRef({ status, progress })
  latest.current = { status, progress }
  const [live, setLive] = useState(false)

  // mount the runtime late, and only where motion is allowed
  useEffect(() => {
    const el = box.current, cv = canvas.current
    if (!engine || engine.PRERENDER || engine.REDUCE || !el || !cv) return
    let rive: Rive | null = null, gone = false, io: IntersectionObserver | null = null, seen: IntersectionObserver | null = null

    const start = async () => {
      const { Rive, Layout, Fit, Alignment, RuntimeLoader } = await import('@rive-app/canvas-lite')
      if (gone) return
      RuntimeLoader.setWasmUrl(wasmUrl)
      rive = new Rive({
        src: rivUrl, canvas: cv, artboard: 'Companion', stateMachines: 'Main',
        autoplay: true, autoBind: true, shouldDisableRiveListeners: true, isTouchScrollEnabled: true,
        layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
        onLoad: () => {
          if (gone || !rive) return
          rive.resizeDrawingSurfaceToCanvas()
          const v = rive.viewModelInstance ?? null
          vmi.current = v
          const reduced = v?.boolean('prefersReducedMotion')
          if (reduced) reduced.value = engine.CALM
          const st = v?.enum('status')
          if (st) st.value = latest.current.status
          const pr = v?.number('progress')
          if (pr) pr.value = latest.current.progress
          // writes apply on the next advance: show the canvas once that frame is drawn
          requestAnimationFrame(() => requestAnimationFrame(() => { if (!gone) setLive(true) }))
          // draw only while the laptop is on screen
          seen = new IntersectionObserver(([e]) => { if (!rive) return; if (e.isIntersecting) rive.startRendering(); else rive.stopRendering() })
          seen.observe(el)
        },
      })
    }

    let cancelIdle = () => {}
    io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io?.disconnect()
      cancelIdle = afterLoadAndIdle(() => { start().catch(() => {}) })
    }, { rootMargin: '600px 0px' })
    io.observe(el)

    const resize = new ResizeObserver(() => rive?.resizeDrawingSurfaceToCanvas())
    resize.observe(cv)

    return () => {
      gone = true
      io?.disconnect(); seen?.disconnect(); resize.disconnect(); cancelIdle()
      vmi.current = null
      rive?.cleanup()
      rive = null
      setLive(false)
    }
  }, [engine])

  useEffect(() => {
    const st = vmi.current?.enum('status')
    if (st) st.value = status
  }, [status, live])
  useEffect(() => {
    const pr = vmi.current?.number('progress')
    if (pr) pr.value = progress
  }, [progress, live])
  useEffect(() => {
    if (keys) vmi.current?.trigger('keystroke')?.trigger()
  }, [keys])

  return (
    <span ref={box} className="ct__pal" data-live={live ? '' : undefined} data-zone="art" aria-hidden="true">
      <img src={restUrl} alt="" width={330} height={216} decoding="async" />
      <canvas ref={canvas} />
    </span>
  )
}
