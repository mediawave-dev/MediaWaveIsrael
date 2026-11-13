// sun · the MW mark of the footer (Nati, 13.11.2026): the short form of the name. The M and W of the logo he picked, between
// code brackets, and under them the disc sitting on a rule that reads as its horizon, with the line WEB DEVELOPMENT.
// It lives only in the footer; the header keeps the disc and the full name.
//
// D266, the fold ("הלוגו עם כל המילה השלמה מתכווץ רק ל-mw"): the first time the footer comes into view, the mark starts as
// the full logo, the same size as in the header. The small letters of "edia" fold into the M's last stroke and those of
// "ave" into the W's, the W slides left and locks onto the M's peak (they share it, as in his file), the disc drops and
// settles on its horizon, the rule draws out from it, the brackets open and the line comes up. About two seconds, once.
// The markup is the finished mark, so without scripts, in the prerender, with ?calm=1, with the panel's "ללא אנימציות", or
// when the footer is already on screen at load, the visitor simply sees the mark. Only transforms, opacity and two
// gradient ends change, on one small SVG.
import { useEffect, useId, useRef } from 'react'
import { EMBLEM } from './emblem-art'
import { MARK, WORD } from './brand-art'

const T = 1900 // ms
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a))
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const out = (t: number) => 1 - Math.pow(1 - t, 3)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const n = (v: number) => +v.toFixed(3)
const L = WORD.lean, B = WORD.base, TOP = WORD.xh * WORD.lean
const D0 = WORD.disc, D1 = EMBLEM.disc
const RULE = { l: [105, 219], r: [281, 395] } as const

/** a run of small letters folded toward the line u0 (upright x on the baseline), along the letters' own lean */
const fold = (u0: number, s: number) =>
  `matrix(1 0 ${-L} 1 ${n(L * B)} 0) translate(${u0} 0) scale(${n(Math.max(0.001, s))} 1) translate(${-u0} 0) matrix(1 0 ${L} 1 ${n(-L * B)} 0)`

/** how far right the drawing reaches: the W, and the folding runs of small letters (their top right corner) */
const reach = (wx: number, s1: number, s2: number) => Math.max(468, 422 + wx,
  s1 > 0 ? WORD.fold.edia.u0 + (WORD.fold.edia.right - WORD.fold.edia.u0) * s1 + TOP : 0,
  s2 > 0 ? wx + WORD.fold.ave.u0 + (WORD.fold.ave.right - WORD.fold.ave.u0) * s2 + TOP : 0)
/** the disc's size on the screen at the start, in the finished mark's units: the full logo fitted to the mark's width */
const DISC0 = (D0.d * 436) / (reach(WORD.wx, 1, 1) - (D0.cx - D0.d / 2))

/** every moving part at progress p (0: the full logo, 1: the MW mark) */
function pose(p: number) {
  const c1 = inOut(seg(p, 0, 0.5)), c2 = inOut(seg(p, 0.06, 0.56))
  const ey = inOut(seg(p, 0.05, 0.5)), ex = inOut(seg(p, 0.15, 0.75))
  const kb = out(seg(p, 0.55, 0.9)), kr = out(seg(p, 0.62, 0.92)), kt = out(seg(p, 0.7, 1))
  const s1 = 1 - c1, s2 = 1 - c2
  // the W keeps its distance from the "a" while "edia" folds, so the word never comes apart, then locks onto the M's peak
  const follow = WORD.fold.edia.u0 + (WORD.fold.edia.right - WORD.fold.edia.u0) * s1 + 40 - 242
  const wx = follow * (1 - inOut(seg(p, 0.3, 0.72)))
  const cx = lerp(D0.cx, D1.cx, ex), cy = lerp(D0.cy, D1.cy, ey)
  // the whole drawing always fits the width of the finished mark (brackets 32 to 468), and the disc's size on the screen
  // only ever shrinks, from its size beside the name to its size on the horizon
  const right = reach(wx, s1, s2)
  const D = lerp(DISC0, D1.d, inOut(seg(p, 0.05, 0.65)))
  let scale = (436 - D / 2) / (right - cx)
  let left = cx - D / (2 * scale)
  if (left > 32) { left = 32; scale = 436 / (right - 32) }
  if (scale > 1) { scale = 1; left = Math.min(32, cx - D / 2) }
  const d = D / scale, mid = (left + right) / 2
  return {
    all: `translate(250 230) scale(${n(scale)}) translate(${n(-mid)} -230)`,
    edia: fold(WORD.fold.edia.u0, s1), ediaO: 1 - seg(c1, 0.7, 0.97), dropO: 1 - seg(p, 0, 0.18),
    w: `translate(${n(wx)} 0)`,
    // "edia" stays solid while it folds (it fills the closing space between M and W); "ave" folds past the W's
    // outer stroke, so it is gone a little sooner
    ave: fold(WORD.fold.ave.u0, s2), aveO: 1 - seg(c2, 0.5, 0.88),
    gm: n(lerp(268, WORD.grad.a[2], s1)), gw: n(lerp(422, WORD.grad.b[2], s2)),
    disc: `translate(${n(cx - d / 2)} ${n(cy - d / 2)}) scale(${n(d / 100)})`,
    bl: `translate(${n((1 - kb) * 40)} 0)`, br: `translate(${n(-(1 - kb) * 40)} 0)`, bO: kb,
    rl: `M${n(RULE.l[1] - (RULE.l[1] - RULE.l[0]) * kr)} ${D1.cy}H${RULE.l[1]}`,
    rr: `M${RULE.r[0]} ${D1.cy}H${n(RULE.r[0] + (RULE.r[1] - RULE.r[0]) * kr)}`, rO: kr,
    tag: `translate(0 ${n((1 - kt) * 10)})`, tagO: kt,
  }
}
type Pose = ReturnType<typeof pose>

export default function Emblem({ title = 'MediaWave' }: { title?: string }) {
  const id = useId().replace(/:/g, '')
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    const html = document.documentElement
    if (/[?&]calm=1(&|$)/.test(location.search) || html.classList.contains('disable-animations')) return
    const r = el.getBoundingClientRect()
    if (r.top < innerHeight && r.bottom > 0) return // already on screen: leave the mark as it is, no jump
    const q = (k: string) => el.querySelector<SVGElement>(`[data-k="${k}"]`)!
    const g = { all: q('all'), edia: q('edia'), drop: q('drop'), w: q('w'), ave: q('ave'), disc: q('disc'), bl: q('bl'), br: q('br'),
      rl: q('rl'), rr: q('rr'), tag: q('tag'), gm: el.querySelector(`#${id}m`)!, gw: el.querySelector(`#${id}w`)! }
    const apply = (o: Pose) => {
      g.all.setAttribute('transform', o.all)
      g.edia.setAttribute('transform', o.edia); g.edia.setAttribute('opacity', String(n(o.ediaO))); g.drop.setAttribute('opacity', String(n(o.dropO)))
      g.w.setAttribute('transform', o.w)
      g.ave.setAttribute('transform', o.ave); g.ave.setAttribute('opacity', String(n(o.aveO)))
      g.gm.setAttribute('x2', String(o.gm)); g.gw.setAttribute('x2', String(o.gw))
      g.disc.setAttribute('transform', o.disc)
      g.bl.setAttribute('transform', o.bl); g.br.setAttribute('transform', o.br)
      g.bl.setAttribute('opacity', String(n(o.bO))); g.br.setAttribute('opacity', String(n(o.bO)))
      g.rl.setAttribute('d', o.rl); g.rr.setAttribute('d', o.rr)
      g.rl.setAttribute('opacity', String(n(o.rO))); g.rr.setAttribute('opacity', String(n(o.rO)))
      g.tag.setAttribute('transform', o.tag); g.tag.setAttribute('opacity', String(n(o.tagO)))
    }
    apply(pose(0))
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = clamp((t - t0) / T) // never negative: the first frame's time can be a hair before t0
        apply(pose(p))
        raf = p < 1 ? requestAnimationFrame(tick) : 0
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(el)
    // turning animations off while the mark waits, or leaving the page, shows the finished mark
    const done = () => { io.disconnect(); cancelAnimationFrame(raf); apply(pose(1)) }
    const mo = new MutationObserver(() => { if (html.classList.contains('disable-animations')) done() })
    mo.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => { mo.disconnect(); done() }
  }, [id])

  const { cx, cy, d } = EMBLEM.disc
  const grad = (k: 'm' | 'w', x1: number, x2: number) => (
    <linearGradient id={`${id}${k}`} gradientUnits="userSpaceOnUse" x1={x1} y1="155" x2={x2} y2="305">
      <stop offset="0" style={{ stopColor: `var(--mw-${k}0)` }} /><stop offset="1" style={{ stopColor: `var(--mw-${k}1)` }} />
    </linearGradient>
  )
  return (
    <svg ref={ref} className="mw-logo mw-emblem" viewBox={EMBLEM.viewBox} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title}>
      <defs>{grad('m', 88, 268)}{grad('w', 232, 422)}</defs>
      <g data-k="all">
        <g fill="none" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
          <g data-k="bl"><polyline points={EMBLEM.bracketL} style={{ stroke: 'var(--mw-m1)', opacity: 0.38 }} /></g>
          <g data-k="br"><polyline points={EMBLEM.bracketR} style={{ stroke: 'var(--mark-b)', opacity: 0.7 }} /></g>
        </g>
        <g data-k="edia" opacity="0">
          <path d={WORD.edia} fill={`url(#${id}m)`} />
          <path data-k="drop" d={WORD.drop.d} transform={WORD.drop.transform} style={{ fill: 'var(--mark-b)' }} />
        </g>
        <path d={EMBLEM.M} fill={`url(#${id}m)`} />
        <g data-k="w">
          <g data-k="ave" opacity="0"><path d={WORD.ave} fill={`url(#${id}w)`} /></g>
          <path d={EMBLEM.W} fill={`url(#${id}w)`} />
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
  )
}
