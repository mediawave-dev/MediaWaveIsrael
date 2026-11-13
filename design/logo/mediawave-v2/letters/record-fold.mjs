// Records the footer fold (the full name folding into the MW mark) frame by frame on a virtual clock, 60 fps, as a phone
// would show it, and writes an MP4: a short hold on the name, the fold, a hold on the mark.
//   node record-fold.mjs [base-url] [out.mp4]
import { createRequire } from 'module'
import fs from 'fs'
import { execFileSync } from 'child_process'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const BASE = process.argv[2] || 'http://localhost:5188'
const OUT = process.argv[3] || 'C:/tmp/night/logo/mw5/fold-390.mp4'
const DIR = 'C:/tmp/night/logo/mw5/frames/'; fs.rmSync(DIR, { recursive: true, force: true }); fs.mkdirSync(DIR, { recursive: true })
const b = await puppeteer.launch({ headless: 'new' })
const pg = await b.newPage(); await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await pg.evaluateOnNewDocument(() => {
  let vt = 0; const q = []; performance.now = () => vt
  window.requestAnimationFrame = (cb) => { q.push(cb); return q.length }
  window.cancelAnimationFrame = () => {}
  window.__step = (ms) => { vt += ms; const l = q.splice(0); l.forEach((cb) => { try { cb(vt) } catch { /* a frame of the wheel */ } }) }
})
await pg.goto(BASE + '/', { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 1500))
await pg.addStyleTag({ content: '[class*="consent"]{display:none!important} [data-part="mark"] path{animation-play-state:paused!important}' })
// stop just above the footer, so the name is on screen but the mark has not been asked to fold yet
await pg.evaluate(() => { const r = document.querySelector('.foot__brand svg').getBoundingClientRect(); window.scrollTo(0, scrollY + r.top - innerHeight * 0.92) })
await new Promise((r) => setTimeout(r, 600))
const clip = await pg.evaluate(() => { const f = document.querySelector('.foot').getBoundingClientRect(); return { y: f.top } })
let i = 0
const shot = async () => { await pg.screenshot({ path: `${DIR}${String(i++).padStart(4, '0')}.png` }) }
// glide down so the footer comes up into the middle (the IntersectionObserver starts the fold on its own)
const from = await pg.evaluate(() => scrollY)
const to = await pg.evaluate(() => { const r = document.querySelector('.foot__brand svg').getBoundingClientRect(); return scrollY + r.top + r.height / 2 - innerHeight * 0.42 })
for (let k = 0; k <= 36; k++) {
  const t = k / 36, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  await pg.evaluate((y) => window.scrollTo(0, y), from + (to - from) * e)
  await pg.evaluate(() => window.__step(1000 / 60))
  await shot()
}
await new Promise((r) => setTimeout(r, 400)) // let the observer fire
for (let k = 0; k < 60 * 3; k++) { await pg.evaluate(() => window.__step(1000 / 60)); await shot() }
await b.close()
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '60', '-i', `${DIR}%04d.png`, '-vf', 'scale=780:-2,format=yuv420p', '-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-movflags', '+faststart', OUT])
console.log('frames', i, fs.statSync(OUT).size)
