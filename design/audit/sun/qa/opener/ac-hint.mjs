// D297: the first AudioContext of a browser session, by latency hint (a fresh browser each time). node ac-hint.mjs
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
for (const opt of [{ latencyHint: 'interactive' }, { latencyHint: 'playback' }, { latencyHint: 'balanced' }, { latencyHint: 'interactive' }, { latencyHint: 'playback' }, { latencyHint: 'balanced' }]) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--mute-audio'] })
  const p = await b.newPage(); await p.goto('http://localhost:5189/privacy/', { waitUntil: 'load' })
  await new Promise((r) => setTimeout(r, 800))
  const r = await p.evaluate((o) => { const a = performance.now(); const c = new AudioContext(o); const made = Math.round(performance.now() - a); return { made, state: c.state, base: c.baseLatency, rate: c.sampleRate } }, opt)
  console.log(JSON.stringify(opt), JSON.stringify(r))
  await b.close()
}
