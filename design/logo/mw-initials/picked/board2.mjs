// Board 2: where the logo lives on the site. Real screenshots of the built site with the logo swapped in the page,
// plus the link card as WhatsApp shows it and the browser tab.
import { createRequire } from 'module'
import fs from 'fs'
import { THEMES, emblem, icon, svg } from './parts.mjs'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const OUT = 'C:/tmp/night/logo/mw3/'
const require = createRequire(ROOT + 'package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const b64 = (p) => fs.readFileSync(ROOT + 'public/fonts/' + p).toString('base64')
const img = (f) => `data:image/png;base64,${fs.readFileSync(OUT + f).toString('base64')}`
await sharp(OUT + 'desk-foot.png').extract({ left: 2880 - 1240, top: 60, width: 1240, height: 900 }).toFile(OUT + 'desk-foot-crop.png')
const meta = JSON.parse(fs.readFileSync(OUT + 'meta.json', 'utf8'))
const css = `
@font-face{font-family:MWH;src:url(data:font/woff2;base64,${b64('eft/artzisraeli.woff2')})}
@font-face{font-family:MWT;src:url(data:font/woff2;base64,${b64('eft/tirosh.woff2')})}
body{margin:0;width:800px;background:#0B1714;font-family:MWT,Arial,sans-serif}
h2{margin:0;padding:24px 26px 4px;font:700 30px/1.15 MWH,Arial;color:#fff;direction:rtl}
.s{padding:18px 26px 26px;direction:rtl}
.s h3{display:flex;align-items:center;gap:12px;margin:0 0 6px;font:700 22px/1.2 MWH,Arial;color:#fff}
.s h3 b{flex:none;width:34px;height:34px;border-radius:50%;background:#2CC5B3;color:#0B1714;display:grid;place-items:center;font:700 17px Arial}
.s p{margin:0 0 14px;font:16.5px/1.5 MWT,Arial;color:#A9C4BE}
.shot{display:block;border-radius:14px;box-shadow:0 0 0 1px #ffffff22,0 18px 40px #0008;margin:0 auto}
.pair{display:flex;gap:18px;align-items:flex-start;justify-content:center;direction:ltr}
.sep{height:12px;background:#fff}
.wa{direction:rtl;background:#0b141a url() ;padding:20px;border-radius:14px;box-shadow:0 0 0 1px #ffffff22}
.bub{width:380px;margin-inline-start:auto;background:#005c4b;border-radius:10px 0 10px 10px;padding:5px;color:#e9edef}
.card{background:#025144;border-radius:7px;overflow:hidden}.card .og{height:190px;display:grid;place-items:center;background:radial-gradient(70% 90% at 50% 50%,#17382F,#0B1714)}
.card div.t{padding:9px 11px 10px;direction:rtl}.card b{display:block;font:700 14.5px/1.35 Arial;color:#e9edef}.card small{display:block;margin-top:3px;font:12.5px/1.35 Arial;color:#a9c0bb}.card em{display:block;margin-top:5px;font:12px Arial;color:#8fb0a9;font-style:normal;direction:ltr;text-align:right}
.bub a{display:block;padding:6px 7px 3px;font:14.5px Arial;color:#53bdeb;direction:ltr;text-align:left}
.tab{direction:ltr;display:flex;align-items:flex-end;background:#dee1e6;border-radius:12px 12px 0 0;padding:8px 10px 0;height:44px;box-sizing:border-box;width:520px;margin:0 auto}
.tab span{display:flex;align-items:center;gap:9px;background:#fff;border-radius:9px 9px 0 0;height:36px;padding:0 14px;font:13px Arial;color:#202124;width:250px;box-sizing:border-box;white-space:nowrap;overflow:hidden}
.url{direction:ltr;background:#fff;width:520px;margin:0 auto;border-radius:0 0 12px 12px;padding:8px 12px;box-sizing:border-box}.url i{display:block;background:#f1f3f4;border-radius:16px;padding:7px 14px;font:13px Arial;color:#202124;font-style:normal}`
const A = `<style>${css}</style><main>
<h2>איפה הלוגו יושב באתר</h2>
<div class="s"><h3><b>1</b>בפינה הלבנה שבראש כל דף</h3><p>העיגול ו-MW בתוך הסוגריים. זה המקום הראשון שהעין פוגשת, ולחיצה עליו מחזירה לדף הבית.</p>
  <img class="shot" src="${img('phone-top.png')}" width="390"></div>
<div class="s"><h3><b>2</b>בגלילה הוא מתקפל לעיגול</h3><p>כמו היום. הפינה מתכווצת, נשאר רק העיגול ליד כפתור התפריט, והאותיות חוזרות כשעולים לראש הדף.</p>
  <img class="shot" src="${img('phone-folded.png')}" width="300"></div>
<div class="s"><h3><b>3</b>אותו דבר במחשב</h3><p>הלוגו בפינה הימנית, התפריט באמצע, וכפתור הוואטסאפ משמאל.</p>
  <img class="shot" src="${img('desk-top.png')}" width="748"></div></main>`
const B = `<style>${css}</style><main>
<div class="s"><h3><b>4</b>בתחתית האתר, הלוגו המלא</h3><p>כאן יש מקום, אז מופיע הסמל השלם. האותיות, הקו עם העיגול, והשורה WEB DEVELOPMENT.</p>
  <div class="pair"><img class="shot" src="${img('phone-foot.png')}" width="330"><img class="shot" src="${img('desk-foot-crop.png')}" width="400"></div></div>
<div class="s"><h3><b>5</b>כששולחים את הקישור בוואטסאפ</h3><p>רוב הלקוחות יקבלו את האתר כקישור. הכרטיס שנפתח בצ'אט יציג את הסמל המלא על רקע כהה.</p>
  <div class="wa"><div class="bub"><div class="card"><div class="og">${svg(emblem(THEMES.dark), 150)}</div><div class="t"><b>${meta.title}</b><small>${meta.desc.slice(0, 96)}…</small><em>mediawave.co.il</em></div></div><a>https://mediawave.co.il</a></div></div></div>
<div class="s"><h3><b>6</b>בלשונית של הדפדפן נשאר העיגול</h3><p>ב-16 פיקסלים האותיות כבר לא נקראות, והעיגול כן. לכן האייקון הקטן לא משתנה.</p>
  <div class="tab"><span>${svg(icon(THEMES.light), 16)}MediaWave Israel</span></div><div class="url"><i>mediawave.co.il</i></div></div></main>`
const b = await puppeteer.launch({ headless: 'new' })
const pg = await b.newPage()
await pg.setViewport({ width: 800, height: 900, deviceScaleFactor: 1.5 })
for (const [n, html] of [['2', A], ['3', B]]) {
  await pg.setContent(html); await pg.evaluate(() => document.fonts.ready)
  await (await pg.$('main')).screenshot({ path: `${OUT}board-${n}.png` })
  await sharp(`${OUT}board-${n}.png`).jpeg({ quality: 88 }).toFile(`${OUT}board-${n}.jpg`)
}
await b.close(); console.log('ok')
