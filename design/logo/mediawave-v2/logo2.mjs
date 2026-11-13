// MediaWave logo, second drawing (13.11.2026): the Horizon logo (disc, name, drop on the i, "Web Development") redrawn
// in the style of the MW logo Nati picked. His M and W are used as they are; "edia" and "ave" are Urbanist Black Italic
// (Google Fonts, OFL), set to the same cap height and lean; the drop replaces the dot of the i as in the first logo.
// Plain path data in one coordinate space: cap height 150, baseline at y 305.
//   node logo2.mjs                 writes art.json beside this file
//   node logo2.mjs <path/to.ts>    also writes the site's brand-art.ts
import fs from 'fs'
import { fileURLToPath } from 'url'
import { word, LEAN, BASE } from './word.mjs'
const HERE = fileURLToPath(new URL('.', import.meta.url)).replace(/\\/g, '/')
const ROOT = process.env.MW_ROOT || 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const f = (n) => +n.toFixed(2)
const ts = fs.readFileSync(ROOT + 'src/components/ui/logo-paths.ts', 'utf8')
const ART = Function('return ' + ts.slice(ts.indexOf('= {') + 2).replace(/;?\s*$/, ''))()
const TAG = JSON.parse(fs.readFileSync(HERE + 'tag.json', 'utf8'))

export const build = (font = HERE + 'fonts/Urbanist-900i.ttf', opts = {}) => {
  const o = word(font, { k1: 15, k2: 16, k3: 8, dot: false, ...opts })
  // the drop on the i: the first logo's drop (apex 1.75 r above the centre), leaned with the letters
  const r = 16.5, gap = 13, [ix, iy] = o.iTop, cy = iy - gap - r, cx = ix + LEAN * (gap + r)
  const drop = { d: `M${f(cx)} ${f(cy - 1.75 * r)}L${f(cx + 0.82 * r)} ${f(cy - 0.573 * r)}A${r} ${r} 0 1 1 ${f(cx - 0.82 * r)} ${f(cy - 0.573 * r)}Z`, transform: `matrix(1 0 ${-LEAN} 1 ${f(LEAN * cy)} 0)` }
  // the disc: the mark's own two halves, 166 across, centred on the middle of the capitals
  const D = 166, dcx = -30, dcy = BASE - 75, k = D / 100
  const half = (p) => ({ d: ART.mark.parts.find((x) => x.part === p).d, transform: `translate(${f(dcx - D / 2)} ${f(dcy - D / 2)}) scale(${k})` })
  // the tagline under the name, outlined from mediawave-font1 Bold, with a rule on each side out to the name's edges
  const nameL = 96, nameR = o.x1 - 26, tagW = 700, tagTop = 342, tk = tagW / (TAG.bbox.x2 - TAG.bbox.x1), mid = (nameL + nameR) / 2
  const tagH = (TAG.bbox.y2 - TAG.bbox.y1) * tk, ry = tagTop + tagH / 2
  const tag = { d: TAG.d, transform: `translate(${f(mid - tagW / 2 - TAG.bbox.x1 * tk)} ${f(tagTop - TAG.bbox.y1 * tk)}) scale(${f(tk)})` }
  const rules = `M${nameL} ${f(ry)}H${f(mid - tagW / 2 - 26)}M${f(mid + tagW / 2 + 26)} ${f(ry)}H${f(nameR)}`
  const top = Math.min(dcy - D / 2, cy - 1.75 * r) - 4, left = dcx - D / 2 - 2, right = o.x1 + 4
  return { font: 'Urbanist Black Italic (OFL)', cap: 150, baseline: BASE, lean: LEAN, weight: opts.weight ?? 2.6,
    markA: half('mark-a'), markB: half('mark-b'), capM: o.capM, lowM: o.lowM, capW: o.capW, lowW: o.lowW, drop, tag, rules,
    grad: { media: [88, 155, f(o.mediaEnd), 305], wave: [f(232 + o.wx), 155, f(o.x1), 305] },
    markW: f(dcx + D / 2 + 26 - left),                      // the width the folded corner keeps: the disc and a breath
    compact: [f(left), f(top), f(right - left), f(BASE + 9 - top)],
    full: [f(left), f(top), f(right - left), f(tagTop + tagH + 8 - top)] }
}
export const THEMES = {
  light: { a: ['#2F5249', '#13241F'], b: ['#22BBA8', '#0F8478'], da: '#13241F', db: '#14A390', drop: '#14A390', tag: '#3F4D48', rule: '#13241F', ruleo: 0.3 },
  dark: { a: ['#FFFFFF', '#CDEDE7'], b: ['#4DE3D0', '#19A996'], da: '#FFFFFF', db: '#2CC5B3', drop: '#2CC5B3', tag: '#A9C4BE', rule: '#FFFFFF', ruleo: 0.3 },
  black: { a: ['#13241F', '#13241F'], b: ['#13241F', '#13241F'], da: '#13241F', db: '#13241F', drop: '#13241F', tag: '#13241F', rule: '#13241F', ruleo: 0.4 },
  white: { a: ['#FFFFFF', '#FFFFFF'], b: ['#FFFFFF', '#FFFFFF'], da: '#FFFFFF', db: '#FFFFFF', drop: '#FFFFFF', tag: '#FFFFFF', rule: '#FFFFFF', ruleo: 0.5 },
}
let n = 0
/** variant: 'compact' (disc and name), 'full' (with the tagline), 'name' (no disc). Returns a standalone SVG string. */
export const render = (art, t, variant = 'compact', height = 60, attrs = '') => { const u = 'L' + (++n)
  let [x, y, w, h] = art[variant === 'full' ? 'full' : 'compact']
  if (variant === 'name') { w -= 84 - x; x = 84 }
  const g = (id, c, [x0, y0, x1, y1]) => `<linearGradient id="${u}${id}" gradientUnits="userSpaceOnUse" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`
  const p = (o, fill) => `<path fill="${fill}"${o.transform ? ` transform="${o.transform}"` : ''} d="${o.d}"/>`
  const low = (k) => (art.weight ? ` stroke="url(#${u}${k})" stroke-width="${art.weight}" stroke-linejoin="miter" stroke-miterlimit="3"` : '')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}"${height ? ` height="${(+height).toFixed(1)}" width="${(height * w / h).toFixed(1)}"` : ''} ${attrs}><defs>${g('a', t.a, art.grad.media)}${g('b', t.b, art.grad.wave)}</defs>
${variant === 'name' ? '' : p(art.markA, t.da) + p(art.markB, t.db)}<path fill="url(#${u}a)" d="${art.capM}"/><path fill="url(#${u}a)"${low('a')} d="${art.lowM}"/><path fill="url(#${u}b)" d="${art.capW}"/><path fill="url(#${u}b)"${low('b')} d="${art.lowW}"/>${p(art.drop, t.drop)}
${variant === 'full' ? p(art.tag, t.tag) + `<path d="${art.rules}" fill="none" stroke="${t.rule}" stroke-opacity="${t.ruleo}" stroke-width="3.4" stroke-linecap="round"/>` : ''}</svg>` }

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('logo2.mjs')) {
  const art = build(); fs.writeFileSync(HERE + 'art.json', JSON.stringify(art, null, 1))
  const out = process.argv[2]
  if (out) { const { compact, full, weight, grad, markA, markB, capM, lowM, capW, lowW, drop, tag, rules } = art
    fs.writeFileSync(out, `// MediaWave logo, second drawing (D265): the Horizon logo redrawn in the style of the MW logo Nati picked on 13.11.2026.
// The capitals M and W are his, untouched; "edia" and "ave" are Urbanist Black Italic (Google Fonts, OFL) at the same cap
// height and lean; the drop replaces the dot of the i; the tagline is mediawave-font1 Bold, outlined.
// Generated by design/logo/mediawave-v2/logo2.mjs: do not edit by hand. One coordinate space, cap height 150, baseline y 305.
export const BRAND = ${JSON.stringify({ compact, full, weight, grad, markA, markB, capM, lowM, capW, lowW, drop, tag, rules }, null, 2)} as const
`) }
  console.log(art.compact.join(' '), '|', art.full.join(' '), '| markW', art.markW)
}
