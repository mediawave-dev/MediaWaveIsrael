// Pairings made only of the EFT fonts in Nati's folder (not the faces he drew), on the real page at phone width.
// Fonts are injected as bytes into a local browser only; nothing is written to the site.
import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const L = 'C:/Users/User/OneDrive/Fonts/עברית/Lampner/'
const face = (family, file, weight) => `@font-face{font-family:"${family}";src:url(data:font/ttf;base64,${fs.readFileSync(L + file).toString('base64')}) format("truetype");font-weight:${weight};font-display:block;unicode-range:U+0020-0040,U+005B-0060,U+007B-007E,U+00A0,U+0590-05FF,U+FB1D-FB4F,U+20AA,U+2010-2027}`
const lampnerText = face('OptT', 'EFT_Lampner-Light-OT.ttf', '100 450') + face('OptT', 'EFT_Lampner-OT.ttf', '500 650') + face('OptT', 'EFT_Lampner-Bold-OT.ttf', '700 900')
// a heading family: the display face for the heavy parts, and a lighter face for the lead-ins before them
const head = (bold, light = 'EFT_Lampner-Light-OT.ttf') => face('OptD', light, '100 500') + face('OptD', bold, '600 900')
const OPTIONS = [
  { key: 'D', name: 'EFT Lampner', sub: 'headings Lampner Bold, text Lampner', css: head('EFT_Lampner-Bold-OT.ttf') + lampnerText },
  { key: 'E', name: 'EFT Asaf + Lampner', sub: 'headings Asaf Bold, text Lampner', css: head('EFT_Asaf-Bold.ttf') + lampnerText },
  { key: 'F', name: 'EFT OffSet + Lampner', sub: 'headings OffSet Bold, text Lampner', css: head('EFT_OffSet-Bold.ttf') + lampnerText },
  { key: 'G', name: 'EFT Artzisraeli + Lampner', sub: 'headings Artzisraeli, text Lampner', css: head('EFT_Artzisraeli.ttf') + lampnerText },
  { key: 'H', name: 'EFT Mashat + Lampner', sub: 'headings Mashat, text Lampner', css: head('EFT_Mashat.ttf') + lampnerText },
]
const only = process.argv.slice(2)
const b = await puppeteer.launch({ headless: 'new' })
for (const o of OPTIONS.filter((x) => !only.length || only.includes(x.key))) {
  const p = await b.newPage()
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await p.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
  await p.goto('http://localhost:5188/?reduce=1', { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 1200))
  // the sizes of the page were raised for mediawave-font1 (set at 83% of its em); these faces take the earlier scale
  await p.addStyleTag({ content: o.css + `:root{--text:"OptT","MW Plex","MW Plex Fallback",Arial,sans-serif;--display:"OptD","MW Plex",Arial,sans-serif}
    .h1{font-size:clamp(2.25rem,9.6vw,5rem)} .h2{font-size:clamp(1.875rem,6.4vw,3.25rem)} .h3{font-size:clamp(1.4375rem,3vw,1.75rem)} .h4{font-size:1.1875rem}` })
  await p.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 900))
  const info = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, used: [...document.fonts].filter((f) => f.status === 'loaded' && /Opt/.test(f.family)).length }))
  const top = await p.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 390, height: 560 } })
  const y = await p.evaluate(() => Math.round(document.getElementById('about').getBoundingClientRect().top + scrollY) + 30)
  await p.evaluate((v) => window.scrollTo(0, v), y); await new Promise((r) => setTimeout(r, 400))
  const about = await p.screenshot({ type: 'png' })
  const aboutCut = await sharp(about).extract({ left: 0, top: 0, width: 780, height: 1500 }).toBuffer()
  const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="780" height="120"><rect width="780" height="120" fill="#171717"/><circle cx="716" cy="60" r="40" fill="#FFC40C"/><text x="716" y="77" font-family="Arial" font-size="48" font-weight="700" fill="#171717" text-anchor="middle">${o.key}</text><text x="650" y="52" font-family="Arial" font-size="34" font-weight="700" fill="#fff" text-anchor="end">${o.name}</text><text x="650" y="92" font-family="Arial" font-size="24" fill="#bbb" text-anchor="end">${o.sub}</text></svg>`)
  await sharp({ create: { width: 780, height: 120 + 1120 + 1500, channels: 3, background: '#fff' } })
    .composite([{ input: label, top: 0, left: 0 }, { input: await sharp(top).toBuffer(), top: 120, left: 0 }, { input: aboutCut, top: 1240, left: 0 }])
    .jpeg({ quality: 82 }).toFile(`qa/font-${o.key}.jpg`)
  console.log(o.key, o.name, JSON.stringify(info))
  await p.close()
}
await b.close()
