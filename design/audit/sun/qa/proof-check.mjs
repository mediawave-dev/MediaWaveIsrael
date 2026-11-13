// node check.mjs [base]  : the proof track's gates on the dev server.
// Per page and width: sideways scroll, targets under 44 px, axe, page errors, whether the placeholder file was
// fetched, how many voices the page shows. Then: the speed link as the prerender writes it, and the page with
// the accessibility panel's largest text and high contrast.
import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const base = process.argv[2] || 'http://localhost:5188'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const PAGES = [
  ['home', '/?reduce=1'],
  ['home demo', '/?proof=demo&reduce=1'],
  ['service demo', '/services/landing-pages/?proof=demo&reduce=1'],
  ['short service demo', '/services/chatbots/?proof=demo&reduce=1'],
]
const b = await puppeteer.launch({ headless: 'new' })
const open = async (w, path, before) => {
  const p = await b.newPage()
  await p.setViewport({ width: w, height: w < 600 ? 844 : 900, isMobile: w < 600, hasTouch: w < 600 })
  await p.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
  if (before) await p.evaluateOnNewDocument(before)
  const errs = [], reqs = []
  p.on('pageerror', (e) => errs.push(e.message))
  p.on('console', (m) => m.type() === 'error' && !/404/.test(m.text()) && errs.push(m.text()))
  p.on('request', (r) => reqs.push(r.url()))
  await p.goto(base + path, { waitUntil: 'networkidle2', timeout: 60000 })
  await wait(1200)
  // every lazy thing gets its turn
  const H = await p.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < H; y += 700) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(80) }
  await p.evaluate(() => window.scrollTo(0, 0)); await wait(300)
  return { p, errs, reqs }
}
let bad = 0
const flag = (ok, s) => { if (!ok) bad++; return (ok ? 'ok   ' : 'FAIL ') + s }
for (const [label, path] of PAGES) {
  for (const w of [320, 390, 1440]) {
    const { p, errs, reqs } = await open(w, path)
    const r = await p.evaluate(() => ({
      over: document.documentElement.scrollWidth - innerWidth,
      small: [...document.querySelectorAll('a,button,summary,select,input')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && e.tabIndex !== -1 && !e.closest('[aria-hidden=true]') && (b.height < 43.5 || b.width < 43.5) && !e.matches('.kind__link') }).map((e) => (e.className || e.tagName) + ':' + (e.textContent || '').trim().slice(0, 18) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)),
      voices: [...document.querySelectorAll('figure.voice')].filter((f) => f.getClientRects().length).length,
      tags: document.querySelectorAll('.proof__tag').length,
      speed: document.querySelector('.check--route a')?.href ?? null,
      // anything of the proof that pokes out of the screen
      out: [...document.querySelectorAll('.proof *, .check *, .sign')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.left < -0.5 || b.right > innerWidth + 0.5) }).length,
    }))
    await p.evaluate(axeSrc)
    const axe = w === 320 ? ['(not run at 320)'] : await p.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map((x) => `${x.id}(${x.nodes.length}): ${x.nodes[0].target} ${(x.nodes[0].any[0]?.message || x.nodes[0].all[0]?.message || '').slice(0, 120)}`))
    const demoFetched = reqs.some((u) => /proof-demo/.test(u))
    const wantDemo = /proof=demo/.test(path)
    console.log(`\n${label} @ ${w}`)
    console.log(' ' + flag(r.over <= 0, `sideways scroll ${r.over}`))
    console.log(' ' + flag(r.out === 0, `proof parts outside the screen ${r.out}`))
    console.log(' ' + flag(r.small.length === 0, `targets under 44 px ${r.small.length} ${r.small.slice(0, 6).join(' | ')}`))
    console.log(' ' + flag(w === 320 || axe.length === 0, `axe ${w === 320 ? axe[0] : axe.length + ' ' + axe.join(' | ')}`))
    console.log(' ' + flag(errs.length === 0, `page errors ${errs.length} ${errs.slice(0, 3).join(' | ')}`))
    console.log(' ' + flag(demoFetched === wantDemo, `placeholder file fetched ${demoFetched}`))
    console.log(' ' + flag(wantDemo ? r.voices >= 1 && r.voices <= 3 && r.tags >= 1 : r.voices === 0 && r.tags === 0, `voices shown ${r.voices}, placeholder marks ${r.tags}`))
    if (label.startsWith('home')) console.log('      speed link ' + r.speed)
    await p.close()
  }
}
// the prerendered page carries the production address
{
  const { p } = await open(390, '/?reduce=1', () => { window.__PRERENDER__ = true })
  const href = await p.evaluate(() => document.querySelector('.check--route a')?.href)
  console.log('\nprerender')
  console.log(' ' + flag(href === 'https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmediawave.co.il%2F&form_factor=mobile', `speed link ${href}`))
  await p.close()
}
// the visitor's own link parameters never travel to Google's tool
{
  const { p } = await open(390, '/?utm_source=test&fbclid=abc123&reduce=1')
  const href = await p.evaluate(() => document.querySelector('.check--route a')?.href)
  console.log(' ' + flag(!/utm|fbclid|reduce/.test(href), `speed link without the visitor's parameters ${href}`))
  await p.close()
}
// largest text and high contrast (the accessibility panel's states), placeholders on
for (const w of [320, 390]) {
  const { p } = await open(w, '/?proof=demo&reduce=1')
  await p.evaluate(() => { document.documentElement.dataset.text = '2'; document.documentElement.classList.add('high-contrast') })
  await wait(500)
  const r = await p.evaluate(() => ({
    over: document.documentElement.scrollWidth - innerWidth,
    bars: [...document.querySelectorAll('figure.voice')].map((f) => getComputedStyle(f).borderInlineStartColor),
    out: [...document.querySelectorAll('.proof *, .check *, .sign')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.left < -0.5 || b.right > innerWidth + 0.5) }).length,
  }))
  console.log(`\nlargest text + high contrast @ ${w}`)
  console.log(' ' + flag(r.over <= 0 && r.out === 0, `sideways scroll ${r.over}, proof parts outside ${r.out}`))
  console.log(' ' + flag(r.bars.every((c) => c === 'rgb(0, 0, 0)'), `bars ${r.bars.join(' ')}`))
  if (w === 390) await p.screenshot({ path: 'qa/hc-390.png', fullPage: true })
  await p.close()
}
console.log(bad ? `\n${bad} FAILED` : '\nall passed')
await b.close()
