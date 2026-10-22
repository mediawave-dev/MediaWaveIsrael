// The floating buttons' ground (D203, Nati: "less the generic squareness of the floating buttons, something
// more beautiful that belongs to the site"). Not a plate: a small island of the sea's own halftone. A grid of
// round dots fills a capsule just around the button; deep inside they are big enough to merge into a solid
// ground (the words read over anything), toward the rim they shrink in steps until they dissolve into the
// page, the way a printed halftone fades out. A second, cream copy of the same dots sits on top at size
// zero: hovered or pressed, its dots grow from the core outward until the island is cream (sea-site.css).
// One path per dot size (zero-length segments with round caps), redrawn only when the button's size changes.
import { useLayoutEffect, useRef } from 'react'

/** the dots' pitch, centre to centre, in px */
const GRID = 4
/** at this radius neighbouring dots overlap into a solid ground */
const FULL = GRID * 0.74
/** the dot sizes, as fractions of FULL, from the rim inward */
const BANDS = [0.26, 0.42, 0.58, 0.76, 1]

/** signed distance from p to a capsule (negative inside) */
function capsuleDist(x: number, y: number, cx: number, cy: number, hw: number, hh: number): number {
  const r = Math.min(hw, hh)
  const qx = Math.abs(x - cx) - (hw - r)
  const qy = Math.abs(y - cy) - (hh - r)
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}

/** the dots of each band, as path data, for an island of w x h whose capsule is `out` px inside its edges */
function islandPaths(w: number, h: number, out: number): string[] {
  const parts: string[][] = BANDS.map(() => [])
  const cx = w / 2
  const cy = h / 2
  const hw = w / 2 - out
  const hh = h / 2 - out
  // the fade: from `out` px outside the capsule (nothing) to `out` px inside (solid)
  const cols = Math.floor(w / GRID)
  const rows = Math.floor(h / GRID)
  const x0 = (w - (cols - 1) * GRID) / 2
  const y0 = (h - (rows - 1) * GRID) / 2
  for (let j = 0; j < rows; j++) {
    const y = y0 + j * GRID
    for (let i = 0; i < cols; i++) {
      const x = x0 + i * GRID
      const t = (out - capsuleDist(x, y, cx, cy, hw, hh)) / (2 * out)
      if (t <= 0.08) continue
      const k = Math.min(BANDS.length - 1, Math.floor(Math.min(t, 1) * BANDS.length))
      parts[k].push(`M${x.toFixed(1)} ${y.toFixed(1)}h0.01`)
    }
  }
  return parts.map((p) => p.join(''))
}

export default function Isle({ out = 7 }: { out?: number }) {
  const svg = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => {
    const s = svg.current
    if (!s) return
    let last = ''
    const draw = (w: number, h: number) => {
      if (w < 12 || h < 12) return
      const key = `${Math.round(w)}x${Math.round(h)}`
      if (key === last) return
      last = key
      const d = islandPaths(w, h, out)
      s.setAttribute('viewBox', `0 0 ${w} ${h}`)
      s.querySelectorAll('path').forEach((p) => p.setAttribute('d', d[Number(p.dataset.b)] ?? ''))
    }
    const r = s.getBoundingClientRect()
    draw(r.width, r.height)
    const ro = new ResizeObserver(([e]) => draw(e.contentRect.width, e.contentRect.height))
    ro.observe(s)
    return () => ro.disconnect()
  }, [out])
  const band = (layer: string) => BANDS.map((f, b) => (
    <path key={`${layer}${b}`} data-b={b} style={{ ['--r' as string]: (f * FULL * 2).toFixed(2), ['--o' as string]: BANDS.length - 1 - b }} />
  ))
  return (
    <svg ref={svg} className="isle" style={{ ['--out' as string]: `${out}px` }} aria-hidden="true" focusable="false">
      <g className="isle__ground">{band('g')}</g>
      <g className="isle__ink">{band('i')}</g>
    </svg>
  )
}
