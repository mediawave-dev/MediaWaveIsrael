// The share card of the statement site (sun): a 1200x630 shot of the real hero, so the card is the page.
// Usage: node scripts/generate-og-sun.mjs [url]   (default: the built site on http://localhost:5189, launch config sun-dist)
import puppeteer from 'puppeteer'

const url = process.argv[2] || 'http://localhost:5189'
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
// ?reduce=1: the opening does not play and the wheel stands still, so the card is the same on every run
await page.goto(url + '/?reduce=1', { waitUntil: 'networkidle2', timeout: 60000 })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 600))
// the card carries the promise and the first sites; the header's action and the tools are for visitors
await page.addStyleTag({ content: '.head__tools, .tab, .consent, .hero__note { display: none !important } .hero { padding-block-start: 6px !important } .hero__stage { margin-block-start: 30px !important }' })
// the viewport itself: a clip is in document coordinates, and an RTL document's x origin is not the left edge
await page.screenshot({ path: 'public/og-sun.png', type: 'png' })
await browser.close()
console.log('public/og-sun.png')
