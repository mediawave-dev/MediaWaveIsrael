// Turns the Horizon mark's two halves (src/components/ui/logo-paths.ts, variant "mark", the
// verbatim brand geometry) into RML PointsPath vertices, centred on the disc (0,0) so the
// scene can scale and rotate the mark about its centre. SVG arcs become cubic segments of at
// most 90 degrees (SVG spec F.6.5 endpoint to centre conversion, k = 4/3 tan(theta/4)).
// Used by build-scene.mjs; run directly to print the two halves as RML.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const CX = 50, CY = 50

/** The two path strings of the mark, in its 0..100 viewBox: [upper, lower]. */
export function markPaths() {
  const src = readFileSync(resolve(ROOT, 'src/components/ui/logo-paths.ts'), 'utf8')
  const mark = src.slice(src.indexOf('"mark": {'))
  return [...mark.matchAll(/"d": "([^"]+)"/g)].map((m) => m[1]).slice(0, 2)
}

function arcToCubics(x1, y1, rx, _ry, _phi, fa, fs, x2, y2) {
  // every arc in the mark is circular and unrotated
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2
  let r = rx
  const lam = (dx * dx + dy * dy) / (r * r)
  if (lam > 1) r *= Math.sqrt(lam)
  const sign = fa === fs ? -1 : 1
  const num = r ** 4 - r * r * dy * dy - r * r * dx * dx
  const den = r * r * dy * dy + r * r * dx * dx
  const coef = sign * Math.sqrt(Math.max(0, num / den))
  const cxp = coef * dy, cyp = -coef * dx
  const cx = cxp + (x1 + x2) / 2, cy = cyp + (y1 + y2) / 2
  const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
  const t1 = ang(1, 0, (dx - cxp) / r, (dy - cyp) / r)
  let dt = ang((dx - cxp) / r, (dy - cyp) / r, (-dx - cxp) / r, (-dy - cyp) / r)
  if (!fs && dt > 0) dt -= 2 * Math.PI
  if (fs && dt < 0) dt += 2 * Math.PI
  const n = Math.ceil(Math.abs(dt) / (Math.PI / 2) - 1e-9)
  const seg = dt / n
  const k = (4 / 3) * Math.tan(seg / 4)
  const out = []
  for (let i = 0; i < n; i++) {
    const a = t1 + i * seg, b = a + seg
    const p0 = [cx + r * Math.cos(a), cy + r * Math.sin(a)]
    const p3 = [cx + r * Math.cos(b), cy + r * Math.sin(b)]
    const c1 = [p0[0] - k * r * Math.sin(a), p0[1] + k * r * Math.cos(a)]
    const c2 = [p3[0] + k * r * Math.sin(b), p3[1] - k * r * Math.cos(b)]
    out.push([p0, c1, c2, p3])
  }
  return out
}

/** Cubic segments [p0, c1, c2, p3] of one closed path, centred on the disc. */
export function cubics(d) {
  const t = d.match(/[MAZ]|-?\d*\.?\d+/g)
  let i = 0, cur = null, start = null
  const segs = []
  while (i < t.length) {
    const c = t[i++]
    if (c === 'M') { cur = [+t[i++], +t[i++]]; start = cur }
    else if (c === 'A') {
      const [rx, ry, phi, fa, fs, x, y] = t.slice(i, i + 7).map(Number); i += 7
      segs.push(...arcToCubics(cur[0], cur[1], rx, ry, phi, fa, fs, x, y))
      cur = [x, y]
    } else if (c === 'Z') {
      if (Math.hypot(cur[0] - start[0], cur[1] - start[1]) > 1e-6) throw new Error('open path')
    }
  }
  return segs.map((s) => s.map(([x, y]) => [x - CX, y - CY]))
}

const f = (v) => +v.toFixed(4)

/** RML vertex attributes for a list of cubic segments (closed: the last joins the first). */
export function vertices(segs, closed = true) {
  const n = segs.length
  const pts = closed ? segs.map((s) => s[0]) : [...segs.map((s) => s[0]), segs[n - 1][3]]
  return pts.map((p, i) => {
    const outSeg = closed ? segs[i] : segs[i]
    const inSeg = closed ? segs[(i - 1 + n) % n] : segs[i - 1]
    const v = { x: f(p[0]), y: f(p[1]) }
    if (inSeg) { const c = inSeg[2]; v.inRotation = f(Math.atan2(c[1] - p[1], c[0] - p[0])); v.inDistance = f(Math.hypot(c[0] - p[0], c[1] - p[1])) }
    if (outSeg) { const c = outSeg[1]; v.outRotation = f(Math.atan2(c[1] - p[1], c[0] - p[0])); v.outDistance = f(Math.hypot(c[0] - p[0], c[1] - p[1])) }
    return v
  })
}

/** Winding of the vertex polygon (y down: positive area is clockwise on screen). */
export function clockwise(vs) {
  let a = 0
  for (let i = 0; i < vs.length; i++) { const p = vs[i], q = vs[(i + 1) % vs.length]; a += p.x * q.y - q.x * p.y }
  return a > 0
}

/** The horizon: the midline of the gap between the halves (the average of the two facing edges). */
export function horizonSegments() {
  const [up, lo] = markPaths().map(cubics)
  // upper: its first two segments run along the gap, left to right; lower likewise
  const avg = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  return [0, 1].map((k) => up[k].map((p, j) => avg(p, lo[k][j])))
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  for (const [idx, d] of markPaths().entries()) {
    const vs = vertices(cubics(d))
    console.log(`<!-- ${idx ? 'lower' : 'upper'} half: ${vs.length} vertices, clockwise ${clockwise(vs)} -->`)
    for (const v of vs) console.log(`<CubicDetachedVertex ${Object.entries(v).map(([k, x]) => `${k}="${x}"`).join(' ')}/>`)
  }
  console.log('<!-- horizon -->')
  for (const v of vertices(horizonSegments(), false)) console.log(JSON.stringify(v))
}
