// The footer mark (D268): the closing on first sight, then a tap to open and a tap to close, frame by frame on a
// virtual clock; plus the colour of "Wave" in the header against the footer's disc at one moment.
import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const OUT = 'C:/tmp/night/logo/mw5/toggle/'; fs.mkdirSync(OUT, { recursive: true })
const BASE = process.argv[2] || 'http://localhost:5188'
const W = +(process.argv[3] || 390)
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage(); await p.setViewport({ width: W, height: 844, deviceScaleFactor: 2 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await p.evaluateOnNewDocument(() => {
  let vt = 0; const q = []; performance.now = () => vt
  window.requestAnimationFrame = (cb) => { q.push(cb); return q.length }
  window.cancelAnimationFrame = () => {}
  window.__step = (ms) => { vt += ms; const l = q.splice(0); l.forEach((cb) => { try { cb(vt) } catch (e) { console.error(String(e)) } }) }
})
const errs = []; p.on('pageerror', (e) => errs.push(String(e)))
await p.goto(BASE + '/', { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 1500))
await p.addStyleTag({ content: '[class*="consent"]{display:none!important} .tab{display:none!important}' })
await p.evaluate(() => document.querySelector('.foot__brand').scrollIntoView({ block: 'center' })); await new Promise((r) => setTimeout(r, 700))
const box = await p.evaluate(() => { const r = document.querySelector('.foot__mark').getBoundingClientRect(); return { x: Math.max(0, r.x - 10), y: scrollY + r.y - 10, width: Math.min(r.width + 20, innerWidth), height: r.height + 20 } })
const shots = async (name, n, ms) => { const files = []; for (let i = 0; i <= n; i++) { if (i) await p.evaluate((v) => window.__step(v), ms); const f = `${OUT}${name}-${String(i).padStart(2, '0')}.png`; await p.screenshot({ path: f, clip: box }); files.push(f) } return files }
const strip = async (files, name) => { const m = await sharp(files[0]).metadata(); const cols = 4, rows = Math.ceil(files.length / cols)
  await sharp({ create: { width: m.width * cols, height: m.height * rows, channels: 3, background: '#fff' } }).composite(files.map((f, i) => ({ input: f, left: (i % cols) * m.width, top: Math.floor(i / cols) * m.height }))).png().toFile(`${OUT}${name}-strip.png`) }
const close1 = await shots('close', 15, 106.67); await strip(close1, 'close')
const pressed0 = await p.evaluate(() => document.querySelector('.foot__mark').getAttribute('aria-pressed'))
await p.click('.foot__mark'); const open1 = await shots('open', 11, 160); await strip(open1, 'open')
const pressed1 = await p.evaluate(() => document.querySelector('.foot__mark').getAttribute('aria-pressed'))
await p.click('.foot__mark'); await p.evaluate(() => window.__step(400)); await p.click('.foot__mark') // reverse mid-way, then again
const rev = await shots('reverse', 7, 160); await strip(rev, 'reverse')
// colours: the header's Wave and the footer disc's lower half, now
const colours = await p.evaluate(() => ({ wave: getComputedStyle(document.querySelector('.pin .mw-logo path[data-part="wave"]')).fill, disc: getComputedStyle(document.querySelector('.foot .mw-logo [data-part="mark"] path:nth-child(2)')).fill, w0: getComputedStyle(document.querySelector('.walk-w0')).stopColor, anims: document.getAnimations().filter((a) => /^(mark|walk)-/.test(a.animationName)).map((a) => a.startTime).filter((v, i, x) => x.indexOf(v) === i) }))
console.log(JSON.stringify({ pressed0, pressed1, colours, errs }))
await b.close()
