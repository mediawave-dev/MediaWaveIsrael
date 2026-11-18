// D297: what `new AudioContext()` costs the main thread, first and second time, in a lab browser. node ac-cost.mjs
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
for (const args of [[], ['--mute-audio'], ['--use-angle=d3d11', '--enable-gpu']]) {
  const b = await puppeteer.launch({ headless: 'new', args })
  const p = await b.newPage(); await p.goto('http://localhost:5189/privacy/', { waitUntil: 'load' })
  const r = await p.evaluate(async () => {
    const out = []
    for (let i = 0; i < 3; i++) { const a = performance.now(); const c = new AudioContext({ latencyHint: 'interactive' }); out.push(Math.round(performance.now() - a) + 'ms/' + c.state); await new Promise((d) => setTimeout(d, 200)) }
    const a = performance.now(); const g = document.createElement('canvas').getContext('webgl'); const mk = Math.round(performance.now() - a)
    const a2 = performance.now(); const d = g.getExtension('WEBGL_debug_renderer_info'); g.getParameter(d.UNMASKED_RENDERER_WEBGL); const nm = Math.round(performance.now() - a2)
    return { audio: out, webglCreate: mk, rendererName: nm }
  })
  console.log(JSON.stringify(args), JSON.stringify(r))
  await b.close()
}
