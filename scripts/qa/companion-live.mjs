// Live check of the contact companion: every state on desktop and phone, the form's request
// intercepted (never reaches any server). Usage: node companion-live.mjs <url> <outdir> [desktop|phone] [ok|fail] [no-preference|reduce]
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
import { mkdirSync } from 'node:fs'

const [url, out, dev = 'desktop', outcome = 'ok', motion = 'no-preference'] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const tag = `${dev}${outcome === 'ok' ? '' : '-fail'}${motion === 'reduce' ? '-calm' : ''}`
const vp = dev === 'phone' ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900, deviceScaleFactor: 1 }
const browser = await puppeteer.launch({ headless: true, args: ['--no-first-run'] })
const page = await browser.newPage()
await page.setViewport(vp)
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: motion }])
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(String(e)))
page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
// the lead popup (opens at half the page) would cover the form: the visitor closed it earlier
await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true') } catch {} })
await page.setRequestInterception(true)
let release = null
page.on('request', (req) => {
  if (req.url().includes('form.test.invalid')) {
    // hold the request like a slow network, then answer or fail
    release = () => (outcome === 'ok' ? req.respond({ status: 200, body: 'ok' }) : req.abort('failed'))
    return
  }
  req.continue()
})
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await page.goto(url, { waitUntil: 'load', timeout: 60000 })
await wait(1500)

const inView = async () => {
  const r = await page.$eval('.ct__pal', (el) => el.getBoundingClientRect().toJSON())
  if (r.top < 60 || r.bottom > vp.height - 20) {
    await page.$eval('.ct__pal', (el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 120))
    await wait(900)
  }
}
await inView()
const t0 = Date.now()
const live = await page.waitForSelector('.ct__pal[data-live]', { timeout: 20000 }).then(() => true).catch(() => false)
console.log('live:', live, 'after', Date.now() - t0, 'ms')

const shot = async (name) => {
  await inView()
  const r = await page.$eval('.ct__pal', (el) => { const b = el.getBoundingClientRect(); return { x: b.x + scrollX, y: b.y + scrollY, w: b.width, h: b.height, vy: b.y } })
  await page.screenshot({ path: `${out}/${tag}-${name}.png`, clip: { x: r.x - 8, y: r.y - 8, width: r.w + 16, height: r.h + 16 }, captureBeyondViewport: false })
}
const formShot = async (name) => {
  const r = await page.$eval('#contact form', (el) => { const b = el.getBoundingClientRect(); return { x: b.x + scrollX, y: b.y + scrollY, w: b.width, h: b.height, vy: b.y } })
  const y = r.y - 8
  await page.screenshot({ path: `${out}/${tag}-${name}.png`, clip: { x: Math.max(0, r.x - 8), y, width: Math.min(vp.width, r.w + 16), height: Math.min(vp.height - (r.vy - 8), r.h + 16) }, captureBeyondViewport: false })
}

await shot('1-idle')
await page.focus('#contact-name')
await wait(500)
await shot('2-focus')
await page.keyboard.type('נתנאל לוי', { delay: 30 })
await page.focus('#contact-email')
await page.keyboard.type('test@example.com', { delay: 20 })
await page.focus('#contact-message')
await page.keyboard.type('שלום, אני צריך אתר חדש לעסק שלי עם טופס הזמנות ויומן תורים. מה התהליך ומה לוחות הזמנים?', { delay: 18 })
await wait(250)
await shot('3-typing')
await formShot('3-form')
await wait(2500)
await shot('4-typing-paused')
await page.click('#contact form button[type="submit"]')
await wait(350)
await shot('5-loading-early')
await wait(1400)
await shot('6-loading-slosh')
release?.()
await wait(450)
await shot('7-after-early')
await wait(1500)
await shot('8-after')
await formShot('8-form')
const state = await page.$eval('#contact form', (f) => ({ status: f.querySelector('[role=status]')?.textContent ?? null, alert: f.querySelector('[role=alert]')?.textContent ?? null }))
console.log('form says:', JSON.stringify(state))
if (outcome === 'ok') { await wait(3500); await shot('9-back-to-idle') }
else { await page.focus('#contact-message'); await page.keyboard.type(' תודה', { delay: 30 }); await wait(600); await shot('9-retyping') }
console.log('errors:', errors.length ? errors : 'none')
await browser.close()
