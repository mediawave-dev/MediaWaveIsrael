// D299: the parts that changed, one picture each, on a phone and on a computer.
// node d299-shots.mjs [base] [only: phone|desk] [query]
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const HERE = path.dirname(fileURLToPath(import.meta.url)).split(path.sep).join('/')
const base = process.argv[2] || 'http://localhost:5189'
const only = process.argv[3] || ''
const query = process.argv[4] || ''
const out = `${HERE}/out/d299`
fs.mkdirSync(out, { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const MODES = { phone: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, desk: { width: 1440, height: 900, deviceScaleFactor: 1 } }
const PARTS = [['about', '#about'], ['offer', '#offer'], ['work', '#work'], ['custom', '.custom'], ['faq', '#faq'], ['pitch', '.pitch'], ['contact', '#contact']]
const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] })
for (const [mode, vp] of Object.entries(MODES)) {
  if (only && only !== mode) continue
  // a context of its own: the cookie choice of one run must not hide the note in the next
  const ctx = await b.createBrowserContext()
  const p = await ctx.newPage(); await p.setViewport(vp)
  const errors = []
  p.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
  p.on('pageerror', (e) => errors.push(String(e)))
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()) })
  await p.goto(`${base}/${query}`, { waitUntil: 'networkidle2', timeout: 60000 })
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' })
  // the cookie note as a first-time visitor meets it (it comes 2.5 s in)
  await wait(4200)
  await p.screenshot({ path: `${out}/${mode}-consent.jpg`, type: 'jpeg', quality: 88 })
  const note = await p.evaluate(() => { const c = document.querySelector('.consent'); if (!c) return null; const r = c.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), share: Math.round((r.width * r.height) / (innerWidth * innerHeight) * 1000) / 10 + '%', buttons: [...c.querySelectorAll('button')].map((x) => { const q = x.getBoundingClientRect(); return `${x.textContent} ${Math.round(q.width)}x${Math.round(q.height)}` }) } })
  console.log(mode, 'consent', JSON.stringify(note))
  await p.evaluate(() => { const x = [...document.querySelectorAll('.consent button')][0]; if (x) x.click() })
  await wait(2200) // the page's recordings are attached 1.5 s after load
  for (const [name, sel] of PARTS) {
    const ok = await p.evaluate((s, vh) => {
      const el = document.querySelector(s); if (!el) return false
      const r = el.getBoundingClientRect()
      // a part taller than the screen is shown from its top; a shorter one in the middle
      const y = scrollY + r.top - (r.height > vh ? 70 : (vh - r.height) / 2)
      scrollTo(0, Math.max(0, y)); return true
    }, sel, vp.height)
    if (!ok) { console.log(mode, name, 'MISSING'); continue }
    await wait(1900)
    await p.screenshot({ path: `${out}/${mode}-${name}.jpg`, type: 'jpeg', quality: 88 })
    if (name === 'work') {
      // a tap on the phone at the side brings it to the front
      const before = await p.evaluate(() => document.querySelector('.work__cap')?.textContent)
      await p.evaluate(() => document.querySelector('.work__seat[data-pos="1"]')?.click())
      await wait(1500)
      await p.screenshot({ path: `${out}/${mode}-work-2.jpg`, type: 'jpeg', quality: 88 })
      const st = await p.evaluate(() => ({ cap: document.querySelector('.work__cap')?.textContent, playing: [...document.querySelectorAll('.work video')].map((v) => `${v.closest('[data-pos]').dataset.pos}:${v.paused ? 'paused' : 'plays'}`), rings: [...document.querySelectorAll('.ring__glass video')].map((v) => (v.paused ? 'paused' : 'plays')) }))
      console.log(mode, 'work', JSON.stringify({ before, ...st }))
    }
    if (name === 'offer') console.log(mode, 'rings', await p.evaluate(() => [...document.querySelectorAll('.ring__glass video')].map((v) => (v.paused ? 'paused' : 'plays') + (v.hasAttribute('data-on') ? ' shown' : ' hidden')).join(', ')))
    if (name === 'contact') console.log(mode, 'tint', await p.evaluate(() => { const c = document.querySelector('#contact'); return [c.style.getPropertyValue('--tint'), c.style.getPropertyValue('--tint2'), getComputedStyle(c.querySelector('.contact__disc')).backgroundColor].join(' | ') }))
  }
  const wide = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  console.log(mode, 'sideways scroll', wide, 'errors', errors.length, errors.slice(0, 6).join(' ; '))
  await ctx.close()
}
await b.close()
