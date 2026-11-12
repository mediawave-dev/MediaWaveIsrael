// The site in Safari's engine (WebKit, through Playwright) at iPhone size: errors, sideways scroll, fonts,
// the pinned corner's fold, the wheel's drift, the menu, the form. Images go to ./qa.
// node webkit-check.mjs <base> [route ...]
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { webkit, devices } = require('playwright')
const base = process.argv[2] || 'http://localhost:5189'
const routes = process.argv.slice(3).length ? process.argv.slice(3) : ['/', '/services/landing-pages/', '/services/building-websites/', '/privacy/']
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const out = {}
const b = await webkit.launch()
for (const [name, device] of [['iphone', devices['iPhone 14']], ['iphone-se', devices['iPhone SE']]]) {
  const ctx = await b.newContext({ ...device, locale: 'he-IL' })
  await ctx.addInitScript(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
  for (const route of routes) {
    const p = await ctx.newPage()
    const errs = []
    p.on('console', (m) => { if (m.type() === 'error' && !/api\/event/.test(m.text())) errs.push(m.text().slice(0, 200)) })
    p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message.slice(0, 200)))
    await p.goto(base + route + '?reduce=1', { waitUntil: 'networkidle' })
    await p.evaluate(() => document.fonts.ready); await wait(600)
    const key = `${name} ${route}`
    const r = { errors: errs }
    r.top = await p.evaluate(() => ({
      sw: document.documentElement.scrollWidth, iw: innerWidth,
      fontsFailed: [...document.fonts].filter((f) => f.status === 'error').map((f) => f.family + ' ' + f.weight),
      h1: (() => { const h = document.querySelector('h1'); const c = getComputedStyle(h); return c.fontFamily.split(',')[0] + ' ' + c.fontSize })(),
      pin: (() => { const e = document.querySelector('.pin__blob'); if (!e) return null; const q = e.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.width), Math.round(q.height)] })(),
      logo: (() => { const e = document.querySelector('.pin__clip'); if (!e) return null; return Math.round(e.getBoundingClientRect().width) })(),
    }))
    const slug = (name + route).replace(/[^a-z0-9]+/gi, '-').replace(/-$/, '')
    await p.screenshot({ path: `qa/wk-${slug}-top.png` })
    // the fold
    await p.evaluate(() => window.scrollTo(0, 400)); await wait(900)
    r.folded = await p.evaluate(() => ({
      p: document.querySelector('.pin')?.style.getPropertyValue('--p'),
      blob: (() => { const e = document.querySelector('.pin__blob'); if (!e) return null; const q = e.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.width), Math.round(q.height)] })(),
      clip: Math.round(document.querySelector('.pin__clip')?.getBoundingClientRect().width || 0),
      menuVisible: getComputedStyle(document.querySelector('.pin__menu')).visibility,
      mask: getComputedStyle(document.querySelector('.pin__clip')).webkitMaskImage?.slice(0, 40),
    }))
    await p.screenshot({ path: `qa/wk-${slug}-folded.png` })
    // the menu
    await p.tap('.pin__menu'); await wait(600)
    r.menu = await p.evaluate(() => ({ open: !document.getElementById('sheet').hidden, rows: document.querySelectorAll('#sheet nav > *').length }))
    await p.screenshot({ path: `qa/wk-${slug}-menu.png` })
    await p.tap('.pin__menu'); await wait(400)
    r.menuClosed = await p.evaluate(() => document.getElementById('sheet').hidden)
    // the contact circle and the form
    if (await p.$('#contact')) {
      await p.evaluate(() => document.getElementById('contact').scrollIntoView()); await wait(700)
      await p.screenshot({ path: `qa/wk-${slug}-contact.png` })
      r.circle = await p.evaluate(() => { const d = document.querySelector('.contact__disc').getBoundingClientRect(); const f = document.querySelector('.form').getBoundingClientRect(); return { disc: [Math.round(d.left), Math.round(d.width)], formInside: f.left >= 0 && f.right <= innerWidth, sw: document.documentElement.scrollWidth } })
      await p.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null } })
      await p.tap('.form button[type=submit]'); await wait(300)
      r.formErrors = await p.$$eval('.field__err', (e) => e.length)
      await p.fill('#lead-name', 'בדיקה'); await p.fill('#lead-phone', '0501234567')
      await p.tap('.form button[type=submit]'); await wait(900)
      r.form = await p.evaluate(() => ({ opened: (window.__opened[0] || '').slice(0, 40), status: document.querySelector('.form__status')?.textContent }))
    }
    out[key] = r
    await p.close()
  }
  // the wheel moves on its own and under a finger (home, no ?reduce)
  const p = await ctx.newPage()
  await p.goto(base + '/', { waitUntil: 'networkidle' }); await wait(3500)
  const t1 = await p.evaluate(() => getComputedStyle(document.querySelector('.wheel__ring')).transform)
  await wait(1500)
  const t2 = await p.evaluate(() => getComputedStyle(document.querySelector('.wheel__ring')).transform)
  out[`${name} wheel`] = { drifts: t1 !== t2 }
  await p.screenshot({ path: `qa/wk-${name}-home-live.png` })
  await p.close()
  await ctx.close()
}
await b.close()
console.log(JSON.stringify(out, null, 1))
