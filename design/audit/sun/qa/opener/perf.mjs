// D296: the opener in real time: frame pacing, the render scale it settles on, how long until the sea is live,
// and what the page looks like when it has finished. node perf.mjs WxH@dpr [base] [cpuSlowdown] [skipAtMs]
import path from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const HERE = path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, '/')
const m = /^(\d+)x(\d+)@([\d.]+)$/.exec(process.argv[2] || '390x844@2')
const base = process.argv[3] || 'http://localhost:5188'
const slow = Number(process.argv[4] || 1)
const skipAt = Number(process.argv[5] || 0)
const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl'] })
const p = await b.newPage()
await p.setViewport({ width: +m[1], height: +m[2], deviceScaleFactor: +m[3], isMobile: +m[1] < 700, hasTouch: +m[1] < 700 })
const errs = []
p.on('console', (c) => { if (c.type() === 'error' && !/404/.test(c.text())) errs.push(c.text()) })
p.on('pageerror', (e) => errs.push('pageerror: ' + e.message))
if (slow > 1) { const cdp = await p.createCDPSession(); await cdp.send('Emulation.setCPUThrottlingRate', { rate: slow }) }
await p.evaluateOnNewDocument(() => {
  window.__f = []; window.__ft = []; let last = 0
  const tick = (t) => { if (last) { window.__f.push(t - last); window.__ft.push(t) } last = t; requestAnimationFrame(tick) }
  requestAnimationFrame(tick)
  window.__marks = {}; window.__long = []
  try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push([e.startTime, e.duration, (e.attribution && e.attribution[0] && (e.attribution[0].containerSrc || e.attribution[0].containerName)) || '']))).observe({ type: 'longtask', buffered: true }) } catch (e) { /* */ }
  new MutationObserver(() => {
    if (!document.documentElement) return
    const c = document.documentElement.classList, n = performance.now()
    if (window.__marks.end && !window.__marks.endFrames) window.__marks.endFrames = window.__f.length
    if (c.contains('mw-intro') && !window.__marks.on) window.__marks.on = n
    const o = document.querySelector('.opener')
    if (o && !window.__marks.root) window.__marks.root = n
    if (o && o.dataset.live && !window.__marks.live) { window.__marks.live = n; window.__marks.probe = o.dataset.live }
    if (o && o.dataset.probe) window.__marks.probe = o.dataset.live + ' ' + o.dataset.probe
    if (o && o.dataset.go && !window.__marks.go) { window.__marks.go = n; window.__marks.goFrames = window.__f.length }
    if (!c.contains('mw-intro-cover') && window.__marks.on && !window.__marks.open) window.__marks.open = n
    if (!c.contains('mw-intro') && window.__marks.on && !window.__marks.end) window.__marks.end = n
  }).observe(document, { attributes: true, childList: true, subtree: true, attributeFilter: ['class'] })
})
await p.goto(base + '/?intro=1', { waitUntil: 'domcontentloaded' })
// a tap on the sea (sound on, a ring) at this many ms; the opener goes on
if (skipAt) { await new Promise((r) => setTimeout(r, skipAt)); if (+m[1] < 700) await p.touchscreen.tap(+m[1] / 2, +m[2] * 0.93); else await p.mouse.click(+m[1] / 2, +m[2] * 0.93) }
await p.waitForFunction(() => window.__marks.end, { timeout: 30000 }).catch(() => errs.push('never ended'))
await new Promise((r) => setTimeout(r, 4000))
const out = await p.evaluate(() => {
  const f = window.__f.slice(window.__marks.goFrames || 0, window.__marks.endFrames || undefined), s = f.slice().sort((a, b) => a - b)
  return {
    marks: Object.fromEntries(Object.entries(window.__marks).map(([k, v]) => [k, typeof v === 'number' ? Math.round(v) : v])),
    frames: f.length, avg: +(f.reduce((a, b) => a + b, 0) / f.length).toFixed(1), p95: +s[Math.floor(s.length * 0.95)].toFixed(1), worst: +s[s.length - 1].toFixed(1),
    // every late frame: seconds after the first wave was let go, and how long it took
    lateAt: window.__f.map((x, i) => [i, x]).filter(([i, x]) => x > 20 && i >= (window.__marks.goFrames || 0) && i < 1e9).map(([i, x]) => [+((window.__ft[i] - window.__marks.go) / 1000).toFixed(2), Math.round(x)]),
    openAt: +((window.__marks.open - window.__marks.go) / 1000).toFixed(2),
    endAt: +((window.__marks.end - window.__marks.go) / 1000).toFixed(2),
    // the main thread's long tasks from the first wave on: seconds after it, and ms
    longTasks: window.__long.filter((x) => x[0] > window.__marks.go).map((x) => [+((x[0] - window.__marks.go) / 1000).toFixed(2), Math.round(x[1])]),
    late: f.filter((x) => x > 20).length, over34: f.filter((x) => x > 34).length, sound: document.querySelector('.opener') ? document.querySelector('.opener').dataset.sound : 'gone',
    info: window.__mwOpener ? window.__mwOpener.info() : null,
    html: document.documentElement.className, opener: !!document.querySelector('.opener'), scrollY, consent: !!document.querySelector('.consent') && getComputedStyle(document.querySelector('.consent')).visibility,
  }
})
console.log(JSON.stringify(out), errs.length ? '\nERRORS ' + errs.join(' | ') : '\nno errors')
await p.screenshot({ path: `${HERE}/after-${m[1]}.png` })
await b.close()
