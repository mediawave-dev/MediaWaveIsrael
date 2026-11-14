// sun · the MW mark of the footer (Nati, 13.11.2026): the short form of the name. The M and W of the logo he picked, between
// code brackets, and under them the disc sitting on a rule that reads as its horizon, with the line WEB DEVELOPMENT.
//
// D268 (Nati, 14.11.2026): the mark opens into the header's logo and closes back. A tap on it (the brackets are the sign)
// opens the full logo, the brackets turn round to say "close", and a second tap closes it, the brackets turning back.
// The first time the footer comes into view it plays the closing once, from the full logo to MW.
// The two drawings use different letters, so the change is made one letter at a time: the header's M and the MW's M
// are given the same lean and the same box at every moment, and they cross over only in the middle of the move, so the
// eye follows one letter that leans and changes rather than one font giving way to another. "edia" and "ave" fold into
// the last stroke of their capitals, the W rides beside the folding letters and locks onto the M's peak (they share it),
// the disc travels from beside the name to its horizon, the rule draws out from it and the line comes up.
// The markup is the closed mark, so without scripts, in the prerender, with ?calm=1 or with "ללא אנימציות" the
// visitor sees the mark, and a tap switches at once. Only transforms and opacity change, on one small SVG.
import { useEffect, useId, useRef, useState } from 'react'
import { EMBLEM } from './emblem-art'
import { MARK } from './brand-art'
import { OPEN } from './emblem-open'
import { track } from '../utils/analytics'

const T = 1600 // ms, one full move
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a))
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const out = (t: number) => 1 - Math.pow(1 - t, 3)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const n = (v: number) => +v.toFixed(3)

// the header's logo placed in the mark's space: its M on the MW's M (centre 178, 230), its capitals 150 high
const LEAN = 13.5 // degrees: the MW's letters lean 36 across 150
const [mx0, my0, mx1, my1] = OPEN.M.box
const K = 150 / (my1 - my0)
const MX = (mx0 + mx1) / 2, MY = (my0 + my1) / 2
const TX = (x: number) => 178 + (x - MX) * K
const TY = (y: number) => 230 + (y - MY) * K
const T_OPEN = `translate(178 230) scale(${n(K)}) translate(${n(-MX)} ${n(-MY)})`
const M_W = mx1 - mx0, W_W = OPEN.W.box[2] - OPEN.W.box[0]
const WX = (OPEN.W.box[0] + OPEN.W.box[2]) / 2, W_OPEN_C = TX(WX), W_OPEN_W = W_W * K
const UM = mx1 - 0.1 * M_W, UW = OPEN.W.box[2] - 0.1 * W_W // fold lines inside the capitals' last strokes
const GAP = TX(OPEN.W.box[0]) - TX(OPEN.edia.box[2])
const PICK_M_UP = 144, PICK_W_UP = 154 // the MW's M and W stood upright (their width less the lean)
const D0 = { cx: TX(OPEN.disc.cx), cy: TY(OPEN.disc.cy), d: OPEN.disc.d * K }
const D1 = EMBLEM.disc
const RULE = { l: [105, 219], r: [281, 395] } as const
const AVAIL = 740 // of the 800 units the mark is wide

/** brackets and container from the content's edges; the disc's own size depends on the scale, so it is solved in turn */
function frame(left: (d: number) => number, right: number, kb: number, dScreen: number) {
  let scale = 0.5, bL = 0, bR = 0, d = dScreen / scale
  for (let i = 0; i < 4; i++) {
    d = dScreen / scale
    bL = left(d) - lerp(70, 38, kb); bR = right + lerp(70, 28, kb)
    scale = Math.min(1, AVAIL / (bR - bL + lerp(56, 40, kb)))
  }
  return { scale, bL, bR, d }
}
// how big the disc looks in the open logo, so that its size on the screen only ever shrinks on the way to the horizon
const OPEN_FRAME = frame((d) => D0.cx - d / 2, TX(OPEN.ave.box[2]), 0, D0.d * 0.5)
const DISC_SCREEN_0 = D0.d * frame((d) => D0.cx - d / 2, TX(OPEN.ave.box[2]), 0, D0.d * OPEN_FRAME.scale).scale

/** every moving part at p (0: the header's full logo, 1: the MW mark) */
function pose(p: number) {
  const c1 = inOut(seg(p, 0, 0.5)), c2 = inOut(seg(p, 0.06, 0.56)), s1 = 1 - c1, s2 = 1 - c2
  const m = inOut(seg(p, 0.2, 0.7)), lock = inOut(seg(p, 0.3, 0.72))
  // the two drawings of a letter never show together: at the middle of the lean, under a light sideways blur, one gives
  // way to the other within two frames, so the letter stays full and dark and the eye reads one letter in motion that
  // changes its shape (a slow cross-fade of two different letters shows both, half strong)
  const xIn = seg(p, 0.435, 0.455), xOut = xIn, blur = Math.sin(Math.PI * seg(p, 0.34, 0.55))
  const ey = inOut(seg(p, 0.05, 0.5)), ex = inOut(seg(p, 0.15, 0.75)), es = inOut(seg(p, 0.05, 0.65))
  const kb = inOut(seg(p, 0.45, 0.95)), kr = out(seg(p, 0.62, 0.92)), kt = out(seg(p, 0.7, 1)), cl = inOut(p)
  const ediaRight = TX(UM + (OPEN.edia.box[2] - UM) * s1)
  const wWidth = lerp(W_OPEN_W, 190, m)
  // the W keeps its distance from the folding "a", so the word never comes apart, then locks onto the M's peak
  const cxW = lerp(ediaRight + GAP + wWidth / 2, 327, lock)
  const dxW = cxW - W_OPEN_C
  const aveRight = TX(UW + (OPEN.ave.box[2] - UW) * s2) + dxW
  const mLeft = lerp(TX(mx0), 88, m)
  const cx = lerp(D0.cx, D1.cx, ex), cy = lerp(D0.cy, D1.cy, ey)
  const right = Math.max(cxW + wWidth / 2, s2 > 0.02 ? aveRight : 0, s1 > 0.02 ? ediaRight : 0)
  const f = frame((d) => Math.min(cx - d / 2, mLeft), right, kb, lerp(DISC_SCREEN_0, D1.d, es))
  const mid = (f.bL + f.bR) / 2, turn = n(180 * (1 - kb)), bs = n(lerp(1.35, 1, kb)) // the brackets a little larger while open
  const lean = (k: number) => n(LEAN * k)
  return {
    all: `translate(250 ${n(lerp(272, 230, cl))}) scale(${n(f.scale)}) translate(${n(-mid)} -230)`,
    bl: `translate(${n(f.bL - 50)} 0) rotate(${turn} 50 230) translate(50 230) scale(${bs}) translate(-50 -230)`,
    br: `translate(${n(f.bR - 450)} 0) rotate(${turn} 450 230) translate(450 230) scale(${bs}) translate(-450 -230)`,
    oM: `translate(178 230) skewX(${lean(-m)}) scale(${n(lerp(K, PICK_M_UP / M_W, m))} ${n(K)}) translate(${n(-MX)} ${n(-MY)})`,
    pM: `translate(178 230) skewX(${lean(1 - m)}) scale(${n(lerp((M_W * K) / PICK_M_UP, 1, m))} 1) translate(-178 -230)`,
    oW: `translate(${n(cxW)} 230) skewX(${lean(-m)}) scale(${n(lerp(K, PICK_W_UP / W_W, m))} ${n(K)}) translate(${n(-WX)} ${n(-MY)})`,
    pW: `translate(${n(cxW)} 230) skewX(${lean(1 - m)}) scale(${n(lerp((W_W * K) / PICK_W_UP, 1, m))} 1) translate(-327 -230)`,
    oOp: n(1 - xOut), pOp: n(xIn), blur: n(blur),
    edia: `${T_OPEN} translate(${n(UM)} 0) scale(${n(Math.max(0.001, s1))} 1) translate(${n(-UM)} 0)`, ediaOp: n(1 - seg(c1, 0.7, 0.97)),
    dropOp: n(1 - seg(p, 0, 0.18)),
    ave: `translate(${n(dxW)} 0) ${T_OPEN} translate(${n(UW)} 0) scale(${n(Math.max(0.001, s2))} 1) translate(${n(-UW)} 0)`, aveOp: n(1 - seg(c2, 0.5, 0.88)),
    disc: `translate(${n(cx - f.d / 2)} ${n(cy - f.d / 2)}) scale(${n(f.d / 100)})`,
    rl: `M${n(RULE.l[1] - (RULE.l[1] - RULE.l[0]) * kr)} ${D1.cy}H${RULE.l[1]}`, rr: `M${RULE.r[0]} ${D1.cy}H${n(RULE.r[0] + (RULE.r[1] - RULE.r[0]) * kr)}`, rOp: n(kr),
    tag: `translate(0 ${n((1 - kt) * 10)})`, tagOp: n(kt),
  }
}
type Pose = ReturnType<typeof pose>

export default function Emblem() {
  const id = useId().replace(/:/g, '')
  const ref = useRef<SVGSVGElement>(null)
  const [open, setOpen] = useState(false)
  // the move's state lives outside React: p (where it is), target (where it goes), and the function the effect builds
  const st = useRef({ p: 1, target: 1, go: (target: number) => { st.current.target = target } })

  useEffect(() => {
    const el = ref.current
    if (!el || (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    const html = document.documentElement
    const calm = /[?&]calm=1(&|$)/.test(location.search)
    const moving = () => !calm && !html.classList.contains('disable-animations')
    const q = (k: string) => el.querySelector<SVGElement>(`[data-k="${k}"]`)!
    const g = Object.fromEntries(['all', 'bl', 'br', 'lt', 'oM', 'pM', 'oW', 'pW', 'edia', 'drop', 'ave', 'disc', 'rl', 'rr', 'tag'].map((k) => [k, q(k)])) as Record<string, SVGElement>
    const blurFx = el.querySelector(`#${id}b feGaussianBlur`)!
    const set = (k: string, a: string, v: string | number) => g[k].setAttribute(a, String(v))
    const apply = (o: Pose) => {
      for (const k of ['all', 'bl', 'br', 'oM', 'pM', 'oW', 'pW', 'edia', 'ave', 'disc', 'tag'] as const) set(k, 'transform', o[k])
      set('oM', 'opacity', o.oOp); set('oW', 'opacity', o.oOp); set('pM', 'opacity', o.pOp); set('pW', 'opacity', o.pOp)
      set('edia', 'opacity', o.ediaOp); set('drop', 'opacity', o.dropOp); set('ave', 'opacity', o.aveOp)
      set('rl', 'd', o.rl); set('rr', 'd', o.rr); set('rl', 'opacity', o.rOp); set('rr', 'opacity', o.rOp); set('tag', 'opacity', o.tagOp)
      // the blur is attached only while it does something, so the mark at rest is never filtered
      if (o.blur > 0.04) { blurFx.setAttribute('stdDeviation', `${n(6 * o.blur)} ${n(0.8 * o.blur)}`); g.lt.setAttribute('filter', `url(#${id}b)`) }
      else g.lt.removeAttribute('filter')
    }
    const s = st.current
    let raf = 0, last = 0
    const tick = (t: number) => {
      const dt = Math.max(0, t - last); last = t // never negative: a frame's time can be a hair before the start
      s.p = s.target > s.p ? Math.min(s.target, s.p + dt / T) : Math.max(s.target, s.p - dt / T)
      apply(pose(s.p))
      raf = s.p !== s.target ? requestAnimationFrame(tick) : 0
    }
    // go to a state: moving when motion is allowed (reversing mid-way is seamless, it is the same path), at once when not
    s.go = (target: number) => {
      s.target = target
      if (!moving()) { cancelAnimationFrame(raf); raf = 0; s.p = target; apply(pose(target)); return }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick) }
    }
    // the first sight of the footer: from the full logo to MW, once. Not when it is on screen already at load.
    let io: IntersectionObserver | null = null
    const r = el.getBoundingClientRect()
    if (moving() && !(r.top < innerHeight && r.bottom > 0)) {
      s.p = 0; s.target = 0; apply(pose(0)); setOpen(true)
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io?.disconnect(); setOpen(false); s.go(1) } }, { threshold: 0.6 })
      io.observe(el)
    }
    // turning animations off finishes any move where it was going
    const mo = new MutationObserver(() => { if (!moving() && s.p !== s.target) s.go(s.target) })
    mo.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => { io?.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); s.p = 1; s.target = 1; apply(pose(1)) }
  }, [id])

  const toggle = () => {
    const s = st.current
    const next = s.target === 1 ? 0 : 1
    setOpen(next === 0)
    s.go(next)
    track('cta_click', { placement: next === 0 ? 'footer_mark_open' : 'footer_mark_close' })
  }

  const { cx, cy, d } = EMBLEM.disc
  const grad = (k: 'm' | 'w', x1: number, x2: number) => (
    <linearGradient id={`${id}${k}`} gradientUnits="userSpaceOnUse" x1={x1} y1="155" x2={x2} y2="305">
      <stop offset="0" className={k === 'w' ? 'walk-w0' : undefined} style={{ stopColor: `var(--mw-${k}0)` }} />
      <stop offset="1" className={k === 'w' ? 'walk-w1' : undefined} style={{ stopColor: `var(--mw-${k}1)` }} />
    </linearGradient>
  )
  const closed = pose(1)
  return (
    <button type="button" className="foot__mark" aria-pressed={open} aria-label="MediaWave, הלוגו המלא" onClick={toggle}>
      <svg ref={ref} className="mw-logo mw-emblem" viewBox="-150 137 800 285" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          {grad('m', 88, 268)}{grad('w', 232, 422)}
          <filter id={`${id}b`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="0 0" /></filter>
        </defs>
        <g data-k="all">
          <g fill="none" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
            <g data-k="bl"><polyline points={EMBLEM.bracketL} style={{ stroke: 'var(--mw-m1)', opacity: 0.38 }} /></g>
            <g data-k="br"><polyline className="walk-stroke" points={EMBLEM.bracketR} style={{ stroke: 'var(--mark-b)', opacity: 0.7 }} /></g>
          </g>
          {/* the header's logo, folded away while the mark is closed */}
          <g data-k="edia" opacity="0" transform={closed.edia}>
            <path transform={`translate(${OPEN.edia.x} 0)`} d={OPEN.edia.d} style={{ fill: 'var(--logo-a)' }} />
            <path data-k="drop" className="walk-text" transform={`translate(${OPEN.drop.x} 0)`} d={OPEN.drop.d} style={{ fill: 'var(--logo-b)' }} />
          </g>
          <g data-k="lt">
          <g data-k="oM" opacity="0" transform={closed.oM}><path transform={`translate(${OPEN.M.x} 0)`} d={OPEN.M.d} style={{ fill: 'var(--logo-a)' }} /></g>
          <g data-k="pM" transform={closed.pM}><path d={EMBLEM.M} fill={`url(#${id}m)`} /></g>
          <g data-k="ave" opacity="0" transform={closed.ave}><path className="walk-text" transform={`translate(${OPEN.ave.x} 0)`} d={OPEN.ave.d} style={{ fill: 'var(--logo-b)' }} /></g>
          <g data-k="oW" opacity="0" transform={closed.oW}><path className="walk-text" transform={`translate(${OPEN.W.x} 0)`} d={OPEN.W.d} style={{ fill: 'var(--logo-b)' }} /></g>
          <g data-k="pW" transform={closed.pW}><path d={EMBLEM.W} fill={`url(#${id}w)`} /></g>
          </g>
          <g fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: 'var(--mw-m1)' }}>
            <g opacity="0.26"><path data-k="rl" d={`M${RULE.l[0]} ${cy}H${RULE.l[1]}`} /><path data-k="rr" d={`M${RULE.r[0]} ${cy}H${RULE.r[1]}`} /></g>
          </g>
          <g data-k="disc" transform={`translate(${cx - d / 2} ${cy - d / 2}) scale(${d / 100})`}>
            <g data-part="mark">
              <path d={MARK.a} style={{ fill: 'var(--logo-a, currentColor)' }} /><path d={MARK.b} style={{ fill: 'var(--logo-b, currentColor)' }} />
            </g>
          </g>
          <g data-k="tag"><path d={EMBLEM.tag.d} transform={EMBLEM.tag.transform} style={{ fill: 'var(--logo-tag, currentColor)' }} /></g>
        </g>
      </svg>
    </button>
  )
}
