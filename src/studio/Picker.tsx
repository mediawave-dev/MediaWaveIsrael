// The style picker: four chips in the thumb's reach, in the site's own language (bracketed mono labels,
// a hairline capsule). Each chip is a disc split by a wave, in the style's ground and ink.
import { STYLES, type StyleDef } from './registry'
import { waForStyle } from './lead'
import { track } from '../utils/analytics'

export interface PickAt { x: number; y: number }

function Disc({ ground, ink }: { ground: string; ink: string }) {
  return (
    <svg className="st-chip__disc" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="11" fill={ground} />
      <path d="M1 13.2c3.4-2.6 6.6-2.6 10 0s6.6 2.6 12 0V14a11 11 0 0 1-22 0z" fill={ink} />
      <circle cx="12" cy="12" r="11.25" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.5" />
    </svg>
  )
}

export default function Picker({ current, onPick, busy }: { current: StyleDef; onPick: (s: StyleDef, at: PickAt) => void; busy: boolean }) {
  return (
    <nav className="st-pick" aria-label="בחירת סגנון" data-busy={busy || undefined}>
      <div className="st-pick__top">
        {/* the configurator's action: the style on screen goes straight to WhatsApp [קופי: נתי] */}
        <a className="st-pick__want" href={waForStyle(current)} target="_blank" rel="noopener noreferrer"
          onClick={() => track('cta_click', { location: `styles_want_${current.id}` })}>אני רוצה כזה <span aria-hidden="true">←</span></a>
        <p className="st-pick__credit" dir="ltr">
          <span className="st-pick__k" lang="en">( Inspired by )</span>{' '}
          <a href={current.creditUrl} target="_blank" rel="noopener noreferrer" aria-label={`בהשראת ${current.credit}`}>{current.credit} ↗</a>
        </p>
      </div>
      <ul className="st-pick__row">
        {STYLES.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className="st-chip"
              aria-pressed={s.id === current.id}
              aria-label={`סגנון ${s.name}: ${s.feel}`}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                onPick(s, { x: r.left + r.width / 2, y: r.top + r.height / 2 })
              }}
            >
              <Disc ground={s.swatch[0]} ink={s.swatch[1]} />
              <span className="st-chip__name">{s.name}</span>
              <span className="st-chip__n" aria-hidden="true">0{i + 1}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
