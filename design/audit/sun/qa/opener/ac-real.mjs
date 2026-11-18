// D297: as in a visitor's browser (sound needs a gesture): what making the first AudioContext holds the main thread
// while it stays suspended, and what resume() inside a click then costs. A fresh browser each time. node ac-real.mjs
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
for (const hint of ['interactive', 'balanced', 'interactive', 'balanced', 'lazy', 'lazy']) {
  const b = await puppeteer.launch({ headless: 'new', ignoreDefaultArgs: ['--mute-audio'], args: ['--autoplay-policy=document-user-activation-required'] })
  const p = await b.newPage(); await p.goto('http://localhost:5189/privacy/', { waitUntil: 'load' })
  await new Promise((r) => setTimeout(r, 800))
  await p.evaluate((h) => {
    window.__r = { hint: h }
    const make = () => { const a = performance.now(); window.__c = new AudioContext({ latencyHint: h === 'lazy' ? 'balanced' : h }); window.__r.made = Math.round(performance.now() - a); window.__r.stateAfterMake = window.__c.state }
    if (h !== 'lazy') make()
    // the longest gap between timer ticks around the click: what the page's frames would feel
    let last = performance.now(); window.__gap = 0; setInterval(() => { const n = performance.now(); window.__gap = Math.max(window.__gap, n - last); last = n }, 4)
    document.addEventListener('click', () => {
      window.__gap = 0
      const a = performance.now()
      if (h === 'lazy') make()
      window.__c.resume().then(() => { window.__r.resumed = Math.round(performance.now() - a); window.__r.state = window.__c.state })
      window.__r.handler = Math.round(performance.now() - a)
    }, { once: true })
  }, hint)
  await new Promise((r) => setTimeout(r, 600))
  await p.mouse.click(200, 300)
  await new Promise((r) => setTimeout(r, 1200))
  console.log(JSON.stringify(await p.evaluate(() => ({ ...window.__r, mainHeldAfterClick: Math.round(window.__gap) }))))
  await b.close()
}
