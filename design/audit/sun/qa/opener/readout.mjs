// D297: the ?why=1 readout after a first visit, as text, under a few device shapes. node readout.mjs <base>
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const base = process.argv[2] || 'http://localhost:5189'
for (const [name, vp, cpu] of [['phone 360x780@3', { width: 360, height: 780, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, 1], ['phone, CPU x4', { width: 360, height: 780, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, 4], ['a heavy screen 2560x1440@2', { width: 2560, height: 1440, deviceScaleFactor: 2 }, 1]]) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-blink-features=AutomationControlled'] })
  const p = await b.newPage(); await p.setViewport(vp)
  if (cpu > 1) { const c = await p.createCDPSession(); await c.send('Emulation.setCPUThrottlingRate', { rate: cpu }) }
  await p.goto(base + '/?why=1', { waitUntil: 'domcontentloaded' })
  await p.waitForFunction(() => sessionStorage.getItem('mw-wave-why'), { timeout: 40000 }).catch(() => {})
  console.log(`--- ${name}\n` + await p.evaluate(() => (sessionStorage.getItem('mw-wave-why') || 'NO READOUT').split(' | ').join('\n')))
  if (name.startsWith('phone 360')) await p.screenshot({ path: 'out/readout.png' })
  await b.close()
}
