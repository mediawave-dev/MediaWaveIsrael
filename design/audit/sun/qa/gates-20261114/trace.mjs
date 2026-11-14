// A Chrome trace of the home page scroll on a slowed phone; prints the heaviest work inside the slow frames.
import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const BASE = process.argv[2], FROM = +(process.argv[3] || 1500), TO = +(process.argv[4] || 2200)
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await p.goto(BASE + '/', { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 3000))
const cdp = await p.target().createCDPSession(); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
// walk to just before the stretch, slowly, so everything above it has settled
await p.evaluate(async (from) => { for (let y = 0; y < from; y += 14) { window.scrollTo(0, y); await new Promise((r) => requestAnimationFrame(r)) } }, FROM)
await new Promise((r) => setTimeout(r, 1500))
await p.tracing.start({ path: 'C:/tmp/night/gates/trace.json', categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'blink', 'v8.execute'] })
await p.evaluate(async (from, to) => { for (let y = from; y < to; y += 14) { window.scrollTo(0, y); await new Promise((r) => requestAnimationFrame(r)) } }, FROM, TO)
await new Promise((r) => setTimeout(r, 800))
await p.tracing.stop(); await b.close()
const ev = JSON.parse(fs.readFileSync('C:/tmp/night/gates/trace.json', 'utf8')).traceEvents || []
const main = ev.filter((e) => e.ph === 'X' && e.dur > 15000 && ['RunTask', 'ThreadControllerImpl::RunTask'].indexOf(e.name) < 0)
const agg = {}
for (const e of main) { const k = e.name + (e.args?.data?.url ? ' ' + String(e.args.data.url).split('/').pop().slice(0, 40) : '') + (e.args?.data?.functionName ? ' fn:' + e.args.data.functionName : ''); agg[k] = agg[k] || { n: 0, ms: 0, max: 0 }; agg[k].n++; agg[k].ms += e.dur / 1000; agg[k].max = Math.max(agg[k].max, e.dur / 1000) }
Object.entries(agg).sort((a, b) => b[1].max - a[1].max).slice(0, 18).forEach(([k, v]) => console.log(k.padEnd(60), 'n', v.n, 'max', v.max.toFixed(0), 'ms total', v.ms.toFixed(0)))
