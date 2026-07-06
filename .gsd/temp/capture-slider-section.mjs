/** Screenshot the before/after slider section with the handle dragged to reveal the "after" side */
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.emulateMediaFeatures([
  { name: 'prefers-reduced-motion', value: 'no-preference' },
])
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2500))

await page.evaluate(() => document.querySelector('#before-after')?.scrollIntoView({ block: 'center' }))
await new Promise((r) => setTimeout(r, 1500))

// Drag the slider handle toward the left so the "after" side dominates
const slider = await page.$('.before-after')
const box = await slider.boundingBox()
const startX = box.x + box.width / 2
const midY = box.y + box.height / 2
await page.mouse.move(startX, midY)
await page.mouse.down()
await page.mouse.move(box.x + box.width * 0.22, midY, { steps: 12 })
await page.mouse.up()
await new Promise((r) => setTimeout(r, 800))

await slider.screenshot({
  path: 'g:/tmp/mediawave-audit/wave-lab/a11y-round/slider-after-updated.png',
})
await browser.close()
console.log('captured')
