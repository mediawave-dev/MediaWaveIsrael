// MediaWave "Crest" mark generator — tapered ribbon fan with clean cubic beziers.
// Tiller-Hanson offset: offset the control polygon of the centerline cubic by a
// per-point half-width -> two smooth edges + round caps = one closed filled path.
import fs from 'node:fs'

const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const add = (a, b) => P(a.x + b.x, a.y + b.y)
const mul = (a, s) => P(a.x * s, a.y * s)
const len = (a) => Math.hypot(a.x, a.y)
const norm = (a) => mul(a, 1 / (len(a) || 1))
const perp = (a) => P(-a.y, a.x) // left normal
const r2 = (n) => Math.round(n * 100) / 100

// Direction at each control-polygon vertex (average of adjacent segment dirs)
function polyNormals([p0, p1, p2, p3]) {
  const d01 = norm(sub(p1, p0))
  const d12 = norm(sub(p2, p1))
  const d23 = norm(sub(p3, p2))
  return [perp(d01), perp(norm(add(d01, d12))), perp(norm(add(d12, d23))), perp(d23)]
}

// Build one tapered ribbon as a closed path.
// centerline: [P0,P1,P2,P3]; w0 base half-width at P0, w3 tip half-width at P3.
function ribbon(cl, w0, w3) {
  const ns = polyNormals(cl)
  // width at control points: smooth taper (slightly eased so mid keeps mass)
  const ws = [w0, w0 * 0.72 + w3 * 0.28, w0 * 0.35 + w3 * 0.65, w3]
  const up = cl.map((p, i) => add(p, mul(ns[i], ws[i])))
  const dn = cl.map((p, i) => sub(p, mul(ns[i], ws[i])))
  const tipDir = norm(sub(cl[3], cl[2]))
  const baseDir = norm(sub(cl[0], cl[1]))
  // round caps as cubic arcs (k*r bulge in the travel direction)
  const k = 1.1
  const tipA = up[3], tipB = dn[3]
  const tCap1 = add(tipA, mul(tipDir, w3 * k))
  const tCap2 = add(tipB, mul(tipDir, w3 * k))
  const baseA = dn[0], baseB = up[0]
  const bCap1 = add(baseA, mul(baseDir, w0 * k))
  const bCap2 = add(baseB, mul(baseDir, w0 * k))
  const c = (p) => `${r2(p.x)} ${r2(p.y)}`
  return [
    `M${c(up[0])}`,
    `C${c(up[1])} ${c(up[2])} ${c(up[3])}`,
    `C${c(tCap1)} ${c(tCap2)} ${c(dn[3])}`,
    `C${c(dn[2])} ${c(dn[1])} ${c(dn[0])}`,
    `C${c(bCap1)} ${c(bCap2)} ${c(up[0])}`,
    'Z',
  ].join(' ')
}

// ---- The Crest fan ----------------------------------------------------------
// 5 ribbons. Bottom = the wave's body (boldest, longest, nearly level sweep).
// Upward each ribbon is finer, shorter and steeper — spray over the crest.
// Bases sit on a small arc (staggered origins read as one gathered source
// without collapsing into mud). Tips land on an implied arc.
export function crestRibbons({ spread = 1, lift = 1 } = {}) {
  const defs = [
    // base(x,y)     c1              c2               tip(x,y)        w0    w3
    { b: P(13, 92), c1: P(44, 95), c2: P(80, 86), t: P(108, 66), w0: 3.6, w3: 1.6 },
    { b: P(14, 84), c1: P(43, 85), c2: P(77, 72), t: P(103, 50), w0: 3.1, w3: 1.45 },
    { b: P(16, 76), c1: P(42, 74), c2: P(72, 57), t: P(94, 35), w0: 2.7, w3: 1.3 },
    { b: P(19, 68), c1: P(41, 63), c2: P(65, 44), t: P(80, 23), w0: 2.3, w3: 1.15 },
    { b: P(23, 60), c1: P(40, 53), c2: P(56, 32), t: P(64, 15), w0: 1.95, w3: 1.0 },
  ]
  return defs.map((d) => ribbon([d.b, d.c1, d.c2, d.t], d.w0 * spread, d.w3 * spread))
}

// Standalone mark SVG for quick preview
function markSvg(paths, { dark = true } = {}) {
  const grad = dark
    ? `<linearGradient id="flow" x1="14" y1="90" x2="108" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#38BDF8"/><stop offset="0.55" stop-color="#7DD3FC"/><stop offset="1" stop-color="#A5F3FC"/>
      </linearGradient>`
    : `<linearGradient id="flow" x1="14" y1="90" x2="108" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#075985"/><stop offset="0.6" stop-color="#0369A1"/><stop offset="1" stop-color="#38BDF8"/>
      </linearGradient>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-labelledby="t d">
  <title id="t">MediaWave mark</title><desc id="d">Fan of five tapered wave ribbons</desc>
  <defs>${grad}</defs>
  <g fill="url(#flow)">
    ${paths.map((p) => `<path d="${p}"/>`).join('\n    ')}
  </g>
</svg>`
}

if (process.argv[1].endsWith('gen-mark.mjs')) {
  const paths = crestRibbons()
  fs.mkdirSync('preview', { recursive: true })
  fs.writeFileSync('preview/crest-dark.svg', markSvg(paths, { dark: true }))
  fs.writeFileSync('preview/crest-light.svg', markSvg(paths, { dark: false }))
  console.log('preview written; first path:\n', paths[0])
}
