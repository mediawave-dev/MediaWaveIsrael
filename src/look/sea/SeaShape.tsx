// sea · a service page's own object (D133): the page's first screen marks the service's scene, and the
// visitor's scroll through it winds the object's take (the same gears as on the home page), so every
// service page opens on its own moving object: the laptop and its lead, the phone page, the ranking,
// the chat, the cassette, the developing print. Its parent is the page's top block.
import { useRef } from 'react'
import { docTop, useGear } from '../wave/clock'
import { SCENE, reels, serviceAt } from './gears'

export default function SeaShape({ id }: { id: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const tape = useRef(reels())

  useGear(ref, (el, vh) => {
    const top = docTop(el.parentElement ?? el)
    return [top - vh * 0.05, top + vh * 1.05]
  }, (p) => {
    // the take starts a little open, so the first screen already shows the object at work
    const q = 0.18 + 0.82 * p
    if (id === 'video-editing') tape.current(q)
    else serviceAt(id, q)
  }, [id])

  return <span ref={ref} className="sea-shape" data-scene={SCENE[id] ?? 'quiet'} aria-hidden="true" />
}
