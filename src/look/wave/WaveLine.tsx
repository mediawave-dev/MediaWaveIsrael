// wave · the line (D118, D119): one thin Prussian line, the wave from the Horizon logo, drawn down the
// whole home page by the scroll. Its pen is always at the reader's eye (60% of the screen), so the
// line is exactly as long as what has been read; scrolling back draws it back. The path runs through
// the chapters' anchors (.wv-pt, placed by CSS per breakpoint): straight where two anchors share a
// side, a soft S where it changes side. Measured on every resize; still mode draws it whole.
import { useRef } from 'react'
import { docTop, useGear } from './clock'

const EYE = 0.6
const STEP = 14

interface Sample { len: number; x: number; y: number }

function build(wrap: HTMLElement): string {
  const pts = [...wrap.querySelectorAll<HTMLElement>('.wv-pt')].map((el) => {
    let x = el.offsetWidth / 2
    let y = el.offsetHeight / 2
    for (let n: HTMLElement | null = el; n && n !== wrap; n = n.offsetParent as HTMLElement | null) { x += n.offsetLeft; y += n.offsetTop }
    return [Math.round(x), Math.round(y)] as const
  }).filter(([, y], i, a) => i === 0 || y > a[i - 1][1])
  if (pts.length < 2) return ''
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    if (x0 === x1) { d += `V${y1}`; continue }
    const k = Math.min(160, (y1 - y0) / 2)
    d += `C${x0} ${y0 + k} ${x1} ${y1 - k} ${x1} ${y1}`
  }
  return d
}

export default function WaveLine() {
  const ref = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const penRef = useRef<SVGCircleElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const table = useRef<Sample[]>([])
  const total = useRef(0)

  useGear(ref, (el, vh) => {
    const wrap = el.parentElement as HTMLElement
    const path = pathRef.current
    const svg = svgRef.current
    // built after the page has loaded (the 'load' remeasure): the line is not in the first view, and
    // measuring it during boot cost a phone hundreds of ms of layout
    if (path && svg && document.readyState === 'complete') {
      svg.setAttribute('viewBox', `0 0 ${wrap.offsetWidth} ${wrap.offsetHeight}`)
      const d = build(wrap)
      // fewer than two anchors laid out yet (a chapter still loading): no line until the next measure
      const L = d ? (path.setAttribute('d', d), path.getTotalLength()) : 0
      if (!d) path.removeAttribute('d')
      total.current = L
      path.style.strokeDasharray = `${L} ${L}`
      const t: Sample[] = []
      if (L > 0) for (let s = 0; s <= L; s += STEP) { const p = path.getPointAtLength(s); t.push({ len: s, x: p.x, y: p.y }) }
      table.current = t
    }
    const top = docTop(wrap)
    return [top - vh * EYE, top + wrap.offsetHeight - vh * EYE]
  }, (p) => {
    const path = pathRef.current
    const t = table.current
    if (!path || !t.length) return
    const wrap = ref.current?.parentElement
    const eyeY = p * (wrap?.offsetHeight ?? 0)
    // the last sample above the eye: the pen
    let lo = 0
    let hi = t.length - 1
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (t[m].y <= eyeY) lo = m; else hi = m - 1 }
    const s = p >= 1 ? t[t.length - 1] : t[lo]
    const drawn = p <= 0 ? 0 : s.len
    path.style.strokeDashoffset = String(total.current - drawn)
    const pen = penRef.current
    if (pen) {
      pen.setAttribute('cx', s.x.toFixed(1)); pen.setAttribute('cy', s.y.toFixed(1))
      pen.style.opacity = p > 0 && p < 1 ? '1' : '0'
    }
  })

  return (
    <div ref={ref} className="wv-line" aria-hidden="true">
      <svg ref={svgRef} focusable="false">
        <path ref={pathRef} className="wv-line__path" />
        <circle ref={penRef} className="wv-line__pen" r="3.5" />
      </svg>
    </div>
  )
}
