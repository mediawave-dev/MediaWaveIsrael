/**
 * GiantWord — one Hebrew word stretched across the viewport
 * (DESIGN-UPGRADE §4.9). Outline type that fills on hover — a pure-CSS
 * typographic confidence statement. Decorative: hidden from screen
 * readers (the real CTA lives in the Contact section right below).
 */

interface GiantWordProps {
  /** [קופי: נתי — מילת הענק] */
  word: string
  /** Background = the color of the adjacent sections */
  bg?: string
}

export function GiantWord({ word, bg = '#F8FAFC' }: GiantWordProps) {
  return (
    <div className="giant-word-strip" style={{ background: bg }} aria-hidden="true">
      <span className="giant-word">{word}</span>
    </div>
  )
}

export default GiantWord
