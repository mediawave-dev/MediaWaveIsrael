import { useState, useEffect } from 'react'

/**
 * Hook to detect user's reduced motion preference
 * Respects prefers-reduced-motion media query for accessibility
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Returns animation variants that respect reduced motion preferences
 * Use this to conditionally apply or skip animations
 */
export function useMotionSafe<T extends Record<string, unknown>>(
  normalAnimation: T,
  reducedAnimation?: Partial<T>
): T {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return { ...normalAnimation, ...reducedAnimation } as T
  }

  return normalAnimation
}

/**
 * Standard reduced motion variants for common animations
 */
export const reducedMotionVariants = {
  // Fade only (no movement)
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  // Instant (no animation)
  instant: {
    initial: {},
    animate: {},
    transition: { duration: 0 },
  },

  // Subtle scale (minimal movement)
  subtleScale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 },
  },
}

/**
 * Transition config that respects reduced motion
 * Returns instant transitions when reduced motion is preferred
 */
export function useReducedTransition(normalTransition: Record<string, unknown>) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return { duration: 0.1, ease: 'linear' }
  }

  return normalTransition
}
