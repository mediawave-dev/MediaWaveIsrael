// node corner.mjs <base> [width=390] : the pinned corner at several scroll positions, the open menu, the contact circle
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const [base, W = '390'] = process.argv.slice(2)
const w = +W, vh = w < 600 ? 844 : 900
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: w, height: vh, deviceScaleFactor: w < 600 ? 2 : 1, isMobile: w < 600, hasTouch: w < 600 })
await p.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
const errs = []
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message))
await p.goto(base + '/?reduce=1', { waitUntil: 'networkidle2', timeout: 60000 })
await p.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 1500))
const cropH = w < 600 ? 300 : 220
const shots = []
for (const y of [0, 35, 70, 105, 140, 600]) {
  await p.evaluate((v) => window.scrollTo(0, v), y)
  await new Promise((r) => setTimeout(r, 700))
  const s = await p.screenshot({ type: 'png' })
  const sm = await sharp(s).metadata()
  shots.push(await sharp(s).extract({ left: 0, top: 0, width: sm.width, height: Math.round(cropH * sm.width / w) }).resize({ width: w < 600 ? 390 : 1000 }).toBuffer())
}
const m0 = await sharp(shots[0]).metadata()
await sharp({ create: { width: m0.width, height: (m0.height + 6) * shots.length, channels: 3, background: '#c00' } })
  .composite(shots.map((input, i) => ({ input, left: 0, top: i * (m0.height + 6) }))).jpeg({ quality: 80 }).toFile(`qa/corner-${w}.jpg`)
const info = await p.evaluate(() => {
  const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)] }
  return { blob: r('.pin__blob'), menu: r('.pin__menu'), logo: r('.pin__logo'), clip: r('.pin__clip'), svg: r('.pin__clip svg'), p: getComputedStyle(document.querySelector('.pin')).getPropertyValue('--p'), sw: document.documentElement.scrollWidth }
})
console.log('folded', JSON.stringify(info))
// the open menu
await p.click('.pin__menu'); await new Promise((r) => setTimeout(r, 500))
await p.screenshot({ type: 'jpeg', quality: 75, path: `qa/menu-${w}.jpg` })
await p.keyboard.press('Escape'); await new Promise((r) => setTimeout(r, 300))
// the contact circle
const cy = await p.evaluate(() => Math.round(document.getElementById('contact').getBoundingClientRect().top + scrollY))
const ch = await p.evaluate(() => Math.round(document.getElementById('contact').getBoundingClientRect().height))
await p.evaluate((v) => window.scrollTo(0, v), cy - 60); await new Promise((r) => setTimeout(r, 600))
const full = await p.screenshot({ type: 'png', fullPage: true })
const fm = await sharp(full).metadata()
const k = fm.width / w
await sharp(full).extract({ left: 0, top: Math.round((cy - 80) * k), width: fm.width, height: Math.min(fm.height - Math.round((cy - 80) * k), Math.round((ch + 160) * k)) }).resize({ width: w < 600 ? 390 : 1000 }).jpeg({ quality: 78 }).toFile(`qa/circle-${w}.jpg`)
console.log('errors', errs.length, errs.slice(0, 4).join(' | '))
await b.close()
