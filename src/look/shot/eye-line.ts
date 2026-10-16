// shot · the eye line (SPEC 1.8, storyboard rule 5): only the Lottie whose item sits in the eye band
// plays (--eye-top .36 to --eye-bottom .62 of the viewport, looks.css). An item enters when its
// centre is inside the band and leaves only once its centre is 4% outside it and no other item is
// inside: the hysteresis keeps a Lottie from flickering on and off at the edge. Leaving the
// chapter resets `active` to -1 (LottieIcon drops its own off-screen pause once `active` is set,
// so a stale index would keep a Lottie running off screen). Building is gated too: an item's
// Lottie is built when it is the active one or a neighbour, or once the chapter's idle warm-up
// (useIdleWarm, 150% ahead) reached it. Render every Lottie through Art with `activeFor` / `load`.
import { createElement, useCallback, useRef, useState, type RefObject } from 'react'
import type { MotionEngine } from '../../motion/motion-engine'
import { useIdleWarm } from '../scenes/idle-warm'
import { Art } from '../parts/Art'
import type { ShowItem } from '../data'
import POSTERS from './lottie-posters.json'

/** The still of an item's Lottie (scripts/lottie-posters.mjs), keyed by the decoded path. */
export function posterFor(lottie?: string): { src: string; frame: number } | undefined {
  if (!lottie) return undefined
  return (POSTERS as Record<string, { src: string; frame: number }>)[decodeURI(lottie)]
}

/** The band's hysteresis: the leave lines sit this far (fraction of the viewport) outside it. */
const SLACK = 0.04

function band() {
  const cs = getComputedStyle(document.documentElement)
  const top = parseFloat(cs.getPropertyValue('--eye-top')) || 0.36
  const bottom = parseFloat(cs.getPropertyValue('--eye-bottom')) || 0.62
  return { top, bottom }
}

export interface EyeLine {
  /** the item in the eye band, -1 when none */
  active: number
  /** call once in the chapter's scene, with its section and the items in render order */
  setup: (t: MotionEngine, root: HTMLElement, items: HTMLElement[]) => void
  /** Art's `active` for item i: false for everything under REDUCE (a still page, each Lottie on its
      finished frame through rest 'last'; ?reduce=1 used to leave them all playing) */
  activeFor: (i: number, lit?: boolean) => boolean
  /** Art's `load` for item i: active ±1, or warmed; nothing under REDUCE (the posters are the still page) */
  load: (i: number) => boolean
}

/**
 * @param ref the chapter's section (drives the idle warm-up); optional
 * @param n   how many items the chapter has (0 = no warm-up beyond the first item)
 */
export function useEyeLine(ref?: RefObject<HTMLElement | null>, n = 0): EyeLine {
  const [active, setActive] = useState(-1)
  const [still, setStill] = useState(false)
  const [warm, setWarm] = useState<Set<number>>(() => new Set([0]))
  const none = useRef<HTMLElement | null>(null)
  useIdleWarm(ref ?? none, n, setWarm)
  const current = useRef(-1)

  const setup = useCallback((t: MotionEngine, root: HTMLElement, items: HTMLElement[]) => {
    const set = (i: number) => {
      if (i === current.current) return
      current.current = i
      setActive(i)
    }
    set(-1)
    setStill(t.REDUCE)
    if (t.REDUCE || !items.length) return

    const { top, bottom } = band()
    const outerTop = top - SLACK
    const outerBottom = bottom + SLACK
    const span = outerBottom - outerTop
    const inner = items.map(() => false)
    const outer = items.map(() => false)
    const pos = items.map(() => 1) // the centre's position in the viewport, 0 top to 1 bottom

    const decide = () => {
      const a = current.current
      let best = -1
      for (let i = 0; i < items.length; i++) {
        if (!inner[i]) continue
        if (best < 0 || Math.abs(pos[i] - 0.5) < Math.abs(pos[best] - 0.5)) best = i
      }
      if (best >= 0) return set(best)
      set(a >= 0 && outer[a] ? a : -1) // still within the slack and nobody else in: stay
    }

    items.forEach((item, i) => {
      t.ScrollTrigger.create({
        trigger: item,
        start: `center ${outerBottom * 100}%`,
        end: `center ${outerTop * 100}%`,
        onUpdate: (self) => {
          pos[i] = outerBottom - self.progress * span
          inner[i] = pos[i] <= bottom && pos[i] >= top
          decide()
        },
        onToggle: (self) => {
          outer[i] = self.isActive
          if (!self.isActive) inner[i] = false
          decide()
        },
      })
    })

    // leaving the chapter either way: nothing of it plays
    t.ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => set(-1),
      onLeaveBack: () => set(-1),
    })
  }, [])

  const activeFor = useCallback((i: number, lit = true) => !still && lit && active === i, [active, still])
  const load = useCallback((i: number) => !still && (Math.abs(active - i) <= 1 || warm.has(i)), [active, warm, still])

  return { active, setup, activeFor, load }
}

/** An item's artwork gated by the eye line: `lit` lets a chapter add its own condition (a screen switched on). */
export function EyeArt({ eye, i, item, size, lit = true }: { eye: EyeLine; i: number; item: ShowItem; size: number; lit?: boolean }) {
  return createElement(Art, { item, size, active: eye.activeFor(i, lit), load: eye.load(i), rest: 'last', poster: posterFor(item.lottie) })
}
