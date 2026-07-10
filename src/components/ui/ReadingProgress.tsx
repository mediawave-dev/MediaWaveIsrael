import { RefObject } from 'react'
import { m, useScroll } from 'framer-motion'

interface ReadingProgressProps {
  /** The article element whose read-through the bar tracks */
  target: RefObject<HTMLElement>
}

/**
 * Scroll-linked reading progress — a thin brand-gradient bar pinned above the
 * fixed header. Scroll feedback (not an ambient loop), so it stays active
 * under reduced motion, exactly like the scrollbar itself.
 */
export function ReadingProgress({ target }: ReadingProgressProps) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start start', 'end end'],
  })

  return (
    <m.div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 h-[3px] z-[60] pointer-events-none"
      style={{
        scaleX: scrollYProgress,
        // RTL: the bar fills from the right, following the reading direction
        transformOrigin: '100% 0',
        background: 'linear-gradient(270deg, #7DD3FC, #5EEAD4)',
      }}
    />
  )
}
