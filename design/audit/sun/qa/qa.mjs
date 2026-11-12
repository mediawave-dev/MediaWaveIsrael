// node qa.mjs <url> <name> [width=390] [sliceH=1500]
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const [url, name, W = '390', SH = '1500'] = process.argv.slice(2)
const w = +W, sh = +SH
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: w, height: w < 600 ? 844 : 900, deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 })
await p.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
const errs = []
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message))
await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 1500))
const H = await p.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < H; y += 600) { await p.evaluate((v) => window.scrollTo(0, v), y); await new Promise((r) => setTimeout(r, 120)) }
await p.evaluate(() => window.scrollTo(0, 0)); await new Promise((r) => setTimeout(r, 400))
const buf = await p.screenshot({ fullPage: true, type: 'png' })
const meta = await sharp(buf).metadata()
let i = 0
for (let y = 0; y < meta.height; y += sh) {
  const h = Math.min(sh, meta.height - y)
  let img = sharp(buf).extract({ left: 0, top: y, width: meta.width, height: h })
  if (w > 800) img = img.resize({ width: 1000 })
  await img.jpeg({ quality: 70 }).toFile(`qa/${name}-${String(i++).padStart(2, '0')}.jpg`)
}
const over = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, h: document.documentElement.scrollHeight }))
console.log(name, JSON.stringify(over), 'slices', i, 'errors', errs.length, errs.slice(0, 5).join(' | '))
await b.close()
