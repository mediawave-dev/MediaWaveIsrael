// Read-only production check: console errors, failed requests, wasm MIME, the companion going live,
// fonts in use, and two screenshots. Never touches the forms.
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const browser = await puppeteer.launch({ headless: true })
for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
  const page = await browser.newPage()
  await page.setViewport(vp)
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true') } catch {} })
  const errors = [], wasm = []
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + e))
  page.on('requestfailed', (r) => errors.push('failed: ' + r.url() + ' ' + r.failure()?.errorText))
  page.on('response', (r) => { if (r.url().endsWith('.wasm')) wasm.push(`${r.status()} ${r.headers()['content-type']}`); if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
  await page.goto('https://mediawave.co.il/', { waitUntil: 'load', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 2500))
  await page.screenshot({ path: `G:/tmp/mw-qa/live-${name}-hero.png`, captureBeyondViewport: false })
  const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')).filter((v, i, a) => a.indexOf(v) === i))
  await page.$eval('#contact form', (f) => window.scrollTo(0, f.getBoundingClientRect().top + scrollY - 100))
  const live = await page.waitForSelector('.ct__pal[data-live]', { timeout: 20000 }).then(() => true).catch(() => false)
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: `G:/tmp/mw-qa/live-${name}-contact.png`, captureBeyondViewport: false })
  console.log(name, '| companion live:', live, '| wasm:', wasm.join(', ') || 'none', '| fonts:', fonts.join(', '))
  console.log('  console/network issues:', errors.length ? errors.slice(0, 8) : 'none')
  await page.close()
}
await browser.close()
