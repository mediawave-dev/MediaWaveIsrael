// node corner2.mjs <base> : narrow phones, and the menu opened from the top of the page
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const base = process.argv[2] || 'http://localhost:5188'
const b = await puppeteer.launch({ headless: 'new' })
const tiles = []
for (const w of [320, 360, 375, 390]) {
  const p = await b.newPage()
  await p.setViewport({ width: w, height: 700, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await p.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
  await p.goto(base + '/?reduce=1', { waitUntil: 'networkidle2' })
  await p.evaluate(() => document.fonts.ready); await new Promise((r) => setTimeout(r, 900))
  const crop = async () => sharp(await p.screenshot({ type: 'png' })).extract({ left: 0, top: 0, width: w * 2, height: 520 }).resize({ width: w }).extend({ right: 400 - w, background: '#888' }).toBuffer()
  tiles.push(await crop())
  // clearances at the top of the page: the wave against the two buttons of the bar
  const gap = await p.evaluate(() => {
    const blob = document.querySelector('.pin__blob path').getBoundingClientRect()
    const tools = [...document.querySelectorAll('.head__tools .icon-btn svg')].map((e) => e.getBoundingClientRect())
    const right = Math.max(...tools.map((t) => t.right)), y = tools[0].top + tools[0].height / 2
    // where the wave's edge is at the height of the icons
    const path = document.querySelector('.pin__blob path'); const svg = path.ownerSVGElement; const L = path.getTotalLength()
    let edge = Infinity
    for (let i = 0; i <= 400; i++) { const pt = path.getPointAtLength(L * i / 400).matrixTransform(svg.getScreenCTM()); if (Math.abs(pt.y - y) < 3) edge = Math.min(edge, pt.x) }
    return { iconsRight: Math.round(right), waveEdgeAtIcons: Math.round(edge), blobLeft: Math.round(blob.left), sw: document.documentElement.scrollWidth }
  })
  await p.tap('.head__menu'); await new Promise((r) => setTimeout(r, 900))
  tiles.push(await crop())
  const st = await p.evaluate(() => ({ p: document.querySelector('.pin').style.getPropertyValue('--p'), vis: getComputedStyle(document.querySelector('.pin__menu')).visibility, hidden: document.getElementById('sheet').hidden }))
  await p.tap('.pin__menu'); await new Promise((r) => setTimeout(r, 900))
  const st2 = await p.evaluate(() => ({ p: document.querySelector('.pin').style.getPropertyValue('--p'), hidden: document.getElementById('sheet').hidden }))
  console.log(w, JSON.stringify(gap), 'open', JSON.stringify(st), 'closed', JSON.stringify(st2))
  await p.close()
}
await sharp({ create: { width: 400 * 4, height: 260 * 2 + 8, channels: 3, background: '#c00' } })
  .composite(tiles.map((input, i) => ({ input, left: Math.floor(i / 2) * 400, top: (i % 2) * 268 }))).jpeg({ quality: 80 }).toFile('qa/corner-narrow.jpg')
await b.close()
