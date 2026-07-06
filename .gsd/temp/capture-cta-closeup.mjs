/** Close-up captures of the header CTA tide-fill hover, at 2x for judging */
import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'

const OUT = 'g:/tmp/mediawave-audit/wave-lab/a11y-round'
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await page.emulateMediaFeatures([
  { name: 'prefers-reduced-motion', value: 'no-preference' },
])
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2500))

const box = await (await page.$('.header-cta')).boundingBox()
const clip = {
  x: Math.max(0, box.x - 120),
  y: Math.max(0, box.y - 25),
  width: box.width + 360,
  height: box.height + 50,
}

await page.screenshot({ path: `${OUT}/cta-1-rest.png`, clip })

await page.hover('.header-cta')
await new Promise((r) => setTimeout(r, 120))
await page.screenshot({ path: `${OUT}/cta-2a-early.png`, clip })
await new Promise((r) => setTimeout(r, 120))
await page.screenshot({ path: `${OUT}/cta-2b-mid.png`, clip })

await new Promise((r) => setTimeout(r, 600))
await page.screenshot({ path: `${OUT}/cta-3-full.png`, clip })

await browser.close()
console.log('done', JSON.stringify(clip))
