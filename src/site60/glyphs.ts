// The trades in the site's own material (D217): each card's object drawn as a shape on -1..1 (y up) and
// sampled into halftone dots by DotGlyph, like the header's chapter marks. Objects from each trade's day,
// not icons from a set: the cup on its saucer, the heart, the briefcase, the shopping bag, the house with
// its door, the hammer, the pencil, and a plus for anything else.
import type { Sdf } from '../look/sea/DotGlyph'
import type { FieldId } from '../data/site-in-60'

const box = (x: number, y: number, cx: number, cy: number, hx: number, hy: number) => Math.abs(x - cx) <= hx && Math.abs(y - cy) <= hy
const rbox = (x: number, y: number, cx: number, cy: number, hx: number, hy: number, r: number) => {
  const qx = Math.abs(x - cx) - hx + r
  const qy = Math.abs(y - cy) - hy + r
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}
const turn = (x: number, y: number, deg: number): [number, number] => {
  const t = (deg * Math.PI) / 180
  return [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)]
}

export const FIELD_GLYPHS: Record<FieldId, Sdf> = {
  // a cup on its saucer, its handle, a thread of steam
  food: (x, y) =>
    rbox(x, y, -0.12, -0.2, 0.52, 0.42, 0.14) <= 0
    || (Math.abs(Math.hypot(x - 0.42, y + 0.16) - 0.22) < 0.09 && x > 0.38)
    || box(x, y, -0.06, -0.76, 0.82, 0.06)
    || (y > 0.36 && y < 0.92 && Math.abs(x + 0.12 - 0.1 * Math.sin(y * 9)) < 0.08),
  // a heart
  clinic: (x, y) => {
    const X = x * 1.18
    const Y = y * 1.22 + 0.12
    return Math.pow(X * X + Y * Y - 1, 3) - X * X * Y * Y * Y <= 0
  },
  // a briefcase: the body with its seam, the handle, the clasp
  pro: (x, y) =>
    (rbox(x, y, 0, -0.18, 0.88, 0.56, 0.1) <= 0 && !(Math.abs(y + 0.06) < 0.05 && Math.abs(x) > 0.16))
    || (Math.abs(rbox(x, y, 0, 0.5, 0.32, 0.2, 0.08)) < 0.08 && y > 0.38),
  // a shopping bag and its two handles
  shop: (x, y) =>
    rbox(x, y, 0, -0.28, 0.72, 0.6, 0.08) <= 0
    || (Math.abs(Math.hypot(x, y - 0.32) - 0.34) < 0.08 && y > 0.32),
  // a house: the roof, the walls, the open door
  realty: (x, y) =>
    (y >= 0.16 && y <= 0.92 - Math.abs(x) * 0.84 && Math.abs(x) <= 0.92)
    || (box(x, y, 0, -0.38, 0.66, 0.54) && !box(x, y, 0.02, -0.62, 0.18, 0.31)),
  // a hammer, leaning
  trades: (x, y) => {
    const [u, v] = turn(x, y, -32)
    return rbox(u, v, -0.08, 0.52, 0.62, 0.19, 0.05) <= 0 || box(u, v, 0, -0.28, 0.11, 0.66)
  },
  // a pencil, leaning: the body, the band, the point
  creative: (x, y) => {
    const [u, v] = turn(x, y, 45)
    if (v > -0.42 && v < 0.86 && Math.abs(u) < 0.2) return !(Math.abs(v - 0.56) < 0.045)
    return v <= -0.42 && v > -0.92 && Math.abs(u) < 0.2 * ((v + 0.92) / 0.5)
  },
  // anything else
  other: (x, y) => (Math.abs(x) < 0.15 && Math.abs(y) < 0.8) || (Math.abs(y) < 0.15 && Math.abs(x) < 0.8),
}
