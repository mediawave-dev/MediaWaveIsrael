// KM · the iris (DECISIONS #64): the opener's lens in every button. On hover, keyboard focus or
// a press, a nine-sided aperture in the label's colour opens from the button's centre and fills
// it; inside the opening the label shows in the button's colour (a copy clipped with it), so the
// text is never hidden at any moment (Nati's rule). Loading keeps the button full and breathing; sent stays full; an
// error closes it. No line under or inside the label at rest: at rest the aperture is shut.
// Layers, one property owner each: .iris__fill `clip-path` and `opacity` (CSS).

import { StateButton, type LookButtonProps } from './StateButton'
import './iris-button.css'

export function IrisButton(props: LookButtonProps) {
  return (
    <StateButton
      {...props}
      cls="iris"
      render={(label, state) => {
        const text = (
          <>
            {state === 'sent' && <span aria-hidden="true">✓</span>}
            {label}
          </>
        )
        return (
          <>
            <span className="iris__label">{text}</span>
            {/* the opening carries the label in the button's colour, clipped with it, so every
                letter is readable at every moment: no masks, nothing moves */}
            <span className="iris__fill" aria-hidden="true"><span className="iris__label">{text}</span></span>
          </>
        )
      }}
    />
  )
}
