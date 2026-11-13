// Cards for the work wheel (src/sun/Wheel.tsx). One source: src/data/work.json.
// A card is one phone screen (390 x 780) of the live page at an offset down the page, chosen so the card
// SAYS something (D244): a hero with its headline and its action, or a section with a heading and text,
// not a picture alone. "top" (default 0) is the project's main card; "scenes" are further ones.
// Offsets are CSS px from the top of the 390 px wide page.
// Usage: node scripts/capture-work.mjs [slug ...]   (no slug = every project that can be captured)
// Writes public/work/<slug>-card-top.webp and -card-s1.webp, -card-s2.webp ...
// "capture": false keeps a project's hand-made card (the old MediaWave site needs a GPU browser);
// "captureUrl" shoots another address than the public one (an archived copy of a site whose domain lapsed).
import puppeteer from 'puppeteer'
import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'node:fs'

const all = JSON.parse(readFileSync('src/data/work.json', 'utf8'))
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const list = all.filter((p) => p.url && p.capture !== false && (!only.length || only.includes(p.slug)))
mkdirSync('public/work', { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// WebGL in software, so a page drawn on a canvas (the old MediaWave hero) still renders
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
for (const p of list) {
  const cuts = [['top', p.top ?? 0], ...(p.scenes ?? []).map((y, i) => [`s${i + 1}`, y])]
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 780, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  // a returning visitor: no cookie note
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
  await page.goto(p.captureUrl || p.url, { waitUntil: 'networkidle2', timeout: 90000 }).catch((e) => console.log(p.slug, 'goto:', e.message))
  await wait(3000)
  // "hide": selectors of things on the client's page that are not their site (a host's badge)
  await wait(1500)
  // D255: a card is the site's own page and nothing on top of it. Floating buttons and badges that sit in the
  // lower part of the screen (WhatsApp, call, chat, cookie notes, a host's badge) are hidden; the header stays.
  const hideFloating = () => page.evaluate(() => {
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el)
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
      const r = el.getBoundingClientRect()
      if (r.top > innerHeight * 0.3 && r.height < innerHeight * 0.5) el.style.setProperty('display', 'none', 'important')
    }
  })
  await hideFloating()
  if (p.hide) await page.addStyleTag({ content: p.hide + " { display: none !important }" })
  // walk down to the last cut once, so lazy pictures and reveal-on-scroll blocks on the way are in
  for (let y = 0; y <= Math.max(...cuts.map((c) => c[1])) + 780; y += 400) { await page.evaluate((v) => window.scrollTo(0, v), y); await wait(250) }
  // (D257-D258 made tall scrolling strips here; since D260 the cards are videos, scripts/record-work.mjs)
  for (const [tag, y] of cuts) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await wait(1200)
    await hideFloating()
    // the viewport itself, not a clip: a clip is in document coordinates, and an RTL page's x origin is not its left edge
    const buf = await page.screenshot({ type: 'png' })
    // 528 px: a 176 px card on a phone with three device pixels to the CSS pixel, so the text in it stays sharp
    await sharp(buf).resize({ width: 528 }).webp({ quality: 70 }).toFile(`public/work/${p.slug}-card-${tag}.webp`)
    console.log('  ', `public/work/${p.slug}-card-${tag}`)
  }
  await page.close()
}
await browser.close()
