// D297: what stalls the compositor around the opener's end. A Chrome trace of the last seconds; prints the longest
// slices on every thread. node trace.mjs [base] [WxH]
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const HERE = path.dirname(fileURLToPath(import.meta.url)).split(path.sep).join('/')
const base = process.argv[2] || 'http://localhost:5188'
const [W, H] = (process.argv[3] || '1440x900').split('x').map(Number)
const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl'] })
const p = await b.newPage(); await p.setViewport({ width: W, height: H, deviceScaleFactor: 1 })
await p.goto(base + '/?intro=1', { waitUntil: 'domcontentloaded' })
await p.waitForFunction(() => !document.documentElement.classList.contains('mw-intro-cover') && document.querySelector('.opener'), { timeout: 30000 })
fs.mkdirSync(`${HERE}/out`, { recursive: true })
await p.tracing.start({ path: `${HERE}/out/trace.json`, categories: ['toplevel', 'gpu', 'viz', 'cc', 'blink', 'media', 'disabled-by-default-gpu.service'] })
await new Promise((r) => setTimeout(r, 4200))
await p.tracing.stop()
await b.close()
const ev = JSON.parse(fs.readFileSync(`${HERE}/out/trace.json`, 'utf8')).traceEvents
const names = {}
for (const e of ev) if (e.ph === 'M' && e.name === 'thread_name') names[e.pid + ':' + e.tid] = e.args.name
let t0 = Infinity; for (const e of ev) if (e.ts && e.ts < t0) t0 = e.ts
const long = ev.filter((e) => e.ph === 'X' && e.dur > 40000).sort((a, c) => c.dur - a.dur).slice(0, 25)
for (const e of long) console.log(((e.ts - t0) / 1e6).toFixed(2) + 's', Math.round(e.dur / 1000) + 'ms', (names[e.pid + ':' + e.tid] || e.tid), e.cat.slice(0, 22), e.name, JSON.stringify(e.args || {}).slice(0, 110))
