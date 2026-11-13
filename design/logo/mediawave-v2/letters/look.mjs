// A working look: the name with the letters redrawn like the M and W (mixed case and capitals), beside the typeface version.
import { createRequire } from 'module'
import fs from 'fs'
import { mixed, caps, BASE } from './glyphs.mjs'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const require = createRequire(ROOT + 'package.json')
const puppeteer = require('puppeteer')
const ts = fs.readFileSync(ROOT + 'src/components/ui/logo-paths.ts', 'utf8')
const ART = Function('return ' + ts.slice(ts.indexOf('= {') + 2).replace(/;?\s*$/, ''))()
const half = (p) => ART.mark.parts.find((x) => x.part === p).d
const THEMES = { light: { a: ['#2F5249', '#13241F'], b: ['#22BBA8', '#0F8478'], da: '#13241F', db: '#14A390' }, dark: { a: ['#FFFFFF', '#CDEDE7'], b: ['#4DE3D0', '#19A996'], da: '#FFFFFF', db: '#2CC5B3' }, black: { a: ['#13241F', '#13241F'], b: ['#13241F', '#13241F'], da: '#13241F', db: '#13241F' } }
let n = 0
export const render = (o, t, height, disc = true) => { const u = 'k' + (++n), D = 166, dcx = -30, dcy = BASE - 75
  const left = disc ? dcx - D / 2 - 2 : 84, top = o.drop ? 136 : 147, w = o.x1 + 4 - left, h = BASE + 9 - top
  const g = (id, c, x0, x1) => `<linearGradient id="${u}${id}" gradientUnits="userSpaceOnUse" x1="${x0}" y1="155" x2="${x1}" y2="305"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left} ${top} ${w} ${h}" height="${height}" width="${(height * w / h).toFixed(1)}"><defs>${g('a', t.a, 88, o.mediaEnd)}${g('b', t.b, 232 + o.wx, o.x1)}</defs>
  ${disc ? `<g transform="translate(${dcx - D / 2} ${dcy - D / 2}) scale(${D / 100})"><path fill="${t.da}" d="${half('mark-a')}"/><path fill="${t.db}" d="${half('mark-b')}"/></g>` : ''}
  <path fill="url(#${u}a)" fill-rule="evenodd" d="${o.media}"/><path fill="url(#${u}b)" fill-rule="evenodd" d="${o.wave}"/>${o.drop ? `<path fill="${t.db}" transform="${o.drop.transform}" d="${o.drop.d}"/>` : ''}</svg>` }
if (process.argv[1].replace(/\\/g, '/').endsWith('look.mjs')) {
  const L = THEMES.light, D = THEMES.dark, mx = mixed(), cp = caps()
  const prev = fs.readFileSync('C:/tmp/night/logo/mw4/svg/mediawave-compact-light.svg', 'utf8').replace('<svg ', '<svg height="74" ')
  const html = `<style>body{margin:0;width:1200px;font-family:Arial}.c{display:flex;align-items:center;justify-content:center;gap:40px;position:relative}
  .mint{background:#C9E8E2}.white{background:#fff}.dark{background:#0B1714}i{position:absolute;top:8px;left:12px;font:600 11px Consolas,monospace;color:#5b7770;font-style:normal}</style><main>
  <div class="c white" style="height:150px"><i>BEFORE: TYPEFACE LETTERS</i>${prev}</div>
  <div class="c mint" style="height:230px"><i>MIXED CASE, DRAWN</i>${render(mx, L, 128)}</div>
  <div class="c dark" style="height:200px"><i>MIXED · DARK</i>${render(mx, D, 104)}</div>
  <div class="c mint" style="height:230px"><i>CAPITALS, DRAWN</i>${render(cp, L, 112)}</div>
  <div class="c dark" style="height:200px"><i>CAPITALS · DARK</i>${render(cp, D, 94)}</div>
  <div class="c white" style="height:110px"><i>SMALL</i>${render(mx, L, 34)}${render(mx, L, 24)}${render(cp, L, 30)}${render(cp, L, 21)}</div></main>`
  const b = await puppeteer.launch({ headless: 'new' })
  const pg = await b.newPage()
  await pg.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1.3 })
  await pg.setContent(html)
  await (await pg.$('main')).screenshot({ path: 'C:/tmp/night/logo/mw5/look.png' })
  await b.close(); console.log('ok')
}
