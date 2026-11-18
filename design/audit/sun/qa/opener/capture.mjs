// D296: the opener, frame by frame on its own clock (dev hook __mwOpener.seek), so the film is exactly 30 fps.
// node capture.mjs phone|desk [base] [seconds]
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const HERE = path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, '/')
const mode = process.argv[2] || 'phone'
const base = process.argv[3] || 'http://localhost:5188'
const secs = Number(process.argv[4] || 9)
const FPS = 30
const vp = mode === 'phone' ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900, deviceScaleFactor: 1 }
fs.mkdirSync(`${HERE}/out`, { recursive: true })
const DIR = `${HERE}/out/f-${mode}`; fs.rmSync(DIR, { recursive: true, force: true }); fs.mkdirSync(DIR, { recursive: true })
const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl'] })
const p = await b.newPage(); await p.setViewport(vp)
p.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text())) console.log('console:', m.text()) })
await p.goto(base + '/?intro=1', { waitUntil: 'domcontentloaded' })
await p.waitForFunction(() => window.__mwOpener && window.__mwOpener.info().live, { timeout: 20000 })
const info = await p.evaluate(() => { const c = document.createElement('canvas').getContext('webgl'); const e = c.getExtension('WEBGL_debug_renderer_info'); return { r: e ? c.getParameter(e.UNMASKED_RENDERER_WEBGL) : '?', ...window.__mwOpener.info() } })
console.log(mode, info.r, 'scale', info.scale)
// the sound on, as after a visitor's touch: the control then reads "Sound on" in the film
await p.evaluate(() => new Promise((done) => { window.__mwOpener.seek(1); requestAnimationFrame(() => requestAnimationFrame(done)) }))
await new Promise((r) => setTimeout(r, 500))
await p.click('.opener__sound')
await new Promise((r) => setTimeout(r, 300))
console.log('sound:', await p.evaluate(() => window.__mwOpener.info().sound))
const n = Math.round(secs * FPS)
for (let i = 0; i < n; i++) {
  await p.evaluate((t) => new Promise((done) => { window.__mwOpener.seek(t); requestAnimationFrame(() => requestAnimationFrame(done)) }), i / FPS + 0.001)
  await p.screenshot({ path: `${DIR}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 90 })
}
// the sea's sound over the same score, rendered by the page's own graph (offline), laid under the film
fs.writeFileSync(`${HERE}/out/sea-${mode}.wav`, Buffer.from(await p.evaluate((s2) => window.__mwOpener.wav(s2), secs), 'base64'))
await b.close()
const w = mode === 'phone' ? 540 : 1280
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${DIR}/f%04d.jpg`, '-i', `${HERE}/out/sea-${mode}.wav`, '-vf', `scale=${w}:-2`, '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', `${HERE}/out/opener-${mode}.mp4`])
// a contact sheet to judge it by eye: one frame every 0.3 s
const cols = mode === 'phone' ? 10 : 5
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${DIR}/f%04d.jpg`, '-vf', `select='not(mod(n\\,9))',scale=${mode === 'phone' ? 190 : 380}:-2,tile=${cols}x${Math.ceil(n / 9 / cols)}`, '-frames:v', '1', '-q:v', '3', `${HERE}/out/sheet-${mode}.jpg`])
console.log('done', n, 'frames')
