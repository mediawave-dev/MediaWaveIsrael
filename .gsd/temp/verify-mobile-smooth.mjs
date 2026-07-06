/**
 * Mobile smoothness gate — real interaction pass on an emulated phone
 * (390x844 + 320x900, touch, prefers-reduced-motion: no-preference).
 * Checks: typewriter alive, mobile menu open/close, FAQ accordion,
 * before/after slider drag, giant-word scroll fill, form focus, zero
 * console/page errors, zero horizontal overflow at every scroll depth.
 * Screenshots to g:/tmp/mediawave-audit/wave-lab/mobile-smooth/
 */
import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:4173'
const OUT = 'g:/tmp/mediawave-audit/wave-lab/mobile-smooth'
mkdirSync(OUT, { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const results = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-reduced-motion=no-preference'] })
const page = await browser.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)) })
page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)))

await page.emulate({
  viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
})
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 60000 })
await wait(2500)

// 1. Typewriter is alive (text changes over time)
const tw1 = await page.evaluate(() => document.querySelector('#hero .text-orange')?.textContent || '')
await wait(1600)
const tw2 = await page.evaluate(() => document.querySelector('#hero .text-orange')?.textContent || '')
check('typewriter alive', tw1 !== tw2, `"${tw1.trim()}" -> "${tw2.trim()}"`)
await page.screenshot({ path: `${OUT}/01-hero.png` })

// 2. Mobile menu opens, links visible, closes
await page.tap('button[aria-label="פתח תפריט"]')
await wait(700)
const menuLinks = await page.evaluate(() =>
  [...document.querySelectorAll('nav a, [class*="fixed"] a')].filter((a) => a.offsetParent !== null).length)
await page.screenshot({ path: `${OUT}/02-menu-open.png` })
check('mobile menu opens with links', menuLinks >= 4, `${menuLinks} visible links`)
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button[aria-label="סגור תפריט"]')]
  btns[btns.length - 1]?.click() // the X inside the panel, like a real thumb
})
await wait(1300) // spring exit fully settles (~800ms)
const menuGone = await page.evaluate(() =>
  !document.querySelector('div[class*="fixed"][class*="right-0"][class*="bottom-0"]'))
check('mobile menu closes', menuGone)

// 3. Before/after slider drag moves the clip
await page.evaluate(() => document.querySelector('[role="slider"]')?.scrollIntoView({ block: 'center' }))
await wait(1200)
const slider = await page.$('[role="slider"]')
if (slider) {
  const before = await page.evaluate(() => document.querySelector('[role="slider"]')?.getAttribute('aria-valuenow'))
  const box = await slider.boundingBox()
  const startX = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.touchscreen.touchStart(startX, y)
  for (let i = 1; i <= 6; i++) await page.touchscreen.touchMove(startX - i * 18, y)
  await page.touchscreen.touchEnd()
  await wait(400)
  const after = await page.evaluate(() => document.querySelector('[role="slider"]')?.getAttribute('aria-valuenow'))
  await page.screenshot({ path: `${OUT}/03-slider-dragged.png` })
  check('slider drag changes position', before !== after, `${before} -> ${after}`)
} else check('slider drag changes position', false, 'slider not found')

// 4. FAQ accordion opens on tap
await page.evaluate(() => document.querySelector('section[aria-label="שאלות נפוצות"]')?.scrollIntoView({ block: 'start' }))
await wait(1200)
const faqBtn = await page.$('section[aria-label="שאלות נפוצות"] button')
if (faqBtn) {
  await faqBtn.tap()
  await wait(700)
  const expanded = await page.evaluate(() =>
    document.querySelector('section[aria-label="שאלות נפוצות"] button')?.getAttribute('aria-expanded'))
  await page.screenshot({ path: `${OUT}/04-faq-open.png` })
  check('FAQ accordion opens', expanded === 'true', `aria-expanded=${expanded}`)
} else check('FAQ accordion opens', false, 'button not found')

// 5. Giant word fills on scroll (mobile pointer:coarse behavior)
await page.evaluate(() => document.querySelector('.giant-word')?.scrollIntoView({ block: 'center' }))
await wait(1500)
const giant = await page.evaluate(() => {
  const el = document.querySelector('.giant-word')
  if (!el) return null
  return { filled: el.classList.contains('giant-word-filled'), color: getComputedStyle(el).color }
})
await page.screenshot({ path: `${OUT}/05-giant-word.png` })
check('giant word fills on mobile scroll', !!giant && (giant.filled || giant.color === 'rgb(56, 189, 248)'), JSON.stringify(giant))

// 6. Contact form: floating label + typing works
await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView({ block: 'start' }))
await wait(1200)
const nameInput = await page.$('#contact input')
if (nameInput) {
  await nameInput.tap()
  await page.keyboard.type('בדיקה', { delay: 40 })
  const val = await page.evaluate(() => document.querySelector('#contact input')?.value)
  await page.screenshot({ path: `${OUT}/06-form-typing.png` })
  check('contact form accepts input', val === 'בדיקה', `value="${val}"`)
} else check('contact form accepts input', false, 'input not found')

// 7. Horizontal overflow at multiple scroll depths (390)
let overflow390 = false
const H = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y <= H; y += 800) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y)
  await wait(120)
  const of = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
  if (of) { overflow390 = true; break }
}
check('no horizontal overflow at 390 (all depths)', !overflow390)

// 8. Repeat quick pass at 320
await page.setViewport({ width: 320, height: 900, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 60000 })
await wait(2000)
let overflow320 = false
const H2 = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y <= H2; y += 700) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y)
  await wait(100)
  const of = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
  if (of) { overflow320 = true; break }
}
check('no horizontal overflow at 320 (all depths)', !overflow320)
await page.screenshot({ path: `${OUT}/07-320-bottom.png` })

// 9. Zero console/page errors across the whole session
check('zero console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '))

await browser.close()
const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed}/${results.length} mobile checks passed`)
process.exit(failed ? 1 : 0)
