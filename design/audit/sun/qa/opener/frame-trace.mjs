// D297: where a frame's main-thread time goes while the waves run, CPU slowed 4x (a phone's CPU, roughly).
// node frame-trace.mjs [base]
import fs from 'fs'
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-blink-features=AutomationControlled'] })
const p = await b.newPage(); await p.setViewport({ width: 360, height: 780, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
const c = await p.createCDPSession(); await c.send('Emulation.setCPUThrottlingRate', { rate: 4 })
await p.goto((process.argv[2] || 'http://localhost:5189') + '/', { waitUntil: 'domcontentloaded' })
await p.waitForSelector('.opener[data-go]', { timeout: 30000 })
await new Promise((r) => setTimeout(r, 600))
fs.mkdirSync('out', { recursive: true })
await p.tracing.start({ path: 'out/frames.json', categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.stack', 'disabled-by-default-devtools.timeline.invalidationTracking', 'v8.execute'] })
await new Promise((r) => setTimeout(r, 3000))
await p.tracing.stop(); await b.close()
const ev = JSON.parse(fs.readFileSync('out/frames.json', 'utf8')).traceEvents
const names = {}
for (const e of ev) if (e.ph === 'M' && e.name === 'thread_name') names[e.pid + ':' + e.tid] = e.args.name
const main = ev.filter((e) => e.ph === 'X' && names[e.pid + ':' + e.tid] === 'CrRendererMain')
const sum = {}
for (const e of main) { const k = e.name; (sum[k] = sum[k] || { n: 0, ms: 0 }); sum[k].n++; sum[k].ms += e.dur / 1000 }
const top = Object.entries(sum).sort((a, c2) => c2[1].ms - a[1].ms).slice(0, 22)
console.log('main thread, 3 s of waves at CPU x4 (ms total, count):')
for (const [k, v] of top) console.log('  ' + String(Math.round(v.ms)).padStart(6), String(v.n).padStart(5), k)
const fn = {}
for (const e of main) if (e.name === 'FunctionCall' && e.args?.data) { const k = (e.args.data.functionName || '(anon)') + ' ' + (e.args.data.url || '').split('/').pop() + ':' + e.args.data.lineNumber + ':' + e.args.data.columnNumber; (fn[k] = fn[k] || { n: 0, ms: 0 }); fn[k].n++; fn[k].ms += e.dur / 1000 }
console.log('functions called from the event loop:')
for (const [k, v] of Object.entries(fn).sort((a, c2) => c2[1].ms - a[1].ms).slice(0, 8)) console.log('  ' + String(Math.round(v.ms)).padStart(6), String(v.n).padStart(5), k)
