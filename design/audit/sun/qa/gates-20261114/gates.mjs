// Pre-production gates for the sun site (G1, G5, G6, G7 partly, G9): every built route, raw HTML and rendered page.
//   node gates.mjs <base> <distDir>
import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const require = createRequire(ROOT + 'package.json')
const puppeteer = require('puppeteer')
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const BASE = process.argv[2] || 'http://localhost:5189'
const DIST = process.argv[3] || ROOT + 'dist'
const routes = []
const walk = (d) => { for (const n of fs.readdirSync(d)) { const p = path.join(d, n); if (fs.statSync(p).isDirectory()) { if (n !== 'studio' && n !== 'assets') walk(p) } else if (n === 'index.html') routes.push('/' + path.relative(DIST, d).replace(/\\/g, '/') + (d === DIST ? '' : '/')) } }
walk(DIST)
routes.sort()
const out = { routes: {}, links: {}, sitemap: {}, notFound: {} }
const linkSet = new Set()
// ---- G1 / G6 / G9: the raw HTML, as a crawler without JavaScript gets it
for (const r of routes) {
  const file = path.join(DIST, r, 'index.html'), html = fs.readFileSync(file, 'utf8')
  const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim()
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => strip(m[1]))
  const canon = [...html.matchAll(/<link[^>]+rel="canonical"[^>]*>/g)].map((m) => (/href="([^"]+)"/.exec(m[0]) || [])[1])
  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => { try { const j = JSON.parse(m[1]); const t = (x) => (Array.isArray(x) ? x.map(t).flat() : x['@graph'] ? x['@graph'].map(t).flat() : [x['@type']]); return t(j).join('+') } catch (e) { return 'INVALID: ' + e.message } })
  const title = (/<title>([\s\S]*?)<\/title>/.exec(html) || [])[1]
  const desc = (/<meta name="description" content="([^"]*)"/.exec(html) || [])[1]
  const robots = (/<meta name="robots" content="([^"]*)"/.exec(html) || [])[1]
  const words = strip((/<body[\s\S]*<\/body>/.exec(html) || [''])[0]).split(' ').length
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) linkSet.add(m[1])
  const faqQ = (html.match(/<summary|aria-expanded/g) || []).length
  out.routes[r] = { title, descLen: desc ? desc.length : 0, h1, canon, ld, robots, words, faqQ, lang: /<html[^>]*lang="([^"]+)"/.exec(html)?.[1], dir: /<html[^>]*dir="([^"]+)"/.exec(html)?.[1] }
}
// internal links: does each resolve to a built page or a file in dist/public?
for (const l of linkSet) {
  if (l.startsWith('/api/')) continue
  const p = path.join(DIST, l), ok = fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html')))
  if (!ok) out.links[l] = 'NOT IN DIST'
}
const sm = fs.existsSync(path.join(DIST, 'sitemap.xml')) ? fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8') : ''
const smUrls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
out.sitemap = { count: smUrls.length, missingFromSitemap: routes.filter((r) => !smUrls.includes(r) && r !== '/'), notBuilt: smUrls.filter((u) => !routes.includes(u)) }
// ---- G5 / G7 / G9: the rendered page, phone and desktop
const b = await puppeteer.launch({ headless: 'new' })
for (const [w, h] of [[390, 844], [1440, 900]]) {
  for (const r of routes) {
    const pg = await b.newPage(); await pg.setViewport({ width: w, height: h })
    await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
    const errs = [], bad = []
    pg.on('pageerror', (e) => errs.push(String(e).slice(0, 160)))
    pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text().slice(0, 160)) })
    pg.on('response', (res) => { const u = new URL(res.url()); if (res.status() >= 400 && u.origin === new URL(BASE).origin && u.pathname !== '/api/event') bad.push(res.status() + ' ' + u.pathname) })
    await pg.goto(BASE + r + '?calm=1', { waitUntil: 'networkidle2', timeout: 60000 }); await new Promise((res) => setTimeout(res, 1800))
    const info = await pg.evaluate(() => {
      const imgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('loading') !== 'lazy').map((i) => i.getAttribute('src'))
      const noAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length
      const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map((x) => +x.tagName[1])
      let jump = 0; for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) jump++
      const small = [...document.querySelectorAll('a[href],button,[role=button],input,select,textarea,summary')].filter((e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && (r.width < 24 || r.height < 24) && !e.closest('.wheel') }).map((e) => (e.className || e.tagName).toString().slice(0, 30) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height))
      return { over: document.documentElement.scrollWidth - innerWidth, imgs, noAlt, h1: document.querySelectorAll('h1').length, jump, small: [...new Set(small)].slice(0, 6), height: document.documentElement.scrollHeight }
    })
    let axe = []
    if (w === 390) { await pg.evaluate(axeSrc); axe = await pg.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] })).violations.map((x) => `${x.impact}:${x.id}(${x.nodes.length}) ${x.nodes[0]?.target?.join(' ').slice(0, 60)}`)) }
    out.routes[r]['r' + w] = { ...info, errs, bad: [...new Set(bad)], axe }
    await pg.close()
  }
}
// G9: a garbage URL
const pg = await b.newPage(); const res = await pg.goto(BASE + '/no-such-page-' + Date.now(), { waitUntil: 'domcontentloaded' })
out.notFound = { status: res.status(), note: 'vite preview always answers 200; Cloudflare Pages serves dist/404.html with 404 (no catch-all in _redirects)' }
await b.close()
fs.writeFileSync('C:/tmp/night/gates/gates.json', JSON.stringify(out, null, 1))
// a short report
for (const [r, v] of Object.entries(out.routes)) {
  const p = v.r390, d = v.r1440
  console.log(`${r}  h1:${v.h1.length} "${(v.h1[0] || '').slice(0, 40)}" canon:${v.canon.length}${v.canon[0] && !v.canon[0].endsWith(r === '/' ? '.il/' : r) ? ' MISMATCH ' + v.canon[0] : ''} ld:[${v.ld.join(', ')}] words:${v.words} desc:${v.descLen} ${v.robots ? 'robots:' + v.robots : ''}`)
  console.log(`   390: over ${p.over} errs ${p.errs.length} bad ${p.bad.join(' ')} imgs ${p.imgs.length} noAlt ${p.noAlt} jump ${p.jump} axe [${p.axe.join(' | ')}] small [${p.small.join(', ')}]`)
  console.log(`   1440: over ${d.over} errs ${d.errs.length} ${d.errs.slice(0, 1)} bad ${d.bad.join(' ')} small [${d.small.join(', ')}]`)
}
console.log('links not in dist:', JSON.stringify(out.links), '\nsitemap:', JSON.stringify(out.sitemap), '\n404:', JSON.stringify(out.notFound))
