// The K laptop, drawn in CSS: a lid on a hinge over a thin aluminium base. The hero shows it
// open with the hero video on its screen; the launch hold opens the lid and turns it per
// announcement. Scenes write `transform` on .lap (the turn) and .lap__lid (the hinge)
// directly, one element each, never through an inherited custom property.

import { forwardRef, type ReactNode } from 'react'
import './laptop.css'

export const Laptop = forwardRef<HTMLDivElement, { children?: ReactNode; className?: string }>(function Laptop({ children, className = '' }, ref) {
  return (
    <div ref={ref} className={`lap ${className}`} aria-hidden="true">
      <div className="lap__lid">
        <div className="lap__screen">{children}</div>
        <span className="lap__cam" />
      </div>
      <div className="lap__base"><span className="lap__notch" /></div>
    </div>
  )
})
