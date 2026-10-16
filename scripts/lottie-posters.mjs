#!/usr/bin/env node
// lottie-posters: a still for every Lottie the site uses, rendered from its fullest frame.
// Several of the 13 Lotties are draw-on loops: empty at frame 0, and some nearly empty at the
// last frame too (web-design.json ends on a single dot), so a Lottie resting off the eye band, a
// Lottie not built yet, and every Lottie under reduced motion showed a blank box (critic, 16.10).
// This samples 24 frames per file on a canvas, keeps the one with the most drawn (non-white)
// pixels, writes it as WebP to public/animations/posters/ and records the frame number, so the
// page can show the still until the Lottie plays, start the Lottie from that same frame (no
// jump), and rest on it again when it leaves the band.
//   node scripts/lottie-posters.mjs            (from the repo root; needs puppeteer and sharp)
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const puppeteer = require('puppeteer')
const sharp = require('sharp')
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUB = join(ROOT, 'public')
const OUT = join(PUB, 'animations', 'posters')
const MAP = join(ROOT, 'src', 'look', 'shot', 'lottie-posters.json')
const MAX = 640 // px on the long side: the largest well is about 300 css px at DPR 2
// Frames chosen by eye where the fullest frame is not the best picture (the call-centre file's
// fullest frame is mostly its blue blob with the figure cut off; frame 119 is the whole scene).
const OVERRIDES = { '/animations/8 call/Call Center Support Lottie Animation.json': 119 }

// every Lottie path the source references (decoded), so nothing unused gets a poster
function referenced() {
  const set = new Set()
  const walk = (d) => {
    for (const n of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, n.name)
      if (n.isDirectory()) walk(p)
      else if (/\.(tsx?|json)$/.test(n.name) && !p.includes('lottie-posters.json')) {
        for (const m of readFileSync(p, 'utf8').matchAll(/\/animations\/[^'"`]+?\.json/g)) set.add(decodeURI(m[0]))
      }
    }
  }
  walk(join(ROOT, 'src'))
  return [...set].sort()
}

const slug = (p) => p.replace(/^\/animations\//, '').replace(/\.json$/, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase()

const files = referenced()
mkdirSync(OUT, { recursive: true })
process.env.TEMP ||= 'G:/tmp/temp'
const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setContent('<!doctype html><html><body style="margin:0;background:transparent"></body></html>')
await page.addScriptTag({ path: join(ROOT, 'node_modules', 'lottie-web', 'build', 'player', 'lottie_canvas.min.js') })

const map = {}
for (const path of files) {
  const data = JSON.parse(readFileSync(join(PUB, path), 'utf8'))
  const res = await page.evaluate(async (anim, max, forced) => {
    const scale = Math.min(1, max / Math.max(anim.w, anim.h))
    const w = Math.round(anim.w * scale), h = Math.round(anim.h * scale)
    document.body.innerHTML = ''
    const box = document.createElement('div')
    box.style.cssText = `width:${w}px;height:${h}px`
    document.body.appendChild(box)
    const a = window.lottie.loadAnimation({ container: box, renderer: 'canvas', loop: false, autoplay: false, animationData: anim, rendererSettings: { clearCanvas: true } })
    await new Promise((r) => { a.addEventListener('DOMLoaded', r); setTimeout(r, 3000) })
    await new Promise((r) => setTimeout(r, 400)) // embedded images decode
    const cv = box.querySelector('canvas')
    const ctx = cv.getContext('2d')
    const total = Math.max(1, Math.floor(a.totalFrames))
    let best = 0, bestScore = -1
    const N = Math.min(24, total)
    for (let i = 0; i < N; i++) {
      const f = Math.round((i * (total - 1)) / Math.max(1, N - 1))
      a.goToAndStop(f, true)
      await new Promise((r) => requestAnimationFrame(() => r()))
      const px = ctx.getImageData(0, 0, cv.width, cv.height).data
      let score = 0
      for (let k = 0; k < px.length; k += 16) { // every 4th pixel is plenty
        if (px[k + 3] > 24 && px[k] + px[k + 1] + px[k + 2] < 705) score++
      }
      if (score >= bestScore) { bestScore = score; best = f }
    }
    if (forced != null) best = Math.min(total - 1, forced)
    a.goToAndStop(best, true)
    await new Promise((r) => requestAnimationFrame(() => r()))
    const url = cv.toDataURL('image/png')
    a.destroy()
    return { url, frame: best, total, w, h, score: bestScore }
  }, data, MAX, OVERRIDES[path] ?? null)
  const name = slug(path) + '.webp'
  const png = Buffer.from(res.url.split(',')[1], 'base64')
  await sharp(png).webp({ quality: 82, alphaQuality: 90 }).toFile(join(OUT, name))
  map[path] = { src: '/animations/posters/' + name, frame: res.frame, w: res.w, h: res.h }
  console.log(`${path}  frame ${res.frame}/${res.total}  ${res.w}x${res.h}  -> ${relative(ROOT, join(OUT, name))}`)
}
await browser.close()
writeFileSync(MAP, JSON.stringify(map, null, 2) + '\n')
console.log('wrote', relative(ROOT, MAP), Object.keys(map).length, 'posters')
