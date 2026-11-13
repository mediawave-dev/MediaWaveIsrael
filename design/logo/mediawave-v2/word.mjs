// "MediaWave" in the style of the MW logo Nati picked: his M and W, untouched, with the seven other letters taken from
// a heavy italic typeface, set to the same cap height and leaned to the same angle (36 across 150 up, 13.5 degrees).
// Everything is baked into plain path data in one coordinate space (no transforms), so gradients and exports are simple.
import { loadFont } from 'file:///C:/Users/User/.claude/skills/svg-logo-designer/scripts/lib/text.mjs'

export const M = 'M88 305L124 155L160 155L196 245L232 155L268 155L232 305L198 305L220 212L186 292L166 292L144 212L122 305Z'
const W0 = [[232, 155], [268, 155], [290, 248], [324, 168], [344, 168], [366, 248], [388, 155], [422, 155], [386, 305], [350, 305], [314, 215], [278, 305], [242, 305]]
export const LEAN = 36 / 150, BASE = 305, CAP = 150
const f = (n) => +n.toFixed(2)
export const wPath = (dx = 0) => W0.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x + dx)} ${y}`).join('') + 'Z'

/** the face's own lean, measured on its capital I (the post table is not always filled in) */
const ownLean = (font) => { const c = font.charToGlyph('I').getPath(0, 0, 1000).commands.filter((k) => k.x !== undefined)
  const ys = c.map((k) => k.y), top = Math.min(...ys), bot = Math.max(...ys)
  const at = (y) => Math.min(...c.filter((k) => Math.abs(k.y - y) < 12).map((k) => k.x))
  return (at(top) - at(bot)) / (bot - top) }

/** opentype commands to path data through a point map; optionally without the highest contour (the dot of the i) */
const bake = (cmds, map) => cmds.map((k) => { const p = (x, y) => { const [a, b] = map(x, y); return `${f(a)} ${f(b)}` }
  return k.type === 'M' ? `M${p(k.x, k.y)}` : k.type === 'L' ? `L${p(k.x, k.y)}` : k.type === 'C' ? `C${p(k.x1, k.y1)} ${p(k.x2, k.y2)} ${p(k.x, k.y)}`
    : k.type === 'Q' ? `Q${p(k.x1, k.y1)} ${p(k.x, k.y)}` : 'Z' }).join('')
const contours = (cmds) => { const out = []; let cur = []; for (const k of cmds) { cur.push(k); if (k.type === 'Z') { out.push(cur); cur = [] } } if (cur.length) out.push(cur); return out }

/** a run of lowercase letters on the baseline, leaned to the logo's angle; x is where its outline starts at the baseline */
const run = (font, text, x, { track = 0, dot = true } = {}) => {
  const H = font.charToGlyph('H').getPath(0, 0, 1000).getBoundingBox(), size = (CAP / (H.y2 - H.y1)) * 1000, k = size / font.unitsPerEm
  const extra = LEAN - ownLean(font)
  const glyphs = font.stringToGlyphs(text); let pen = 0; const parts = []; let iTop = null
  glyphs.forEach((g, i) => { let cmds = g.getPath(pen, 0, size).commands
    if (text[i] === 'i' && !dot) { const cs = contours(cmds).map((c) => ({ c, top: Math.min(...c.filter((q) => q.y !== undefined).map((q) => q.y)) })).sort((a, b) => a.top - b.top)
      const stem = cs[cs.length - 1].c, sx = stem.filter((q) => q.x !== undefined)
      const sTop = Math.min(...sx.map((q) => q.y)), topPts = sx.filter((q) => Math.abs(q.y - sTop) < 10).map((q) => q.x)
      iTop = { x: (Math.min(...topPts) + Math.max(...topPts)) / 2, y: sTop }; cmds = stem }
    parts.push(cmds)
    pen += g.advanceWidth * k + track + (i < glyphs.length - 1 ? font.getKerningValue(g, glyphs[i + 1]) * k : 0) })
  // leftmost point of the outline at the baseline zone, after the lean, decides where the run starts
  const lean = (px, py) => [px - extra * py, py]
  let x1 = Infinity, x2 = -Infinity
  for (const cmds of parts) for (const q of cmds) if (q.x !== undefined) { const [a] = lean(q.x, q.y); x1 = Math.min(x1, a); x2 = Math.max(x2, a) }
  const map = (px, py) => { const [a, b] = lean(px, py); return [a - x1 + x, b + BASE] }
  const xb = font.charToGlyph('x').getPath(0, 0, size).getBoundingBox()
  return { d: parts.map((c) => bake(c, map)).join(''), left: x, right: x - x1 + x2, xh: -xb.y1, iTop: iTop && map(iTop.x, iTop.y) }
}

/**
 * The whole name. k1 (M to e), k2 (a to W), k3 (W to a) are gaps at the outlines' extremes; track is extra letter
 * space inside the two runs. Returns separate path data for the dark half, the turquoise half and the drop's seat.
 */
export const word = (fontPath, opts = {}) => { const { k1 = 26, k2 = 8, k3 = 4, track = 0, dot = true } = opts
  const font = typeof fontPath === 'string' ? loadFont(fontPath) : fontPath
  const a = run(font, 'edia', 232 + k1, { track, dot })
  const wx = a.right + k2 - 232
  const b = run(font, 'ave', 386 + wx + k3, { track })
  return { media: M + a.d, wave: wPath(wx) + b.d, capM: M, lowM: a.d, capW: wPath(wx), lowW: b.d, x0: 88, x1: b.right, wx, mediaEnd: a.right, xh: a.xh, iTop: a.iTop }
}
