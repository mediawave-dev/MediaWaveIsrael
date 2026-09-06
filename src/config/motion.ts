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
  /** scroll entrances: short enough that they are over before you look */
  reveal: 0.35,
  normal: 0.6,
  slow: 0.9,
} as const

/**
 * The ONE in-view trigger for the whole site.
 *
 * framer's default fires an entrance the moment a block's leading edge touches
 * the viewport edge, so a 0.45-0.6s animation is still running while the
 * visitor scrolls over it — measured on a phone, 20 of 21 scroll steps had a
 * block mid-entrance, which reads as the page being unstable. A POSITIVE
 * bottom margin grows the observer root downward, so the entrance starts
 * ~600px before the block appears and has settled by the time it is seen.
 * 600px is a phone flick: at 280px a fast scroll still landed on blocks that
 * were mid-entrance. Negative margins do the opposite and must never be used.
 */
export const inViewOnce = { once: true as const, margin: '0px 0px 600px 0px' }

/** Shared whileInView entrance — fade + rise with the brand easing */
export const fadeUpProps = (delay = 0, distance = 20) => ({
  initial: { opacity: 0, transform: `translateY(${distance}px)` },
  whileInView: { opacity: 1, transform: 'translateY(0px)' },
  viewport: inViewOnce,
  transition: { duration: DURATION.reveal, delay, ease: EASE_BRAND },
})

/** Stagger container for word/child reveals */
export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})
