// wave · the laptop (D119): drawn in the wave's one line, seen from the front and a little above.
// Its lid is geared to the scroll (clock.ts): shut at the top of the page, open as the laptop reaches
// the middle of the screen, where the hero film plays on its screen (the hero video, sacred). The
// geometry is a projection of a lid of fixed length turning about the hinge, so it reads as one
// object at every frame: shut, the lid lies on the deck and shows the Horizon disc; open, the screen.
// No JS, the prerender and still mode: open, with the film's first frame (the poster).
// Pre-paint (index.html adds html.shot-dive on the home page when motion runs): the shut pose is
// painted from static markup until the first geared frame, so the open prerender never flashes.
import { useRef } from 'react'
import { HeroMedia } from '../parts/HeroMedia'
import { clamp01, docTop, useGear } from './clock'

// seen from about 28deg above: the deck shows its keyboard, the shut lid its whole back
const HINGE_Y = 292
const HINGE_HW = 200
const FRONT_DY = 118
const FRONT_HW = 262
const LID = 252
const OPEN_DEG = 102
const VIEW_W = 600
const VIEW_H = 430

type Pt = [number, number]
const mix = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** The lid's four corners at an angle (0 shut .. OPEN_DEG). */
function lid(deg: number): [Pt, Pt, Pt, Pt] {
  const th = (deg * Math.PI) / 180
  const yf = HINGE_Y + FRONT_DY * Math.cos(th) - LID * Math.sin(th)
  const hw = HINGE_HW + (FRONT_HW - HINGE_HW) * Math.cos(th)
  return [[300 - HINGE_HW, HINGE_Y], [300 + HINGE_HW, HINGE_Y], [300 + hw, yf], [300 - hw, yf]]
}
/** The screen inside the lid: u across, v from the hinge to the free edge. */
function screen(q: [Pt, Pt, Pt, Pt]): Pt[] {
  const at = (u: number, v: number) => mix(mix(q[0], q[1], u), mix(q[3], q[2], u), v)
  return [at(0.045, 0.07), at(0.955, 0.07), at(0.955, 0.955), at(0.045, 0.955)]
}
const DECK: [Pt, Pt, Pt, Pt] = [[300 - HINGE_HW, HINGE_Y], [300 + HINGE_HW, HINGE_Y], [300 + FRONT_HW, HINGE_Y + FRONT_DY], [300 - FRONT_HW, HINGE_Y + FRONT_DY]]
const onDeck = (u: number, v: number) => mix(mix(DECK[0], DECK[1], u), mix(DECK[3], DECK[2], u), v)
/** the keyboard (five rows) and the trackpad, printed on the deck */
const KEYS = [0.1, 0.19, 0.28, 0.37, 0.46, 0.55].map((v) => { const a = onDeck(0.07, v); const b = onDeck(0.93, v); return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}` }).join('')
  + (() => { const a = onDeck(0.07, 0.1); const b = onDeck(0.07, 0.55); const c = onDeck(0.93, 0.1); const d = onDeck(0.93, 0.55); return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}M${c[0].toFixed(1)} ${c[1].toFixed(1)}L${d[0].toFixed(1)} ${d[1].toFixed(1)}` })()
const PAD = [onDeck(0.36, 0.64), onDeck(0.64, 0.64), onDeck(0.64, 0.92), onDeck(0.36, 0.92)]
const DISC = onDeck(0.5, 0.5)
const DISC_RX = 44
const DISC_RY = 44 * (FRONT_DY / LID)
const pts = (p: Pt[]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
const poly = (p: Pt[]) => p.map(([x, y]) => `${((x / VIEW_W) * 100).toFixed(2)}% ${((y / VIEW_H) * 100).toFixed(2)}%`).join(', ')
const smooth = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t) }

/** The Horizon disc on the shut lid, foreshortened like the lid: ink above the wave, blue below. */
function Disc() {
  const [cx, cy] = DISC
  const w = `M${cx - DISC_RX} ${cy}q${DISC_RX / 2} ${-DISC_RY * 0.5} ${DISC_RX} 0t${DISC_RX} 0`
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={DISC_RX} ry={DISC_RY} />
      <path d={`${w}a${DISC_RX} ${DISC_RY} 0 0 1 ${-DISC_RX * 2} 0z`} />
    </>
  )
}

const SHUT = lid(0)
const OPEN = lid(OPEN_DEG)

export default function WaveLaptop() {
  const ref = useRef<HTMLDivElement>(null)
  const lidRef = useRef<SVGPolygonElement>(null)
  const scrRef = useRef<SVGPolygonElement>(null)
  const discRef = useRef<SVGGElement>(null)
  const filmRef = useRef<HTMLDivElement>(null)

  useGear(ref, (el, vh) => {
    const top = docTop(el)
    return [0, Math.max(vh * 0.4, top + el.offsetHeight / 2 - vh * 0.5)]
  }, (p) => {
    const deg = OPEN_DEG * p
    const q = lid(deg)
    const s = screen(q)
    const shut = deg < 12
    lidRef.current?.setAttribute('points', pts(q))
    lidRef.current?.classList.toggle('is-shut', shut)
    scrRef.current?.setAttribute('points', pts(s))
    scrRef.current?.style.setProperty('opacity', shut ? '0' : '1')
    discRef.current?.style.setProperty('opacity', String(1 - smooth(3, 12, deg)))
    const film = filmRef.current
    if (film) {
      film.style.clipPath = `polygon(${poly(s)})`
      film.style.opacity = String(smooth(55, 88, deg))
    }
    document.documentElement.classList.remove('shot-dive', 'shot-dive-calm')
  })

  const s = screen(OPEN)
  return (
    <div ref={ref} className="wv-lap" aria-hidden="true" data-zone="art">
      <svg className="wv-lap__svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} focusable="false">
        {/* the deck and its front lip */}
        <polygon className="wv-lap__deck" points={pts(DECK)} />
        <path className="wv-lap__keys" d={KEYS} />
        <polygon className="wv-lap__keys" points={pts(PAD)} />
        <path className="wv-lap__line" d={`M${300 - FRONT_HW} ${HINGE_Y + FRONT_DY}v8h${FRONT_HW * 2}v-8M266 ${HINGE_Y + FRONT_DY + 8}v-3h68v3`} />
        {/* live: geared */}
        <g className="wv-lap__live">
          <polygon ref={lidRef} className="wv-lap__lid" points={pts(OPEN)} />
          <polygon ref={scrRef} className="wv-lap__screen" points={pts(s)} />
          <g ref={discRef} className="wv-lap__disc" style={{ opacity: 0 }}><Disc /></g>
        </g>
        {/* pre-paint: the shut pose, static */}
        <g className="wv-lap__still">
          <polygon className="wv-lap__lid is-shut" points={pts(SHUT)} />
          <g className="wv-lap__disc"><Disc /></g>
        </g>
      </svg>
      <div ref={filmRef} className="wv-lap__film" style={{ clipPath: `polygon(${poly(s)})` }}>
        <HeroMedia sizes="(max-width: 767px) 86vw, 560px" />
      </div>
    </div>
  )
}
