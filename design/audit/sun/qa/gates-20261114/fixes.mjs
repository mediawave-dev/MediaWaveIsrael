// Checks each fix from the pre-production review on the built site.
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const BASE = process.argv[2] || 'http://localhost:5189'
const b = await puppeteer.launch({ headless: 'new' })
const page = async (w = 390, h = 844) => { const p = await b.newPage(); await p.setViewport({ width: w, height: h }); await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]); return p }
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const out = {}
// 2. the inner pages' chunk fails twice: the header and footer stay, the page says what to do
{ const p = await page(); await p.setRequestInterception(true)
  p.on('request', (r) => (/\/assets\/pages-[^/]+\.js/.test(r.url()) ? r.abort() : r.continue()))
  await p.goto(BASE + '/services/landing-pages/', { waitUntil: 'networkidle2' }); await wait(6000)
  out.chunkFail = await p.evaluate(() => ({ oops: !!document.querySelector('.oops'), header: !!document.querySelector('.pin'), footer: !!document.querySelector('.foot'), url: location.pathname, text: document.querySelector('.oops h1')?.textContent }))
  await p.close() }
// 4. ?calm=1 stops the CSS loops
{ const p = await page(); await p.goto(BASE + '/?calm=1', { waitUntil: 'networkidle2' }); await wait(2500)
  out.calm = await p.evaluate(() => { const a = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).animationName : 'none-found' }
    return { cls: document.documentElement.classList.contains('calm'), buoy: a('.buoy'), run: a('.tide__run'), mark: a('.pin .mw-logo [data-part="mark"] path') } })
  await p.close() }
{ const p = await page(); await p.goto(BASE + '/', { waitUntil: 'networkidle2' }); await wait(2500)
  out.notCalm = await p.evaluate(() => getComputedStyle(document.querySelector('.buoy')).animationName); await p.close() }
// 8. the accessibility panel on a phone on its side
{ const p = await page(667, 375); await p.goto(BASE + '/?calm=1', { waitUntil: 'networkidle2' }); await wait(1500)
  const btn = await p.$('[aria-label*="נגישות"]'); if (btn) await btn.click(); await wait(500)
  out.panel = await p.evaluate(() => { const a = document.querySelector('.a11y'); if (!a) return 'no panel'; const r = a.getBoundingClientRect(); return { bottom: Math.round(r.bottom), vh: innerHeight, scrolls: a.scrollHeight > a.clientHeight, overflowY: getComputedStyle(a).overflowY } })
  await p.close() }
// 5. the form's status is in the accessibility tree while empty
{ const p = await page(); await p.goto(BASE + '/?calm=1', { waitUntil: 'networkidle2' }); await wait(1500)
  out.status = await p.evaluate(() => { const s = document.querySelector('.form__status'); const c = getComputedStyle(s); return { display: c.display, role: s.getAttribute('role'), w: s.getBoundingClientRect().width } })
  // 11. the corner after a reload in the middle of the page
  await p.evaluate(() => window.scrollTo(0, 700)); await wait(800); await p.reload({ waitUntil: 'domcontentloaded' })
  const seq = []; for (let i = 0; i < 12; i++) { seq.push(await p.evaluate(() => [Math.round(scrollY), getComputedStyle(document.querySelector('.pin')).getPropertyValue('--p')])); await wait(120) }
  out.foldAfterReload = seq.map((x) => x.join(':')).join(' ')
  await p.close() }
// 12. landing on /#contact: the circle stays as painted
{ const p = await page(); await p.goto(BASE + '/#contact', { waitUntil: 'networkidle2' }); await wait(3500)
  out.contact = await p.evaluate(() => { const c = document.querySelector('.contact'); return { isIn: c.classList.contains('is-in'), discOpacity: getComputedStyle(c.querySelector('.contact__disc')).opacity, top: Math.round(c.getBoundingClientRect().top) } })
  await p.close() }
// 23. the hidden WhatsApp corner is out of the screen reader's way at the top
{ const p = await page(); await p.goto(BASE + '/?calm=1', { waitUntil: 'networkidle2' }); await wait(1500)
  out.tab = await p.evaluate(() => document.querySelector('.tab').getAttribute('aria-hidden'))
  await p.evaluate(() => window.scrollTo(0, 1200)); await wait(600)
  out.tabPast = await p.evaluate(() => document.querySelector('.tab').getAttribute('aria-hidden'))
  await p.close() }
// 6. "רק חיוניות": no events are sent
{ const p = await page(); const ev = []; p.on('request', (r) => { if (r.url().includes('/api/event')) ev.push(r.url()) })
  await p.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'rejected') } catch {} })
  await p.goto(BASE + '/?calm=1', { waitUntil: 'networkidle2' }); await wait(2000)
  out.eventsWhenDeclined = ev.length; await p.close() }
await b.close()
console.log(JSON.stringify(out, null, 1))
