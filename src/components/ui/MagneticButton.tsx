import { ReactNode, useCallback, useRef } from 'react'
import { m, useMotionValue, useSpring } from 'framer-motion'

/**
 * MagneticButton — primary CTAs lean 4-8px toward the cursor
 * (DESIGN-UPGRADE §4.8). Desktop pointers only: on coarse pointers the
 * listeners never fire meaningfully and the springs stay at 0, so mobile
 * pays nothing. Wrap the actual <a>/<button> with it.
 */

interface MagneticButtonProps {
  children: ReactNode
  /** Max pull distance in px */
  strength?: number
  className?: string
}

export function MagneticButton({ children, strength = 7, className = '' }: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 })

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      // fine pointers only — never magnetize touch
      if (!window.matchMedia('(pointer: fine)').matches) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
      x.set(relX * strength)
      y.set(relY * strength)
    },
    [strength, x, y]
  )

  const onMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <m.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </m.span>
  )
}

export default MagneticButton
