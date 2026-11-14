// A 60 fps phone video of the footer mark (D268) on a virtual clock: the closing as the footer comes up, then a tap that
// opens it into the header's logo, a hold, and a tap that closes it again.
import { createRequire } from 'module'
import fs from 'fs'
import { execFileSync } from 'child_process'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const BASE = process.argv[2] || 'http://localhost:5188'
const OUT = process.argv[3] || 'C:/tmp/night/logo/mw5/toggle-390.mp4'
const DIR = 'C:/tmp/night/logo/mw5/tframes/'; fs.rmSync(DIR, { recursive: true, force: true }); fs.mkdirSync(DIR, { recursive: true })
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await p.evaluateOnNewDocument(() => {
  let vt = 0; const q = []; performance.now = () => vt
  window.requestAnimationFrame = (cb) => { q.push(cb); return q.length }
  window.cancelAnimationFrame = () => {}
  window.__step = (ms) => { vt += ms; document.getAnimations().forEach((an) => { try { an.pause(); an.currentTime = vt } catch { /* finished */ } }); const l = q.splice(0); l.forEach((cb) => { try { cb(vt) } catch { /* the wheel */ } }) }
})
await p.goto(BASE + '/', { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 1500))
await p.addStyleTag({ content: '[class*="consent"]{display:none!important} .tab{display:none!important} [data-part="mark"] path, .walk-text, .walk-w0, .walk-w1, .walk-stroke, .tide__water, .tide__deep { animation-play-state: paused !important }' })
await p.evaluate(() => { const r = document.querySelector('.foot__mark').getBoundingClientRect(); window.scrollTo(0, scrollY + r.top - innerHeight * 0.9) })
await new Promise((r) => setTimeout(r, 500))
const clip = await p.evaluate(() => { const r = document.querySelector('.foot__mark').getBoundingClientRect(); return r })
let i = 0
const shot = async () => { await p.screenshot({ path: `${DIR}${String(i++).padStart(4, '0')}.png`, clip: { x: 0, y: (await p.evaluate(() => scrollY + document.querySelector('.foot__mark').getBoundingClientRect().top)) - 150, width: 390, height: 420 } }) }
const frames = async (k) => { for (let j = 0; j < k; j++) { await p.evaluate(() => window.__step(1000 / 60)); await shot() } }
// glide the footer up into view; the closing starts on its own
const from = await p.evaluate(() => scrollY)
const to = await p.evaluate(() => { const r = document.querySelector('.foot__mark').getBoundingClientRect(); return scrollY + r.top - 300 })
for (let k = 0; k <= 30; k++) { const t = k / 30, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; await p.evaluate((y) => window.scrollTo(0, y), from + (to - from) * e); await p.evaluate(() => window.__step(1000 / 60)); await shot() }
await new Promise((r) => setTimeout(r, 300))
await frames(60 * 2.2)
await p.evaluate(() => document.querySelector('.foot__mark').click()); await frames(60 * 2.4) // open, and a hold on the full logo
await p.evaluate(() => document.querySelector('.foot__mark').click()); await frames(60 * 2.2) // close
await b.close()
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '60', '-i', `${DIR}%04d.png`, '-vf', 'scale=780:-2,format=yuv420p', '-c:v', 'libx264', '-crf', '22', '-preset', 'slow', '-movflags', '+faststart', OUT])
console.log('frames', i, fs.statSync(OUT).size)
