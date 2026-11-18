// D297: the main thread's long tasks while the page boots under the opener, with what ran inside them.
// A lab browser (headless, no GPU flags, as Lighthouse launches Chrome), not throttled. node boot-trace.mjs
import fs from 'fs'
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const b = await puppeteer.launch({ headless: 'new', args: ['--disable-blink-features=AutomationControlled'] })
const p = await b.newPage(); await p.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true })
fs.mkdirSync('out', { recursive: true })
await p.tracing.start({ path: 'out/boot.json', categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'v8.execute', 'disabled-by-default-v8.cpu_profiler', 'gpu', 'blink.user_timing'] })
await p.goto('http://localhost:5189/', { waitUntil: 'load' })
await new Promise((r) => setTimeout(r, 4000))
await p.tracing.stop(); await b.close()
const ev = JSON.parse(fs.readFileSync('out/boot.json', 'utf8')).traceEvents
const names = {}
for (const e of ev) if (e.ph === 'M' && e.name === 'thread_name') names[e.pid + ':' + e.tid] = e.args.name
let t0 = Infinity; for (const e of ev) if (e.ts && e.ts < t0) t0 = e.ts
const main = ev.filter((e) => e.ph === 'X' && names[e.pid + ':' + e.tid] === 'CrRendererMain')
const tasks = main.filter((e) => e.name === 'RunTask' && e.dur > 60000).sort((a, c) => a.ts - c.ts)
for (const t of tasks) {
  console.log(`\nTASK at ${((t.ts - t0) / 1e6).toFixed(2)} s, ${Math.round(t.dur / 1000)} ms`)
  const inside = main.filter((e) => e !== t && e.ts >= t.ts && e.ts + e.dur <= t.ts + t.dur && e.dur > 15000).sort((a, c) => c.dur - a.dur).slice(0, 5)
  for (const e of inside) console.log('   ', Math.round(e.dur / 1000) + 'ms', e.name, JSON.stringify(e.args?.data ? { fn: e.args.data.functionName, url: (e.args.data.url || '').split('/').pop(), line: e.args.data.lineNumber, col: e.args.data.columnNumber } : {}).slice(0, 120))
}
