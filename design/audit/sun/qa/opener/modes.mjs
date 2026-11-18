// D296: when the opener plays and when it must not, on the built site. node modes.mjs [base]
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const base = process.argv[2] || 'http://localhost:5189'
const GPU = ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl']
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const state = (p) => p.evaluate(() => ({
  intro: document.documentElement.classList.contains('mw-intro'), cover: document.documentElement.classList.contains('mw-intro-cover'),
  opener: !!document.querySelector('.opener'), live: !!document.querySelector('.opener[data-live]'), seen: sessionStorage.getItem('mw-wave-intro'),
  h1: document.querySelector('h1')?.textContent?.slice(0, 22), say: document.querySelector('.opener__sr')?.textContent, sound: document.querySelector('.opener')?.dataset.sound,
  label: document.querySelector('.opener__sound span')?.textContent, ui: document.querySelector('.opener')?.classList.contains('opener--ui'), t: Math.round(performance.now()),
}))
let bad = 0
const say = (name, ok, extra) => { if (!ok) bad++; console.log(ok ? 'ok  ' : 'FAIL', name, extra ? JSON.stringify(extra) : '') }

// a real visitor: Chrome that does not say it is driven
const real = await puppeteer.launch({ headless: 'new', args: [...GPU, '--disable-blink-features=AutomationControlled'] })
{
  const p = await real.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (c) => { if (c.type() === 'error' && !/404|Failed to load resource/.test(c.text())) errs.push(c.text()) })
  await p.goto(base + '/', { waitUntil: 'domcontentloaded' })
  const s0 = await state(p)
  say('first visit: cover on from the start', s0.intro && s0.cover, s0)
  await p.waitForSelector('.opener[data-live]', { timeout: 8000 }).catch(() => {})
  const s1 = await state(p)
  say('first visit: the sea goes live, the sound waits for a touch', s1.live && s1.sound === 'armed', { ms: s1.t, say: s1.say, label: s1.label })
  // a touch on the water: the sound comes on, and the opener goes on playing (a touch is not "skip")
  await sleep(1400); await p.touchscreen.tap(195, 780); await sleep(500)
  const s1b = await state(p)
  say('a touch on the water: sound on, still playing', s1b.sound === 'on' && s1b.label === 'Sound on' && s1b.cover && s1b.opener, s1b)
  const sb = await p.evaluate(() => { const r = document.querySelector('.opener__sound').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2] })
  await p.touchscreen.tap(sb[0], sb[1]); await sleep(300)
  const s1c = await state(p)
  say('the sound control: off again', s1c.sound === 'off' && s1c.label === 'Sound off', s1c)
  await sleep(2600); await p.screenshot({ path: 'out/dist-phone-mid.png' })
  await p.waitForFunction(() => !document.documentElement.classList.contains('mw-intro'), { timeout: 15000 }).catch(() => {})
  await sleep(900)
  const s2 = await state(p)
  say('first visit: it ends, nothing left behind', !s2.intro && !s2.cover && !s2.opener && s2.seen === '1', s2)
  say('first visit: no errors', errs.length === 0, errs)
  await p.screenshot({ path: 'out/dist-phone-after.png' })
  await p.reload({ waitUntil: 'domcontentloaded' }); await sleep(600)
  const s3 = await state(p)
  say('same visit, again: no opener', !s3.intro && !s3.opener, s3)
  await p.close()
}
for (const [name, url] of [['?calm=1', '/?calm=1'], ['?reduce=1', '/?reduce=1'], ['an inner page', '/privacy/']]) {
  const ctx = await real.createBrowserContext(); const p = await ctx.newPage()
  await p.goto(base + url, { waitUntil: 'domcontentloaded' }); await sleep(700)
  const s = await state(p)
  say(name + ': no opener', !s.intro && !s.cover && !s.opener, s); await ctx.close()
}
{ // "ללא אנימציות" switched on in the middle: it stops at once
  const ctx = await real.createBrowserContext(); const p = await ctx.newPage(); await p.setViewport({ width: 1280, height: 800 })
  await p.goto(base + '/', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.opener[data-live]', { timeout: 8000 }).catch(() => {}); await sleep(1500)
  await p.evaluate(() => document.documentElement.classList.add('disable-animations')); await sleep(300)
  const s = await state(p)
  say('animations switched off mid-way: gone at once', !s.intro && !s.cover && !s.opener, s); await ctx.close()
}
{ // a key sends the last wave; the page is usable right after
  const ctx = await real.createBrowserContext(); const p = await ctx.newPage(); await p.setViewport({ width: 1280, height: 800 })
  await p.goto(base + '/', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.opener[data-live]', { timeout: 8000 }).catch(() => {}); await sleep(1200)
  const t0 = Date.now(); await p.keyboard.press('Escape')
  await p.waitForFunction(() => !document.documentElement.classList.contains('mw-intro-cover'), { timeout: 6000 }).catch(() => {})
  const open = Date.now() - t0
  await p.waitForFunction(() => !document.documentElement.classList.contains('mw-intro'), { timeout: 8000 }).catch(() => {})
  say('Escape: the page is uncovered within 1.3 s and the opener ends', open < 1300 && !(await state(p)).intro, { openMs: open, endMs: Date.now() - t0 }); await ctx.close()
}
{ // a browser whose font requests fail (Android has no Arial for the fallback face): the sea still comes up
  const ctx = await real.createBrowserContext(); const p = await ctx.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await p.evaluateOnNewDocument(() => { document.fonts.load = () => Promise.reject(new DOMException('A network error occurred.', 'NetworkError')) })
  await p.goto(base + '/', { waitUntil: 'domcontentloaded' })
  const ok = await p.waitForSelector('.opener[data-go]', { timeout: 12000 }).then(() => true, () => false)
  say('font requests fail: the opener still plays', ok, await state(p)); await ctx.close()
}
{ // "Skip" sends the last wave
  const ctx = await real.createBrowserContext(); const p = await ctx.newPage(); await p.setViewport({ width: 1280, height: 800 })
  await p.goto(base + '/', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.opener.opener--ui', { timeout: 9000 }).catch(() => {}); await sleep(900)
  const t0 = Date.now(); await p.click('.opener__skip')
  await p.waitForFunction(() => !document.documentElement.classList.contains('mw-intro-cover'), { timeout: 6000 }).catch(() => {})
  const open = Date.now() - t0
  await p.waitForFunction(() => !document.documentElement.classList.contains('mw-intro'), { timeout: 8000 }).catch(() => {})
  say('Skip: the page is uncovered within 1.3 s and the opener ends', open < 1300 && !(await state(p)).intro, { openMs: open, endMs: Date.now() - t0 }); await ctx.close()
}
{ // no WebGL: the page, no cover
  const b = await puppeteer.launch({ headless: 'new', args: ['--disable-gpu', '--disable-webgl', '--disable-3d-apis', '--disable-blink-features=AutomationControlled'] })
  const p = await b.newPage(); await p.goto(base + '/', { waitUntil: 'domcontentloaded' }); await sleep(1500)
  const s = await state(p)
  say('no WebGL: no cover, the page is there', !s.cover && !s.opener && !!s.h1, s); await b.close()
}
await real.close()
{ // a driven browser (the gates, Lighthouse): never
  const b = await puppeteer.launch({ headless: 'new' }); const p = await b.newPage()
  await p.goto(base + '/', { waitUntil: 'domcontentloaded' }); await sleep(700)
  const s = await state(p)
  say('a driven browser: no opener', !s.intro && !s.opener, s); await b.close()
}
console.log(bad ? `${bad} FAILED` : 'all passed')
