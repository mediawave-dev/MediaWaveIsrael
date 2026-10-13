// KM · the tide (DECISIONS #62): the opener's water in every button. On hover, keyboard focus
// or a press, water in the label's colour rises behind the label with the Horizon mark's wave on
// its surface and fills the button; the label, always on top and never masked, takes the
// button's colour as the water passes it (Nati: the text is never hidden). Loading keeps the
// button full with the wave running along its top edge; sent stays full; an error drains it.
// No line under or inside the label at rest (Nati's rule): at rest the water waits below the
// button's edge.
// Layers, one property owner each: .tide__sea `transform` (the level, CSS) and its mask's
// position (the wave running while loading, CSS); .tide__label `color` (CSS).

import { StateButton, type LookButtonProps } from './StateButton'
import './tide-button.css'

export function TideButton(props: LookButtonProps) {
  return (
    <StateButton
      {...props}
      cls="tide"
      render={(label, state) => (
        <>
          <span className="tide__sea" aria-hidden="true" />
          <span className="tide__label">
            {state === 'sent' && <span aria-hidden="true">✓</span>}
            {label}
          </span>
        </>
      )}
    />
  )
}
