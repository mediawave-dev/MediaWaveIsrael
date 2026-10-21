// Flight's timeline, Storytelling's mechanism: scroll progress = chapter index + the fraction read
// through it (0 to 6), and that number seeks a keyed timeline of the camera and the bird. Their timeline
// is a Blender bake (cam.glb, cam-mob.glb); ours is these keys, played through a Catmull-Rom curve so the
// camera never stops at a key. Wings beat on time, never on scroll (their mixer.update(ds)); scroll
// speed opens the field of view (25 + min(|v|, 10) degrees).

/** p, camera xyz, target xyz, bird xyz, yaw, pitch, roll, flap amplitude, wing bias, fold, spread */
export type Key = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]

export const KEYS: Key[] = [
  //  p     cam x  y     z      tgt x  y     z      bird x y     z      yaw    pitch  roll   amp   bias  fold spread
  [0.00, 0.00, -0.80, 5.40, 0.00, -0.70, 0.00, 0.00, -0.10, 0.00, 0.10, 0.50, -0.05, 0.26, 0.34, 0, 1],
  [0.45, 0.30, 0.60, 10.5, 0.20, 0.20, 0.00, 0.20, 0.30, 0.00, 0.10, 0.18, 0.00, 0.34, 0.14, 0, 1],
  [1.00, -1.80, 0.40, 15.0, 0.00, 0.60, 0.00, 1.50, 0.30, 0.00, -0.95, 0.10, 0.22, 0.55, 0.05, 0, 1],
  [1.33, 1.60, -1.10, 14.0, 0.00, 0.90, 0.00, -1.40, 1.40, -2.0, 0.85, -0.18, -0.30, 0.60, 0.08, 0, 1],
  [1.66, 0.00, 3.40, 12.5, 0.00, 0.00, 0.00, 0.60, -0.50, 1.00, 0.10, 0.70, 0.05, 0.50, 0.10, 0, 1],
  [2.00, 0.00, 0.20, 12.0, 0.00, 0.80, 0.00, 0.00, 1.00, -1.0, 0.00, 0.08, 0.00, 0.42, 0.18, 0, 1],
  [2.55, 1.40, -0.40, 11.0, 0.00, 1.10, 0.00, 0.00, 1.70, -3.0, 3.00, 0.25, 0.10, 0.48, 0.10, 0, 1],
  [3.05, 0.00, 0.00, 9.00, 0.00, 0.10, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.06, 0.00, 1, 0.6],
  [4.00, 0.00, 0.20, 9.50, 0.00, 0.20, 0.00, 0.00, 0.10, 0.00, 0.90, 0.00, 0.00, 0.06, 0.00, 1, 0.6],
  [4.90, 0.00, 0.30, 10.0, 0.00, 0.20, 0.00, 0.00, 0.10, 0.00, 1.80, 0.00, 0.00, 0.10, 0.10, 0.85, 0.7],
  [5.40, 0.00, 0.50, 13.0, 0.00, 0.60, 0.00, 0.00, 0.50, 0.00, 0.00, 0.12, 0.00, 0.30, 0.52, 0, 1],
  [6.00, 0.00, 0.70, 15.0, 0.00, 0.90, 0.00, 0.00, 1.10, 0.00, 0.00, 0.14, 0.00, 0.26, 0.48, 0, 1],
]

const cr = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const t2 = t * t
  const t3 = t2 * t
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
}

/** The keyed state at progress p (the first value of the result is p itself). */
export function sample(p: number, out: number[]): number[] {
  const n = KEYS.length
  const q = Math.max(KEYS[0][0], Math.min(KEYS[n - 1][0], p))
  let i = 0
  while (i < n - 2 && KEYS[i + 1][0] < q) i++
  const k1 = KEYS[i]
  const k2 = KEYS[i + 1]
  const k0 = KEYS[Math.max(0, i - 1)]
  const k3 = KEYS[Math.min(n - 1, i + 2)]
  const t = (q - k1[0]) / Math.max(1e-6, k2[0] - k1[0])
  // the fold and the spread ease (no overshoot); everything else follows the curve
  const e = t * t * (3 - 2 * t)
  for (let j = 0; j < k1.length; j++) out[j] = j >= 15 ? k1[j] + (k2[j] - k1[j]) * e : cr(k0[j], k1[j], k2[j], k3[j], t)
  return out
}

const sm = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** The sky's four grounds by progress: day, dusk, night, dawn (they sum to 1). */
export function skyMix(p: number): [number, number, number, number] {
  const dusk = sm(1.9, 2.45, p)
  const night = sm(2.75, 3.1, p)
  const dawn = sm(4.85, 5.3, p)
  const w = [(1 - dusk), dusk * (1 - night), night * (1 - dawn), dawn]
  const s = w[0] + w[1] + w[2] + w[3]
  return [w[0] / s, w[1] / s, w[2] / s, w[3] / s]
}
