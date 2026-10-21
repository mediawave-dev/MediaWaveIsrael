// node audit-read.mjs <url> <WxH> <out.json> [stepFraction=0.7]
// env: PRE = a script to run in the page before measuring (e.g. open a dialog), SCOPE = only the text inside
// this selector, ONCE = measure the first screen only
// Legibility audit on the real rendered page (WebGL included): at every stop, photograph the page with all
// text made transparent, then measure each visible line of text against the pixels actually behind it.
// A line fails when its 15th-percentile contrast is under 4.5 (3 for large text). Lines still fading in or
// out (effective opacity < 0.95) are reported apart as "moving".
import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'
const require = createRequire(new URL('../../package.json', import.meta.url))
const puppeteer = require('puppeteer')
const [url, size, out, stepArg] = process.argv.slice(2)
const [W, H] = size.split('x').map(Number)
const STEP = Number(stepArg) || 0.7
const DPR = W < 760 ? 2 : 1
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await puppeteer.launch({ headless: true, userDataDir: 'G:/tmp/pw-gl-profile-studio', args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=d3d11', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width: W, height: H, deviceScaleFactor: DPR, isMobile: W < 760, hasTouch: W < 760 })
await p.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'rejected') } catch {} })
await p.goto(url, { waitUntil: 'networkidle2', timeout: 90000 })
await sleep(5000)
// the guide and the trail are not content
await p.addStyleTag({ content: '.gd, .gd-trail' + (process.env.NOSND ? ', .snd' : '') + ' { display: none !important; }' })
if (process.env.PRE) { await p.evaluate(process.env.PRE); await sleep(2500) }
const total = process.env.ONCE ? 1 : await p.evaluate(() => document.documentElement.scrollHeight)
const found = []
for (let y = 0; y < total; y += Math.round(H * STEP)) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y)
  await sleep(1500)
  const items = await p.evaluate((scope) => {
    const out = []
    const opacityOf = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return o }
    for (const el of document.querySelectorAll(`${scope} *`)) {
      if (el.closest('svg, .gd, .gd-trail, [aria-hidden="true"], .sr-only')) continue
      // a closed <details> keeps its answer laid out but never paints it
      const dt = el.closest('details')
      if (dt && !dt.open && !el.closest('summary')) continue
      const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
      if (!own.length) continue
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none') continue
      const range = document.createRange()
      range.selectNodeContents(el)
      const rects = [...range.getClientRects()].filter((r) => r.width > 2 && r.height > 4 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth)
      if (!rects.length) continue
      const fill = cs.webkitTextFillColor
      const color = fill && fill !== 'rgba(0, 0, 0, 0)' ? fill : cs.color
      const size = parseFloat(cs.fontSize)
      const bold = Number(cs.fontWeight) >= 700
      out.push({ text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 48), color, size, bold, op: opacityOf(el), rects: rects.slice(0, 4).map((r) => [r.left, r.top, r.width, r.height]), cls: (el.className?.toString?.() || el.tagName).slice(0, 40) })
    }
    return out
  }, process.env.SCOPE || 'body')
  const hide = await p.addStyleTag({ content: '* { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; caret-color: transparent !important; } ::placeholder { color: transparent !important; }' })
  await sleep(120)
  const shot = await p.screenshot({ encoding: 'base64' })
  await hide.evaluate((n) => n.remove())
  const res = await p.evaluate(async (b64, items, dpr) => {
    const img = new Image()
    img.src = 'data:image/png;base64,' + b64
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.width
    c.height = img.height
    const g = c.getContext('2d', { willReadFrequently: true })
    g.drawImage(img, 0, 0)
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
    const lum = (r, gg, bb) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(bb)
    const parse = (s) => { const m = s.match(/[\d.]+/g).map(Number); return [m[0], m[1], m[2], m[3] ?? 1] }
    return items.map((it) => {
      const [tr, tg, tb, ta] = parse(it.color)
      const a = ta * it.op
      const ratios = []
      for (const [x, y, w, h] of it.rects) {
        for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) {
          const px = Math.round((x + (w * (i + 0.5)) / 9) * dpr)
          const py = Math.round((y + (h * (j + 0.5)) / 4) * dpr)
          if (px < 0 || py < 0 || px >= c.width || py >= c.height) continue
          const d = g.getImageData(px, py, 1, 1).data
          const br = d[0], bg = d[1], bb = d[2]
          const fr = tr * a + br * (1 - a), fg = tg * a + bg * (1 - a), fb = tb * a + bb * (1 - a)
          const L1 = lum(fr, fg, fb), L2 = lum(br, bg, bb)
          ratios.push((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05))
        }
      }
      ratios.sort((m, n) => m - n)
      const worst = ratios.length ? ratios[Math.floor(ratios.length * 0.15)] : 21
      const large = it.size >= 24 || (it.size >= 18.66 && it.bold)
      return { ...it, ratio: Math.round(worst * 100) / 100, need: large ? 3 : 4.5 }
    })
  }, shot, items, DPR)
  for (const r of res) if (r.ratio < r.need) found.push({ y, ...r, moving: r.op < 0.95 })
}
const firm = found.filter((f) => !f.moving)
const uniq = new Map()
for (const f of firm) { const k = f.text + '|' + f.cls; if (!uniq.has(k) || uniq.get(k).ratio > f.ratio) uniq.set(k, f) }
writeFileSync(out, JSON.stringify({ firm: [...uniq.values()], moving: found.filter((f) => f.moving).length }, null, 1))
console.log(`${url} ${size}: firm fails ${uniq.size}, moving ${found.filter((f) => f.moving).length}`)
for (const f of [...uniq.values()].slice(0, 30)) console.log(`  y${f.y} ${f.ratio}/${f.need} ${f.size}px "${f.text}" (${f.cls}) ${f.color} op${f.op.toFixed(2)}`)
await b.close()
