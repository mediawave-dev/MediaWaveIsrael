// Board 1: the MW logo joined with the disc. The source file as pasted, the emblem, the header lockup, the sizes.
import { createRequire } from 'module'
import fs from 'fs'
import { THEMES, emblem, lockup, mono, icon, svg } from './parts.mjs'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const require = createRequire(ROOT + 'package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const b64 = (p) => fs.readFileSync(ROOT + 'public/fonts/' + p).toString('base64')
const SRC = fs.readFileSync(new URL('./source.svg', import.meta.url), 'utf8').replace('width="100%" height="100%"', 'width="250" height="250"')
const L = THEMES.light, D = THEMES.dark
const css = `
@font-face{font-family:MWH;src:url(data:font/woff2;base64,${b64('eft/artzisraeli.woff2')})}
@font-face{font-family:MWT;src:url(data:font/woff2;base64,${b64('eft/tirosh.woff2')})}
body{margin:0;width:800px;background:#0B1714;font-family:MWT,Arial,sans-serif}
h2{margin:0;padding:22px 26px 6px;font:700 28px/1.15 MWH,Arial;color:#fff;direction:rtl}
p{margin:0;padding:0 26px 18px;font:17px/1.45 MWT,Arial;color:#A9C4BE;direction:rtl}
.two{display:grid;grid-template-columns:1fr 1fr}.c{display:grid;place-items:center;position:relative}
.mint{background:#C9E8E2}.white{background:#fff}.dark{background:radial-gradient(70% 80% at 50% 50%,#17382F,#0B1714)}
i{position:absolute;top:10px;left:14px;font:600 10px Consolas,monospace;letter-spacing:.14em;color:#5E8C83;font-style:normal}
.mint i,.white i{color:#5b7770}
.sizes{display:flex;align-items:center;justify-content:space-around;background:#C9E8E2;padding:22px 10px}
.sizes span{display:grid;justify-items:center;gap:8px;font:600 10px Consolas,monospace;color:#3F4D48}
.sep{height:12px;background:#fff}`
const html = `<style>${css}</style><main>
<h2>המקור והשילוב</h2><p>מימין הקובץ כמו שקיבלת אותו. משמאל אותו לוגו על צבע האתר, כשהעיגול של האתר יושב על הקו והקו הופך לאופק שלו.</p>
<div class="two"><div class="c white" style="height:330px"><i>SOURCE FILE</i>${SRC}</div><div class="c mint" style="height:330px"><i>ON THE SITE'S MINT</i>${svg(emblem(L), 215)}</div></div>
<div class="c dark" style="height:400px"><i>EMBLEM · DARK</i>${svg(emblem(D), 268)}</div>
<div class="sep"></div>
<h2>הלוגו לכותרת האתר</h2><p>העיגול, ואחריו MW. בשורה השנייה אותו דבר בתוך הסוגריים של הקוד.</p>
<div class="two"><div class="c mint" style="height:170px"><i>HEADER</i>${svg(lockup(L), 76)}</div><div class="c dark" style="height:170px"><i>HEADER · DARK</i>${svg(lockup(D), 76)}</div></div>
<div class="two"><div class="c mint" style="height:170px"><i>WITH BRACKETS</i>${svg(lockup(L, { br: true }), 76)}</div><div class="c dark" style="height:170px"><i>WITH BRACKETS · DARK</i>${svg(lockup(D, { br: true }), 76)}</div></div>
<div class="sizes"><span>${svg(lockup(L), 44)}44 PX</span><span>${svg(lockup(L), 30)}30 PX</span><span>${svg(lockup(THEMES.ink), 30)}ONE COLOUR</span><span>${svg(icon(L), 32)}ICON 32</span><span>${svg(icon(L), 16)}16</span></div>
</main>`
const b = await puppeteer.launch({ headless: 'new' })
const pg = await b.newPage()
await pg.setViewport({ width: 800, height: 900, deviceScaleFactor: 1.5 })
await pg.setContent(html); await pg.evaluate(() => document.fonts.ready)
await (await pg.$('main')).screenshot({ path: 'C:/tmp/night/logo/mw3/board-1.png' })
await sharp('C:/tmp/night/logo/mw3/board-1.png').jpeg({ quality: 90 }).toFile('C:/tmp/night/logo/mw3/board-1.jpg')
await b.close(); console.log('ok')
