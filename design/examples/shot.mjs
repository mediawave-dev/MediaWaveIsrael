// The example sites as a phone shows them: a strip of screens down the page. node design/examples/shot.mjs <name> [screens]
// Writes design/examples/out/<name>.jpg and prints the page's height (for the recording's range in work.json).
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const HERE = path.dirname(fileURLToPath(import.meta.url))
const name = process.argv[2]
const out = path.join(HERE, 'out', name)
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true })
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: 390, height: 780, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
const errors = []
p.on('pageerror', (e) => errors.push(String(e)))
await p.goto(pathToFileURL(path.join(HERE, name, 'index.html')).href, { waitUntil: 'networkidle2' })
await p.evaluate(() => document.fonts.ready)
const total = await p.evaluate(() => document.documentElement.scrollHeight)
const n = Math.min(Number(process.argv[3] || 5), Math.ceil(total / 700))
for (let i = 0; i < n; i++) {
  const y = Math.round((i * (total - 780)) / Math.max(1, n - 1))
  await p.evaluate((v) => scrollTo(0, v), y)
  await new Promise((r) => setTimeout(r, 700))
  await p.screenshot({ path: path.join(out, `s${i}.jpg`), type: 'jpeg', quality: 88 })
}
const wide = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
await b.close()
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(out, 's%d.jpg'), '-vf', `scale=390:-2,tile=${n}x1:padding=10:color=0x888888`, '-frames:v', '1', '-q:v', '3', path.join(HERE, 'out', `${name}.jpg`)])
console.log(name, 'height', total, 'sideways', wide, 'errors', errors.length, errors.slice(0, 2).join(' ; '))
