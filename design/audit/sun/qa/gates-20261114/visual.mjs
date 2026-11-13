// Full-page looks, cut into columns so a tall page fits one image: each page is sliced into strips and the strips are
// laid side by side. Also the phone menu open, and high contrast (header and footer).
import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const BASE = process.argv[2] || 'http://localhost:5189'
const OUT = 'C:/tmp/night/gates/v/'; fs.mkdirSync(OUT, { recursive: true })
const jobs = (process.argv[3] || '/:390,/:1440,/services/landing-pages/:390,/privacy/:390,/no-such-page/:390').split(',')
const b = await puppeteer.launch({ headless: 'new' })
const page = async (w, h) => { const pg = await b.newPage(); await pg.setViewport({ width: w, height: h }); await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]); return pg }
const settle = async (pg) => { await pg.addStyleTag({ content: '[class*="consent"]{display:none!important}' }); for (let y = 0; y < 12000; y += 700) { await pg.evaluate((v) => window.scrollTo(0, v), y); await new Promise((r) => setTimeout(r, 120)) } await pg.evaluate(() => window.scrollTo(0, 0)); await new Promise((r) => setTimeout(r, 800)) }
for (const job of jobs) {
  const [route, ws] = job.split(':'), w = +ws
  const pg = await page(w, w < 800 ? 844 : 900)
  await pg.goto(BASE + route + '?calm=1', { waitUntil: 'networkidle2', timeout: 60000 }); await new Promise((r) => setTimeout(r, 1500)); await settle(pg)
  const file = `${OUT}${route.replace(/\//g, '_') || '_'}${w}.png`
  await pg.screenshot({ path: file, fullPage: true }); await pg.close()
  const m = await sharp(file).metadata(), strip = w < 800 ? 1500 : 1100, cols = Math.ceil(m.height / strip)
  const scale = w < 800 ? 0.5 : 0.36, sw = Math.round(m.width * scale), sh = Math.round(strip * scale)
  const parts = []
  for (let i = 0; i < cols; i++) { const top = i * strip, hh = Math.min(strip, m.height - top); parts.push({ input: await sharp(file).extract({ left: 0, top, width: m.width, height: hh }).resize({ width: sw }).toBuffer(), left: i * (sw + 8), top: 0 }) }
  await sharp({ create: { width: cols * (sw + 8), height: sh, channels: 3, background: '#777' } }).composite(parts).png().toFile(file.replace('.png', '-cols.png'))
  console.log(file.replace('.png', '-cols.png'), m.height, cols)
}
// the menu open on a phone, and high contrast
{ const pg = await page(390, 844); await pg.goto(BASE + '/?calm=1', { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 1200))
  await pg.addStyleTag({ content: '[class*="consent"]{display:none!important}' })
  await pg.evaluate(() => window.scrollTo(0, 600)); await new Promise((r) => setTimeout(r, 900))
  await pg.click('.pin__menu'); await new Promise((r) => setTimeout(r, 900)); await pg.screenshot({ path: OUT + 'menu390.png' })
  await pg.close() }
{ const pg = await page(390, 844); await pg.goto(BASE + '/?calm=1', { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 1200))
  await pg.evaluate(() => document.documentElement.classList.add('high-contrast')); await pg.addStyleTag({ content: '[class*="consent"]{display:none!important}' })
  await pg.screenshot({ path: OUT + 'hc-top.png', clip: { x: 0, y: 0, width: 390, height: 160 } })
  await pg.evaluate(() => document.querySelector('.foot__brand').scrollIntoView({ block: 'center' })); await new Promise((r) => setTimeout(r, 900))
  await pg.screenshot({ path: OUT + 'hc-foot.png' }); await pg.close() }
await b.close()
