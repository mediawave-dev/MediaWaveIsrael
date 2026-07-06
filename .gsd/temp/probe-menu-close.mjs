import puppeteer from 'puppeteer'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.emulate({
  viewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1',
})
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 60000 })
await wait(2000)

const panelSel = 'div[class*="fixed"][class*="right-0"][class*="bottom-0"]'

// open
await p.tap('button[aria-label="פתח תפריט"]')
await wait(900)
console.log('after open: panel exists =', await p.$(panelSel) !== null)

// close via the X inside the panel (last matching close button)
await p.evaluate(() => {
  const btns = [...document.querySelectorAll('button[aria-label="סגור תפריט"]')]
  btns[btns.length - 1]?.click()
})
await wait(1200)
console.log('after X close (1.2s): panel gone =', await p.$(panelSel) === null)

// reopen, close via backdrop tap
await p.tap('button[aria-label="פתח תפריט"]')
await wait(900)
await p.touchscreen.tap(30, 700)
await wait(1200)
console.log('after backdrop close (1.2s): panel gone =', await p.$(panelSel) === null)

// reopen, close via the HAMBURGER itself (what the failed suite check did)
await p.tap('button[aria-label="פתח תפריט"]')
await wait(900)
await p.tap('button[aria-label="סגור תפריט"]')
await wait(1200)
console.log('after hamburger toggle close (1.2s): panel gone =', await p.$(panelSel) === null)

await b.close()
