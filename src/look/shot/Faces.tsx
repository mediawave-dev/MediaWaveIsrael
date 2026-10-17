// shot · faces for the desk props (critic #8: some props had blank white faces). Each prop shows
// what it is for, drawn in ink lines on its white face: the phone a small site, the bubble a reply
// being typed, the frame a photo of a horizon, the cassette a handwritten label, the loupe a
// magnified line of text. Decorative only (the props are aria-hidden), no text, no colour.
import type { Kind } from '../parts/Things'

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export function DeskFace({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'phone':
      return (
        <svg className="desk-face" viewBox="0 0 50 96" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path {...S} d="M10 14h12M33 14h7" />
          <rect {...S} x="9" y="24" width="32" height="22" rx="2" />
          <path {...S} d="M12 41l8-8 6 6 4-4 8 7" />
          <path {...S} d="M9 55h32M9 62h24M9 69h28" />
          <rect x="9" y="77" width="32" height="8" rx="1.5" fill="currentColor" />
        </svg>
      )
    case 'bubble':
      return (
        <svg className="desk-face" viewBox="0 0 44 30" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <circle cx="13" cy="15" r="3.2" fill="currentColor" />
          <circle cx="22" cy="15" r="3.2" fill="currentColor" opacity="0.6" />
          <circle cx="31" cy="15" r="3.2" fill="currentColor" opacity="0.3" />
        </svg>
      )
    case 'frame':
      return (
        <svg className="desk-face desk-face--frame" viewBox="0 0 40 40" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <circle {...S} cx="26" cy="14" r="4.5" />
          <path {...S} d="M6 30c5-6 9-8 13-5s8 2 15-4" />
          <path {...S} d="M6 34h28" />
        </svg>
      )
    case 'cassette':
      return (
        <svg className="desk-face" viewBox="0 0 48 14" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path {...S} strokeWidth={1.8} d="M6 6c3-2 5 2 8 0s5-2 7 0M25 6h8M36 6c2-1.6 4 1.6 6 0" />
          <path {...S} strokeWidth={1.4} d="M6 10.5h36" opacity="0.45" />
        </svg>
      )
    case 'loupe':
      return (
        <svg className="desk-face" viewBox="0 0 40 40" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path {...S} strokeWidth={3} d="M9 16h22M9 24h15" />
          <path {...S} strokeWidth={3} d="M28 24h3" opacity="0.4" />
        </svg>
      )
    default:
      return null
  }
}
