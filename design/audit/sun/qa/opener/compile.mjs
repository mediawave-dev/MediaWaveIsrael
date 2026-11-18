// D296: how long the sea's shader takes to compile and link, cold (a fresh profile per run). node compile.mjs [runs]
import fs from 'fs'
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const src = fs.readFileSync('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/src/sun/opener/shader.ts', 'utf8')
const FRAG = /export const FRAG = `([\s\S]*?)`/.exec(src)[1]
const VERT = /export const VERT = `([\s\S]*?)`/.exec(src)[1]
const runs = Number(process.argv[2] || 3)
const out = []
for (let i = 0; i < runs; i++) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl'] })
  const p = await b.newPage()
  await p.goto('about:blank')
  const r = await p.evaluate(async (V, F) => {
    const gl = document.createElement('canvas').getContext('webgl')
    const par = gl.getExtension('KHR_parallel_shader_compile')
    const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); return x }
    const pr = gl.createProgram(); const fs2 = sh(gl.FRAGMENT_SHADER, F)
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, V)); gl.attachShader(pr, fs2)
    const t0 = performance.now(); gl.linkProgram(pr)
    if (par) await new Promise((done) => { const poll = () => gl.getProgramParameter(pr, par.COMPLETION_STATUS_KHR) ? done() : setTimeout(poll, 4); poll() })
    const ok = gl.getProgramParameter(pr, gl.LINK_STATUS)
    return { ms: Math.round(performance.now() - t0), ok, log: ok ? '' : (gl.getShaderInfoLog(fs2) || gl.getProgramInfoLog(pr)) }
  }, VERT, FRAG)
  out.push(r.ms); if (!r.ok) console.log('LINK FAILED', r.log)
  await b.close()
}
console.log('link ms, cold:', out.join(', '))
