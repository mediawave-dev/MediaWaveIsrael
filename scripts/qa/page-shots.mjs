// Viewport frames down the page at given scroll fractions, desktop and phone.
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const [url, out, ...fr] = process.argv.slice(2)
const fracs = fr.length ? fr.map(Number) : [0, 0.08, 0.2, 0.32, 0.45, 0.6, 0.72, 0.84, 0.93, 1]
const browser = await puppeteer.launch({ headless: true })
for (const [name, vp] of [['d', { width: 1440, height: 900 }], ['p', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
  const page = await browser.newPage()
  await page.setViewport(vp)
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true'); localStorage.setItem('cookie-consent', 'declined') } catch {} })
  await page.goto(url, { waitUntil: 'load', timeout: 60000 })
  await page.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 2500))
  for (const f of fracs) {
    await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), f)
    await new Promise((r) => setTimeout(r, 1300))
    await page.screenshot({ path: `${out}/${name}-${String(Math.round(f * 100)).padStart(3, '0')}.png`, captureBeyondViewport: false })
  }
  await page.close()
}
await browser.close()
console.log('done')
