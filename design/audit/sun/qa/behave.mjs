import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const base = process.argv[2] || 'http://localhost:5188'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await puppeteer.launch({ headless: 'new' })
const out = {}
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const p = await b.newPage()
  await p.setViewport({ width: w, height: h, isMobile: w < 600, hasTouch: w < 600 })
  await p.evaluateOnNewDocument(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null } })
  const errs = []
  p.on('pageerror', (e) => errs.push(e.message))
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  await p.goto(base + '/', { waitUntil: 'networkidle2' })
  await wait(800)
  const r = {}
  const ring = () => p.$eval('.wheel__ring', (e) => e.style.transform)
  const t1 = await ring()
  await wait(1200)
  const t2 = await ring()
  r.wheelDrift = t1 !== t2 ? 'ok' : `STILL ${t1}`
  const box = await (await p.$('.wheel')).boundingBox()
  await p.mouse.move(box.x + box.width / 2, box.y + 150)
  await p.mouse.down()
  await p.mouse.move(box.x + box.width / 2 + 120, box.y + 150, { steps: 6 })
  await p.mouse.up()
  r.afterDrag = await ring()
  await wait(2600)
  r.consent = !!(await p.$('.consent'))
  if (r.consent) { await p.click('.consent .btn'); r.consentGone = !(await p.$('.consent')) }
  await p.click('button[aria-label="כלי נגישות"]')
  r.a11yOpen = !!(await p.$('.a11y'))
  const opts = await p.$$('.a11y__opt')
  await opts[2].click(); await opts[3].click(); await opts[4].click()
  r.a11y = await p.evaluate(() => [document.documentElement.dataset.text, document.documentElement.className, getComputedStyle(document.documentElement).fontSize, getComputedStyle(document.querySelector('.hero')).backgroundColor])
  await wait(300)
  const s1 = await ring()
  await wait(700)
  const s2 = await ring()
  r.stillWhenStopped = s1 === s2
  r.overflowAtXL = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  await opts[0].click(); await opts[3].click(); await opts[4].click()
  await p.keyboard.press('Escape')
  r.a11yClosed = !(await p.$('.a11y'))
  if (w < 600) {
    await p.click('.head__menu')
    r.menu = await p.$eval('#sheet', (e) => !e.hidden && e.querySelectorAll('a').length)
    await p.click('#sheet nav a[href="/#process"]')
    await wait(1200)
    r.menuNav = await p.evaluate(() => [location.hash, Math.round(document.getElementById('process').getBoundingClientRect().top)])
  }
  await p.evaluate(() => document.getElementById('contact').scrollIntoView())
  await wait(900)
  await p.click('.form button[type=submit]')
  r.formErrors = await p.$$eval('.field__err', (e) => e.map((x) => x.textContent))
  await p.type('#lead-name', 'בדיקה')
  await p.type('#lead-phone', '0501234567')
  await p.click('.form button[type=submit]')
  await wait(200)
  r.formOpened = await p.evaluate(() => decodeURIComponent(window.__opened[0] || '').slice(0, 140))
  r.formStatus = await p.$eval('.form__status', (e) => e.textContent)
  await p.click('.faq__item summary')
  r.faqOpen = await p.$eval('.faq__item', (e) => e.open)
  r.smallTargets = await p.evaluate(() => [...document.querySelectorAll('a,button,summary,select,input')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && e.tabIndex !== -1 && !e.closest('[aria-hidden=true]') && (b.height < 43.5 || b.width < 43.5) }).map((e) => (e.className || e.tagName) + ':' + (e.textContent || '').trim().slice(0, 18) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)).slice(0, 14))
  for (const path of ['/', '/services/building-websites/', '/privacy/']) {
    await p.goto(base + path, { waitUntil: 'networkidle2' })
    await wait(500)
    await p.evaluate(axeSrc)
    r['axe ' + path] = await p.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map((x) => `${x.id}(${x.nodes.length}): ${x.nodes[0].target} ${(x.nodes[0].any[0]?.message || x.nodes[0].all[0]?.message || '').slice(0, 120)}`))
  }
  r.errors = errs
  out[w] = r
  await p.close()
}
console.log(JSON.stringify(out, null, 1))
await b.close()
