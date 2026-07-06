/**
 * Verifies the a11y-widget "disable animations" now stops FRAMER (JS) loops,
 * not just CSS — the impeccable audit P2-9 finding.
 * Method: sample the hero CTA shine element's computed transform twice,
 * 600ms apart: moving before the kill switch, frozen after.
 * Also captures a keyboard-focus screenshot on a light surface (focus ring).
 */
import puppeteer from 'puppeteer'

const BASE = 'http://localhost:4173'
const OUT = 'g:/tmp/mediawave-audit/wave-lab/impeccable-audit'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await page.setViewport({ width: 1440, height: 900 })
await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
await wait(1500)

// The hero primary CTA shine span (first m.span inside the #hero primary link)
const getShineTransform = () =>
  page.evaluate(() => {
    const cta = document.querySelector('#hero a[href="#contact"] span')
    return cta ? getComputedStyle(cta).transform : 'MISSING'
  })

const a1 = await getShineTransform()
await wait(600)
const a2 = await getShineTransform()
const aliveBefore = a1 !== a2

// Flip the kill switch exactly like the widget does
await page.evaluate(() => document.documentElement.classList.add('disable-animations'))
await wait(800) // let the MutationObserver -> setState -> framer stop settle

const b1 = await getShineTransform()
await wait(600)
const b2 = await getShineTransform()
const frozenAfter = b1 === b2

console.log(`shine before kill: ${aliveBefore ? 'ANIMATING (ok)' : 'static (?)'} [${a1 !== 'MISSING' ? 'found' : 'MISSING'}]`)
console.log(`shine after kill:  ${frozenAfter ? 'FROZEN (ok)' : 'STILL MOVING (fail!)'}`)

// Focus-ring visual on a light surface: Tab to the first blog card link
await page.evaluate(() => document.documentElement.classList.remove('disable-animations'))
await page.goto(BASE + '/blog', { waitUntil: 'networkidle0' })
await wait(800)
for (let i = 0; i < 6; i++) await page.keyboard.press('Tab')
await wait(300)
await page.screenshot({ path: OUT + '/focus-ring-blog.png' })

// Focus-ring on dark surface: first Tab stop on home (header link)
await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
await wait(800)
for (let i = 0; i < 3; i++) await page.keyboard.press('Tab')
await wait(300)
await page.screenshot({ path: OUT + '/focus-ring-header.png', clip: { x: 0, y: 0, width: 1440, height: 220 } })

await browser.close()
const pass = aliveBefore && frozenAfter
console.log(pass ? 'PASS' : 'FAIL')
process.exit(pass ? 0 : 1)
