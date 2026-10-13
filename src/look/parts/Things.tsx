// M's floating tools: a laptop, a phone, a loupe, a chat bubble, a cassette and a photo
// frame, each a charcoal body with a white face. Drawn in em, so the font-size of the
// context sets the size (the hero hangs them small; the flight draws them at their largest
// and only ever scales them down, so nothing is upscaled and blurred).

import type { ReactNode } from 'react'
import './things.css'

export const KINDS = ['laptop', 'phone', 'loupe', 'bubble', 'cassette', 'frame'] as const
export type Kind = (typeof KINDS)[number]

/** Body size in em, for fitting an object into its zone. */
export const THING_EM: Record<Kind, [number, number]> = {
  laptop: [52, 36],
  phone: [27, 50],
  loupe: [40, 46],
  bubble: [48, 38],
  cassette: [52, 33],
  frame: [44, 44],
}

export function Thing({ kind, children, className = '' }: { kind: Kind; children?: ReactNode; className?: string }) {
  return (
    <span className={`thing thing--${kind} ${className}`}>
      <span className="thing__body">
        <span className="thing__face">{children}</span>
        {kind === 'cassette' && <><i className="thing__reel" /><i className="thing__reel" /></>}
        {kind === 'loupe' && <i className="thing__handle" />}
        {kind === 'laptop' && <i className="thing__deck" />}
        {kind === 'bubble' && <i className="thing__tail" />}
      </span>
    </span>
  )
}
