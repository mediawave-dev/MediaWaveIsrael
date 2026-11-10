// The ink film · the hand. A ballpoint pen draws the MediaWave logo: the Horizon disc (its two halves, each
// outlined and shaded, with the paper left white in the wave between them) and the name, letter by letter, and
// the last thing it does is go back and set the drop on the i. The timing is a real hand's: slow in the bends and at the corners, quick on
// the straights (the two-thirds power law of handwriting), with a low arc between strokes. One source of truth:
// the renderer lays the ink from these samples, the pen and the camera follow them, and the sound is synthesised
// from the same speed and pressure, so picture and sound cannot drift.
//
// The geometry is the logo's own (logos/horizon/mediawave-compact-light.svg): the disc's circle and wave are read
// from its numbers, and every letter is the centre line of its glyph, so the drawing lands on the logo's
// proportions. It is a pen's rendition of the mark, one weight and one ink, not a replacement for the files.
// Units are millimetres on the page: x to the right, z down the page (toward the writer), y up off the paper.

export const DT = 0.0005 // the time step of the series, seconds
export const BALL = 0.6 // the ball's radius: a broad 1.2 mm ballpoint, so the line has the logo's weight
export const LINE = 0.24 // half the width of the line it leaves
export const LEAN = [0.47, 0.79, 0.39] // the way the pen leans: up, to the right and toward the writer
const SC = 0.054 // millimetres to one unit of the logo's file
const ORIGIN = [321, 33] // the logo's middle in its own units: the origin of the page
const SPEED = 14 // mm a second on a letter: an unhurried, sure hand
const TOUCH = 1.15 // the first touch, seconds
const HOLD = 0.9 // the finished page, held
const FLIGHT = 1.15 // the pen's way back to the i, seconds
const CRANE = 2.8 // the camera's rise, seconds

const mix = (a, b, t) => a + (b - a) * t
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const smooth = (t) => { const u = clamp(t, 0, 1); return u * u * (3 - 2 * u) }

// ── the logo, as strokes ── (logo units, y up from the baseline; 'c' marks a corner the pen stops in)
const INSET = LINE / SC // half a line, in the file's units: the pen's line sits inside every edge it follows
const DISC = { x: 39, y: 35.65, r: 39 - INSET } // the file's disc is r 39

/** Points on an SVG arc (endpoint form, y down), as the logo file writes its wave. */
function arc(x1, y1, r, sweep, x2, y2, n = 40) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  const dx = x2 - x1, dy = y2 - y1, half = Math.hypot(dx, dy) / 2
  const h = Math.sqrt(Math.max(0, r * r - half * half)) * (sweep ? 1 : -1)
  const cx = mx - (dy / (2 * half)) * h, cy = my + (dx / (2 * half)) * h
  const a1 = Math.atan2(y1 - cy, x1 - cx)
  let da = Math.atan2(y2 - cy, x2 - cx) - a1
  if (sweep && da < 0) da += 2 * Math.PI
  if (!sweep && da > 0) da -= 2 * Math.PI
  return Array.from({ length: n + 1 }, (_, i) => [cx + r * Math.cos(a1 + (da * i) / n), cy + r * Math.sin(a1 + (da * i) / n)])
}
// the two edges of the wave, verbatim from the file; the pen draws the line between them
const EDGE_UP = [...arc(0.15, -39.06, 29.26, 0, 37.34, -37.81), ...arc(37.34, -37.81, 34.72, 1, 77.85, -39.12)]
const EDGE_DOWN = [...arc(0.15, -32.18, 34.72, 0, 40.66, -33.49), ...arc(40.66, -33.49, 29.26, 1, 77.85, -32.24)]
const yAt = (edge, x) => {
  let i = 0
  while (i < edge.length - 2 && edge[i + 1][0] < x) i++
  return mix(edge[i][1], edge[i + 1][1], clamp((x - edge[i][0]) / (edge[i + 1][0] - edge[i][0]), 0, 1))
}
// the wave's two banks (y up), each half a line inside its edge, so the band between them stays paper white
const bankUp = (x) => -yAt(EDGE_UP, x) + INSET
const bankDown = (x) => -yAt(EDGE_DOWN, x) - INSET
const off = (x, y) => Math.hypot(x - DISC.x, y - DISC.y)
/** A bank moved by `shift`, as points from its left end to its right end inside the circle of radius r. */
function row(bank, shift, r, n) {
  let x0 = DISC.x - r, x1 = DISC.x + r
  for (let k = 0; k < 120; k++) { // walk both ends in until they are inside
    if (off(x0, bank(x0) + shift) > r) x0 += 0.4
    if (off(x1, bank(x1) + shift) > r) x1 -= 0.4
  }
  return x1 - x0 < 12 ? null : Array.from({ length: n }, (_, i) => { const x = mix(x0, x1, i / (n - 1)); return [x, bank(x) + shift] })
}
/** The circle from one of its points to another: over the top (`over`) or under the bottom. */
function rim(from, to, over) {
  const a0 = Math.atan2(from[1] - DISC.y, from[0] - DISC.x)
  let a1 = Math.atan2(to[1] - DISC.y, to[0] - DISC.x)
  // left to right over the top turns clockwise (the angle falls); under the bottom it also falls from right to left
  while (a1 > a0) a1 -= 2 * Math.PI
  if (!over && a0 - a1 > Math.PI * 1.5) a1 += 2 * Math.PI
  const n = 8
  return Array.from({ length: n - 1 }, (_, i) => { const t = mix(a0, a1, (i + 1) / n); const r = DISC.r * (1 + 0.005 * Math.sin(t * 2 + 0.7)); return [DISC.x + r * Math.cos(t), DISC.y + r * Math.sin(t)] })
}
/** One half of the disc: its outline in one closed stroke, then its shading in one unbroken zigzag. */
function half(name, bank, away) {
  const edge = row(bank, 0, DISC.r, 9)
  const left = edge[0], right = edge[edge.length - 1]
  // the sky: from the left end over the top to the right end, and back along the wave.
  // the water: along the wave to the right end, and back under the bottom
  const outline = away > 0
    ? [left, ...rim(left, right, true), [...right, 'c'], ...edge.slice(1, -1).reverse(), [left[0], left[1]]]
    : [left, ...edge.slice(1, -1), [...right, 'c'], ...rim(right, left, false), [left[0], left[1]]]
  const shade = []
  for (let k = 1; k <= 5; k++) {
    const line = row(bank, away * k * INSET * 1.86, DISC.r - INSET * 0.9, 7)
    if (!line) break
    if (k % 2 === 0) line.reverse()
    line[0].push('c'); line[line.length - 1].push('c')
    shade.push(...line)
  }
  return [{ name, pts: outline, pace: 0.85 }, { name: name + ' shade', pts: shade, pace: 1.6, weight: 0.7, kind: 'shade' }]
}
const discStrokes = () => [...half('sky', bankUp, 1), ...half('water', bankDown, -1)]

/** A round bowl, anticlockwise from `from` degrees, closing a little past its start. */
const bowl = (cx, cy, r, from = 24) => Array.from({ length: 14 }, (_, i) => { const t = ((from + i * 28.6) * Math.PI) / 180; return [cx + r * Math.cos(t), cy + r * Math.sin(t)] })
/** An e: the bar from the left, then up and round to the open end. */
const letterE = (cx) => [[cx - 17.6, 24.4], [cx + 18.5, 24.7, 'c'], ...[32, 62, 92, 122, 152, 182, 212, 242, 272, 300, 322].map((a) => { const t = (a * Math.PI) / 180; return [cx + 18.7 * Math.cos(t), 24.2 + 18.7 * Math.sin(t)] })]

const LOGO = [
  ...discStrokes(),
  { name: 'M', pts: [[118, 6.5], [118, 63.8, 'c'], [146.5, 19.5, 'c'], [175, 63.8, 'c'], [175, 6.5]] },
  { name: 'e', pts: letterE(216.2) },
  { name: 'd', pts: bowl(271.1, 24.15, 18.6) },
  { name: 'd', pts: [[289.55, 65.8], [289.55, 6.5]] },
  { name: 'i', pts: [[314.3, 41.8], [314.3, 6.5]] },
  { name: 'a', pts: bowl(354.7, 24.15, 18.5) },
  { name: 'a', pts: [[373.2, 41.8], [373.2, 6.5]] },
  { name: 'W', pts: [[394.4, 63.8], [415.6, 6.5, 'c'], [435.15, 63.8, 'c'], [454.7, 6.5, 'c'], [475.9, 63.8]] },
  { name: 'a', pts: bowl(506.1, 24.15, 18.5) },
  { name: 'a', pts: [[524.6, 41.8], [524.6, 6.5]] },
  { name: 'v', pts: [[544.3, 41.8], [563.15, 6.5, 'c'], [582.05, 41.8]] },
  { name: 'e', pts: letterE(615) },
  // the last touch, after the name is done: the drop on the i
  { name: 'drop', pts: [[314.3, 71.6], [316.4, 66.6], [317.2, 63.4], [316.1, 61.2], [314.3, 60.6], [312.5, 61.2], [311.4, 63.4], [312.2, 66.6], [314.2, 70.6]], pace: 0.42, last: true },
]

/** Centripetal Catmull-Rom through the points: no loops or cusps where the points crowd. */
function spline(pts, per = 40) {
  if (pts.length === 2) return Array.from({ length: per + 1 }, (_, i) => [mix(pts[0][0], pts[1][0], i / per), mix(pts[0][1], pts[1][1], i / per)])
  const P = [[0, 1].map((i) => 2 * pts[0][i] - pts[1][i]), ...pts, [0, 1].map((i) => 2 * pts[pts.length - 1][i] - pts[pts.length - 2][i])]
  const out = []
  const knot = (a, b) => Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5) || 1e-4
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]]
    const t0 = 0, t1 = t0 + knot(p0, p1), t2 = t1 + knot(p1, p2), t3 = t2 + knot(p2, p3)
    for (let k = 0; k < per; k++) {
      const t = mix(t1, t2, k / per)
      out.push([0, 1].map((d) => {
        const a1 = ((t1 - t) * p0[d] + (t - t0) * p1[d]) / (t1 - t0)
        const a2 = ((t2 - t) * p1[d] + (t - t1) * p2[d]) / (t2 - t1)
        const a3 = ((t3 - t) * p2[d] + (t - t2) * p3[d]) / (t3 - t2)
        const b1 = ((t2 - t) * a1 + (t - t0) * a2) / (t2 - t0)
        const b2 = ((t3 - t) * a2 + (t - t1) * a3) / (t3 - t1)
        return ((t2 - t) * b1 + (t - t1) * b2) / (t2 - t1)
      }))
    }
  }
  out.push(pts[pts.length - 1].slice(0, 2))
  return out
}

/** The same curve at even steps of `ds` along its length. */
function even(curve, ds) {
  const len = [0]
  for (let i = 1; i < curve.length; i++) len.push(len[i - 1] + Math.hypot(curve[i][0] - curve[i - 1][0], curve[i][1] - curve[i - 1][1]))
  const total = len[len.length - 1]
  const n = Math.max(2, Math.round(total / ds))
  const out = []
  let j = 0
  for (let i = 0; i <= n; i++) {
    const s = (total * i) / n
    while (j < len.length - 2 && len[j + 1] < s) j++
    const u = (s - len[j]) / Math.max(1e-9, len[j + 1] - len[j])
    out.push([mix(curve[j][0], curve[j + 1][0], u), mix(curve[j][1], curve[j + 1][1], u)])
  }
  return { pts: out, ds: total / n, total }
}

function box(a, r) {
  const out = new Float64Array(a.length)
  let sum = 0
  for (let i = -r; i <= r; i++) sum += a[clamp(i, 0, a.length - 1)]
  for (let i = 0; i < a.length; i++) {
    out[i] = sum / (2 * r + 1)
    sum += a[clamp(i + r + 1, 0, a.length - 1)] - a[clamp(i - r, 0, a.length - 1)]
  }
  return out
}

// a hand is never a ruler: a slow drift of a hundredth of a millimetre along every stroke
const wobble = (s, seed) => Math.sin(s * 1.9 + seed) * 0.6 + Math.sin(s * 4.3 + seed * 2.1) * 0.4

/** A stroke on the page, in millimetres, with the time each point is reached and the pen's pressure there. */
function stroke(def, index) {
  const page = def.pts.map(([x, y, c]) => [(x - ORIGIN[0]) * SC, -(y - ORIGIN[1]) * SC, c])
  // corners split the stroke into curves that meet at a point: the pen turns there, it does not round it
  const runs = [[]]
  page.forEach((p, i) => { runs[runs.length - 1].push(p); if (p[2] === 'c' && i > 0 && i < page.length - 1) runs.push([p]) })
  const curve = runs.flatMap((r, i) => (i ? spline(r).slice(1) : spline(r)))
  const laid = even(curve, 0.004)
  const { ds, total } = laid
  const n = laid.pts.length
  const pts = laid.pts.map(([x, z], i) => {
    const a = laid.pts[clamp(i - 3, 0, n - 1)], b = laid.pts[clamp(i + 3, 0, n - 1)]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const w = wobble(i * ds, index * 1.7) * 0.008 * smooth((i * ds) / 0.4) * smooth((total - i * ds) / 0.4)
    return [x - ((b[1] - a[1]) / l) * w, z + ((b[0] - a[0]) / l) * w]
  })
  // curvature from the turning of the tangent, read over a tenth of a millimetre
  const w = Math.max(1, Math.round(0.05 / ds))
  const bend = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    const a = pts[clamp(i - w, 0, n - 1)], b = pts[i], c = pts[clamp(i + w, 0, n - 1)]
    let d = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(b[1] - a[1], b[0] - a[0])
    while (d > Math.PI) d -= 2 * Math.PI
    while (d < -Math.PI) d += 2 * Math.PI
    bend[i] = Math.abs(d) / Math.max(1e-6, w * ds)
  }
  const kappa = box(bend, Math.round(0.08 / ds))
  let v = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    const s = i * ds
    v[i] = Math.pow(kappa[i] + 0.16, -1 / 3) * mix(0.16, 1, smooth(s / 0.5)) * mix(0.24, 1, smooth((total - s) / 0.4))
  }
  v = box(v, Math.round(0.12 / ds))
  const want = total / (SPEED * (def.pace ?? 1))
  let sum = 0
  for (let i = 0; i < n; i++) sum += ds / v[i]
  const k = sum / want
  const t = new Float64Array(n)
  for (let i = 1; i < n; i++) t[i] = t[i - 1] + ds / (v[i] * k)
  // pressure: firmer down the page, lighter up it, eased in at the touch and out at the lift
  let p = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    const a = pts[clamp(i - w, 0, n - 1)], c = pts[clamp(i + w, 0, n - 1)]
    const down = (c[1] - a[1]) / Math.max(1e-6, Math.hypot(c[0] - a[0], c[1] - a[1]))
    const s = i * ds
    p[i] = (0.74 + 0.18 * down) * (def.weight ?? 1) * mix(0.64, 1, smooth(s / 0.3)) * mix(0.55, 1, smooth((total - s) / 0.5))
  }
  p = box(p, Math.round(0.15 / ds))
  return { index, name: def.name, kind: def.kind ?? 'line', last: def.last === true, pts, t, p, v: Array.from(v, (x) => x * k), ds, total, time: t[n - 1] }
}

/** The whole take as one even time series: where the tip is, whether it is on the paper, how fast and how hard. */
export function buildHand() {
  const strokes = LOGO.map(stroke)
  const first = strokes[0].pts[0]
  const segs = []
  const events = []
  let clock = TOUCH
  let named = 0 // the moment the name's last letter is finished: the camera starts to rise
  strokes.forEach((s, i) => {
    events.push({ t: clock, type: 'touch', kind: s.kind, name: s.name })
    segs.push({ kind: 'ink', from: clock, to: clock + s.time, s })
    clock += s.time
    const end = s.pts[s.pts.length - 1]
    events.push({ t: clock, type: 'lift', kind: s.kind, name: s.name })
    const next = strokes[i + 1]
    if (!next) return
    if (next.last) named = clock
    const to = next.pts[0]
    const far = Math.hypot(to[0] - end[0], to[1] - end[1])
    // the way back to the i is one long, unhurried arc, and the camera swings back with it
    const d = next.last ? FLIGHT : 0.15 + 0.019 * far
    segs.push({ kind: 'air', from: clock, to: clock + d, a: end, b: to, h: next.last ? 2.6 : 0.7 + 0.07 * far })
    clock += d
  })
  const written = clock
  const rise = written + 0.4 // the pen has left the frame: the camera starts to rise
  const duration = rise + CRANE + HOLD
  const n = Math.round(duration / DT) + 1
  const H = { x: new Float32Array(n), y: new Float32Array(n), z: new Float32Array(n), p: new Float32Array(n), v: new Float32Array(n), on: new Uint8Array(n), s: new Float32Array(n), shade: new Uint8Array(n), k: new Uint8Array(n) }
  const last = strokes[strokes.length - 1].pts.at(-1)
  // the pen comes down along its own lean, from the side of the hand, and leaves the same way: straight up its
  // own axis and gone before the camera rises, so the wide shot never shows a pen with no hand on it
  const lean = Math.hypot(...LEAN)
  const from = [first[0] + (LEAN[0] / LEAN[1]) * 13, first[1] + (LEAN[2] / LEAN[1]) * 13]
  let seg = 0
  let run = 0 // millimetres of ink so far: the sound reads the paper's grain along it
  for (let i = 0; i < n; i++) {
    const t = i * DT
    if (t < TOUCH) {
      const u = clamp((t - 0.1) / (TOUCH - 0.1), 0, 1)
      const e = 1 - Math.pow(1 - u, 2.4)
      H.x[i] = mix(from[0], first[0], e); H.z[i] = mix(from[1], first[1], e)
      H.y[i] = 13 * Math.pow(1 - u, 1.9) * (1 - 0.25 * u)
      continue
    }
    while (seg < segs.length - 1 && t >= segs[seg].to) seg++
    const g = segs[seg]
    if (t >= written) {
      const out = (280 * Math.pow(clamp((t - written) / 0.85, 0, 1), 2.2)) / lean
      H.x[i] = last[0] + LEAN[0] * out; H.z[i] = last[1] + LEAN[2] * out
      H.y[i] = LEAN[1] * out
      continue
    }
    if (g.kind === 'air') {
      const u = (t - g.from) / (g.to - g.from)
      const e = smooth(u)
      H.x[i] = mix(g.a[0], g.b[0], e); H.z[i] = mix(g.a[1], g.b[1], e)
      H.y[i] = g.h * Math.pow(Math.sin(Math.PI * u), 0.9)
      continue
    }
    const s = g.s
    const tt = t - g.from
    let j = Math.min(s.pts.length - 2, Math.floor((tt / s.time) * (s.pts.length - 1)))
    while (j < s.pts.length - 2 && s.t[j + 1] < tt) j++
    while (j > 0 && s.t[j] > tt) j--
    const u = clamp((tt - s.t[j]) / Math.max(1e-9, s.t[j + 1] - s.t[j]), 0, 1)
    H.x[i] = mix(s.pts[j][0], s.pts[j + 1][0], u); H.z[i] = mix(s.pts[j][1], s.pts[j + 1][1], u)
    H.p[i] = mix(s.p[j], s.p[j + 1], u)
    H.v[i] = mix(s.v[j], s.v[j + 1], u)
    H.on[i] = 1
    H.shade[i] = s.kind === 'shade' ? 1 : 0
    H.k[i] = s.index
    run += H.v[i] * DT
    H.s[i] = run
  }
  for (let i = 1; i < n; i++) if (!H.on[i]) H.s[i] = H.s[i - 1]
  // where the eye rests: the first touch until the pen lands, then a slow follow of the tip
  const eye = { x: new Float32Array(n), z: new Float32Array(n) }
  const lag = { x: new Float32Array(n), z: new Float32Array(n) } // the hand follows the fingers a beat late
  let ex = first[0], ez = first[1], ex2 = ex, ez2 = ez, hx = H.x[0], hz = H.z[0]
  const ke = DT / 0.26, kh = DT / 0.4
  for (let i = 0; i < n; i++) {
    const t = i * DT
    const tx = t < TOUCH ? first[0] : t >= written ? last[0] : H.x[i]
    const tz = t < TOUCH ? first[1] : t >= written ? last[1] : H.z[i]
    ex += (tx - ex) * ke; ez += (tz - ez) * ke
    ex2 += (ex - ex2) * ke; ez2 += (ez - ez2) * ke
    eye.x[i] = ex2; eye.z[i] = ez2
    hx += (H.x[i] - hx) * kh; hz += (H.z[i] - hz) * kh
    lag.x[i] = hx; lag.z[i] = hz
  }
  return { ...H, n, duration, written, named, flight: FLIGHT, rise, crane: CRANE, touch: TOUCH, strokes, events, eye, lag, first, last, drop: strokes[strokes.length - 1].pts[0] }
}

/** The series at any moment, between its samples. */
export function at(hand, t) {
  const f = clamp(t / DT, 0, hand.n - 1.001)
  const i = Math.floor(f), u = f - i
  const g = (a) => mix(a[i], a[i + 1], u)
  return { x: g(hand.x), y: g(hand.y), z: g(hand.z), p: g(hand.p), v: g(hand.v), on: hand.on[i] === 1, eye: [g(hand.eye.x), g(hand.eye.z)], lag: [g(hand.lag.x), g(hand.lag.z)] }
}
