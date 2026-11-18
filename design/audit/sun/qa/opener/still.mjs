// D296: stills of the opener at given moments. node still.mjs phone|desk|WxH@dpr 1.7,3.75 [base] [clip x,y,w,h]
import path from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const HERE = path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, '/')
const mode = process.argv[2] || 'phone'
const times = (process.argv[3] || '1.7').split(',').map(Number)
const base = process.argv[4] || 'http://localhost:5188'
const clip = process.argv[5] ? process.argv[5].split(',').map(Number) : null
const m = /^(\d+)x(\d+)@([\d.]+)$/.exec(mode)
const vp = m ? { width: +m[1], height: +m[2], deviceScaleFactor: +m[3], isMobile: +m[1] < 700, hasTouch: +m[1] < 700 }
  : mode === 'phone' ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900, deviceScaleFactor: 1 }
const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl'] })
const p = await b.newPage(); await p.setViewport(vp)
p.on('console', (c) => { if (c.type() === 'error' && !/404/.test(c.text())) console.log('console:', c.text()) })
p.on('pageerror', (e) => console.log('pageerror:', e.message))
await p.goto(base + '/?intro=1', { waitUntil: 'domcontentloaded' })
await p.waitForFunction(() => window.__mwOpener && window.__mwOpener.info().live, { timeout: 20000 })
console.log(JSON.stringify(await p.evaluate(() => window.__mwOpener.info())))
for (const t of times) {
  await p.evaluate((tt) => new Promise((done) => { window.__mwOpener.seek(tt); requestAnimationFrame(() => requestAnimationFrame(done)) }), t)
  const name = `${HERE}/still-${mode.replace(/[@.]/g, '_')}-${String(t).replace('.', '_')}.png`
  await p.screenshot({ path: name, ...(clip ? { clip: { x: clip[0], y: clip[1], width: clip[2], height: clip[3] } } : {}) })
  console.log(name)
}
await b.close()
