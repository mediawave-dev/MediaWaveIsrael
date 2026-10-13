// Trace a phone scroll (4x throttle) through ONE section and list what fills its long tasks:
// trace event totals plus the JS functions (self time) sampled inside them.
// Usage: node trace-section.mjs <url> <selector> [seconds]
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
import { readFileSync } from 'node:fs'
const [url, sel, secs = '20'] = process.argv.slice(2)
const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true') } catch {} })
const cdp = await page.createCDPSession()
await page.goto(url, { waitUntil: 'load' })
await new Promise((r) => setTimeout(r, 2500))
const [top, h] = await page.evaluate((sel) => { const el = document.querySelector(sel); const r = el.getBoundingClientRect(); return [r.top + scrollY - innerHeight, r.height + innerHeight] }, sel)
await page.evaluate((y) => window.scrollTo(0, y), top)
await new Promise((r) => setTimeout(r, 1500))
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
const path = 'G:/tmp/mw-qa/trace-sec.json'
await page.tracing.start({ path, categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-v8.cpu_profiler'] })
const steps = Math.round(+secs * 10)
for (let i = 0; i <= steps; i++) { await page.evaluate((y) => window.scrollTo(0, y), Math.round(top + (h * i) / steps)); await new Promise((r) => setTimeout(r, 100)) }
await page.tracing.stop()
await browser.close()
const ev = JSON.parse(readFileSync(path, 'utf8')).traceEvents
const main = ev.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain')
const T = ev.filter((e) => e.pid === main.pid && e.tid === main.tid)
const X = T.filter((e) => e.ph === 'X' && e.dur)
const long = X.filter((e) => e.name === 'RunTask' && e.dur > 50000)
console.log('long tasks', long.length, 'sum', (long.reduce((a, e) => a + e.dur, 0) / 1000).toFixed(0), 'ms')
const inside = (e) => long.some((L) => e.ts >= L.ts && e.ts + e.dur <= L.ts + L.dur)
const by = new Map()
for (const e of X) if (e.name !== 'RunTask' && inside(e) && /^(UpdateLayoutTree|Layout|Paint|PrePaint|Layerize|Commit|FunctionCall|FireAnimationFrame|TimerFire|HitTest|IntersectionObserverController::computeIntersections|MinorGC|MajorGC|EvaluateScript|v8.compile|ParseHTML|Decode Image|ImageDecodeTask|v8.parseOnBackground|ResourceReceivedData|XHRReadyStateChange)$/.test(e.name)) by.set(e.name, (by.get(e.name) || 0) + e.dur / 1000)
console.log('== inside long tasks (ms; nested events overlap)')
for (const [k, v] of [...by].sort((a, b) => b[1] - a[1])) console.log(v.toFixed(0).padStart(7), k)
// JS self time from the sampled profile chunks, restricted to long-task windows
const nodes = new Map(); const samples = []
let t = 0
for (const e of ev) {
  if (e.name === 'Profile') t = e.args?.data?.startTime ?? t
  if (e.name !== 'ProfileChunk') continue
  const d = e.args.data.cpuProfile || {}
  for (const n of d.nodes || []) nodes.set(n.id, n)
  const td = e.args.data.timeDeltas || []
  ;(d.samples || []).forEach((s, i) => { t += td[i] || 0; samples.push([s, t]) })
}
const fn = new Map()
for (let i = 1; i < samples.length; i++) {
  const [id, ts] = samples[i]; const dt = ts - samples[i - 1][1]
  if (!long.some((L) => ts >= L.ts && ts <= L.ts + L.dur)) continue
  const cf = nodes.get(id)?.callFrame; if (!cf) continue
  const k = `${cf.functionName || '(anon)'} @ ${(cf.url || '').split('/').pop()}:${cf.lineNumber}`
  fn.set(k, (fn.get(k) || 0) + dt / 1000)
}
console.log('== JS self time inside long tasks')
for (const [k, v] of [...fn].sort((a, b) => b[1] - a[1]).slice(0, 22)) console.log(v.toFixed(0).padStart(7), k)
