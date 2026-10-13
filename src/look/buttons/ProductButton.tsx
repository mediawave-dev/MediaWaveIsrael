// K · the product button: it tips toward the pointer like a product on a turntable and
// presses in. The tilt is one transform on the button itself; the press is `scale`, a
// separate property, so the two never fight. Touch: the press only.

import { StateButton, type LookButtonProps, type Pointer } from './StateButton'
import './product-button.css'

const tilt = (el: HTMLElement, p: Pointer | null) => {
  // the accessibility widget's stop switch stops this too
  el.style.transform = p && !document.documentElement.classList.contains('disable-animations')
    ? `perspective(520px) rotateX(${((p.y - 0.5) * -14).toFixed(2)}deg) rotateY(${((p.x - 0.5) * 16).toFixed(2)}deg)`
    : ''
}

export function ProductButton(props: LookButtonProps) {
  return (
    <StateButton
      {...props}
      cls="kbtn"
      onPoint={tilt}
      render={(label, state) => (
        <span className="kbtn__label">
          {state === 'sent' && <span className="kbtn__mark" aria-hidden="true">✓</span>}
          {label}
          {state === 'loading' && (
            <span className="kbtn__dots" aria-hidden="true"><i /><i /><i /></span>
          )}
        </span>
      )}
    />
  )
}
