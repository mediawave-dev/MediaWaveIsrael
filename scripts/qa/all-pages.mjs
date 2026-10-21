// all-pages: viewport frames of every route (motion on, consent stored, the lead popup off), plus
// per-page facts: sideways overflow, text under 12px, tap targets under 44px, axe violations
// (WCAG 2.0-2.2 A/AA), the heading outline, colours in use, page errors.
//   node scripts/qa/all-pages.mjs <base> <out dir> <WxH> [step fraction=0.9] [max frames=8] [--routes /a,/b]
// Output: <out>/<slug>-NN.jpg and <out>/report.json (outside the repo by default: G:/tmp/sotd/...).
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const require = createRequire(join(ROOT, 'package.json'))
const puppeteer = require('puppeteer')
const AXE = readFileSync(join(ROOT, 'node_modules/axe-core/axe.min.js'), 'utf8')

const args = process.argv.slice(2)
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null }
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')))
const [base, out, size, stepArg, maxArg] = pos
const [W, H] = size.split('x').map(Number)
const STEP = Number(stepArg) || 0.9
const MAX = Number(maxArg) || 8
const ALL = ['/', '/services/building-websites', '/services/landing-pages', '/services/seo-promotion', '/services/chatbots', '/services/video-editing', '/services/memory-videos', '/portfolio/memory-videos', '/terms', '/privacy', '/accessibility', '/no-such-page']
const ROUTES = flag('--routes') ? flag('--routes').split(',') : ALL
process.env.TEMP ||= 'G:/tmp/temp'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
const report = []
for (const route of ROUTES) {
  const page = await browser.newPage()
  await page.setViewport({ width: W, height: H, deviceScaleFactor: W < 768 ? 2 : 1, isMobile: W < 768, hasTouch: W < 1100 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'rejected'); sessionStorage.setItem('leadModalClosed', 'true') } catch { /* private mode */ } })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 160)))
  await page.goto(base.replace(/\/$/, '') + route + (route.includes('?') ? '&' : '?') + 'lead=off', { waitUntil: 'load', timeout: 90000 })
  await new Promise((r) => setTimeout(r, 2500))
  const slug = route.replace(/[/?=&]/g, '_').replace(/^_/, '') || 'home'
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  const frames = []
  for (let i = 0, y = 0; i < MAX; i++) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await new Promise((r) => setTimeout(r, 800))
    const p = join(out, `${slug}-${String(i).padStart(2, '0')}.jpg`)
    await page.screenshot({ path: p, type: 'jpeg', quality: 62, captureBeyondViewport: false })
    frames.push(p)
    if (y + H >= total) break
    y = Math.min(total - H, Math.round(y + H * STEP))
  }
  const facts = await page.evaluate(() => {
    const vis = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05 && r.width > 0 && r.height > 0 }
    const small = new Set(); const colors = {}; const bgs = {}
    for (const el of document.querySelectorAll('main *')) {
      if (!vis(el)) continue
      const cs = getComputedStyle(el)
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (own) { colors[cs.color] = (colors[cs.color] || 0) + 1; if (parseFloat(cs.fontSize) < 12) small.add(el.tagName + ' ' + cs.fontSize + ' ' + el.textContent.trim().slice(0, 30)) }
      if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') bgs[cs.backgroundColor] = (bgs[cs.backgroundColor] || 0) + 1
    }
    const targets = [...document.querySelectorAll('main a[href], main button, main input, main summary')].filter(vis).map((el) => { const r = el.getBoundingClientRect(); return { t: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) } }).filter((t) => t.h < 44 || t.w < 44)
    const heads = [...document.querySelectorAll('main h1, main h2, main h3')].map((h) => h.tagName + ' ' + h.textContent.trim().slice(0, 40))
    const main = document.querySelector('main')
    const h1 = document.querySelector('main h1')
    return { overflowX: document.documentElement.scrollWidth - innerWidth, small: [...small].slice(0, 8), colors, bgs, targets: targets.slice(0, 12), heads: heads.slice(0, 16), mainBg: main ? getComputedStyle(main).backgroundColor : null, bodyBg: getComputedStyle(document.body).backgroundColor, bodyFont: main ? getComputedStyle(main).fontFamily.slice(0, 40) : null, h1Font: h1 ? getComputedStyle(h1).fontFamily.slice(0, 40) : null, title: document.title }
  })
  await page.addScriptTag({ content: AXE })
  const axe = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations'] })).violations.map((v) => `${v.id} x${v.nodes.length}: ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`))
  report.push({ route, total, frames: frames.length, ...facts, axe, errors })
  console.log(`${route}  h ${total}  frames ${frames.length}  overflowX ${facts.overflowX}  axe ${axe.length}  small ${facts.small.length}  targets<44 ${facts.targets.length}  bodyBg ${facts.bodyBg}  errors ${errors.length}`)
  await page.close()
}
await browser.close()
writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 1))
