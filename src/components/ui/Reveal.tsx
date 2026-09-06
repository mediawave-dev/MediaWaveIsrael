import { ReactNode } from 'react'
import { m } from 'framer-motion'
import { useReveal, RevealVariant, RevealOptions } from '../../config/reveal'

/**
 * Entrance-only reveal wrapper for PLAIN blocks (headers, columns, quotes).
 * Picks a curated variant from src/config/reveal.ts and self-gates on
 * reduced-motion. For hover-enabled cards, prefer spreading useReveal(...)
 * onto the existing `m.*` element instead (keeps whileHover, no extra DOM).
 */
interface RevealProps {
  variant?: RevealVariant
  delay?: number
  /** grid rhythm: final delay = delay + staggerIndex * staggerStep */
  staggerIndex?: number
  staggerStep?: number
  as?: 'div' | 'section' | 'article' | 'span' | 'li'
  options?: RevealOptions
  className?: string
  /** host class for the overflow-hidden mask (maskRise / clipWipe) */
  wrapperClassName?: string
  children: ReactNode
}

const NEEDS_MASK: RevealVariant[] = ['maskRise', 'clipWipe']

export function Reveal({
  variant = 'fadeUp',
  delay = 0,
  staggerIndex = 0,
  staggerStep = 0.1,
  as = 'div',
  options,
  className,
  wrapperClassName,
  children,
}: RevealProps) {
  const props = useReveal(variant, delay + staggerIndex * staggerStep, options)
  const MotionTag = m[as] as typeof m.div

  const el = (
    <MotionTag className={className} {...props}>
      {children}
    </MotionTag>
  )

  if (NEEDS_MASK.includes(variant)) {
    return <div className={wrapperClassName ?? 'overflow-clip'}>{el}</div>
  }
  return el
}
