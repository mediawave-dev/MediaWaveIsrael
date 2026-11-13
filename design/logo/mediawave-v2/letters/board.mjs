// Two boards for Nati (13.11.2026): the MW mark in the footer (photographed on the local site, not pushed), and the
// name with its other letters redrawn like the M and W, in two forms, beside the typeface version.
import { createRequire } from 'module'
import fs from 'fs'
import { mixed, caps } from './glyphs.mjs'
import { render } from './look.mjs'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const OUT = 'C:/tmp/night/logo/mw5/'
const require = createRequire(ROOT + 'package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const b64 = (p) => fs.readFileSync(ROOT + 'public/fonts/' + p).toString('base64')
await sharp(OUT + 'foot-1440.png').extract({ left: 2880 - 1280, top: 100, width: 1280, height: 560 }).toFile(OUT + 'foot-1440-crop.png')
await sharp(OUT + 'foot-390.png').extract({ left: 0, top: 80, width: 780, height: 420 }).toFile(OUT + 'foot-390-crop.png')
const img = (f) => `data:image/png;base64,${fs.readFileSync(OUT + f).toString('base64')}`
const L = { a: ['#2F5249', '#13241F'], b: ['#22BBA8', '#0F8478'], da: '#13241F', db: '#14A390' }, D = { a: ['#FFFFFF', '#CDEDE7'], b: ['#4DE3D0', '#19A996'], da: '#FFFFFF', db: '#2CC5B3' }
const prev = (k, h) => fs.readFileSync(`C:/tmp/night/logo/mw4/svg/mediawave-compact-${k}.svg`, 'utf8').replace('<svg ', `<svg height="${h}" `).replace(/mw-light-/g, `p${k}${h}-`).replace(/mw-(title|desc)/g, `p${k}${h}-$1`)
const mx = mixed(), cp = caps()
const css = `
@font-face{font-family:MWH;src:url(data:font/woff2;base64,${b64('eft/artzisraeli.woff2')})}
@font-face{font-family:MWT;src:url(data:font/woff2;base64,${b64('eft/tirosh.woff2')})}
body{margin:0;width:800px;background:#0B1714;font-family:MWT,Arial,sans-serif}
h2{margin:0;padding:24px 26px 4px;font:700 30px/1.15 MWH,Arial;color:#fff;direction:rtl}
p.lead{margin:0;padding:0 26px 18px;font:17px/1.5 MWT,Arial;color:#A9C4BE;direction:rtl}
.o{direction:rtl;display:flex;align-items:center;gap:14px;padding:18px 26px 12px}
.o b{flex:none;width:44px;height:44px;border-radius:50%;background:#2CC5B3;color:#0B1714;display:grid;place-items:center;font:700 22px Arial}
.o h3{margin:0;font:700 23px/1.2 MWH,Arial;color:#fff}.o p{margin:3px 0 0;font:16px/1.45 MWT,Arial;color:#A9C4BE}
.c{display:flex;align-items:center;justify-content:center;gap:30px}.mint{background:#C9E8E2}.dark{background:radial-gradient(70% 90% at 50% 50%,#17382F,#0B1714)}.white{background:#fff}
.shot{display:block;border-radius:14px;box-shadow:0 0 0 1px #ffffff22,0 18px 40px #0008;margin:0 auto 22px}
.sep{height:12px;background:#fff}`
const opt = (n, title, text, big, dark, small) => `<div class="o"><b>${n}</b><div><h3>${title}</h3><p>${text}</p></div></div>
  <div class="c mint" style="height:170px">${big}</div><div class="c dark" style="height:150px">${dark}</div><div class="c white" style="height:74px">${small}</div>`
const A = `<style>${css}</style><main>
<h2>ה-MW עם האייקון מתחת, בתחתית האתר</h2><p class="lead">צילום מהאתר אצלי במחשב. זה לא נדחף לתצוגה המקדימה, ויעלה רק אם תאשר. בראש הדף נשאר הלוגו המקורי.</p>
<img class="shot" src="${img('foot-390-crop.png')}" width="390"><img class="shot" src="${img('foot-1440-crop.png')}" width="640"></main>`
const B = `<style>${css}</style><main>
<h2>שאר האותיות, מצוירות כמו ה-M וה-W</h2><p class="lead">ה-M וה-W שלך הן בלוקים נטויים עם חיתוכים חדים וקצוות ישרים, בלי קו עגול אחד. ציירתי את שאר האותיות באותה שיטה. אלה תמונות בלבד, שום דבר מזה לא באתר.</p>
${opt(1, 'אותיות קטנות, מצוירות', 'כל אות היא בלוק עם חיתוך חד אחד, כמו ב-M. ה-v היא חצי מה-W, וה-a היא ה-e הפוכה. הטיפה נשארת.', render(mx, L, 96), render(mx, D, 84), render(mx, L, 30) + render(mx, L, 21))}
<div class="sep"></div>
${opt(2, 'כל האותיות גדולות', 'כולן בגובה של ה-M וה-W. ה-A היא ה-V הפוכה, בלי קו אמצעי, כך שכל המילה נראית כמו רצף אחד של M ו-W.', render(cp, L, 84), render(cp, D, 74), render(cp, L, 27) + render(cp, L, 19))}
<div class="sep"></div>
${opt(3, 'הגרסה הקודמת, מפונט', 'להשוואה. האותיות העגולות מהפונט Urbanist, ליד ה-M וה-W שלך.', prev('light', 76), prev('dark', 66), prev('light', 24))}
</main>`
const b = await puppeteer.launch({ headless: 'new' })
const pg = await b.newPage()
await pg.setViewport({ width: 800, height: 900, deviceScaleFactor: 1.5 })
for (const [n, html] of [['footer', A], ['letters', B]]) {
  await pg.setContent(html); await pg.evaluate(() => document.fonts.ready)
  await (await pg.$('main')).screenshot({ path: `${OUT}board-${n}.png` })
  await sharp(`${OUT}board-${n}.png`).jpeg({ quality: 90 }).toFile(`${OUT}board-${n}.jpg`)
}
await b.close(); console.log('ok')
