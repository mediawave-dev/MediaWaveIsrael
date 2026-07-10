/**
 * Quick visual audit — screenshots key pages at desktop + mobile widths.
 * Usage: node scripts/screenshot-audit.mjs [port] [outDir]
 */
import { mkdirSync } from 'fs'
import { resolve } from 'path'
import puppeteer from 'puppeteer'

const PORT = process.argv[2] || '5174'
const OUT = resolve(process.argv[3] || 'screenshots-audit')
mkdirSync(OUT, { recursive: true })

const PAGES = [
  { route: '/', name: 'home', full: true },
  { route: '/blog', name: 'blog', full: true },
  { route: '/blog/why-your-business-needs-a-website-2026', name: 'blog-post', full: true },
  { route: '/does-not-exist', name: '404', full: false },
]

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

for (const vp of VIEWPORTS) {
  for (const p of PAGES) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
    try {
      await page.goto(`http://localhost:${PORT}${p.route}`, { waitUntil: 'networkidle2', timeout: 30000 })
      await new Promise((r) => setTimeout(r, 2500))
      // settle lazy sections by scrolling through the page once
      if (p.full) {
        await page.evaluate(async () => {
          await new Promise((done) => {
            let y = 0
            const step = () => {
              y += 600
              window.scrollTo(0, y)
              if (y < document.body.scrollHeight) setTimeout(step, 120)
              else { window.scrollTo(0, 0); setTimeout(done, 600) }
            }
            step()
          })
        })
        await new Promise((r) => setTimeout(r, 1200))
      }
      await page.screenshot({ path: resolve(OUT, `${p.name}-${vp.name}.png`), fullPage: p.full })
      console.log(`ok ${p.name}-${vp.name}`)
    } catch (e) {
      console.error(`FAIL ${p.name}-${vp.name}: ${e.message}`)
    }
    await page.close()
  }
}

await browser.close()
console.log('done → ' + OUT)
