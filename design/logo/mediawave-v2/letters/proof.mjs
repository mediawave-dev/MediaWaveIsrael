// Polish proof for option 1: the name very large over its guides (baseline, x-height, cap height), ink only, and at the
// sizes it will really live at (header 27 px, footer start ~22 px), on white and mint, at 1x and 2x device pixels.
import { createRequire } from 'module'
import { mixed, BASE } from './glyphs.mjs'
import { render } from './look.mjs'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const o = mixed()
const ink = { a: ['#13241F', '#13241F'], b: ['#13241F', '#13241F'], da: '#13241F', db: '#13241F' }
const L = { a: ['#2F5249', '#13241F'], b: ['#22BBA8', '#0F8478'], da: '#13241F', db: '#14A390' }
// guides drawn in the same coordinate space
const guides = (svg) => svg.replace('</svg>', `<g stroke="#E0457B" stroke-width="1.2" opacity=".7"><path d="M-200 ${BASE}H1600M-200 ${BASE - 112}H1600M-200 ${BASE - 150}H1600"/></g></svg>`)
const html = `<style>body{margin:0;width:1500px;background:#fff;font-family:Arial}.r{display:flex;align-items:center;justify-content:center;gap:40px;padding:24px 0;border-bottom:1px solid #e5ecea}.mint{background:#C9E8E2}</style><main>
<div class="r">${guides(render(o, ink, 300, false))}</div>
<div class="r">${render(o, L, 27)}${render(o, L, 22)}${render(o, ink, 27)}</div>
<div class="r mint">${render(o, L, 27)}${render(o, L, 22)}</div></main>`
const b = await puppeteer.launch({ headless: 'new' })
for (const dpr of [1, 2]) {
  const pg = await b.newPage(); await pg.setViewport({ width: 1500, height: 900, deviceScaleFactor: dpr })
  await pg.setContent(html); await (await pg.$('main')).screenshot({ path: `C:/tmp/night/logo/mw5/proof-${dpr}x.png` }); await pg.close()
}
await b.close(); console.log('ok', JSON.stringify({ wx: o.wx, x1: Math.round(o.x1) }))
