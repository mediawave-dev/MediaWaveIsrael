// D297: the opener's sea as a file: the same graph the page plays, rendered offline over the whole score (the dev
// hook __mwOpener.wav), so it can be measured and laid under the films. node sound.mjs [base] [seconds] [out.wav]
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const HERE = path.dirname(fileURLToPath(import.meta.url)).split(path.sep).join('/')
const base = process.argv[2] || 'http://localhost:5188'
const secs = Number(process.argv[3] || 9.2)
const out = process.argv[4] || `${HERE}/out/sea.wav`
fs.mkdirSync(path.dirname(out), { recursive: true })
const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl'] })
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
p.on('pageerror', (e) => console.log('pageerror:', e.message))
await p.goto(base + '/?intro=1', { waitUntil: 'domcontentloaded' })
await p.waitForFunction(() => window.__mwOpener && window.__mwOpener.info().live, { timeout: 20000 })
const b64 = await p.evaluate((s) => window.__mwOpener.wav(s), secs)
fs.writeFileSync(out, Buffer.from(b64, 'base64'))
console.log(out, fs.statSync(out).size, 'bytes')
await b.close()
