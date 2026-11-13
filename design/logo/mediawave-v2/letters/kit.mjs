// Builds the logo kit of the drawn wordmark (D266) into logos/mediawave-v2 from the site's own path data
// (src/sun/brand-art.ts, src/sun/emblem-art.ts), so the files and the site can never drift apart.
//   node design/logo/mediawave-v2/letters/kit.mjs
// Writes, each in light / dark / black / white:
//   mediawave-compact-*.svg     the disc and the name (headers, small spaces)
//   mediawave-horizontal-*.svg  the same with the line WEB DEVELOPMENT under the name (documents, the schema logo)
//   mediawave-mw-*.svg          the MW mark: brackets, M and W, the disc on its horizon, WEB DEVELOPMENT (square spaces)
import fs from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const OUT = resolve(ROOT, 'logos/mediawave-v2')
const ts = (file, name) => { const s = fs.readFileSync(resolve(ROOT, file), 'utf8'); const a = s.indexOf(`export const ${name} = `) + `export const ${name} = `.length; return JSON.parse(s.slice(a, s.indexOf(' as const', a))) }
const WORD = ts('src/sun/brand-art.ts', 'WORD'), MARK = ts('src/sun/brand-art.ts', 'MARK'), EMBLEM = ts('src/sun/emblem-art.ts', 'EMBLEM')
const TAG = JSON.parse(fs.readFileSync(resolve(ROOT, 'design/logo/mediawave-v2/tag.json'), 'utf8'))
const f = (n) => +n.toFixed(2)

const PAL = {
  light: { a: ['#2F5249', '#13241F'], b: ['#22BBA8', '#0F8478'], da: '#13241F', db: '#14A390', tag: '#3F4D48', rule: ['#13241F', 0.3], bl: ['#13241F', 0.38], br: ['#14A390', 0.7], bg: 'white backgrounds and the light mint' },
  dark: { a: ['#FFFFFF', '#CDEDE7'], b: ['#4DE3D0', '#19A996'], da: '#FFFFFF', db: '#2CC5B3', tag: '#A9C4BE', rule: ['#FFFFFF', 0.3], bl: ['#CDEDE7', 0.5], br: ['#2CC5B3', 0.75], bg: 'dark backgrounds (ink #13241F or darker)' },
  black: { mono: '#13241F', bg: 'print and engraving in one colour' },
  white: { mono: '#FFFFFF', bg: 'one colour on photos and video' },
}
const paint = (p, k) => (p.mono ? p.mono : `url(#mwk-${k})`)
const grads = (p, a, b) => (p.mono ? '' : `<linearGradient id="mwk-a" gradientUnits="userSpaceOnUse" x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}"><stop offset="0" stop-color="${p.a[0]}"/><stop offset="1" stop-color="${p.a[1]}"/></linearGradient><linearGradient id="mwk-b" gradientUnits="userSpaceOnUse" x1="${b[0]}" y1="${b[1]}" x2="${b[2]}" y2="${b[3]}"><stop offset="0" stop-color="${p.b[0]}"/><stop offset="1" stop-color="${p.b[1]}"/></linearGradient>`)
const disc = (p, cx, cy, d) => `<g transform="translate(${f(cx - d / 2)} ${f(cy - d / 2)}) scale(${f(d / 100)})"><path fill="${p.mono || p.da}" d="${MARK.a}"/><path fill="${p.mono || p.db}" d="${MARK.b}"/></g>`
const svg = (vb, title, desc, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(f).join(' ')}" role="img" aria-labelledby="mwk-title mwk-desc"><title id="mwk-title">${title}</title><desc id="mwk-desc">${desc}</desc>${body}</svg>\n`
const name = (p) => `<path fill="${paint(p, 'a')}" d="${WORD.M}"/><path fill="${paint(p, 'a')}" d="${WORD.edia}"/><g transform="translate(${WORD.wx} 0)"><path fill="${paint(p, 'b')}" d="${WORD.W}"/><path fill="${paint(p, 'b')}" d="${WORD.ave}"/></g><path fill="${p.mono || p.db}" transform="${WORD.drop.transform}" d="${WORD.drop.d}"/>`
// the tagline under the name, centred on the name, a rule on each side out to the name's edges
const nameL = 96, nameR = WORD.viewBox[0] + WORD.viewBox[2] - 30, tagW = 700, tagTop = 342
const tk = tagW / (TAG.bbox.x2 - TAG.bbox.x1), mid = (nameL + nameR) / 2, tagH = (TAG.bbox.y2 - TAG.bbox.y1) * tk, ry = tagTop + tagH / 2
const tagline = (p) => `<path fill="${p.mono || p.tag}" transform="translate(${f(mid - tagW / 2 - TAG.bbox.x1 * tk)} ${f(tagTop - TAG.bbox.y1 * tk)}) scale(${f(tk)})" d="${TAG.d}"/><path d="M${nameL} ${f(ry)}H${f(mid - tagW / 2 - 26)}M${f(mid + tagW / 2 + 26)} ${f(ry)}H${f(nameR)}" fill="none" stroke="${p.mono || p.rule[0]}" stroke-opacity="${p.mono ? 0.45 : p.rule[1]}" stroke-width="3.4" stroke-linecap="round"/>`
const mw = (p) => {
  const { cx, cy, d } = EMBLEM.disc
  // one colour: a channel keeps the W's first stroke apart from the M's last, which a second tone does otherwise
  const sep = p.mono ? `<defs><mask id="mwk-sep" maskUnits="userSpaceOnUse" x="60" y="130" width="400" height="200"><rect x="60" y="130" width="400" height="200" fill="#fff"/><path d="${EMBLEM.W}" fill="#000" stroke="#000" stroke-width="9"/></mask></defs>` : ''
  return `${sep}<g fill="none" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><polyline points="${EMBLEM.bracketL}" stroke="${p.mono || p.bl[0]}" stroke-opacity="${p.mono ? 0.45 : p.bl[1]}"/><polyline points="${EMBLEM.bracketR}" stroke="${p.mono || p.br[0]}" stroke-opacity="${p.mono ? 0.7 : p.br[1]}"/></g>` +
    `<path fill="${paint(p, 'a')}"${p.mono ? ' mask="url(#mwk-sep)"' : ''} d="${EMBLEM.M}"/><path fill="${paint(p, 'b')}" d="${EMBLEM.W}"/>` +
    `<path d="M105 ${cy}H${cx - d / 2 - 9}M${cx + d / 2 + 9} ${cy}H395" fill="none" stroke="${p.mono || p.rule[0]}" stroke-opacity="${p.mono ? 0.45 : 0.26}" stroke-width="3" stroke-linecap="round"/>` +
    disc(p, cx, cy, d) + `<path fill="${p.mono || p.tag}" transform="${EMBLEM.tag.transform}" d="${EMBLEM.tag.d}"/>`
}
fs.mkdirSync(OUT, { recursive: true })
const [x, y, w, h] = WORD.viewBox
const gradA = WORD.grad.a, gradB = [WORD.grad.b[0] + WORD.wx, WORD.grad.b[1], WORD.grad.b[2] + WORD.wx, WORD.grad.b[3]]
const D = 'The MediaWave logo: a disc cut by a sea line, beside the name MediaWave in heavy leaning letters with a drop on the i.'
for (const [k, p] of Object.entries(PAL)) {
  const body = `${p.mono ? '' : `<defs>${grads(p, gradA, gradB)}</defs>`}${disc(p, WORD.disc.cx, WORD.disc.cy, WORD.disc.d)}${name(p)}`
  fs.writeFileSync(resolve(OUT, `mediawave-compact-${k}.svg`), svg([x, y, w, h], 'MediaWave', D, body))
  fs.writeFileSync(resolve(OUT, `mediawave-horizontal-${k}.svg`), svg([x, y, w, tagTop + tagH + 8 - y], 'MediaWave', D + ' Under the name, the line Web Development.', body + tagline(p)))
  const mwBody = `${p.mono ? '' : `<defs>${grads(p, [88, 155, 268, 305], [232, 155, 422, 305])}</defs>`}${mw(p)}`
  fs.writeFileSync(resolve(OUT, `mediawave-mw-${k}.svg`), svg(EMBLEM.viewBox.split(' ').map(Number), 'MediaWave', 'The MW mark of MediaWave: the letters M and W between code brackets, under them the disc on a horizon line and the words Web Development.', mwBody))
}
console.log('kit:', fs.readdirSync(OUT).filter((n) => n.endsWith('.svg')).length, 'files in logos/mediawave-v2')
