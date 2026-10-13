// The KM buttons (the iris, DECISIONS #64) in every state on /states, on the stage and on paper, plus a
// real hover over the hero's button mid-rise and settled. node scripts/qa/button-states.mjs [origin]
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const origin = process.argv[2] || 'http://localhost:5180'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 })
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true'); sessionStorage.setItem('mw-hero-wave', '1'); localStorage.setItem('mw-cookie-consent', 'declined') } catch {} })
await page.goto(`${origin}/states?look=km&motion=full`, { waitUntil: 'networkidle0' })
await sleep(800)
await page.screenshot({ path: 'G:/tmp/mw-qa/btn-states.png', fullPage: true, captureBeyondViewport: false })
await page.goto(`${origin}/?motion=full`, { waitUntil: 'load' })
await sleep(1500)
const cta = await page.$('.kl__ctas .iris')
const box = await cta.boundingBox()
const clip = { x: box.x - 30, y: box.y - 24, width: box.width + 60, height: box.height + 48 }
await page.screenshot({ path: 'G:/tmp/mw-qa/btn-hero-rest.png', clip, captureBeyondViewport: false })
await page.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2)
await sleep(150); await page.screenshot({ path: 'G:/tmp/mw-qa/btn-hero-rise.png', clip, captureBeyondViewport: false })
await sleep(600); await page.screenshot({ path: 'G:/tmp/mw-qa/btn-hero-full.png', clip, captureBeyondViewport: false })
await page.mouse.down(); await sleep(300); await page.screenshot({ path: 'G:/tmp/mw-qa/btn-hero-press.png', clip, captureBeyondViewport: false })
await page.mouse.up()
await browser.close()
