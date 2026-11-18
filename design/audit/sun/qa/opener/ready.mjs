// D296: how long a first visit waits for the sea (fresh profile each run, so no shader cache). node ready.mjs [base] [runs] [cpu]
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const base = process.argv[2] || 'http://localhost:5189'
const runs = Number(process.argv[3] || 3)
const cpu = Number(process.argv[4] || 1)
for (let i = 0; i < runs; i++) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-blink-features=AutomationControlled'] })
  const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  if (cpu > 1) { const c = await p.createCDPSession(); await c.send('Emulation.setCPUThrottlingRate', { rate: cpu }) }
  await p.evaluateOnNewDocument(() => {
    window.__m = {}; window.__long = []
    try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: 'longtask', buffered: true }) } catch (e) { /* */ }
    new MutationObserver(() => {
      const o = document.querySelector('.opener'), n = Math.round(performance.now())
      if (o && !window.__m.root) window.__m.root = n
      if (o && o.dataset.live && !window.__m.live) { window.__m.live = n; window.__m.link = o.dataset.live }
      if (o && o.classList.contains('opener--skip') && !window.__m.wave) window.__m.wave = n
    }).observe(document, { attributes: true, childList: true, subtree: true })
  })
  await p.goto(base + '/', { waitUntil: 'domcontentloaded' })
  await p.waitForFunction(() => window.__m.wave || !document.documentElement.classList.contains('mw-intro'), { timeout: 12000 }).catch(() => {})
  const out = await p.evaluate(() => ({ ...window.__m, fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0), long: window.__long }))
  console.log(JSON.stringify(out))
  await b.close()
}
