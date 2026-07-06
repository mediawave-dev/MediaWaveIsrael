/** Capture the accessibility widget: default (רגיל selected) + each size, at 2x */
import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'

const OUT = 'g:/tmp/mediawave-audit/wave-lab/a11y-round'
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2000))

await page.click('button[aria-label="פתח תפריט נגישות"]')
await page.waitForSelector('#accessibility-panel', { visible: true })
await new Promise((r) => setTimeout(r, 700))

const panel = await page.$('#accessibility-panel')
// Default state — "רגיל" is the selected chip
await panel.screenshot({ path: `${OUT}/widget-default-regil.png` })

// Select each size and shoot, to prove selected chip is always readable
for (const label of ['גדול', 'גדול מאוד', 'רגיל']) {
  await page.evaluate((lbl) => {
    const b = [...document.querySelectorAll('#accessibility-panel .text-size-btn')]
      .find((x) => x.textContent.trim() === lbl)
    b?.click()
  }, label)
  await new Promise((r) => setTimeout(r, 400))
}
await panel.screenshot({ path: `${OUT}/widget-back-to-regil.png` })

await browser.close()
console.log('captured')
