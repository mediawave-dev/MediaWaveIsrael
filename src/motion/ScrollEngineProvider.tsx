// React bridge for the scroll engine (pattern-breaker motion-engine.js, MediaWave policy patch).
//
//   <ScrollEngineProvider>{children}</ScrollEngineProvider>        // once, inside the router
//   const ref = useScene<HTMLElement>((engine, root) => { ... });  // in any component
//
// Framer Motion (components/MotionProvider.tsx) stays the owner of component state: menus,
// modals, accordions, presence. This engine owns scroll: Lenis, ScrollTrigger, reveals, stages.
// One owner per element per property.

import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { useGSAP } from '@gsap/react'
import { createMotionEngine, type MotionEngine } from './motion-engine.js'
import { useAmbientMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const EngineContext = createContext<MotionEngine | null>(null)

/** Scroll to the element the URL hash names, instantly (deep links, route changes). */
function hashTarget(): HTMLElement | null {
  if (!location.hash) return null
  try {
    return document.getElementById(decodeURIComponent(location.hash.slice(1)))
  } catch {
    return null // malformed hash
  }
}

export function ScrollEngineProvider({ children }: { children: ReactNode }) {
  const [engine, setEngine] = useState<MotionEngine | null>(null)
  // The accessibility widget's "stop animations" (html.disable-animations) is the full stop:
  // a reduced engine replaces the running one without a reload, and every useScene re-runs.
  const ambient = useAmbientMotion()
  const { pathname } = useLocation()

  useEffect(() => {
    const e = createMotionEngine({ gsap, ScrollTrigger, SplitText, Lenis }, { reduce: !ambient })
    // CSS-only ambient loops (floating objects) stop under the OS flag; ?motion=full lifts it
    const calm = e.CALM && !e.PRERENDER
    document.documentElement.classList.toggle('motion-calm', calm)
    setEngine(e)
    return () => { e.destroy(); document.documentElement.classList.remove('motion-calm') } // the second StrictMode mount gets a fresh engine
  }, [ambient])

  // Content that mounts late (lazy sections, a variant swap) moves every trigger below it, and
  // ScrollTrigger only re-measures on resize, fonts and load: re-measure when the page's height
  // changes, once scrolling is calm (safeRefresh waits for a lifted finger and 350 ms of quiet).
  useEffect(() => {
    if (!engine || engine.PRERENDER || typeof ResizeObserver === 'undefined') return
    let h = document.body.scrollHeight
    let timer = 0
    const ro = new ResizeObserver(() => {
      const nh = document.body.scrollHeight
      if (Math.abs(nh - h) < 2) return
      h = nh
      clearTimeout(timer)
      timer = window.setTimeout(() => engine.safeRefresh(), 200)
    })
    ro.observe(document.body)
    return () => { ro.disconnect(); clearTimeout(timer) }
  }, [engine])

  // Deep link (/#contact) on first load: held stages grow after mount, which moves the target the
  // browser already jumped to. Re-land on it once fonts are in and the triggers have measured.
  const landed = useRef(false)
  useEffect(() => {
    if (!engine || landed.current) return
    landed.current = true
    const target = hashTarget()
    if (!target) return
    engine.fontsReady.then(() => {
      ScrollTrigger.refresh()
      target.scrollIntoView({ behavior: 'auto' })
      engine.lenis?.resize()
    })
  }, [engine])

  // Route change: go to the top (or the new URL's #hash), then re-measure. Not on the first run.
  const prevPath = useRef(pathname)
  useEffect(() => {
    if (!engine || prevPath.current === pathname) return
    prevPath.current = pathname
    const target = hashTarget()
    if (engine.lenis) engine.lenis.scrollTo(target ?? 0, { immediate: true, force: true })
    else if (target) target.scrollIntoView({ behavior: 'auto' })
    else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname, engine])

  return <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
}

export function useMotionEngine(): MotionEngine | null {
  return useContext(EngineContext)
}

/**
 * A scene scoped to one component. Everything gsap creates inside `setup` (tweens, timelines,
 * ScrollTriggers, SplitText) is reverted when the component unmounts, the engine is replaced
 * (accessibility switch) or `deps` change. The markup must already show the final state: the
 * scene hides things just before animating them, never the other way round.
 */
export function useScene<T extends HTMLElement = HTMLElement>(
  setup: (engine: MotionEngine, scope: T) => void | (() => void),
  deps: unknown[] = [],
): RefObject<T> {
  const scope = useRef<T>(null)
  const engine = useMotionEngine()
  useGSAP(
    () => {
      if (!engine || !scope.current || engine.PRERENDER) return
      return setup(engine, scope.current)
    },
    { scope, dependencies: [engine, ...deps], revertOnUpdate: true },
  )
  return scope
}
