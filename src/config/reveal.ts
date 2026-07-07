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
 */
import { useReducedMotion, useAmbientMotion } from '../hooks/useReducedMotion'
import { EASE_BRAND, DURATION, fadeUpProps } from './motion'

export interface RevealOptions {
  /** px distance for slide/rise variants */
  distance?: number
  /** starting scale for scaleIn (e.g. 0.92) */
  from?: number
  /** blur radius in px for blurIn (bounded, ≤8 recommended) */
  blur?: number
  /** secondary Y offset (blurIn / rotateSubtle) */
  y?: number
  /** wipe direction for clipWipe — 'right' reveals right→left (RTL home base) */
  dir?: 'right' | 'left'
  /** tilt in degrees for rotateSubtle (≤2 recommended) */
  deg?: number
}

const viewportOnce = { once: true as const }

/** RTL home base: content arrives from the reading edge (visual right). */
export const slideInRight = (delay = 0, o: RevealOptions = {}) => {
  const d = o.distance ?? 32
  return {
    initial: { opacity: 0, transform: `translateX(${d}px)` },
    whileInView: { opacity: 1, transform: 'translateX(0px)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.normal, delay, ease: EASE_BRAND },
  }
}

/** Deliberate accent — the opposite framing (from the left). */
export const slideInLeft = (delay = 0, o: RevealOptions = {}) => {
  const d = o.distance ?? 32
  return {
    initial: { opacity: 0, transform: `translateX(-${d}px)` },
    whileInView: { opacity: 1, transform: 'translateX(0px)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.normal, delay, ease: EASE_BRAND },
  }
}

/** Tiles/cards pop to scale — no overshoot (EASE_BRAND, not a back curve). */
export const scaleIn = (delay = 0, o: RevealOptions = {}) => {
  const from = o.from ?? 0.92
  return {
    initial: { opacity: 0, transform: `scale(${from})` },
    whileInView: { opacity: 1, transform: 'scale(1)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.normal, delay, ease: EASE_BRAND },
  }
}

/**
 * Focus-pull with a bounded blur. Use on IMAGES / media only — never on text:
 * blurred Hebrew type reads as broken during the ~0.9s reveal (and lazy-mounted
 * sections play it right as they appear). For text, use a transform variant.
 */
export const blurIn = (delay = 0, o: RevealOptions = {}) => {
  const blur = o.blur ?? 8
  const y = o.y ?? 12
  return {
    initial: { opacity: 0, filter: `blur(${blur}px)`, transform: `translateY(${y}px)` },
    whileInView: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.slow, delay, ease: EASE_BRAND },
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
    transition: { duration: DURATION.slow, delay, ease: EASE_BRAND },
  }
}

/** Rise from a mask — pair with an overflow-hidden host (Reveal adds one). */
export const maskRise = (delay = 0, o: RevealOptions = {}) => {
  const d = o.distance ?? 26
  return {
    initial: { opacity: 0, transform: `translateY(${d}px)` },
    whileInView: { opacity: 1, transform: 'translateY(0px)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.normal, delay, ease: EASE_BRAND },
  }
}

/** Whisper of a tilt as it rises — never elastic, ≤2°. */
export const rotateSubtle = (delay = 0, o: RevealOptions = {}) => {
  const deg = o.deg ?? 2
  const y = o.y ?? 18
  return {
    initial: { opacity: 0, transform: `translateY(${y}px) rotate(${deg}deg)` },
    whileInView: { opacity: 1, transform: 'translateY(0px) rotate(0deg)' },
    viewport: viewportOnce,
    transition: { duration: DURATION.normal, delay, ease: EASE_BRAND },
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
  fadeUp: (delay = 0, o: RevealOptions = {}) => fadeUpProps(delay, o.distance ?? 20),
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
 * Reads the two reduced-motion signals ONCE and returns a plain (non-hook)
 * builder. Use this when reveals are produced inside a `.map()` — calling the
 * builder in a loop is fine (it is not a hook), whereas calling useReveal there
 * would break the Rules of Hooks.
 *   const reveal = useRevealFactory()
 *   items.map((it, i) => <m.div {...reveal('scaleIn', i * 0.1)} whileHover={…} />)
 */
export function useRevealFactory() {
  const prefersReduced = useReducedMotion()
  const ambient = useAmbientMotion()

  return (variant: RevealVariant, delay = 0, opts: RevealOptions = {}) => {
    if (!ambient) return REVEAL_VISIBLE
    if (prefersReduced) return revealFallback(true)
    return REVEAL_VARIANTS[variant](delay, opts)
  }
}

/**
 * The ergonomic entry point for a SINGLE element. Spread it onto an existing
 * `m.*` element:
 *   <m.div {...useReveal('slideInRight', 0.1)} whileHover={{ y: -4 }} />
 * Self-gates on both reduced-motion signals (site kill-switch → instant visible,
 * OS prefers-reduced-motion → gentle opacity crossfade, else the variant).
 * For reveals inside a loop, use useRevealFactory() instead.
 */
export function useReveal(variant: RevealVariant, delay = 0, opts: RevealOptions = {}) {
  return useRevealFactory()(variant, delay, opts)
}
