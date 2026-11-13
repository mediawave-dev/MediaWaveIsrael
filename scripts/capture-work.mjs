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
  // D257: every card also gets a tall strip that starts where the card starts and runs 2600 px down the page
  // (-card-long for the main card, -card-<scene>-long for the others); it scrolls slowly inside the phone.
  // Blocks that reveal on scroll are walked into view first, with motion allowed, unless the project keeps the
  // reduced mode ("still": true, a page whose own reduced mode is its clean state).
  if (!p.still) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  const H = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= H; y += 300) { await page.evaluate((v) => window.scrollTo(0, v), y); await wait(250) }
  await wait(800)
  for (const [tag, y0] of cuts) {
    // a page whose top is a scroll scene (empty space between screens) names the screens of its main strip: "long": [y, y, ...]
    let strip, from = y0
    // a scene card names its own screens the same way: "long_s1": [y, y, ...]
    const screens = tag === 'top' ? p.long : p['long_' + tag]
    if (Array.isArray(screens)) {
      const shots = []
      for (const y of screens) { await page.evaluate((v) => window.scrollTo(0, v), y); await wait(1300); await hideFloating(); shots.push(await page.screenshot({ type: 'png' })) }
      const m0 = await sharp(shots[0]).metadata()
      strip = await sharp({ create: { width: m0.width, height: m0.height * shots.length, channels: 3, background: '#000' } }).composite(shots.map((input, i) => ({ input, left: 0, top: i * m0.height }))).png().toBuffer()
      from = 0
    } else {
      await page.evaluate(() => window.scrollTo(0, 0)); await wait(1000); await hideFloating()
      strip = await page.screenshot({ type: 'png', fullPage: true })
    }
    const meta = await sharp(strip).metadata()
    const k = meta.width / 390
    const top = Math.min(Math.round(from * k), meta.height - 10)
    const h = Math.min(meta.height - top, Math.round(2600 * k))
    const name = tag === 'top' ? `${p.slug}-card-long` : `${p.slug}-card-${tag}-long`
    await sharp(strip).extract({ left: 0, top, width: meta.width, height: h }).resize({ width: 480 }).webp({ quality: 66 }).toFile(`public/work/${name}.webp`)
    console.log('  ', `public/work/${name}`)
  }
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
