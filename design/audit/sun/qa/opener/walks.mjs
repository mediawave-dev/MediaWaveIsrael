// D297: the page's own loops stand still while the opener plays and go on after it. node walks.mjs [base]
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const base = process.argv[2] || 'http://localhost:5189'
const read = (p) => p.evaluate(() => { const a = document.getAnimations().filter((x) => /^(mark|walk|tide|buoy|foot)-/.test(x.animationName || '')); const by = {}; for (const x of a) { const k = x.animationName + ':' + x.playState; by[k] = (by[k] || 0) + 1 } const m = a.find((x) => x.animationName === 'mark-clear'); return { by, markClearTime: m ? Math.round(Number(m.currentTime)) : null, intro: document.documentElement.classList.contains('mw-intro') } })
for (const [name, args] of [['with the opener', ['--disable-blink-features=AutomationControlled']], ['without it (a driven browser)', []]]) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', ...args] })
  const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await p.goto(base + '/', { waitUntil: 'load' })
  await new Promise((r) => setTimeout(r, 5000))
  const during = await read(p)
  await p.waitForFunction(() => !document.documentElement.classList.contains('mw-intro'), { timeout: 20000 })
  await new Promise((r) => setTimeout(r, 1500))
  const after = await read(p)
  await new Promise((r) => setTimeout(r, 1000))
  const later = await read(p)
  console.log(name, '\n  at 5 s  ', JSON.stringify(during), '\n  after   ', JSON.stringify(after), '\n  +1 s    ', JSON.stringify({ markClearTime: later.markClearTime }))
  await b.close()
}
