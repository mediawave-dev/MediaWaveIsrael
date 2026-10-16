// shot · build a chapter's scene only when the chapter comes near. Building every chapter's
// triggers and first renders at load was the page's biggest blocking work: React mounted all the
// chapters in one commit and their scenes created about 50 ScrollTriggers and their immediate
// renders together (a 0.57 s task at 4x CPU and a Lighthouse TBT of 2.6 s, against 0.25 s on KM).
// A chapter below the first view now builds its scene when it is within 1.5 viewports, at the
// next idle slot: its transforms only move paper that is still off screen, and nothing measures
// layout differently (transforms do not move layout), so the result is the same page.
import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { useMotionEngine } from '../../motion/ScrollEngineProvider'
import type { MotionEngine } from '../../motion/motion-engine'

/** True once `target()` has come within `margin` of the viewport, then at the next idle slot. */
export function useNear(target: () => Element | null, margin = '150% 0px'): boolean {
  const [near, setNear] = useState(false)
  useEffect(() => {
    if (near) return
    const el = target()
    // the engine's ?at=<id>:<p> QA hook (scroll-film, overlap-audit) looks its trigger up at load
    const qa = /[?&]at=/.test(window.location.search)
    if (!el || qa || !('IntersectionObserver' in window)) { setNear(true); return }
    let idle = 0
    let timer = 0
    const go = () => setNear(true)
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      io.disconnect()
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(go, { timeout: 400 })
      else timer = setTimeout(go, 50) as unknown as number
    }, { rootMargin: margin })
    io.observe(el)
    return () => {
      io.disconnect()
      if (idle) window.cancelIdleCallback(idle)
      clearTimeout(timer)
    }
  }, [near]) // eslint-disable-line react-hooks/exhaustive-deps
  return near
}

/** useScene (ScrollEngineProvider) for a chapter below the first view: built once it comes near. */
export function useSceneNear<T extends HTMLElement = HTMLElement>(
  setup: (engine: MotionEngine, scope: T) => void | (() => void),
  deps: unknown[] = [],
  margin?: string,
) {
  const scope = useRef<T>(null)
  const engine = useMotionEngine()
  const near = useNear(() => scope.current, margin)
  useGSAP(
    () => {
      if (!engine || !scope.current || engine.PRERENDER || !near) return
      return setup(engine, scope.current)
    },
    { scope, dependencies: [engine, near, ...deps], revertOnUpdate: true },
  )
  return scope
}
