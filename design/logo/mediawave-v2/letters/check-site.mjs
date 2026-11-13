// Checks the logo work on the running dev site:
//   header: top and folded corner at 320 / 390 / 1440
//   footer: the fold from the full name to the MW mark, frame by frame on a virtual clock (11 frames, p = 0 to 1)
import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const OUT = 'C:/tmp/night/logo/mw5/check/'; fs.mkdirSync(OUT, { recursive: true })
const BASE = process.argv[2] || 'http://localhost:5188'
const b = await puppeteer.launch({ headless: 'new' })
const report = {}
for (const [name, w, h] of [['320', 320, 640], ['390', 390, 844], ['1440', 1440, 900]]) {
  const pg = await b.newPage(); await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
  await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  const errs = []; pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errs.push(m.text()))
  await pg.goto(BASE + '/?calm=1', { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 2500))
  await pg.addStyleTag({ content: '[class*="consent"]{display:none!important}' })
  const top = await pg.evaluate(() => { const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)] }
    return { logo: r('.pin__clip svg'), clip: r('.pin__clip'), tools: r('.head__tools'), over: document.documentElement.scrollWidth - innerWidth } })
  await pg.screenshot({ path: `${OUT}${name}-top.png`, clip: { x: 0, y: 0, width: w, height: 140 } })
  await pg.evaluate(() => window.scrollTo(0, 900)); await new Promise((r) => setTimeout(r, 1300))
  const fold = await pg.evaluate(() => { const c = document.querySelector('.pin__clip').getBoundingClientRect(), d = document.querySelector('.pin__clip [data-part="mark"]').getBoundingClientRect()
    return { clipW: Math.round(c.width), disc: [Math.round(d.width), Math.round(d.height)], name: getComputedStyle(document.querySelector('.pin__clip [data-part="name"]')).opacity } })
  await pg.screenshot({ path: `${OUT}${name}-fold.png`, clip: { x: Math.max(0, w - 240), y: 900, width: Math.min(w, 240), height: 110 } })
  report[name] = { top, fold, errs }
  await pg.close()
}
// the footer fold, frame by frame
for (const [name, w, h] of [['390', 390, 844], ['1440', 1440, 900]]) {
  const pg = await b.newPage(); await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
  await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await pg.evaluateOnNewDocument(() => {
    let vt = 0; const q = []; performance.now = () => vt
    window.requestAnimationFrame = (cb) => { q.push(cb); return q.length }
    window.cancelAnimationFrame = () => {}
    window.__step = (ms) => { vt += ms; const l = q.splice(0); l.forEach((cb) => { try { cb(vt) } catch (e) { console.error(String(e)) } }) }
  })
  await pg.goto(BASE + '/', { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 1500))
  await pg.addStyleTag({ content: '[class*="consent"]{display:none!important}' })
  await pg.evaluate(() => document.querySelector('.foot__brand').scrollIntoView({ block: 'center' })); await new Promise((r) => setTimeout(r, 700))
  const box = await pg.evaluate(() => { const r = document.querySelector('.foot__brand svg').getBoundingClientRect(); return { x: Math.max(0, r.x - 30), y: scrollY + r.y - 24, width: r.width + 60, height: r.height + 48 } })
  const frames = []
  for (let i = 0; i <= 10; i++) {
    if (i) await pg.evaluate(() => window.__step(190))
    const f = `${OUT}${name}-f${String(i).padStart(2, '0')}.png`; await pg.screenshot({ path: f, clip: box }); frames.push(f)
  }
  // one strip
  const meta = await sharp(frames[0]).metadata()
  await sharp({ create: { width: meta.width * 4, height: meta.height * 3, channels: 3, background: '#ffffff' } })
    .composite(frames.map((f, i) => ({ input: f, left: (i % 4) * meta.width, top: Math.floor(i / 4) * meta.height }))).png().toFile(`${OUT}${name}-fold-strip.png`)
  report['foot' + name] = box
  await pg.close()
}
await b.close()
console.log(JSON.stringify(report))
