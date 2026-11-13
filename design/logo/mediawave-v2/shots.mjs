// Photographs the logo on the running site: the top state, the folded corner, the footer, at several widths.
import { createRequire } from 'module'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const OUT = 'C:/tmp/night/logo/mw4/shots/'
const require = createRequire(ROOT + 'package.json')
const puppeteer = require('puppeteer'); const fs = require('fs')
fs.mkdirSync(OUT, { recursive: true })
const base = process.argv[2] || 'http://localhost:5188'
const b = await puppeteer.launch({ headless: 'new' })
for (const [name, w, h] of [['320', 320, 640], ['390', 390, 844], ['1440', 1440, 900]]) {
  const pg = await b.newPage()
  await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
  await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  const errs = []; pg.on('console', (m) => m.type() === 'error' && errs.push(m.text())); pg.on('pageerror', (e) => errs.push(String(e)))
  await pg.goto(base + '/?calm=1', { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 3200))
  await pg.addStyleTag({ content: '[class*="consent"]{display:none!important}' })
  const top = await pg.evaluate(() => { const q = (s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] }
    return { logo: q('.pin__clip svg'), blob: q('.pin__blob'), tools: q('.head__tools'), overflow: document.documentElement.scrollWidth - innerWidth } })
  await pg.screenshot({ path: `${OUT}${name}-top.png`, clip: { x: 0, y: 0, width: w, height: Math.min(h, 420) } })
  await pg.evaluate(() => window.scrollTo(0, 900)); await new Promise((r) => setTimeout(r, 1400))
  const fold = await pg.evaluate(() => { const r = document.querySelector('.pin__clip').getBoundingClientRect(); const m = document.querySelector('.pin__menu').getBoundingClientRect(); return { clip: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], menu: [Math.round(m.x), Math.round(m.width)], nameOpacity: getComputedStyle(document.querySelector('.pin__clip [data-part="name"]')).opacity } })
  await pg.screenshot({ path: `${OUT}${name}-fold.png`, clip: { x: Math.max(0, w - 360), y: 900, width: Math.min(w, 360), height: 130 } })
  await pg.evaluate(() => document.querySelector('.foot__brand').scrollIntoView({ block: 'center' })); await new Promise((r) => setTimeout(r, 1200))
  const fb = await pg.evaluate(() => { const r = document.querySelector('.foot__brand').getBoundingClientRect(); const s = document.querySelector('.foot__brand svg').getBoundingClientRect(); return { y: scrollY + r.y - 30, h: r.height + 60, svg: [Math.round(s.width), Math.round(s.height)] } })
  await pg.screenshot({ path: `${OUT}${name}-foot.png`, clip: { x: 0, y: fb.y, width: w, height: Math.min(fb.h, 420) } })
  console.log(name, JSON.stringify({ top, fold, foot: fb.svg, errs: errs.slice(0, 3) }))
  await pg.close()
}
await b.close()
