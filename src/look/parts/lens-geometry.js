// The hero lens's iris (DECISIONS #64), shared by the Rive generator (design/rive/lens/build-lens.mjs)
// and the page (Lens.tsx), so the static frames and the live file are the same drawing.
// A straight-bladed iris: blade i's edge is the line tangent to the opening's inscribed circle
// (radius r) at angle twist + i * 2pi/N. Two neighbouring edges meet at the opening's corner V,
// and each edge runs on to a circle hidden under the barrel (E). Blade i's visible face is the
// triangle E_i, V_i, E_(i+1), so the N faces tile the ring around the opening with no overlaps,
// and every blade is the first one turned by i * 2pi/N. Units: the 1000 x 1000 artboard, the
// lens centred on (500, 500); blade coordinates are relative to the centre.

export const LENS = {
  size: 1000,
  n: 9,
  /** the opening at full aperture (the barrel's inner edge) */
  rl: 330,
  /** where the blade edges end, under the barrel */
  rBig: 440,
  /** the barrel's outer edge */
  rOut: 486,
  /** the rest aperture (0 closed, 1 fully open) and the twist the blades have there */
  rest: 0.72,
}

/** The blades turn as they close: the twist for an aperture a (radians). */
export function twistFor(a, extra = 0) {
  return -0.35 + (1 - a) * 0.62 + extra
}

/** Blade 0 for aperture a in [0, 1] and twist t: its corner V, its edge's far end E0, the next
    edge's far end E1, and a light gradient from the middle of its edge (lit) to E1 (shade). */
export function blade(a, t) {
  const { n, rl, rBig } = LENS
  const r = Math.max(0, Math.min(1, a)) * (rl + 6)
  const half = Math.PI / n
  const s = Math.sqrt(rBig * rBig - r * r)
  const line = (phi) => {
    const tx = r * Math.cos(phi), ty = r * Math.sin(phi), dx = -Math.sin(phi), dy = Math.cos(phi)
    return { tx, ty, dx, dy }
  }
  const l0 = line(t), l1 = line(t + 2 * half)
  const k = r * Math.tan(half)
  const v = [l0.tx + k * l0.dx, l0.ty + k * l0.dy]
  const e0 = [l0.tx - s * l0.dx, l0.ty - s * l0.dy]
  const e1 = [l1.tx - s * l1.dx, l1.ty - s * l1.dy]
  const g0 = [(e0[0] + v[0]) / 2, (e0[1] + v[1]) / 2]
  return { v, e0, e1, g0, g1: e1 }
}
