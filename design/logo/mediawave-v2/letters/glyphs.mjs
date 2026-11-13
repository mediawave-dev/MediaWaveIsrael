// The seven other letters of "MediaWave", drawn to belong to the M and W Nati picked (13.11.2026, round 2 of the letters).
// His M and W are heavy leaning blocks cut by sharp wedges: straight edges only, flat ends, no curves. So are these:
// every letter is a block with one or two wedge cuts. Drawn upright (y up from the baseline), then leaned 36 across 150.
export const M = 'M88 305L124 155L160 155L196 245L232 155L268 155L232 305L198 305L220 212L186 292L166 292L144 212L122 305Z'
const W0 = [[232, 155], [268, 155], [290, 248], [324, 168], [344, 168], [366, 248], [388, 155], [422, 155], [386, 305], [350, 305], [314, 215], [278, 305], [242, 305]]
export const LEAN = 36 / 150, BASE = 305
const f = (n) => +n.toFixed(2)
export const wPath = (dx = 0) => W0.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x + dx)} ${y}`).join('') + 'Z'

const X = 112, H = 150
const rot = (pts, w, h) => pts.map(([x, y]) => [w - x, h - y])
// lowercase
const E_LOW = { w: 98, polys: [
  [[12, 0], [92, 0], [98, 22], [30, 41], [98, 54], [98, 100], [86, 112], [12, 112], [0, 94], [0, 18]],            // the block with the mouth cut in from the right, to a point
  [[34, 69], [66, 76], [66, 90], [34, 90]] ] }                                                                       // the eye
const A_LOW = { w: 98, polys: E_LOW.polys.map((p) => rot(p, 98, X)) }                                               // the e turned half a turn
const D_LOW = { w: 98, polys: [
  [[12, 0], [98, 0], [98, H], [64, H], [64, 97], [50, X], [12, X], [0, 94], [0, 18]],                                 // bowl, stem, and a wedge where they meet
  [[34, 26], [64, 26], [64, 86], [34, 86]] ] }
const I_LOW = { w: 34, polys: [[[0, 0], [34, 0], [34, X], [0, X]]] }
const V_LOW = { w: 104, polys: [[[0, X], [36, 0], [68, 0], [104, X], [72, X], [52, 38], [32, X]]] }
// capitals
const E_CAP = { w: 92, polys: [[[0, 0], [92, 0], [92, 28], [34, 40], [34, 48], [92, 62], [92, 88], [34, 102], [34, 110], [92, 122], [92, H], [0, H]]] }
const D_CAP = { w: 104, polys: [[[0, 0], [74, 0], [104, 30], [104, 120], [74, H], [0, H]], [[34, 28], [62, 28], [70, 36], [70, 114], [62, 122], [34, 122]]] }
const I_CAP = { w: 36, polys: [[[0, 0], [36, 0], [36, H], [0, H]]] }
const V_CAP = { w: 118, polys: [[[0, H], [40, 0], [78, 0], [118, H], [82, H], [59, 52], [36, H]]] }
const A_CAP = { w: 118, polys: V_CAP.polys.map((p) => rot(p, 118, H)) }                                             // the V turned over: an A with no bar

/** a glyph placed with its upright origin at logo x = ox (on the baseline) */
const place = (g, ox) => g.polys.map((p) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${f(ox + x + LEAN * y)} ${f(BASE - y)}`).join('') + 'Z').join('')
const drop = (ox, top) => { const r = 16.5, gap = 13, cyU = top + gap + r, cx = ox + 17 + LEAN * cyU, cy = BASE - cyU
  return { d: `M${f(cx)} ${f(cy - 1.75 * r)}L${f(cx + 0.82 * r)} ${f(cy - 0.573 * r)}A${r} ${r} 0 1 1 ${f(cx - 0.82 * r)} ${f(cy - 0.573 * r)}Z`, transform: `matrix(1 0 ${-LEAN} 1 ${f(LEAN * cy)} 0)` } }

/** "MediaWave" with the angular lowercase */
export const mixed = (g = 9) => { let x = 232 + g, media = M, wave = ''
  media += place(E_LOW, x); x += E_LOW.w + g
  media += place(D_LOW, x); x += D_LOW.w + g
  const ix = x; media += place(I_LOW, x); x += I_LOW.w + g
  media += place(A_LOW, x); x += A_LOW.w
  const wx = x + 40 - 242; wave += wPath(wx); x = 386 + wx + g
  wave += place(A_LOW, x); x += A_LOW.w + 5
  wave += place(V_LOW, x); x += 110
  wave += place(E_LOW, x); x += E_LOW.w
  return { media, wave, drop: drop(ix, X), mediaEnd: 242 + wx - 40, wx, x1: x + LEAN * X }
}
/** "MEDIAWAVE" in capitals: the A is the V turned over */
export const caps = (g = 10) => { let x = 232 + g, media = M, wave = ''
  media += place(E_CAP, x); x += E_CAP.w + g
  media += place(D_CAP, x); x += D_CAP.w + g
  media += place(I_CAP, x); x += I_CAP.w + 6
  const ax = x; media += place(A_CAP, x)
  const wx = ax + 123 - 232; wave += wPath(wx); x = 386 + wx + 4
  const a2 = x; wave += place(A_CAP, x); x = a2 + 86
  const vx = x; wave += place(V_CAP, x); x = vx + 126
  wave += place(E_CAP, x); x += E_CAP.w
  return { media, wave, drop: null, mediaEnd: ax + 118, wx, x1: x + LEAN * H }
}
