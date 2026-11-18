// D296: what the opener costs the page's largest paint on a real GPU, CPU slowed 4x. node lcp.mjs
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const GPU = ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl']
for (const [name, extra] of [['with the opener', ['--disable-blink-features=AutomationControlled']], ['without', []], ['with the opener', ['--disable-blink-features=AutomationControlled']], ['without', []]]) {
  const b = await puppeteer.launch({ headless: 'new', args: [...GPU, ...extra] })
  const p = await b.newPage(); await p.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true })
  const c = await p.createCDPSession(); await c.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await p.evaluateOnNewDocument(() => {
    window.__lcp = []; window.__tbt = 0
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lcp.push([Math.round(e.startTime), e.element ? e.element.tagName + '.' + (e.element.className || '').toString().slice(0, 18) : '?', Math.round(e.size)]))).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { window.__tbt += Math.max(0, e.duration - 50) })).observe({ type: 'longtask', buffered: true })
  })
  await p.goto('http://localhost:5189/', { waitUntil: 'load' })
  await new Promise((r) => setTimeout(r, 11000))
  const o = await p.evaluate(() => ({ lcp: window.__lcp.slice(-2), blocked: Math.round(window.__tbt), fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0].startTime), played: sessionStorage.getItem('mw-wave-intro') }))
  console.log(name.padEnd(16), JSON.stringify(o))
  await b.close()
}
