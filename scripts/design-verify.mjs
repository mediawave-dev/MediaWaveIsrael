/**
 * design-verify.mjs — visual quality gate for the wave-lab design run.
 *
 * Usage: node scripts/design-verify.mjs <baseURL> <outDir>
 *   e.g. node scripts/design-verify.mjs http://localhost:4176 g:/tmp/mediawave-audit/wave-lab/phase1
 *
 * For every viewport (320/390/768/1440) and route it records:
 *   - full-page screenshot (+ viewport-sized section scroll shots for home)
 *   - console errors, page errors, failed network requests
 *   - horizontal overflow (scrollWidth > clientWidth)
 * Animations are captured with prefers-reduced-motion: no-preference
 * (headless Chrome otherwise emulates `reduce` and everything looks frozen).
 * Writes report.json + prints a PASS/FAIL summary.
 */
import { mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import puppeteer from 'puppeteer'

const baseURL = process.argv[2] || 'http://localhost:4173'
const outDir = resolve(process.argv[3] || 'g:/tmp/mediawave-audit/wave-lab/adhoc')
mkdirSync(outDir, { recursive: true })

const VIEWPORTS = [
  { name: '320', width: 320, height: 900 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
]

const ROUTES = [
  { name: 'home', path: '/', sections: true },
  { name: 'blog', path: '/blog' },
  { name: 'accessibility', path: '/accessibility' },
  { name: '404', path: '/this-page-does-not-exist' },
]

const IGNORED_CONSOLE = [
  /Download the React DevTools/,
  /net::ERR_FAILED.*fonts\.googleapis/, // offline font fetch in CI is not a site bug
]

const browser = await puppeteer.launch({ headless: 'new' })
const report = { baseURL, timestamp: new Date().toISOString(), pages: [], pass: true }

for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    // 1440 + 320 cover all routes; middle widths only need the home page
    if (!route.sections && vp.name !== '1440' && vp.name !== '320') continue

    const page = await browser.newPage()
    const entry = { route: route.name, viewport: vp.name, consoleErrors: [], pageErrors: [], failedRequests: [], hOverflow: false }

    page.on('console', (msg) => {
      if (msg.type() === 'error' && !IGNORED_CONSOLE.some((re) => re.test(msg.text()))) {
        entry.consoleErrors.push(msg.text().slice(0, 300))
      }
    })
    page.on('pageerror', (err) => entry.pageErrors.push(String(err).slice(0, 300)))
    page.on('requestfailed', (req) => {
      const failure = req.failure()?.errorText || ''
      if (failure !== 'net::ERR_ABORTED') {
        entry.failedRequests.push(`${req.url().slice(0, 200)} — ${failure}`)
      }
    })

    await page.setViewport({ width: vp.width, height: vp.height })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
    await page.goto(`${baseURL}${route.path}`, { waitUntil: 'networkidle0', timeout: 60000 })
    await new Promise((r) => setTimeout(r, 1200))

    entry.hOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    )

    // Section-by-section scroll shots for the home page (animations fire per view)
    if (route.sections) {
      const totalHeight = await page.evaluate(() => document.body.scrollHeight)
      const steps = Math.ceil(totalHeight / vp.height)
      for (let i = 0; i < steps; i++) {
        await page.evaluate((y) => window.scrollTo(0, y), i * vp.height)
        await new Promise((r) => setTimeout(r, 900))
        await page.screenshot({ path: `${outDir}/${vp.name}-home-s${String(i).padStart(2, '0')}.png` })
      }
      await page.evaluate(() => window.scrollTo(0, 0))
      await new Promise((r) => setTimeout(r, 400))
    }

    await page.screenshot({ path: `${outDir}/${vp.name}-${route.name}-full.png`, fullPage: true })

    const failed = entry.consoleErrors.length || entry.pageErrors.length || entry.failedRequests.length || entry.hOverflow
    if (failed) report.pass = false
    console.log(
      `${failed ? 'FAIL' : 'ok  '} ${vp.name.padEnd(4)} ${route.name.padEnd(14)}` +
        ` console:${entry.consoleErrors.length} pageErr:${entry.pageErrors.length}` +
        ` reqFail:${entry.failedRequests.length} hOverflow:${entry.hOverflow}`
    )
    report.pages.push(entry)
    await page.close()
  }
}

await browser.close()
writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 2))
console.log(`\n${report.pass ? 'PASS' : 'FAIL'} — details in ${outDir}/report.json`)
process.exit(report.pass ? 0 : 1)
