// M and KM · the lens: a small disc follows the pointer inside the button and inverts what
// it passes over (mix-blend-mode only on the disc's own track); a press grows it until it fills the
// button. In KM it also takes a light version of the product button's tilt (DECISIONS #50).
// Layers, one property owner each: .lens__pos `transform` (the pointer, written here),
// .lens__disc `scale` (hover/press, CSS), .lens__track `translate` (the loading scan, CSS).

import { StateButton, type LookButtonProps, type Pointer } from './StateButton'
import './lens-button.css'

const stopped = () => document.documentElement.classList.contains('disable-animations')

function follow(tilt: boolean) {
  return (el: HTMLElement, p: Pointer | null) => {
    const pos = el.querySelector<HTMLElement>('.lens__pos')
    if (pos && p) pos.style.transform = `translate(${((p.x - 0.5) * p.w).toFixed(1)}px, ${((p.y - 0.5) * p.h).toFixed(1)}px)`
    if (!tilt) return
    el.style.transform = p && !stopped()
      ? `perspective(600px) rotateX(${((p.y - 0.5) * -6).toFixed(2)}deg) rotateY(${((p.x - 0.5) * 7).toFixed(2)}deg)`
      : ''
  }
}

const plain = follow(false)
const tilted = follow(true)

export function LensButton({ tilt = false, ...props }: LookButtonProps & { tilt?: boolean }) {
  return (
    <StateButton
      {...props}
      cls={tilt ? 'lens lens--tilt' : 'lens'}
      onPoint={tilt ? tilted : plain}
      render={(label, state) => (
        <>
          <span className="lens__label">
            {state === 'sent' && <span aria-hidden="true">✓</span>}
            {label}
          </span>
          <span className="lens__track" aria-hidden="true">
            <span className="lens__pos"><span className="lens__disc" /></span>
          </span>
        </>
      )}
    />
  )
}

/** KM's variant: the lens with the calm tilt. */
export function LensTiltButton(props: LookButtonProps) {
  return <LensButton {...props} tilt />
}
