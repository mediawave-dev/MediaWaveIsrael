/**
 * generate-demo-images.mjs — builds the BeforeAfterSlider demo assets.
 * "Before": a deliberately outdated fake Hebrew business site (rendered
 * from inline HTML — NOT a real client project, clearly a demo).
 * "After": a screenshot of THIS site's current hero.
 * Usage: node scripts/generate-demo-images.mjs <previewURL>
 */
import { writeFileSync, mkdirSync, unlinkSync } from 'fs'
import { resolve } from 'path'
import { tmpdir } from 'os'
import puppeteer from 'puppeteer'
import sharp from 'sharp'

const previewURL = process.argv[2] || 'http://localhost:4173'
const W = 1200
const H = 750

const OLD_SITE_HTML = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8"><style>
  body { margin:0; font-family: Arial, sans-serif; background:#e8e4d8 url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="%23e8e4d8"/><rect width="2" height="2" fill="%23ddd8c8"/></svg>'); }
  .top { background: linear-gradient(#274a7d,#16294a); color:#fff; padding:10px 16px; border-bottom:4px solid #f7a600; }
  .top h1 { margin:0; font-size:30px; text-shadow:2px 2px 2px #000; }
  .top p { margin:2px 0 0; color:#ffd97a; font-size:13px; }
  .navbar { background:#f7a600; padding:6px 10px; font-size:14px; font-weight:bold; }
  .navbar a { color:#16294a; margin-inline-end:14px; text-decoration:underline; }
  .wrap { display:table; width:100%; border-collapse:collapse; }
  .side { display:table-cell; width:190px; background:#fffbe8; border-inline-start:2px dashed #b3a884; padding:10px; vertical-align:top; font-size:13px; }
  .side h3 { background:#274a7d; color:#fff; padding:4px 8px; margin:8px 0 4px; font-size:14px; }
  .side ul { margin:0; padding-inline-start:18px; }
  .main { display:table-cell; padding:14px 18px; vertical-align:top; }
  .blink { color:#d40000; font-weight:bold; font-size:15px; }
  .box { border:2px ridge #999; background:#fff; padding:10px; margin-bottom:12px; }
  .box h2 { margin:0 0 6px; color:#274a7d; font-size:20px; text-decoration:underline; }
  .box p { margin:0 0 6px; font-size:13px; line-height:1.5; color:#333; }
  .btn { display:inline-block; background:linear-gradient(#ffe259,#f7a600); border:2px outset #f7a600; padding:6px 18px; font-weight:bold; color:#16294a; font-size:14px; }
  .counter { text-align:center; font-size:11px; color:#666; margin-top:6px; }
  .marq { background:#16294a; color:#ffe259; font-size:13px; padding:4px 8px; white-space:nowrap; overflow:hidden; }
  table.prices { width:100%; border-collapse:collapse; font-size:12px; }
  table.prices td, table.prices th { border:1px solid #999; padding:4px 6px; text-align:right; }
  table.prices th { background:#274a7d; color:#fff; }
  .footer { background:#16294a; color:#9fb3d9; text-align:center; font-size:11px; padding:8px; }
</style></head><body>
  <div class="top"><h1>עסק לפיתוח אתרים!</h1><p>*** האתר הרשמי *** בונים אתרים לאינטרנט מאז 2003 ***</p></div>
  <div class="marq">★★★ ברוכים הבאים לאתר החדש שלנו!!! מבצע: אתר תדמית + ספר אורחים בחינם לכל המזמינים החודש!!! ★★★</div>
  <div class="navbar"><a>דף הבית</a><a>אודות</a><a>שירותים</a><a>גלריית אתרים</a><a>מחירון</a><a>צור קשר</a><a>ספר אורחים</a></div>
  <div class="wrap">
    <div class="main">
      <div class="box"><h2>ברוכים הבאים!!!</h2>
        <p>אנחנו בונים אתרים לאינטרנט לכל מטרה! אתרי תדמית, פורומים, מצגות פלאש מרהיבות ודפי אינדקס. אצלנו האתר שלכם יעלה לאוויר מהר ובמחיר ללא תחרות. הלקוח תמיד צודק!</p>
        <p class="blink">!!! חדש !!! עכשיו גם אנימציות פלאש וספרי אורחים !!!</p>
        <span class="btn">לחץ כאן לפרטים</span>
      </div>
      <div class="box"><h2>המחירון שלנו</h2>
        <table class="prices"><tr><th>שירות</th><th>מחיר</th></tr>
        <tr><td>אתר תדמית 5 עמודים</td><td>לפי בקשה</td></tr>
        <tr><td>מצגת פלאש לדף הבית</td><td>התקשרו</td></tr>
        <tr><td>כפתורים מהבהבים</td><td>מחיר מיוחד!</td></tr></table>
      </div>
      <div class="counter">אתם המבקר מספר 003842 באתר | עודכן לאחרונה: 12/03/2011</div>
    </div>
    <div class="side">
      <h3>ניווט מהיר</h3><ul><li>המלצות</li><li>אתרים שבנינו</li><li>טופס הזמנה</li><li>שאלות ותשובות</li></ul>
      <h3>צור קשר</h3><p>טל: 03-1234567<br>פקס: 03-1234568<br>שעות פעילות:<br>א-ה 8:00-17:00</p>
      <h3>חדשות</h3><p>האתר שלנו עלה לאוויר! נבנה בעצמנו כמובן</p>
    </div>
  </div>
  <div class="footer">כל הזכויות שמורות © 2011 | האתר נבנה באהבה | מומלץ לצפייה ברזולוציה 1024x768 בדפדפן אקספלורר</div>
</body></html>`

const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 })

// BEFORE — the fake outdated site
const tmpHtml = resolve(tmpdir(), 'mw-demo-old.html')
writeFileSync(tmpHtml, OLD_SITE_HTML)
await page.goto('file://' + tmpHtml.replace(/\\/g, '/'), { waitUntil: 'networkidle0' })
const beforePng = await page.screenshot({ type: 'png' })

// AFTER — this site's hero (motion enabled so it looks alive)
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await page.goto(previewURL, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 3500))
// dismiss the cookie banner (click אישור) + hide floating widgets
await page.evaluate(() => {
  const accept = [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'אישור')
  accept?.click()
  document.querySelectorAll('.floating-cta').forEach((el) => (el.style.display = 'none'))
})
await new Promise((r) => setTimeout(r, 600))
const afterPng = await page.screenshot({ type: 'png' })
await browser.close()
unlinkSync(tmpHtml)

await sharp(beforePng).webp({ quality: 72 }).toFile('public/images/demo-before.webp')
await sharp(afterPng).webp({ quality: 72 }).toFile('public/images/demo-after.webp')
const { size: s1 } = await sharp('public/images/demo-before.webp').metadata().then(() => import('fs').then((fs) => fs.statSync('public/images/demo-before.webp')))
const { size: s2 } = await import('fs').then((fs) => fs.statSync('public/images/demo-after.webp'))
console.log('demo-before.webp:', Math.round(s1 / 1024), 'KB | demo-after.webp:', Math.round(s2 / 1024), 'KB')
