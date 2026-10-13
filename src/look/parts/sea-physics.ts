// The hero sea's surface (DECISIONS #62): a row of water columns joined by the wave equation,
// with a pull back to the calm curve and some drag, so a disturbance travels, reflects off the
// sides and dies away in a few seconds. Everything here is in CSS pixels; HeroSea converts the
// heights to the Rive band's units. Positive is down (screen coordinates).
//
// The opening is not simulated: a bore (a step in the water level with a crest on its front)
// is drawn from a formula so its timing is art-directed, and the simulation takes over from
// its last frame, positions and velocities, just before the crest meets the left wall.

export interface SeaTuning {
  /** wave speed, px/s */
  speed: number
  /** pull back to the calm curve, 1/s^2 */
  spring: number
  /** drag, 1/s */
  drag: number
}

const STEP = 1 / 120

export class SeaSurface {
  readonly n: number
  /** column positions, px from the band's left edge */
  readonly x: Float64Array
  /** displacement from the calm curve, px */
  readonly h: Float64Array
  readonly v: Float64Array
  /** a held pull (the pointer lifting the water): target displacement and strength per column */
  private readonly pull: Float64Array
  private pullK = 0
  private acc = 0
  private dx: number

  constructor(n: number, x0: number, dx: number, private t: SeaTuning) {
    this.n = n
    this.dx = dx
    this.x = Float64Array.from({ length: n }, (_, i) => x0 + i * dx)
    this.h = new Float64Array(n)
    this.v = new Float64Array(n)
    this.pull = new Float64Array(n)
  }

  /** a new width (resize): positions scale, the water keeps its shape */
  rescale(x0: number, dx: number, t: SeaTuning) {
    for (let i = 0; i < this.n; i++) this.x[i] = x0 + i * dx
    this.dx = dx
    this.t = t
  }

  /** advance by dt seconds (fixed internal steps, so the result does not depend on the frame rate) */
  advance(dt: number) {
    this.acc = Math.min(this.acc + dt, 0.1)
    const { n, h, v, pull } = this
    const c2 = (this.t.speed * this.t.speed) / (this.dx * this.dx)
    const { spring, drag } = this.t
    while (this.acc >= STEP) {
      this.acc -= STEP
      for (let i = 0; i < n; i++) {
        // reflecting walls: the water beyond each edge mirrors the edge column
        const l = h[i > 0 ? i - 1 : 0], r = h[i < n - 1 ? i + 1 : n - 1]
        let a = c2 * (l + r - 2 * h[i]) - spring * h[i] - drag * v[i]
        if (this.pullK) a += this.pullK * (pull[i] - h[i])
        v[i] += a * STEP
      }
      for (let i = 0; i < n; i++) h[i] += v[i] * STEP
    }
  }

  /** add velocity in a bell around x (px/s at the centre) */
  kick(x: number, amount: number, sigma: number) {
    for (let i = 0; i < this.n; i++) {
      const d = (this.x[i] - x) / sigma
      if (d > -3 && d < 3) this.v[i] += amount * Math.exp(-0.5 * d * d)
    }
  }

  /** hold the water toward a bell-shaped lift around x (px, negative is up); 0 releases it */
  hold(x: number, lift: number, sigma: number, k: number) {
    this.pullK = lift ? k : 0
    if (!lift) return
    for (let i = 0; i < this.n; i++) {
      const d = (this.x[i] - x) / sigma
      this.pull[i] = lift * Math.exp(-0.5 * d * d)
    }
  }

  /** the displacement at x, interpolated between columns */
  at(x: number) {
    const f = Math.max(0, Math.min(this.n - 1.001, (x - this.x[0]) / this.dx))
    const i = Math.floor(f), u = f - i
    return this.h[i] * (1 - u) + this.h[i + 1] * u
  }

  /** take over a drawn state: positions now, velocities from the frame before */
  adopt(now: ArrayLike<number>, before: ArrayLike<number>, dt: number) {
    for (let i = 0; i < this.n; i++) {
      this.h[i] = now[i]
      this.v[i] = (now[i] - before[i]) / dt
    }
  }

  /** calm enough to stop drawing */
  resting() {
    if (this.pullK) return false
    for (let i = 0; i < this.n; i++) if (Math.abs(this.h[i]) > 0.35 || Math.abs(this.v[i]) > 4) return false
    return true
  }

  settle() {
    this.h.fill(0)
    this.v.fill(0)
    this.pullK = 0
  }
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

export interface Bore {
  /** seconds the front takes to cross */
  duration: number
  /** how far below the calm curve the water starts, px */
  depth: number
  /** crest height above the calm curve, px */
  crest: number
  /** crest width (sigma), px */
  width: number
  /** how wide the wave's face is, from the deep to the crest, px */
  face: number
  /** the band's width, px */
  span: number
}

/** Where the crest is at time t: it enters with its whole face beyond the right edge and is
    handed to the physics as it meets the left wall. */
export function boreCrest(b: Bore, t: number) {
  const u = Math.max(0, Math.min(1, t / b.duration))
  // quick in, slowing a little as it spends itself
  const e = 0.25 * u + 0.75 * (1 - (1 - u) * (1 - u))
  const from = b.span + b.face + 2 * b.width, to = -2 * b.width
  return from - e * (from - to)
}

/** The bore's displacement at column positions xs, time t, into out; returns the crest's x. */
export function boreShape(b: Bore, xs: ArrayLike<number>, t: number, out: Float64Array) {
  const c = boreCrest(b, t)
  const u = Math.max(0, Math.min(1, t / b.duration))
  const crest = b.crest * (0.82 + 0.18 * Math.sin(Math.PI * u))
  const wave = b.width * 3.8, tail = b.width * 5
  for (let i = 0; i < out.length; i++) {
    const x = xs[i]
    // the face: from the deep ahead of the crest up to the calm level at the crest
    const behind = smooth(c - b.face, c + b.width * 0.3, x)
    const dc = (x - c) / b.width
    let h = b.depth * (1 - behind) - crest * Math.exp(-0.5 * dc * dc)
    // the undulations that follow a bore's crest (it does not arrive as one clean step)
    const s = x - c - b.width * 1.3
    if (s > 0) h -= crest * 0.36 * Math.sin((2 * Math.PI * s) / wave) * Math.exp(-s / tail)
    out[i] = h
  }
  return c
}
