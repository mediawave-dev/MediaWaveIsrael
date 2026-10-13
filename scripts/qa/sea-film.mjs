// Frames of the KM opener (the sea, DECISIONS #62): the opening on a first visit, then the
// visitor's hand (pointer above the water, through it, a click) and the flood on scroll.
// Writes G:/tmp/mw-qa/sea-<d|p>-<step>.png and prints the page's state and errors.
// node scripts/qa/sea-film.mjs [url] [d|p|s|both|all, or a comma list]
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const url = process.argv[2] || 'http://localhost:5180/?motion=full'
const which = process.argv[3] || 'both' // d, p, s, both (d and p) or all
const OUT = 'G:/tmp/mw-qa'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] })
// s: the same phone with the browser's bars showing (the visible height at first load)
const vps = [['d', { width: 1440, height: 900 }], ['p', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['s', { width: 390, height: 664, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]
for (const [name, vp] of vps.filter(([n]) => which === 'all' || (which === 'both' && n !== 's') || which.split(',').includes(n))) {
  const page = await browser.newPage()
  await page.setViewport(vp)
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true'); localStorage.setItem('mw-cookie-consent', 'declined') } catch {} })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  const shot = (step) => page.screenshot({ path: `${OUT}/sea-${name}-${step}.png`, captureBeyondViewport: false })
  // the opening: wait for the canvas to go live, then film it
  await page.waitForSelector('.ks__band[data-live]', { timeout: 20000 }).catch(() => errors.push('never live'))
  const t0 = Date.now()
  for (const t of [0, 250, 500, 750, 1000, 1250, 1500, 1800, 2200, 3000, 4500]) {
    const wait = t - (Date.now() - t0); if (wait > 0) await sleep(wait)
    await shot(`open-${t}`)
  }
  await sleep(2500)
  const band = await page.$eval('.ks__band', (el) => { const r = el.getBoundingClientRect(); return { top: r.top, h: r.height, w: r.width } })
  const rest = band.top + band.h * (320 / 760)
  if (name === 'd') {
    // the pointer comes down toward the water (the water rises to meet it), then drags through it
    await page.mouse.move(700, rest - 220)
    for (let i = 0; i <= 10; i++) { await page.mouse.move(700 + i * 4, rest - 220 + i * 16); await sleep(16) }
    await shot('lift')
    for (let i = 0; i <= 12; i++) { await page.mouse.move(740 + i * 30, rest - 60 + i * 14); await sleep(16) }
    await sleep(120); await shot('through-120')
    await sleep(380); await shot('through-500')
    await page.mouse.move(1100, rest + 60)
    await page.mouse.down(); await page.mouse.up()
    await sleep(160); await shot('drop-160')
    await sleep(500); await shot('drop-660')
  } else {
    await page.touchscreen.tap(120, rest + 40)
    await sleep(180); await shot('drop-180')
    await sleep(600); await shot('drop-780')
  }
  // the flood: scroll the hero away
  for (const f of [0.15, 0.3, 0.5, 0.7]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(vp.height * f))
    await sleep(450)
    await shot(`flood-${f}`)
  }
  const state = await page.evaluate(() => ({ cls: document.documentElement.className, live: !!document.querySelector('.ks__band[data-live]'), playing: !!document.querySelector('.ks__film video.is-playing'), seen: sessionStorage.getItem('mw-hero-wave') }))
  console.log(name, JSON.stringify(state), errors.length ? errors.slice(0, 4) : 'no errors')
  await page.close()
}
await browser.close()
