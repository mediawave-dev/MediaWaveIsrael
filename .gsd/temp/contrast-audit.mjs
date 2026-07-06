/**
 * Site-wide WCAG color-contrast audit via axe-core.
 * Scans every page + interactive states (widget open, chat open,
 * high-contrast mode, mobile menu) and prints deduped violations.
 */
import puppeteer from 'puppeteer'
import { readFileSync } from 'node:fs'

const BASE = 'http://localhost:4173'
const AXE = readFileSync('node_modules/axe-core/axe.min.js', 'utf8')

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function runAxe(page, label, results) {
  await page.evaluate(AXE)
  const res = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: { type: 'rule', values: ['color-contrast'] },
      resultTypes: ['violations'],
    })
  })
  for (const v of res.violations) {
    for (const node of v.nodes) {
      const data = node.any?.[0]?.data ?? {}
      results.push({
        label,
        target: node.target?.join(' '),
        text: (node.html || '').replace(/\s+/g, ' ').slice(0, 90),
        fg: data.fgColor,
        bg: data.bgColor,
        ratio: data.contrastRatio,
        required: data.expectedContrastRatio,
      })
    }
  }
}

const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()
await page.emulateMediaFeatures([
  { name: 'prefers-reduced-motion', value: 'no-preference' },
])
const results = []

// ---------- Desktop pages ----------
await page.setViewport({ width: 1440, height: 900 })

const desktopPages = [
  ['/', 'home'],
  ['/blog', 'blog-index'],
  ['/blog/why-your-business-needs-a-website-2026', 'blog-post'],
  ['/blog/how-to-choose-web-developer-israel', 'blog-post-new'],
  ['/services/building-websites', 'service-websites'],
  ['/services/memory-videos', 'service-memory'],
  ['/portfolio/memory-videos', 'portfolio-example'],
  ['/terms', 'terms'],
  ['/privacy', 'privacy'],
  ['/accessibility', 'accessibility'],
  ['/does-not-exist', '404'],
]

for (const [path, label] of desktopPages) {
  await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 60000 })
  await wait(2200)
  // Scroll slowly so lazy sections mount AND every whileInView reveal
  // (some with delay up to 0.8s) fully settles to opacity 1 before axe
  // samples — otherwise mid-fade blends read as false contrast failures.
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 350))
    }
  })
  await wait(1500)
  await runAxe(page, label, results)
}

// ---------- Home: widget panel open ----------
await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 60000 })
await wait(2000)
await page.click('button[aria-label="פתח תפריט נגישות"]')
await page.waitForSelector('#accessibility-panel', { visible: true })
// Let the spring entrance fully settle: axe blends mid-animation opacity
// into the fg color and reports phantom near-white violations (flaky gate).
await page.waitForFunction(() => {
  const panel = document.querySelector('#accessibility-panel')
  const label = panel?.querySelector('span.font-medium')
  if (!panel || !label) return false
  const c = getComputedStyle(label).color
  const settled = window.__lastC === c && getComputedStyle(panel).opacity === '1'
  window.__lastC = c
  return settled
}, { polling: 150, timeout: 6000 })
await runAxe(page, 'widget-panel', results)

// ---------- Home: high-contrast ON ----------
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('#accessibility-panel button')]
  btns.find((b) => b.textContent.includes('ניגודיות גבוהה'))?.click()
})
await wait(500)
// Scroll slowly so every whileInView reveal fully settles (opacity 1)
// before axe samples colors — otherwise mid-fade blends read as failures.
await page.evaluate(async () => {
  for (let y = 0; y <= document.body.scrollHeight; y += 400) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 350))
  }
})
await wait(1500)
await runAxe(page, 'home-high-contrast', results)

// ---------- Home: chat panel open ----------
await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 60000 })
await wait(2000)
await page.click('button[aria-label="פתח צ\'אט"]').catch(() => {})
await wait(1200)
await runAxe(page, 'chat-panel', results)

// ---------- Mobile: menu open ----------
await page.setViewport({ width: 390, height: 844 })
await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 60000 })
await wait(2000)
await page.click('button[aria-label="פתח תפריט"]').catch(() => {})
await wait(900)
await runAxe(page, 'mobile-menu', results)

await browser.close()

// ---------- Dedupe + report ----------
const seen = new Map()
for (const r of results) {
  const key = `${r.target}|${r.fg}|${r.bg}`
  if (!seen.has(key)) seen.set(key, { ...r, labels: new Set([r.label]) })
  else seen.get(key).labels.add(r.label)
}
const unique = [...seen.values()]
console.log(`\n===== ${unique.length} unique contrast violations =====\n`)
for (const u of unique) {
  console.log(
    `[${[...u.labels].join(',')}] ${u.ratio} (need ${u.required})  fg=${u.fg} bg=${u.bg}\n   ${u.target}\n   ${u.text}\n`
  )
}
