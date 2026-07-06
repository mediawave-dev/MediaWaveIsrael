/**
 * Visual verification for the accessibility/consistency round:
 * 1. Header CTA tide-fill hover (contained, neighbors untouched)
 * 2. Accessibility widget: selected chip readable
 * 3. High-contrast mode: sky-family palette, NO link underlines
 * 4. Settings never persist across reloads (always default)
 * 5. New shorter tagline in hero
 */
import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:4173'
const OUT = 'g:/tmp/mediawave-audit/wave-lab/a11y-round'
mkdirSync(OUT, { recursive: true })

const consoleErrors = []
const failedRequests = []
const results = []

function check(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
}

const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
// Headless emulates reduced motion by default — force real animations
await page.emulateMediaFeatures([
  { name: 'prefers-reduced-motion', value: 'no-preference' },
])
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('requestfailed', (req) => failedRequests.push(req.url()))

await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2500))

// ---------- 1. Tagline ----------
const heroText = await page.evaluate(() => document.body.innerText)
check(
  'tagline shortened',
  heroText.includes('עיצוב ופיתוח אתרים מקצועיים לעסקים.') &&
    !heroText.includes('קטנים ובינוניים')
)

// ---------- 2. Header CTA hover (tide fill, no drift) ----------
const cta = await page.$('.header-cta')
check('header CTA exists', !!cta)
const beforeBox = await cta.boundingBox()
await page.hover('.header-cta')
await new Promise((r) => setTimeout(r, 180))
const headerClip = { x: 0, y: 0, width: 1440, height: 110 }
await page.screenshot({ path: `${OUT}/1-cta-hover-mid.png`, clip: headerClip })
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: `${OUT}/2-cta-hover-full.png`, clip: headerClip })
const afterBox = await cta.boundingBox()
// Contained: only the small lift (-2px translateY), zero horizontal drift
const dx = Math.abs(afterBox.x - beforeBox.x)
const dy = Math.abs(afterBox.y - beforeBox.y)
check('CTA has no horizontal drift on hover', dx < 1, `dx=${dx.toFixed(2)}px dy=${dy.toFixed(2)}px`)
await page.mouse.move(720, 500) // un-hover
await new Promise((r) => setTimeout(r, 400))

// ---------- 3. Accessibility widget: open, select size, check contrast ----------
await page.click('button[aria-label="פתח תפריט נגישות"]')
await page.waitForSelector('#accessibility-panel', { visible: true })
await new Promise((r) => setTimeout(r, 600))

// Click "גדול"
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('#accessibility-panel .text-size-btn')]
  const target = btns.find((b) => b.textContent.trim() === 'גדול')
  target?.click()
})
await new Promise((r) => setTimeout(r, 500))

const chipStyles = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('#accessibility-panel .text-size-btn')]
  const active = btns.find((b) => b.getAttribute('aria-pressed') === 'true')
  if (!active) return null
  const cs = getComputedStyle(active)
  return { color: cs.color, background: cs.backgroundColor, label: active.textContent.trim() }
})
check(
  'selected size chip is dark bg + white text',
  chipStyles &&
    chipStyles.color === 'rgb(255, 255, 255)' &&
    chipStyles.background === 'rgb(42, 42, 42)',
  JSON.stringify(chipStyles)
)
await page.screenshot({ path: `${OUT}/3-widget-panel-selected.png` })

// ---------- 4. High contrast ON: palette + no underlines ----------
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('#accessibility-panel button')]
  btns.find((b) => b.textContent.includes('ניגודיות גבוהה'))?.click()
})
await new Promise((r) => setTimeout(r, 500))

const hcState = await page.evaluate(() => {
  const html = document.documentElement
  const orange = getComputedStyle(html).getPropertyValue('--color-orange').trim()
  const navLink = document.querySelector('.nav-link')
  const navDecoration = navLink ? getComputedStyle(navLink).textDecorationLine : 'n/a'
  const ctaColor = getComputedStyle(document.querySelector('.header-cta')).color
  return { hcClass: html.classList.contains('high-contrast'), orange, navDecoration, ctaColor }
})
check('high-contrast class applied', hcState.hcClass)
check('HC accent is deep sky #0369A1', hcState.orange.toUpperCase() === '#0369A1', hcState.orange)
check('nav links NOT underlined in HC', hcState.navDecoration === 'none', hcState.navDecoration)
check('header CTA text white in HC', hcState.ctaColor === 'rgb(255, 255, 255)', hcState.ctaColor)
await page.screenshot({ path: `${OUT}/4-hc-header.png`, clip: { x: 0, y: 0, width: 1440, height: 110 } })

// Footer in HC — no underlines under links
await page.evaluate(() => document.querySelector('footer')?.scrollIntoView())
await new Promise((r) => setTimeout(r, 1200))
const footerUnderlines = await page.evaluate(() => {
  const links = [...document.querySelectorAll('footer a')]
  return links.filter((a) => getComputedStyle(a).textDecorationLine.includes('underline')).length
})
check('footer links have zero underlines in HC', footerUnderlines === 0, `${footerUnderlines} underlined`)
const footer = await page.$('footer')
const fb = await footer.boundingBox()
await page.screenshot({
  path: `${OUT}/5-hc-footer.png`,
  clip: { x: 0, y: Math.max(0, fb.y - (await page.evaluate(() => window.scrollY)) * -1), width: 1440, height: 400 },
}).catch(async () => {
  await page.screenshot({ path: `${OUT}/5-hc-footer.png` })
})

// ---------- 5. Nothing persisted: reload resets everything ----------
const storedBefore = await page.evaluate(() => localStorage.getItem('mediawave-accessibility'))
check('localStorage key not written', storedBefore === null, String(storedBefore))

await page.reload({ waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 2000))
const afterReload = await page.evaluate(() => ({
  hc: document.documentElement.classList.contains('high-contrast'),
  scale: getComputedStyle(document.documentElement).getPropertyValue('--accessibility-text-scale').trim(),
  stored: localStorage.getItem('mediawave-accessibility'),
}))
check(
  'reload resets to defaults (no HC, scale 1, no storage)',
  !afterReload.hc && (afterReload.scale === '1' || afterReload.scale === '') && afterReload.stored === null,
  JSON.stringify(afterReload)
)
await page.screenshot({ path: `${OUT}/6-after-reload-default.png`, clip: { x: 0, y: 0, width: 1440, height: 700 } })

// ---------- Summary ----------
console.log('\nconsole errors:', consoleErrors.length ? consoleErrors : 'none')
console.log('failed requests:', failedRequests.length ? failedRequests : 'none')
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
await browser.close()
process.exit(failed.length || consoleErrors.length ? 1 : 0)
