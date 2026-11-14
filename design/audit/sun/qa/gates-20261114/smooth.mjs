// How smooth is a full scroll of a page on a mid-range phone? Chrome with the CPU slowed 4x, 390 px, DPR 2.
// Scrolls top to bottom in small steps, one per frame, and records frame times, long tasks and layout shifts.
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const BASE = process.argv[2]
const routes = (process.argv[3] || '/').split(',')
const b = await puppeteer.launch({ headless: 'new', args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist'] })
for (const route of routes) {
  const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  const errs = []; p.on('pageerror', (e) => errs.push(String(e).slice(0, 100)))
  await p.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 }); await new Promise((r) => setTimeout(r, 3000))
  const cdp = await p.target().createCDPSession(); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  const r = await p.evaluate(async () => {
    const long = []; const shifts = []
    new PerformanceObserver((l) => l.getEntries().forEach((e) => long.push(Math.round(e.duration)))).observe({ type: 'longtask', buffered: false })
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) shifts.push(e.value) })).observe({ type: 'layout-shift', buffered: false })
    const end = document.documentElement.scrollHeight - innerHeight
    const frames = []; let last = performance.now(); let y = 0
    await new Promise((done) => {
      const step = (t) => { frames.push(t - last); last = t; y += 14; window.scrollTo(0, y); if (y < end) requestAnimationFrame(step); else done() }
      requestAnimationFrame(step)
    })
    await new Promise((res) => setTimeout(res, 2500)) // the footer fold plays at the end
    frames.shift()
    const slow = frames.filter((f) => f > 34).length, sorted = [...frames].sort((a, b) => a - b)
    return { frames: frames.length, p50: Math.round(sorted[Math.floor(sorted.length / 2)]), p95: Math.round(sorted[Math.floor(sorted.length * 0.95)]), worst: Math.round(sorted[sorted.length - 1]), over34ms: +(100 * slow / frames.length).toFixed(1) + '%', longTasks: long.length, longestTask: Math.max(0, ...long), cls: +shifts.reduce((a, b) => a + b, 0).toFixed(3), foldDone: document.querySelector('[data-k="edia"]')?.getAttribute('opacity') }
  })
  console.log(route.padEnd(28), JSON.stringify({ ...r, errs: errs.length }))
  await p.close()
}
await b.close()
