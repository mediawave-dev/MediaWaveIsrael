// D297: on a real network, why did the opener give up (or not)? Timeline of one first visit. node why.mjs <base> [runs]
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const base = process.argv[2]
for (let i = 0; i < Number(process.argv[3] || 2); i++) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-blink-features=AutomationControlled'] })
  const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await p.evaluateOnNewDocument(() => {
    window.__tl = []; window.__f = []; let last = 0
    const tick = (t) => { if (last) window.__f.push([Math.round(t), Math.round(t - last)]); last = t; requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
    const seen = {}
    const mark = (k, v) => { if (!seen[k]) { seen[k] = 1; window.__tl.push([Math.round(performance.now()), k, v || '']) } }
    new MutationObserver(() => {
      if (!document.documentElement) return
      const c = document.documentElement.classList, o = document.querySelector('.opener')
      if (c.contains('mw-intro')) mark('intro-on')
      if (o) mark('opener-root')
      if (o && o.dataset.live) mark('live', o.dataset.live)
      if (o && o.dataset.audio) mark('audio', o.dataset.audio)
      if (o && o.dataset.probe) mark('probe', o.dataset.probe)
      if (o && o.dataset.go) mark('go')
      if (seen['intro-on'] && !c.contains('mw-intro-cover')) mark('cover-off')
      if (seen['intro-on'] && !c.contains('mw-intro')) mark('intro-off')
    }).observe(document, { attributes: true, childList: true, subtree: true })
  })
  await p.goto(base + '/', { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 14000))
  const o = await p.evaluate(() => ({ tl: window.__tl, fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0), load: Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart),
    slowFramesBefore6s: window.__f.filter((x) => x[0] < 6000 && x[1] > 60), fonts: [...document.fonts].filter((f) => f.status !== 'unloaded').map((f) => f.family + ':' + f.status).slice(0, 8) }))
  console.log(JSON.stringify(o))
  await b.close()
}
