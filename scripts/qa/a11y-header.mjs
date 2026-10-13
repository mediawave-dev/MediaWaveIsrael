// The accessibility trigger in the phone header (DECISIONS #63): the header at several widths,
// the panel opened from it, focus back on close, and the side tab hidden on phones.
// node scripts/qa/a11y-header.mjs [origin]
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const origin = process.argv[2] || 'http://localhost:5180'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({ headless: true })
for (const w of [320, 360, 390, 430, 768, 1280]) {
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: 700, deviceScaleFactor: 2, isMobile: w < 800, hasTouch: w < 800 })
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true'); sessionStorage.setItem('mw-hero-wave', '1'); localStorage.setItem('mw-cookie-consent', 'declined') } catch {} })
  await page.goto(`${origin}/`, { waitUntil: 'load' })
  await page.waitForSelector('[data-accessibility-widget]', { timeout: 15000 })
  await sleep(500)
  const info = await page.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const q = e.getBoundingClientRect(); return q.width ? [Math.round(q.left), Math.round(q.right), Math.round(q.top), Math.round(q.width)] : 'hidden' }
    return { logo: r('.mw-head__logo'), a11y: r('.mw-head__a11y'), burger: r('.mw-head__burger'), cta: r('.mw-head__cta'), tab: r('.mw-a11y-tab'), overflow: document.documentElement.scrollWidth > innerWidth }
  })
  await page.screenshot({ path: `G:/tmp/mw-qa/a11y-head-${w}.png`, clip: { x: 0, y: 0, width: w, height: 140 }, captureBeyondViewport: false })
  let opened = null
  if (info.a11y !== 'hidden' && info.a11y) {
    await page.click('.mw-head__a11y')
    await sleep(500)
    opened = await page.evaluate(() => ({ panel: !!document.querySelector('#accessibility-panel'), focus: document.activeElement?.textContent?.trim().slice(0, 12) }))
    await page.screenshot({ path: `G:/tmp/mw-qa/a11y-open-${w}.png`, captureBeyondViewport: false })
    await page.keyboard.press('Escape'); await sleep(250)
    opened.back = await page.evaluate(() => document.activeElement?.className)
    opened.closed = await page.evaluate(() => !document.querySelector('#accessibility-panel'))
  }
  console.log(w, JSON.stringify(info), opened ? JSON.stringify(opened) : '')
  await page.close()
}
await browser.close()
