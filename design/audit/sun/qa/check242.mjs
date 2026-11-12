// Targeted checks of the D242 fixes on the built site.
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const base = process.argv[2] || 'http://localhost:5189'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await puppeteer.launch({ headless: 'new' })
const out = {}
const open = async (path, w, h, touch = false, consent = true) => {
  const p = await b.newPage()
  await p.setViewport({ width: w, height: h, isMobile: touch, hasTouch: touch })
  await p.evaluateOnNewDocument((c) => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null }; if (c) { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} } }, consent)
  await p.goto(base + path, { waitUntil: 'networkidle2' })
  await wait(3200)
  return p
}

// F01: every card of the deck is reachable on a phone, and no picture repeats in the first desktop view
for (const [w, h] of [[390, 844], [1440, 900], [1920, 1080]]) {
  const p = await open('/?reduce=1', w, h, w < 600)
  out['F01 wheel ' + w] = await p.evaluate(() => {
    const vis = [...document.querySelectorAll('.wheel__slot')].filter((s) => getComputedStyle(s).display !== 'none')
    const id = (s) => { const i = s.querySelector('img'); return i ? i.getAttribute('src').replace('/work/', '').replace('.webp', '') : 'next' }
    const inView = vis.filter((s) => { const r = s.getBoundingClientRect(); return r.right > 0 && r.left < innerWidth && r.top < innerHeight })
    const ids = inView.map(id)
    return { shown: vis.length, distinctReachable: new Set(vis.map(id)).size, firstView: ids.length, repeatsInFirstView: ids.length - new Set(ids).size }
  })
  await p.close()
}

// F04, F28, F29: no single word alone on a line
{
  const p = await open('/?reduce=1', 390, 844, true)
  out['F04 h1 lines'] = await p.evaluate(() => {
    const m = document.querySelector('.h1'); const r = document.createRange(); r.selectNodeContents(m)
    const rects = [...r.getClientRects()]; const tops = [...new Set(rects.map((x) => Math.round(x.top)))]
    return { lines: tops.length, widths: tops.map((t) => Math.round(rects.filter((x) => Math.round(x.top) === t).reduce((a, x) => a + x.width, 0))) }
  })
  out['F28 date'] = await p.evaluate(() => { const s = document.querySelector('.launch strong'); return s ? { text: s.textContent, lines: s.getClientRects().length } : 'no slip' })
  await p.close()
}

// F07 + F08 + F09 + F11: the form
for (const path of ['/', '/services/video-editing/', '/services/chatbots/']) {
  const p = await open(path, 390, 844, true)
  await p.evaluate(() => document.getElementById('contact').scrollIntoView())
  await wait(400)
  const r = {}
  r.button = await p.$eval('.form button[type=submit]', (e) => e.textContent.trim())
  await p.click('.form button[type=submit]')
  r.errorsAfterEmpty = (await p.$$('.field__err')).length
  await p.type('#lead-name', 'דנה')
  r.errorsAfterTypingName = (await p.$$('.field__err')).length
  await p.type('#lead-phone', '+972 52-123 4567')
  r.errorsAfterTypingPhone = (await p.$$('.field__err')).length
  await p.click('.form button[type=submit]')
  await wait(200)
  r.sent = await p.evaluate(() => decodeURIComponent((window.__opened[0] || 'NOTHING OPENED').split('text=')[1] || '').replace(/\n/g, ' / '))
  out['form ' + path] = r
  await p.close()
}

// F02 + F03: the cookie note and the corner tab on a first visit
{
  const p = await open('/?reduce=1', 390, 700, true, false)
  const box = (sel) => p.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)] }).catch(() => null)
  const r = { top: { consent: await box('.consent'), note: await box('.hero__note'), second: await box('.hero__actions .btn--line') } }
  await p.evaluate(() => window.scrollTo(0, 900)); await wait(900)
  r.scrolled = { consent: await box('.consent'), tab: await box('.tab') }
  // a tap in the tab's empty top-left corner must reach what is under it
  r.emptyCornerHits = await p.evaluate(() => { const t = document.querySelector('.tab').getBoundingClientRect(); const el = document.elementFromPoint(t.right - 6, t.top + 6); return el ? (el.closest('.tab') ? 'TAB' : el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0]) : 'none' })
  r.labelHits = await p.evaluate(() => { const s = document.querySelector('.tab span').getBoundingClientRect(); const el = document.elementFromPoint(s.left + s.width / 2, s.top + s.height / 2); return el && el.closest('.tab') ? 'TAB' : 'not the tab' })
  out['F02 F03'] = r
  await p.close()
}

// F06: a hover skin only under a hovering pointer
{
  const p = await open('/?reduce=1', 390, 844, true)
  out['F06 hover rules outside (hover: hover)'] = await p.evaluate(() => {
    let n = 0
    for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules } catch { continue }
      for (const r of rules) if (r.selectorText && /:hover/.test(r.selectorText)) n++ }
    return n
  })
  await p.close()
}

// F15, F16: inner pages
{
  const p = await open('/nope', 1440, 900)
  out['F15 404'] = await p.evaluate(() => { const h = document.querySelector('.phero').getBoundingClientRect(); const f = document.querySelector('.foot').getBoundingClientRect(); return { heroBottomPlusWave: Math.round(h.bottom + parseFloat(getComputedStyle(document.querySelector('.phero'), '::after').height)), footTop: Math.round(f.top) } })
  await p.close()
  for (const w of [390, 1440]) {
    const q = await open('/services/landing-pages/', w, 900, w < 600)
    out['F16 gap ' + w] = await q.evaluate(() => {
      const faq = [...document.querySelectorAll('.band--line')][0]; const prev = faq.previousElementSibling
      const lastText = prev.querySelector('.ticks li:last-child').getBoundingClientRect().bottom
      const h2 = faq.querySelector('.h2').getBoundingClientRect().top
      return { gapBetweenPriceAndQuestions: Math.round(h2 - lastText), pills: document.querySelectorAll('.phero .tags').length, h2s: [...document.querySelectorAll('.h2')].map((e) => (e.firstChild && e.firstChild.nodeType === 3 ? 'light+bold' : 'bold') + ': ' + e.textContent).slice(0, 6) }
    })
    await q.close()
  }
}

// F19: the hero on a short laptop screen
for (const [w, h] of [[1440, 700], [1366, 657], [1440, 900]]) {
  const p = await open('/?reduce=1', w, h)
  out[`F19 ${w}x${h}`] = await p.evaluate(() => { const wh = document.querySelector('.wheel').getBoundingClientRect(); return { wheelTop: Math.round(wh.top), wheelVisiblePx: Math.round(innerHeight - wh.top), h1: getComputedStyle(document.querySelector('.h1')).fontSize } })
  await p.close()
}

// F20: larger text at 1040 and 1100
for (const w of [1040, 1100, 1280]) {
  const p = await open('/?reduce=1', w, 800)
  await p.evaluate(() => { document.documentElement.dataset.text = '2' }); await wait(300)
  out['F20 text XL ' + w] = await p.evaluate(() => ({ sideways: document.documentElement.scrollWidth - innerWidth, headerHeight: Math.round(document.querySelector('.head__in').getBoundingClientRect().height), navShown: getComputedStyle(document.querySelector('.head__nav')).display }))
  await p.close()
}

// F05: an inner page read half way down is not thrown to the top by the app's boot
{
  const p = await b.newPage()
  await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await p.goto(base + '/services/landing-pages/', { waitUntil: 'domcontentloaded' })
  await p.evaluate(() => window.scrollTo(0, 900))
  await wait(3500)
  out['F05 scroll kept'] = await p.evaluate(() => Math.round(window.scrollY))
  await p.close()
}
// F18 redirects are Cloudflare's: checked on the deployed preview, not here
console.log(JSON.stringify(out, null, 1))
await b.close()
