// A tap on the wheel holds it; a second tap lets it go; a drag still turns it; the page still scrolls over it.
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const base = process.argv[2] || 'http://localhost:5189'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
await p.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
await p.goto(base + '/', { waitUntil: 'networkidle2' })
await wait(4500) // the opening is over
const ang = () => p.$eval('.wheel__ring', (e) => parseFloat((e.style.transform.match(/rotate\(([-\d.]+)deg/) || [])[1]))
const moving = async (ms = 900) => { const a = await ang(); await wait(ms); return Math.abs((await ang()) - a) > 0.5 }
const box = await (await p.$('.wheel')).boundingBox()
const x = box.x + box.width / 2, y = box.y + 120
const r = {}
r.driftsAtRest = await moving()
await p.touchscreen.tap(x, y); await wait(300)
r.heldAfterTap = !(await moving())
await wait(2500)
r.stillHeldAfter3s = !(await moving())
await p.touchscreen.tap(x, y); await wait(300)
r.movesAfterSecondTap = await moving()
await p.touchscreen.tap(x, y); await wait(6500)
r.movesAgainByItselfAfter6s = await moving()
// a drag turns it
const a0 = await ang()
await p.touchscreen.touchStart(x, y); await p.touchscreen.touchMove(x + 40, y); await p.touchscreen.touchMove(x + 120, y); await p.touchscreen.touchEnd()
await wait(200)
r.dragTurnedBy = Math.round(((await ang()) - a0) * 10) / 10
// a vertical swipe over the wheel scrolls the page
const s0 = await p.evaluate(() => scrollY)
await p.touchscreen.touchStart(x, y); await p.touchscreen.touchMove(x, y - 80); await p.touchscreen.touchMove(x, y - 200); await p.touchscreen.touchEnd()
await wait(500)
r.pageScrolledBy = (await p.evaluate(() => scrollY)) - s0
console.log(JSON.stringify(r, null, 1))
await b.close()
