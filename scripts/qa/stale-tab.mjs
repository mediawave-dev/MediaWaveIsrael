// Stale-tab probe (live check V2): a tab opened before a deploy asks for a route chunk that is gone.
// The first request for the service page's chunk answers 404 (as after a deploy); the page must
// reload once onto the route and show the service page, not the error page.
//   node scripts/qa/stale-tab.mjs http://localhost:4191
import puppeteer from 'puppeteer'

const BASE = (process.argv[2] || 'http://localhost:4191').replace(/\/$/, '')
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844 })
await page.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'rejected') } catch { /* private mode */ } })
await page.goto(BASE + '/', { waitUntil: 'load' })
await wait(3000)

let served404 = 0
await page.setRequestInterception(true)
page.on('request', (req) => {
  if (!served404 && /\/assets\/ShotService-[^/]+\.js$/.test(req.url())) {
    served404++
    return req.respond({ status: 404, contentType: 'text/plain', body: 'gone' })
  }
  req.continue()
})
let navigations = 0
page.on('framenavigated', (f) => { if (f === page.mainFrame()) navigations++ })

const link = await page.$('a[href^="/services/"]')
const href = await link.evaluate((a) => a.getAttribute('href'))
await link.evaluate((a) => a.click())
await wait(7000)
const r = await page.evaluate(() => ({ path: location.pathname, h1: document.querySelector('h1')?.textContent?.trim() ?? '', error: /אופס, משהו השתבש/.test(document.body.innerText) }))
await browser.close()
const ok = served404 === 1 && !r.error && r.path === href && r.h1.length > 0
console.log(`${ok ? 'PASS' : 'FAIL'}  clicked ${href}; 404s served ${served404}; navigations ${navigations}; now ${r.path}; h1 "${r.h1}"; error page ${r.error}`)
process.exit(ok ? 0 : 1)
