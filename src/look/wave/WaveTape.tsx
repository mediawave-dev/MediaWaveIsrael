// wave · the tape (D119, the details lab's cassette; method: harvest mr-pandas.md). A cassette in the
// wave's line, its two reels geared to the scroll: the tape is conserved, so the pack that empties
// turns faster, as on a real deck, and scrolling back rewinds it. Under it, a deck's counter and its
// state (PLAY while the reader moves down, REW up, STOP at rest). Still mode: the last frame.
import { useRef } from 'react'
import { docTop, useGear } from './clock'

const R0 = 22
const R1 = 52
const TAPE = 5200
const L = { x: 228, y: 150 }
const R = { x: 372, y: 150 }
const DEG = 180 / Math.PI

const teeth = [0, 60, 120, 180, 240, 300].map((a) => <path key={a} d="M0 -16v6" transform={`rotate(${a})`} />)

export default function WaveTape() {
  const ref = useRef<HTMLDivElement>(null)
  const packL = useRef<SVGCircleElement>(null)
  const packR = useRef<SVGCircleElement>(null)
  const hubL = useRef<SVGGElement>(null)
  const hubR = useRef<SVGGElement>(null)
  const tape = useRef<SVGPathElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const state = useRef<HTMLSpanElement>(null)
  const ang = useRef({ l: 0, r: 0 })

  useGear(ref, (el, vh) => {
    const top = docTop(el)
    return [top - vh * 0.9, top + el.offsetHeight - vh * 0.1]
  }, (p, v) => {
    const rl = Math.sqrt(R0 * R0 + (1 - p) * (R1 * R1 - R0 * R0))
    const rr = Math.sqrt(R0 * R0 + p * (R1 * R1 - R0 * R0))
    const ds = v * TAPE
    ang.current.l += (ds / rl) * DEG
    ang.current.r += (ds / rr) * DEG
    packL.current?.setAttribute('r', rl.toFixed(2))
    packR.current?.setAttribute('r', rr.toFixed(2))
    hubL.current?.setAttribute('transform', `translate(${L.x} ${L.y}) rotate(${ang.current.l.toFixed(1)})`)
    hubR.current?.setAttribute('transform', `translate(${R.x} ${R.y}) rotate(${ang.current.r.toFixed(1)})`)
    tape.current?.setAttribute('d', `M${(L.x - rl * 0.6).toFixed(1)} ${(L.y + rl * 0.8).toFixed(1)}L168 300H432L${(R.x + rr * 0.6).toFixed(1)} ${(R.y + rr * 0.8).toFixed(1)}`)
    if (count.current) count.current.textContent = String(Math.round(p * 1800)).padStart(4, '0')
    if (state.current) state.current.textContent = v > 0.0004 ? '▶ PLAY' : v < -0.0004 ? '◀◀ REW' : '■ STOP'
  })

  return (
    <div ref={ref} className="wv-tape" aria-hidden="true" data-zone="art">
      <svg className="wv-tape__svg" viewBox="0 0 600 360" focusable="false">
        <defs>
          <clipPath id="wv-tape-window"><rect x="140" y="104" width="320" height="92" rx="46" /></clipPath>
        </defs>
        <rect className="wv-tape__body" x="8" y="8" width="584" height="344" rx="20" />
        <rect className="wv-tape__label" x="46" y="36" width="508" height="196" rx="10" />
        <text className="wv-tape__brand" x="300" y="76" textAnchor="middle" direction="ltr">MediaWave</text>
        <rect className="wv-tape__window" x="140" y="104" width="320" height="92" rx="46" />
        <g clipPath="url(#wv-tape-window)">
          <circle ref={packL} className="wv-tape__pack" cx={L.x} cy={L.y} r={R0} />
          <circle ref={packR} className="wv-tape__pack" cx={R.x} cy={R.y} r={R1} />
        </g>
        <g ref={hubL} className="wv-tape__hub" transform={`translate(${L.x} ${L.y})`}><circle r="16" />{teeth}</g>
        <g ref={hubR} className="wv-tape__hub" transform={`translate(${R.x} ${R.y})`}><circle r="16" />{teeth}</g>
        <path ref={tape} className="wv-tape__tape" d={`M${L.x - R0 * 0.6} ${L.y + R0 * 0.8}L168 300H432L${R.x + R1 * 0.6} ${R.y + R1 * 0.8}`} />
        <path className="wv-tape__line" d="M196 352L214 300H386L404 352" />
        <circle className="wv-tape__line" cx="246" cy="326" r="7" />
        <circle className="wv-tape__line" cx="354" cy="326" r="7" />
      </svg>
      <p className="wv-tape__deck"><span ref={count} className="wv-tape__count">1800</span><span ref={state} className="wv-tape__state">■ STOP</span></p>
    </div>
  )
}
