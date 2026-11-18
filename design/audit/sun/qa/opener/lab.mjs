// D297: what a lab browser (headless Chrome with no GPU flags, as Lighthouse launches it) does with the opener,
// CPU slowed 4x as Lighthouse does: the renderer's name, whether the opener ran, what the probe read, long tasks.
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const b = await puppeteer.launch({ headless: 'new', args: ['--disable-blink-features=AutomationControlled'] })
const p = await b.newPage(); await p.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true })
const c = await p.createCDPSession(); if (process.argv[3] !== '1') await c.send('Emulation.setCPUThrottlingRate', { rate: 4 })
await p.evaluateOnNewDocument(() => {
  window.__long = []; window.__seen = {}
  new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: 'longtask', buffered: true })
  new MutationObserver(() => { const o = document.querySelector('.opener'); if (o) { window.__seen.opener = true; if (o.dataset.live) window.__seen.live = o.dataset.live; if (o.dataset.audio) window.__seen.audio = o.dataset.audio } }).observe(document, { attributes: true, childList: true, subtree: true })
})
await p.goto('http://localhost:5189/' + (process.argv[2] || ''), { waitUntil: 'load' })
await new Promise((r) => setTimeout(r, 12000))
console.log(JSON.stringify(await p.evaluate(() => {
  const g = document.createElement('canvas').getContext('webgl'); const d = g && g.getExtension('WEBGL_debug_renderer_info')
  return { renderer: g ? (d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER)) : 'no webgl', intro: sessionStorage.getItem('mw-wave-intro'), seen: window.__seen, long: window.__long, blocked: window.__long.reduce((a, x) => a + Math.max(0, x[1] - 50), 0) }
})))
await b.close()
