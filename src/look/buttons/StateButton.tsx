// One press / force / state engine for both button families (DECISIONS #50).
// Seven states: idle, hover, pressed, focus (CSS + forced by data-force for the state strip),
// loading, sent, error (data-state, driven by the real form). The label is real text; every
// decorative layer is aria-hidden. Pointer following is fine-pointer only: touch gets the
// press response and nothing else. The pointer writes one transform on one small element
// per event (never a custom property fanned out over a subtree).

import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react'

export type BtnState = 'idle' | 'loading' | 'sent' | 'error'
export type BtnForce = 'hover' | 'pressed' | 'focus' | undefined

export const STATE_LABEL: Record<Exclude<BtnState, 'idle'>, string> = {
  loading: 'שולחים',
  sent: 'נשלח. נחזור אליכם היום', // [קופי: נתי] the promise needs his OK
  error: 'לא נשלח. נסו שוב',
}

export interface LookButtonProps {
  children: ReactNode
  href?: string
  target?: string
  rel?: string
  type?: 'button' | 'submit'
  state?: BtnState
  /** States strip only: force hover, press or focus for screenshots. */
  force?: BtnForce
  size?: 'sm' | 'lg'
  /** Stretch to the container (forms, phones). */
  block?: boolean
  disabled?: boolean
  className?: string
  ariaLabel?: string
  /** Announce state changes (the form's submit button). */
  live?: boolean
  /** The overlap audit's zone; CTAs inside the header pass none. */
  zone?: 'text'
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

export interface Pointer {
  /** 0..1 across and down the button */
  x: number
  y: number
  w: number
  h: number
}

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function StateButton({
  cls, render, onPoint, children, href, target, rel, type = 'button', state = 'idle', force, size = 'lg',
  block, disabled, className = '', ariaLabel, live, zone, onClick,
}: LookButtonProps & {
  cls: string
  render: (label: ReactNode, state: BtnState) => ReactNode
  /** Called with the pointer position (fine pointers only), and with null on leave. */
  onPoint?: (el: HTMLElement, p: Pointer | null) => void
}) {
  const [pressed, setPressed] = useState(false)
  const fine = useRef(false)
  useEffect(() => { fine.current = finePointer() }, [])
  const label = state === 'idle' ? children : STATE_LABEL[state]

  const point = (e: React.PointerEvent<HTMLElement>) => {
    if (!onPoint || !fine.current || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    onPoint(e.currentTarget, { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, w: r.width, h: r.height })
  }
  const shared = {
    className: `${cls} ${className}`.trim(),
    'data-state': state,
    'data-force': force,
    'data-size': size,
    'data-block': block ? '' : undefined,
    'data-pressed': pressed || force === 'pressed' ? '' : undefined,
    'data-zone': zone,
    'aria-label': ariaLabel,
    onPointerEnter: point,
    onPointerMove: point,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerCancel: () => setPressed(false),
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
      setPressed(false)
      if (onPoint && fine.current) onPoint(e.currentTarget, null)
    },
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') setPressed(true) },
    onKeyUp: () => setPressed(false),
    onBlur: () => setPressed(false),
    onClick,
  }
  const inner = render(<span aria-live={live ? 'polite' : undefined}>{label}</span>, state)
  if (href) return <a href={href} target={target} rel={rel} {...shared}>{inner}</a>
  return (
    <button type={type} disabled={disabled} aria-busy={state === 'loading' || undefined} {...shared}>
      {inner}
    </button>
  )
}
