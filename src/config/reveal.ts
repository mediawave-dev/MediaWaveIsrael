/**
 * Scroll-reveal variant library — a small, curated set of entrance motions so
 * the page feels alive without every section sharing one uniform fade-up (the
 * AI-slop "reveal reflex"). Sits beside motion.ts and reuses the ONE signature
 * easing (EASE_BRAND) + DURATION steps from there.
 *
 * Each factory returns the SAME drop-in shape as fadeUpProps
 * ({ initial, whileInView, viewport, transition }) so it can be spread straight
 * onto any framer `m.*` element. Values use the `transform`/`filter`/`clipPath`
 * STRING form (matching the rest of the codebase, e.g. StaggeredWords) — never
 * mix with framer's `x`/`scale` shorthand on the same element.
 *
 * Prerender + a11y contract (see plan): variants only ever animate
 * transform / opacity / filter / clip-path — content is never removed from the
 * DOM. The reduced-motion path (useReveal) renders content FULLY VISIBLE and
 * UNCLIPPED, so a reveal that never fires can never ship a blank section.
 *
 * Stability contract (2026-09-06): a reveal must be FINISHED by the time the
 * block reaches the screen. Every variant therefore uses the shared
 * `inViewOnce` trigger (starts ~280px early), short durations, small distances
 * and a capped stagger. On touch devices the transform is dropped entirely —
 * a phone scrolls fast, and moving blocks under the thumb read as instability.
 */
import { useReducedMotion, useAmbientMotion } from '../hooks/useReducedMotion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { EASE_BRAND, DURATION, fadeUpProps, inViewOnce } from './motion'

export interface RevealOptions {
  /** px distance for slide/rise variants */
  distance?: number
  /** starting scale for scaleIn (e.g. 0.94) */
  from?: number
  /** blur radius in px for blurIn (bounded, ≤6 recommended) */
  blur?: number
  /** secondary Y offset (blurIn / rotateSubtle) */
  y?: number
  /** wipe direction for clipWipe — 'right' reveals right→left (RTL home base) */
  dir?: 'right' | 'left'
  /** tilt in degrees for rotateSubtle (≤2 recommended) */
  deg?: number
}

const viewportOnce = inViewOnce

/**
 * Grid stagger is a rhythm, not a queue. Call sites pass `index * 0.1`, which
 * left the sixth card in a row still arriving half a second after the first —
 * visible as a cascade while scrolling. Cap it.
 */
const capDelay = (delay: number) => Math.min(Math.max(delay, 0), 0.2)

/** RTL home base: content arrives from the reading edge (visual right). */
export const slideInRight = (delay = 0, o: RevealOptions = {}) => {
  const d = o.distance ?? 18
  return {
    initial: { opacity: 0, transform: `translateX(${d}px)` },
    whileInView: { opacity: 1, transform: 'translateX(0px)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.reveal, delay: capDelay(delay), ease: EASE_BRAND },
  }
}

/** Deliberate accent — the opposite framing (from the left). */
export const slideInLeft = (delay = 0, o: RevealOptions = {}) => {
  const d = o.distance ?? 18
  return {
    initial: { opacity: 0, transform: `translateX(-${d}px)` },
    whileInView: { opacity: 1, transform: 'translateX(0px)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.reveal, delay: capDelay(delay), ease: EASE_BRAND },
  }
}

/** Tiles/cards pop to scale — no overshoot (EASE_BRAND, not a back curve). */
export const scaleIn = (delay = 0, o: RevealOptions = {}) => {
  const from = o.from ?? 0.96
  return {
    initial: { opacity: 0, transform: `scale(${from})` },
    whileInView: { opacity: 1, transform: 'scale(1)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.reveal, delay: capDelay(delay), ease: EASE_BRAND },
  }
}

/**
 * Focus-pull with a bounded blur. Use on IMAGES / media only — never on text:
 * blurred Hebrew type reads as broken during the reveal (and lazy-mounted
 * sections play it right as they appear). For text, use a transform variant.
 */
export const blurIn = (delay = 0, o: RevealOptions = {}) => {
  const blur = o.blur ?? 6
  const y = o.y ?? 8
  return {
    initial: { opacity: 0, filter: `blur(${blur}px)`, transform: `translateY(${y}px)` },
    whileInView: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.normal, delay: capDelay(delay), ease: EASE_BRAND },
  }
}

/**
 * Editorial wipe. Opacity stays 1 throughout so text is never invisible
 * mid-wipe (crawlers ignore geometric clipping). RTL default reveals right→left.
 * Use on STATIC panels/blocks only — never on interactive components (a stuck
 * clip hides the control) or on lazy-mounted centerpieces. For those, use a
 * transform variant.
 */
export const clipWipe = (delay = 0, o: RevealOptions = {}) => {
  const dir = o.dir ?? 'right'
  const hidden = dir === 'right' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)'
  const shown = 'inset(0 0 0 0%)'
  return {
    initial: { opacity: 1, clipPath: hidden, WebkitClipPath: hidden },
    whileInView: { opacity: 1, clipPath: shown, WebkitClipPath: shown },
    viewport: viewportOnce,
    transition: { duration: DURATION.normal, delay: capDelay(delay), ease: EASE_BRAND },
  }
}

/** Rise from a mask — pair with a clipping host (Reveal adds one). */
export const maskRise = (delay = 0, o: RevealOptions = {}) => {
  const d = o.distance ?? 14
  return {
    initial: { opacity: 0, transform: `translateY(${d}px)` },
    whileInView: { opacity: 1, transform: 'translateY(0px)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.reveal, delay: capDelay(delay), ease: EASE_BRAND },
  }
}

/** Whisper of a tilt as it rises — never elastic, ≤2°. */
export const rotateSubtle = (delay = 0, o: RevealOptions = {}) => {
  const deg = o.deg ?? 1.5
  const y = o.y ?? 10
  return {
    initial: { opacity: 0, transform: `translateY(${y}px) rotate(${deg}deg)` },
    whileInView: { opacity: 1, transform: 'translateY(0px) rotate(0deg)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.reveal, delay: capDelay(delay), ease: EASE_BRAND },
  }
}

export type RevealVariant =
  | 'fadeUp'
  | 'slideInRight'
  | 'slideInLeft'
  | 'scaleIn'
  | 'blurIn'
  | 'clipWipe'
  | 'maskRise'
  | 'rotateSubtle'

/** Typed registry — keeps <Reveal variant="…"> and useReveal type-safe. */
export const REVEAL_VARIANTS = {
  fadeUp: (delay = 0, o: RevealOptions = {}) => fadeUpProps(capDelay(delay), o.distance ?? 12),
  slideInRight,
  slideInLeft,
  scaleIn,
  blurIn,
  clipWipe,
  maskRise,
  rotateSubtle,
} satisfies Record<RevealVariant, (delay?: number, o?: RevealOptions) => unknown>

/** Instant, fully-visible — the hard accessibility kill-switch fallback. */
export const REVEAL_VISIBLE = {
  initial: { opacity: 1 },
  whileInView: { opacity: 1 },
  viewport: viewportOnce,
  transition: { duration: 0 },
}

/**
 * Touch path. A phone scrolls in fast flicks, so any block still travelling
 * when the thumb passes it reads as the page being unstable: keep the arrival
 * (a short crossfade, so nothing snaps) and drop the movement.
 *
 * It zeroes the variant's magnitudes rather than swapping in an opacity-only
 * object. `useMediaQuery` is false on the first (prerender-safe) render and
 * flips after mount, so a swap would leave whatever the first render set —
 * measured: cards stuck at `translateX(18px)` with opacity already 1. Keeping
 * the SAME animated properties means the reveal always lands them at rest.
 */
const TOUCH_OPTS: RevealOptions = { distance: 0, from: 1, blur: 0, y: 0, deg: 0 }

/**
 * Reduced-motion fallback. Carries ONLY opacity — never filter/clip/transform —
 * so content is always fully visible and unclipped. fadeOnly=true keeps a gentle
 * crossfade (OS "reduce" pref); false is the instant, fully-visible form.
 */
export function revealFallback(fadeOnly = true) {
  if (!fadeOnly) return REVEAL_VISIBLE
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: viewportOnce,
    transition: { duration: 0.3, ease: 'linear' as const },
  }
}

/**
 * Reads the reduced-motion signals and the pointer type ONCE and returns a
 * plain (non-hook) builder. Use this when reveals are produced inside a
 * `.map()` — calling the builder in a loop is fine (it is not a hook), whereas
 * calling useReveal there would break the Rules of Hooks.
 *   const reveal = useRevealFactory()
 *   items.map((it, i) => <m.div {...reveal('scaleIn', i * 0.1)} whileHover={…} />)
 */
export function useRevealFactory() {
  const prefersReduced = useReducedMotion()
  const ambient = useAmbientMotion()
  const isTouch = useMediaQuery('(pointer: coarse)')

  return (variant: RevealVariant, delay = 0, opts: RevealOptions = {}) => {
    if (!ambient) return REVEAL_VISIBLE
    if (prefersReduced) return revealFallback(true)
    // A clip wipe has no magnitude to zero, so on touch it becomes a crossfade.
    if (isTouch) {
      const v = variant === 'clipWipe' ? 'fadeUp' : variant
      return REVEAL_VARIANTS[v](0, { ...opts, ...TOUCH_OPTS })
    }
    return REVEAL_VARIANTS[variant](delay, opts)
  }
}

/**
 * The ergonomic entry point for a SINGLE element. Spread it onto an existing
 * `m.*` element:
 *   <m.div {...useReveal('slideInRight', 0.1)} whileHover={{ y: -4 }} />
 * Self-gates on both reduced-motion signals (site kill-switch → instant visible,
 * OS prefers-reduced-motion → gentle opacity crossfade, touch → crossfade only,
 * else the variant). For reveals inside a loop, use useRevealFactory() instead.
 */
export function useReveal(variant: RevealVariant, delay = 0, opts: RevealOptions = {}) {
  return useRevealFactory()(variant, delay, opts)
}
