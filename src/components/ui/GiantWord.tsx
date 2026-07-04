import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * GiantWord — one Hebrew word stretched across the viewport
 * (DESIGN-UPGRADE §4.9). Outline type that fills with color.
 * Desktop: fills on hover (interplay). Touch devices have no hover, so
 * the fill triggers when the word reaches mid-viewport instead.
 * Decorative: hidden from screen readers (the real CTA is right below).
 */

interface GiantWordProps {
  /** [קופי: נתי — מילת הענק] */
  word: string
  /** Background = the color of the adjacent sections */
  bg?: string
}

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export function GiantWord({ word, bg = '#F8FAFC' }: GiantWordProps) {
  const ref = useRef<HTMLDivElement>(null)
  // fires when the word crosses the middle band of the viewport
  const inView = useInView(ref, { margin: '-35% 0px -35% 0px' })
  const touchFill = isCoarsePointer() && inView

  return (
    <div ref={ref} className="giant-word-strip" style={{ background: bg }} aria-hidden="true">
      <span className={`giant-word${touchFill ? ' giant-word-filled' : ''}`}>{word}</span>
    </div>
  )
}

export default GiantWord
