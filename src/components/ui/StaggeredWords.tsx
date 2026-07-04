import { m } from 'framer-motion'
import { EASE_BRAND } from '../../config/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * StaggeredWords — kinetic Hebrew headline reveal (DESIGN-UPGRADE §4.1).
 * Splits by WORDS ONLY — splitting Hebrew letters breaks glyph shaping.
 * Each word sits in an overflow-hidden span and rises y:110%→0 with the
 * brand easing. In RTL the DOM order is the reading order, so the stagger
 * naturally flows right-to-left.
 * Screen readers get the intact sentence (sr-only); the animated copy is
 * aria-hidden.
 */

interface StaggeredWordsProps {
  text: string
  /** Base delay before the first word (seconds) */
  delay?: number
  stagger?: number
  className?: string
}

export function StaggeredWords({ text, delay = 0, stagger = 0.08, className = '' }: StaggeredWordsProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>
  }

  const words = text.split(' ')

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span
              className="inline-block overflow-hidden align-bottom"
              style={{ paddingBottom: '0.08em', marginBottom: '-0.08em' }}
            >
              <m.span
                className="inline-block"
                initial={{ transform: 'translateY(110%)' }}
                animate={{ transform: 'translateY(0%)' }}
                transition={{
                  duration: 0.7,
                  delay: delay + i * stagger,
                  ease: EASE_BRAND,
                }}
              >
                {word}
              </m.span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </span>
  )
}

export default StaggeredWords
