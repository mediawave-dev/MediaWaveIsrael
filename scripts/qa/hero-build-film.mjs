import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const url = process.argv[2] || 'http://localhost:5180/?motion=full'
const browser = await puppeteer.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] })
for (const [name, vp] of [['d', { width: 1440, height: 900 }], ['p', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
  const page = await browser.newPage()
  await page.setViewport(vp)
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true'); localStorage.setItem('mw-cookie-consent', 'declined') } catch {} })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  const t0 = Date.now()
  await page.goto(url, { waitUntil: 'load', timeout: 60000 })
  const sel = name === 'd' ? null : '.kh__screen'
  if (sel) await page.$eval(sel, (el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 160))
  for (const t of [700, 1600, 2400, 3200, 4000, 4800, 5600, 7000]) {
    const wait = t - (Date.now() - t0); if (wait > 0) await new Promise((r) => setTimeout(r, wait))
    await page.screenshot({ path: `G:/tmp/mw-qa/build-${name}-${t}.png`, captureBeyondViewport: false })
  }
  const state = await page.evaluate(() => ({ cls: document.documentElement.className, live: !!document.querySelector('.kh__build[data-live]'), playing: !!document.querySelector('.kh__slot video.is-playing'), played: sessionStorage.getItem('mw-hero-build') }))
  console.log(name, JSON.stringify(state), errors.length ? errors.slice(0, 3) : 'no errors')
  await page.close()
}
await browser.close()
