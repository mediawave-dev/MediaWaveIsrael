// sea · a service page's own object (D133, D139): a slot in the page's first screen, between the trail
// and the words on a phone and beside the words when wide, where the field draws the service's object;
// the visitor's scroll through the first screen winds its take (the same gears as on the home page): the
// laptop and its lead, the phone page, the ranking, the chat, the cassette, the developing print.
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

  return <span ref={ref} className="sea-spot sea-spot--page" data-spot={SCENE[id] ?? 'quiet'} aria-hidden="true" />
}
