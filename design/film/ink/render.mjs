// The ink film · the driver. Opens the renderer in Chrome on the GPU, asks it for every frame and writes PNGs.
//   node render.mjs --out G:/tmp/ink/frames --size 1080 --spp 96            the whole film, the square cut
//   node render.mjs --out G:/tmp/ink/frames-p --cut p --w 810 --h 1440 --spp 160   the hero's upright cut
//   node render.mjs --out G:/tmp/ink/frames-w --cut w --w 1600 --h 900 --spp 160   the hero's wide cut
//   node render.mjs --out G:/tmp/ink/test --size 540 --spp 32 --frames 40,120,200   a few frames, to look at
// Frames that already exist are kept (delete them to render again), so a stopped run picks up where it was.
import puppeteer from 'puppeteer'
import { mkdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { serve } from './serve.mjs'

const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback }
const out = arg('out', 'frames')
const size = arg('size', '1080'), spp = arg('spp', '96'), paper = arg('paper', '4096')
const cut = arg('cut', 'sq'), w = arg('w', size), h = arg('h', size)
const only = arg('frames', '')
const extra = arg('q', '') // extra query for the renderer, e.g. ev=0.7&ap=1
await mkdir(out, { recursive: true })

const { server, url } = await serve()
const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 0,
  args: ['--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11', '--disable-gpu-watchdog', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', `--window-size=${w},${h}`],
})
try {
  const tab = await browser.newPage()
  await tab.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1 })
  tab.on('console', (m) => process.stdout.write(`[page] ${m.text()}\n`))
  // a page that fails to start (a shader that does not compile) must stop the run, not wait for ever
  let broke = null
  tab.on('pageerror', (e) => { broke = e.message; process.stdout.write(`[error] ${e.message}\n`) })
  await tab.goto(`${url}/render.html?cut=${cut}&w=${w}&h=${h}&spp=${spp}&paper=${paper}&${extra}`, { waitUntil: 'load' })
  while (!broke && !(await tab.evaluate(() => window.ready === true))) await new Promise((r) => setTimeout(r, 400))
  if (broke) throw new Error(`The renderer did not start: ${broke}`)
  const film = await tab.evaluate(() => window.film)
  const list = only ? only.split(',').map(Number) : Array.from({ length: film.frames }, (_, i) => i)
  const began = Date.now()
  let made = 0
  for (const i of list) {
    const file = path.join(out, `f${String(i).padStart(4, '0')}.png`)
    if (!only && await access(file).then(() => true, () => false)) continue
    const png = await tab.evaluate((n) => window.renderFrame(n), i)
    await writeFile(file, Buffer.from(png.slice(png.indexOf(',') + 1), 'base64'))
    made++
    if (only || made % 10 === 0) process.stdout.write(`frame ${i} of ${film.frames} · ${((Date.now() - began) / made / 1000).toFixed(2)} s a frame\n`)
  }
  await writeFile(path.join(out, 'film.json'), JSON.stringify(film, null, 2))
} finally {
  await browser.close()
  server.close()
}
