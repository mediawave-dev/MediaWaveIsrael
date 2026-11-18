// D297: does warming Chrome's audio service off the main thread (enumerateDevices) make the first AudioContext cheap?
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
for (const [name, warm] of [['cold', false], ['warmed', true], ['cold', false], ['warmed', true]]) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--mute-audio'] })
  const p = await b.newPage(); await p.goto('http://localhost:5189/privacy/', { waitUntil: 'load' })
  const r = await p.evaluate(async (w) => {
    let wt = 0, block = 0
    if (w) {
      // how long the main thread itself is held while the warm-up runs (it should not be)
      let last = performance.now(); const iv = setInterval(() => { const n = performance.now(); block = Math.max(block, n - last); last = n }, 4)
      const a = performance.now(); await navigator.mediaDevices.enumerateDevices(); wt = Math.round(performance.now() - a)
      await new Promise((d) => setTimeout(d, 60)); clearInterval(iv)
    }
    const a = performance.now(); const c = new AudioContext({ latencyHint: 'interactive' })
    return { warmTookMs: wt, mainHeldMs: Math.round(block), firstAudioContextMs: Math.round(performance.now() - a), state: c.state }
  }, warm)
  console.log(name.padEnd(7), JSON.stringify(r))
  await b.close()
}
