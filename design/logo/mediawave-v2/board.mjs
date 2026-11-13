// The board for Nati: the MediaWave logo redrawn in the style of the MW logo he picked, and how it sits on the site
// (real screenshots of the built site). Also writes the standalone SVG files of the kit.
import { createRequire } from 'module'
import fs from 'fs'
import { build, render, THEMES } from './logo2.mjs'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const OUT = 'C:/tmp/night/logo/mw4/'
const require = createRequire(ROOT + 'package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const b64 = (p) => fs.readFileSync(ROOT + 'public/fonts/' + p).toString('base64')
const img = (f) => `data:image/png;base64,${fs.readFileSync(OUT + 'shots/' + f).toString('base64')}`
const art = build()
const old = fs.readFileSync(ROOT + 'logos/horizon/mediawave-compact-light.svg', 'utf8').replace(/<\?xml[^>]*>/, '').replace('<svg ', '<svg height="44" ')
const L = THEMES.light, D = THEMES.dark
// the kit: standalone files
fs.mkdirSync(OUT + 'svg', { recursive: true })
for (const [variant, name] of [['compact', 'compact'], ['full', 'horizontal']]) for (const [k, t] of Object.entries({ light: L, dark: D, black: THEMES.black, white: THEMES.white }))
  fs.writeFileSync(`${OUT}svg/mediawave-${name}-${k}.svg`, render(art, t, variant, 0, 'role="img" aria-labelledby="mw-title mw-desc"').replace(/L\d+([ab])/g, 'mw-light-$1').replace(/\n/g, '')
    .replace(/(<svg[^>]*>)/, `$1<title id="mw-title">MediaWave</title><desc id="mw-desc">${variant === 'full' ? 'A disc cut by a sea line, the name MediaWave in heavy leaning letters with a drop on the i, and the line Web Development.' : 'A disc cut by a sea line beside the name MediaWave in heavy leaning letters, with a drop on the i.'}</desc>`) + '\n')

const css = `
@font-face{font-family:MWH;src:url(data:font/woff2;base64,${b64('eft/artzisraeli.woff2')})}
@font-face{font-family:MWT;src:url(data:font/woff2;base64,${b64('eft/tirosh.woff2')})}
body{margin:0;width:800px;background:#0B1714;font-family:MWT,Arial,sans-serif}
h2{margin:0;padding:24px 26px 4px;font:700 30px/1.15 MWH,Arial;color:#fff;direction:rtl}
p.lead{margin:0;padding:0 26px 18px;font:17px/1.5 MWT,Arial;color:#A9C4BE;direction:rtl}
.c{display:flex;align-items:center;justify-content:center;gap:34px;position:relative}
.mint{background:#C9E8E2}.white{background:#fff}.dark{background:radial-gradient(70% 90% at 50% 50%,#17382F,#0B1714)}
i{position:absolute;top:10px;left:14px;font:600 10px Consolas,monospace;letter-spacing:.14em;color:#5E8C83;font-style:normal}.mint i,.white i{color:#5b7770}
.s{padding:16px 26px 24px;direction:rtl}.s h3{display:flex;align-items:center;gap:12px;margin:0 0 6px;font:700 22px/1.2 MWH,Arial;color:#fff}
.s h3 b{flex:none;width:34px;height:34px;border-radius:50%;background:#2CC5B3;color:#0B1714;display:grid;place-items:center;font:700 17px Arial}
.s p{margin:0 0 14px;font:16.5px/1.5 MWT,Arial;color:#A9C4BE}.shot{display:block;border-radius:14px;box-shadow:0 0 0 1px #ffffff22,0 18px 40px #0008;margin:0 auto}
.sep{height:12px;background:#fff}.col{display:grid;gap:8px;justify-items:center;font:600 10px Consolas,monospace;color:#3F4D48}`
const A = `<style>${css}</style><main>
<h2>הלוגו המקורי, בסגנון של ה-MW</h2><p class="lead">העיגול, השם MediaWave והטיפה על ה-i נשארו. ה-M וה-W הן בדיוק האותיות מהלוגו שאהבת, ושאר האותיות צוירו באותו משקל ובאותה נטייה.</p>
<div class="c mint" style="height:230px"><i>ON THE SITE'S MINT</i>${render(art, L, 'compact', 92)}</div>
<div class="c dark" style="height:230px"><i>ON DARK</i>${render(art, D, 'compact', 92)}</div>
<div class="c white" style="height:240px;flex-direction:column;gap:26px"><i>BEFORE / AFTER</i>${old}${render(art, L, 'compact', 52)}</div>
<div class="sep"></div>
<h2>הלוגו המלא, עם השורה</h2><p class="lead">לתחתית האתר, לחשבוניות ולחתימות. השורה WEB DEVELOPMENT באותיות של הפונט שלך.</p>
<div class="c white" style="height:210px"><i>FULL</i>${render(art, L, 'full', 124)}</div>
<div class="c dark" style="height:210px"><i>FULL · DARK</i>${render(art, D, 'full', 124)}</div>
<div class="c mint" style="height:120px;gap:30px"><span class="col">${render(art, L, 'compact', 32)}32 PX</span><span class="col">${render(art, L, 'compact', 21)}21 PX</span><span class="col">${render(art, THEMES.black, 'compact', 26)}ONE COLOUR</span></div></main>`
const B = `<style>${css}</style><main>
<h2>כך זה נראה באתר</h2><p class="lead">צילומים של אתר התצוגה המקדימה אחרי הבנייה. זה כבר בקוד, לא הדמיה.</p>
<div class="s"><h3><b>1</b>בראש הדף, הלוגו המלא</h3><p>העיגול והשם בסגנון החדש, בפינה הלבנה.</p><img class="shot" src="${img('390-top.png')}" width="390"></div>
<div class="s"><h3><b>2</b>בגלילה, רק האייקון</h3><p>הכפתור הצף בצד ימין למעלה נשאר עם העיגול בלבד, ליד כפתור התפריט.</p><img class="shot" src="${img('390-fold.png')}" width="360"></div>
<div class="s"><h3><b>3</b>בתחתית האתר</h3><p>הלוגו המלא עם השורה WEB DEVELOPMENT.</p><img class="shot" src="${img('390-foot.png')}" width="390"></div>
<div class="s"><h3><b>4</b>במחשב</h3><p>אותו לוגו בפינה הימנית.</p><img class="shot" src="${img('1440-top.png')}" width="748"></div></main>`
const b = await puppeteer.launch({ headless: 'new' })
const pg = await b.newPage()
await pg.setViewport({ width: 800, height: 900, deviceScaleFactor: 1.5 })
for (const [n, html] of [['a', A], ['b', B]]) {
  await pg.setContent(html); await pg.evaluate(() => document.fonts.ready)
  await (await pg.$('main')).screenshot({ path: `${OUT}logo-board-${n}.png` })
  await sharp(`${OUT}logo-board-${n}.png`).jpeg({ quality: 90 }).toFile(`${OUT}logo-board-${n}.jpg`)
}
await b.close(); console.log('ok')
