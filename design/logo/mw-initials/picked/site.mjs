// Board 2: the logo on the real site. Loads the built site, swaps the logo in the header and the footer in the page
// (nothing in the repo changes), and photographs it on a phone and on a desktop.
import { createRequire } from 'module'
import fs from 'fs'
import { THEMES, emblem, lockup, svg } from './parts.mjs'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const OUT = 'C:/tmp/night/logo/mw3/'
const require = createRequire(ROOT + 'package.json')
const puppeteer = require('puppeteer')
const L = THEMES.light
const b = await puppeteer.launch({ headless: 'new' })
const shot = async (name, w, h, opt) => {
  const pg = await b.newPage()
  await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
  await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await pg.goto('http://localhost:5189/?calm=1', { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 3000))
  await pg.addStyleTag({ content: '[class*="consent"],[class*="cookie"]{display:none!important}' })
  if (name === 'phone') fs.writeFileSync(OUT + 'meta.json', JSON.stringify(await pg.evaluate(() => ({ title: document.title, desc: document.querySelector('meta[name=description]')?.content || '' }))))
  // the folded corner as it is today: the disc alone beside the menu button
  await pg.evaluate(() => window.scrollTo(0, 700)); await new Promise((r) => setTimeout(r, 1200))
  await pg.screenshot({ path: `${OUT}${name}-folded.png`, clip: { x: w - opt.foldW, y: 700, width: opt.foldW, height: opt.foldH } })
  await pg.evaluate(() => window.scrollTo(0, 0)); await new Promise((r) => setTimeout(r, 1200))
  await pg.evaluate((head, w0) => { const clip = document.querySelector('.pin__clip'); clip.innerHTML = head
    clip.style.cssText = 'width:auto;overflow:visible;-webkit-mask-image:none;mask-image:none'
    document.querySelector('.pin').style.setProperty('--w0', w0) }, svg(lockup(L, { br: opt.br }), opt.lh, 'style="display:block"'), opt.w0)
  await new Promise((r) => setTimeout(r, 400))
  await pg.screenshot({ path: `${OUT}${name}-top.png`, clip: { x: 0, y: 0, width: w, height: opt.topH } })
  await pg.evaluate((foot) => { const el = document.querySelector('.foot__brand .mw-logo'); const d = document.createElement('div'); d.innerHTML = foot; d.style.cssText = 'direction:ltr;display:flex;justify-content:flex-end'; el.replaceWith(d); d.scrollIntoView({ block: 'center' }) },
    svg(emblem(L), opt.footH, 'style="display:block"'))
  await new Promise((r) => setTimeout(r, 900))
  const box = await pg.evaluate(() => { const r = document.querySelector('.foot').getBoundingClientRect(); const top = Math.max(0, r.y - 24); return { x: 0, y: scrollY + top, width: innerWidth, height: Math.min(innerHeight - top, r.height + 24) } })
  await pg.screenshot({ path: `${OUT}${name}-foot.png`, clip: box })
  await pg.close()
}
await shot('phone', 390, 844, { br: process.argv[2] !== 'nobr', lh: 40, w0: 262, topH: 560, foldW: 200, foldH: 110, footH: 132 })
await shot('desk', 1440, 900, { br: true, lh: 46, w0: 356, topH: 560, foldW: 420, foldH: 130, footH: 150 })
await b.close(); console.log('ok')
