// The text-face options on the real page at phone width, headings in mediawave-font1 Bold.
// Fonts are injected as bytes into a local browser only; nothing is written to the site.
import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const L = 'C:/Users/User/OneDrive/Fonts/עברית/Lampner/'
const W = 'C:/Users/User/OneDrive/Fonts/עברית/MediaWave/site-web-fonts/'
const face = (family, file, weight, fmt = 'truetype') => `@font-face{font-family:"${family}";src:url(data:font/${fmt === 'woff2' ? 'woff2' : 'ttf'};base64,${fs.readFileSync(file).toString('base64')}) format("${fmt}");font-weight:${weight};font-display:block}`
const OPTIONS = [
  { key: 'A', name: 'Noto Sans Hebrew', css: '' },
  { key: 'B', name: 'EFT Lampner', css: face('Opt', L + 'EFT_Lampner-Light-OT.ttf', '300 450') + face('Opt', L + 'EFT_Lampner-OT.ttf', '500 650') + face('Opt', L + 'EFT_Lampner-Bold-OT.ttf', '700 900') },
  { key: 'B2', name: 'EFT Lampner (regular body)', css: face('Opt', L + 'EFT_Lampner-OT.ttf', '300 550') + face('Opt', L + 'EFT_Lampner-Bold-OT.ttf', '600 900') },
  { key: 'C', name: 'IBM Plex Sans Hebrew', css: face('Opt', W + 'IBMPlexSansHebrew-Hebrew-400.woff2', '300 500', 'woff2') + face('Opt', W + 'IBMPlexSansHebrew-Hebrew-600.woff2', '600 900', 'woff2') + face('OptL', W + 'IBMPlexSansHebrew-Latin-400.woff2', '300 500', 'woff2') + face('OptL', W + 'IBMPlexSansHebrew-Latin-600.woff2', '600 900', 'woff2') },
]
const only = process.argv.slice(2)
const b = await puppeteer.launch({ headless: 'new' })
for (const o of OPTIONS.filter((x) => !only.length || only.includes(x.key))) {
  const p = await b.newPage()
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await p.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
  await p.goto('http://localhost:5188/?reduce=1', { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 1200))
  if (o.css) await p.addStyleTag({ content: o.css + `:root{--text:"Opt","OptL","MW Noto","MW Noto Fallback",Arial,sans-serif}` })
  await p.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 900))
  const info = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, used: [...document.fonts].filter((f) => f.status === 'loaded' && /Opt/.test(f.family)).length }))
  // two parts of the page: the opening, and "nice to meet you" with the first ring below it
  const top = await p.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 390, height: 560 } })
  const y = await p.evaluate(() => Math.round(document.getElementById('about').getBoundingClientRect().top + scrollY) + 30)
  await p.evaluate((v) => window.scrollTo(0, v), y); await new Promise((r) => setTimeout(r, 400))
  const about = await p.screenshot({ type: 'png' })
  const aboutCut = await sharp(about).extract({ left: 0, top: 0, width: 780, height: 1500 }).toBuffer()
  const topBuf = await sharp(top).toBuffer()
  const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="780" height="120"><rect width="780" height="120" fill="#171717"/><circle cx="716" cy="60" r="40" fill="#FFC40C"/><text x="716" y="77" font-family="Arial" font-size="48" font-weight="700" fill="#171717" text-anchor="middle">${o.key}</text><text x="650" y="52" font-family="Arial" font-size="34" font-weight="700" fill="#fff" text-anchor="end">${o.name}</text><text x="650" y="92" font-family="Arial" font-size="24" fill="#bbb" text-anchor="end">headings: mediawave-font1 Bold</text></svg>`)
  await sharp({ create: { width: 780, height: 120 + 1120 + 1500, channels: 3, background: '#fff' } })
    .composite([{ input: label, top: 0, left: 0 }, { input: topBuf, top: 120, left: 0 }, { input: aboutCut, top: 1240, left: 0 }])
    .jpeg({ quality: 82 }).toFile(`qa/font-${o.key}.jpg`)
  console.log(o.key, o.name, JSON.stringify(info))
  await p.close()
}
await b.close()
