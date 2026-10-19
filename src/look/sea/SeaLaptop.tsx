// sea · the laptop (D119, D133, in the dot field): the chapter holds the screen (a sticky stage) while
// one scroll number drives the whole laptop at a fixed ratio, eased twice (wave/clock.ts, the Mr. Pandas
// gearing). The lid, drawn in dots, turns about the hinge; past the edge-on point the screen faces the
// reader and tells the H1's promise in one take: code types itself, the code becomes a small business
// site, the site scrolls with the reader, a cursor taps its WhatsApp key, and a lead rises out of the
// screen as a blue bubble. Scroll back and the take runs backwards. Without WebGL (and in still mode) a
// plain drawn screen stands in its place.
import { useRef, type ReactNode } from 'react'
import { docTop, useGear } from '../wave/clock'
import { laptopAt } from './gears'

export default function SeaLaptop({ children }: { children: ReactNode }) {
  const run = useRef<HTMLDivElement>(null)

  useGear(run, (el, vh) => {
    const top = docTop(el)
    return [top - vh * 0.25, top + el.offsetHeight - vh]
  }, laptopAt)

  return (
    <div ref={run} className="sea-lap" data-cursor="גללו, והמחשב נפתח">
      <div className="sea-lap__stage">
        {/* the laptop's slot (D139): above the words on a phone, beside them when wide */}
        <span className="sea-spot sea-spot--lap" data-spot="laptop" aria-hidden="true">
          <span className="sea-lap__still"><i /><i /><i /><b /></span>
        </span>
        {children}
      </div>
    </div>
  )
}
