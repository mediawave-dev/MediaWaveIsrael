/**
 * Central motion config — the ONE signature easing for the whole site.
 * Every new framer-motion transition must import from here instead of
 * declaring its own ease. (DESIGN-UPGRADE §2: one signature easing,
 * cubic-bezier(0.16, 1, 0.3, 1) — same value as --ease-brand in CSS.)
 */
export const EASE_BRAND = [0.16, 1, 0.3, 1] as const

/** Standard entrance duration steps */
export const DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.9,
} as const

/** Shared whileInView entrance — fade + rise with the brand easing */
export const fadeUpProps = (delay = 0, distance = 20) => ({
  initial: { opacity: 0, transform: `translateY(${distance}px)` },
  whileInView: { opacity: 1, transform: 'translateY(0px)' },
  viewport: { once: true as const },
  transition: { duration: DURATION.normal, delay, ease: EASE_BRAND },
})

/** Stagger container for word/child reveals */
export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})
