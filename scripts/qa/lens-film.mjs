// Frames of the KM opener (the lens, DECISIONS #64): the opening on a first visit, then the
// pointer over the lens, a click (the shutter) and the scroll. Writes
// G:/tmp/mw-qa/lens-<d|p|s>-<step>.png and prints the page's state and errors.
// node scripts/qa/lens-film.mjs [url] [d|p|s|both|all, or a comma list]
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const url = process.argv[2] || 'http://localhost:5180/?motion=full'
const which = process.argv[3] || 'both'
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
  const shot = (step) => page.screenshot({ path: `${OUT}/lens-${name}-${step}.png`, captureBeyondViewport: false })
  await shot('first-paint')
  await page.waitForSelector('.kl__lens[data-live]', { timeout: 20000 }).catch(() => errors.push('never live'))
  const t0 = Date.now()
  for (const t of [0, 150, 300, 450, 600, 800, 1100, 1600, 2500]) {
    const wait = t - (Date.now() - t0); if (wait > 0) await sleep(wait)
    await shot(`open-${t}`)
  }
  await sleep(800)
  const lens = await page.$eval('.kl__lens', (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width } })
  if (name === 'd') {
    await page.mouse.move(lens.x + lens.w * 0.2, lens.y - lens.w * 0.1)
    await sleep(500); await shot('hover')
    await page.mouse.down(); await page.mouse.up()
    await sleep(70); await shot('shutter-70')
    await sleep(400); await shot('shutter-470')
    await page.mouse.move(10, 10); await sleep(500)
  } else {
    await page.touchscreen.tap(lens.x, lens.y)
    await sleep(70); await shot('shutter-70')
    await sleep(500)
  }
  for (const f of [0.2, 0.4, 0.6]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(vp.height * f))
    await sleep(600)
    await shot(`scroll-${f}`)
  }
  const state = await page.evaluate(() => ({ cls: document.documentElement.className, live: !!document.querySelector('.kl__lens[data-live]'), playing: !!document.querySelector('.kl__film video.is-playing'), seen: sessionStorage.getItem('mw-hero-iris') }))
  console.log(name, JSON.stringify(state), errors.length ? errors.slice(0, 4) : 'no errors')
  await page.close()
}
await browser.close()
