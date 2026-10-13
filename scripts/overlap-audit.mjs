#!/usr/bin/env node
/**
 * overlap-audit — "nothing steps on anything" (DECISIONS #50, brief §4).
 *
 * Every scene declares zones: data-zone="text" (headlines, copy, captions, CTAs),
 * data-zone="art" (moving objects, media) and data-zone="ui" (header, floating buttons,
 * cookie banner, accessibility tab). This walks the page with motion ON, the way a visitor
 * scrolls it, and reports every visible text/art, text/text or text/ui intersection larger
 * than --min px in both directions.
 *
 *   node scripts/overlap-audit.mjs --looks k=http://localhost:4175/,m=http://localhost:4176/,km=http://localhost:4177/
 *   node scripts/overlap-audit.mjs --base http://localhost:5173/ --looks k,m,km      (dev: appends ?look=)
 *        [--vp 320,390,768,1024,1440] [--page-step 0.02] [--hold-step 0.05] [--min 4]
 *        [--path /] [--out design/audit] [--shots 12]
 *
 * Positions: the whole page in --page-step fractions of its scroll range, then every held
 * scene ([data-hold]) in --hold-step fractions of its own range (the same positions the
 * engine's ?at=<id>:<p> hook lands on). Each position waits until the scrub and the CSS
 * swaps have settled (rects and opacities stable twice in a row).
 *
 * What counts:
 *   - visible = display/visibility on, effective opacity (own x ancestors) > 0.1, inside the
 *     viewport, clipped by every ancestor whose overflow is not visible;
 *   - text is measured by its line boxes (a Range over its text, links inside included),
 *     a zone that is itself a link or button (a CTA) by its box;
 *   - text/art and text/text everywhere;
 *   - text/ui where it is a design fault, not ordinary scrolling: text inside a held stage
 *     while that stage is stuck, and anything at the first view (scrollY 0) and at the end
 *     of the page. Copy that simply scrolls past under the header or a floating button
 *     elsewhere is listed as "passing" and not counted.
 * Exit code 1 when anything counts.
 */
import { mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import puppeteer from 'puppeteer'

const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d }
if (args.includes('--help')) { console.log(readHelp()); process.exit(0) }
function readHelp() { return 'see the header of scripts/overlap-audit.mjs' }

const base = opt('--base', null)
const lookArg = opt('--looks', 'k,m,km')
const targets = lookArg.split(',').map((s) => {
  const [look, url] = s.includes('=') ? s.split(/=(.+)/) : [s, null]
  const path = opt('--path', '/')
  if (url) return { look, url: new URL(path, url).href }
  if (!base) throw new Error('--looks k,m,km needs --base, or give look=url pairs')
  const u = new URL(path, base)
  u.searchParams.set('look', look)
  return { look, url: u.href }
})
const VPS = opt('--vp', '320,390,768,1024,1440').split(',').map(Number)
const PAGE_STEP = Number(opt('--page-step', '0.02'))
const HOLD_STEP = Number(opt('--hold-step', '0.05'))
const MIN = Number(opt('--min', '4'))
const OUT = resolve(opt('--out', 'design/audit'))
const SHOTS = Number(opt('--shots', '12'))
mkdirSync(OUT, { recursive: true })

const HEIGHT = { 320: 568, 390: 844, 768: 1024, 1024: 768, 1440: 900 }

/** In-page: every visible zone box at this scroll position. */
function collect() {
  const vw = innerWidth
  const vh = innerHeight
  const clipTo = (r, c) => ({ l: Math.max(r.l, c.l), t: Math.max(r.t, c.t), r: Math.min(r.r, c.r), b: Math.min(r.b, c.b) })
  const ok = (r) => r.r - r.l > 0.5 && r.b - r.t > 0.5
  const desc = (el) => {
    const cls = typeof el.className === 'string' ? el.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.') : ''
    const text = (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40)
    return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}${text ? ` "${text}"` : ''}`
  }
  const out = []
  let idx = 0
  for (const el of document.querySelectorAll('[data-zone]')) {
    idx++
    const zone = el.dataset.zone
    // visibility and effective opacity
    let op = 1
    let hidden = false
    let clip = { l: 0, t: 0, r: vw, b: vh }
    let stage = null
    for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
      const cs = getComputedStyle(a)
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.contentVisibility === 'hidden') { hidden = true; break }
      op *= Number(cs.opacity)
      if (a !== el && (cs.overflowX !== 'visible' || cs.overflowY !== 'visible')) {
        const ar = a.getBoundingClientRect()
        clip = clipTo(clip, { l: ar.left, t: ar.top, r: ar.right, b: ar.bottom })
      }
      if (!stage && a.classList && a.classList.contains('hold__stage') && cs.position === 'sticky') stage = a
    }
    if (hidden || op <= 0.1) continue
    // boxes: text by its line boxes, controls and everything else by the element box
    let boxes = []
    const control = el.matches('a, button, [role="button"]')
    if (zone === 'text' && !control) {
      const range = document.createRange()
      range.selectNodeContents(el)
      boxes = [...range.getClientRects()].map((r) => ({ l: r.left, t: r.top, r: r.right, b: r.bottom }))
    }
    if (!boxes.length) { const r = el.getBoundingClientRect(); boxes = [{ l: r.left, t: r.top, r: r.right, b: r.bottom }] }
    boxes = boxes.map((b) => clipTo(b, clip)).filter(ok)
    if (!boxes.length) continue
    // a stage is stuck while its top sits at its sticky offset
    let stuck = false
    if (stage) {
      const st = stage.getBoundingClientRect()
      const top = parseFloat(getComputedStyle(stage).top) || 0
      stuck = Math.abs(st.top - top) < 1.5
    }
    out.push({ i: idx, zone, desc: desc(el), op: Math.round(op * 100) / 100, stuck, boxes })
  }
  return out
}

/** Pairs that step on each other. */
function pairs(zones, atEdge) {
  const found = []
  const passing = []
  for (let a = 0; a < zones.length; a++) {
    for (let b = a + 1; b < zones.length; b++) {
      const A = zones[a]
      const B = zones[b]
      const kinds = [A.zone, B.zone].sort().join('/')
      if (!['art/text', 'text/text', 'text/ui'].includes(kinds)) continue
      let best = null
      for (const p of A.boxes) for (const q of B.boxes) {
        const w = Math.min(p.r, q.r) - Math.max(p.l, q.l)
        const h = Math.min(p.b, q.b) - Math.max(p.t, q.t)
        if (w > MIN && h > MIN && (!best || w * h > best.w * best.h)) best = { w: Math.round(w), h: Math.round(h), x: Math.round(Math.max(p.l, q.l)), y: Math.round(Math.max(p.t, q.t)) }
      }
      if (!best) continue
      const rec = { kinds, a: A.desc, b: B.desc, ops: [A.op, B.op], ...best }
      if (kinds === 'text/ui') {
        const text = A.zone === 'text' ? A : B
        if (text.stuck || atEdge) found.push(rec)
        else passing.push(rec)
      } else found.push(rec)
    }
  }
  return { found, passing }
}

async function settle(page) {
  await new Promise((r) => setTimeout(r, 650))
  let prev = ''
  for (let i = 0; i < 14; i++) {
    const sig = await page.evaluate(() => [...document.querySelectorAll('[data-zone]')].map((el) => {
      const r = el.getBoundingClientRect()
      return `${r.left | 0},${r.top | 0},${r.width | 0},${getComputedStyle(el).opacity}`
    }).join(';'))
    if (sig === prev) return
    prev = sig
    await new Promise((r) => setTimeout(r, 120))
  }
}

async function auditOne(browser, target, vw) {
  const page = await browser.newPage()
  const mobile = vw < 768
  await page.setViewport({ width: vw, height: HEIGHT[vw] || 900, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)))
  await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 90000 })
  await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'), { timeout: 20000 }).catch(() => errors.push('motion-ready never set'))
  await new Promise((r) => setTimeout(r, 2200)) // widgets mount after idle; the cookie banner after 1.5 s

  const positions = []
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  for (let p = 0; p <= 1.0001; p += PAGE_STEP) positions.push({ label: `page:${p.toFixed(2)}`, y: Math.round(max * p), edge: p < 1e-6 || p > 0.9999 })
  const holds = await page.evaluate(() => [...document.querySelectorAll('[data-hold]')].map((el) => ({
    id: el.dataset.hold, top: el.getBoundingClientRect().top + scrollY, range: el.offsetHeight - innerHeight,
  })))
  for (const h of holds) {
    for (let p = 0; p <= 1.0001; p += HOLD_STEP) positions.push({ label: `${h.id}:${p.toFixed(2)}`, y: Math.round(h.top + h.range * p), edge: false })
  }

  const results = []
  for (const pos of positions) {
    await page.evaluate((y) => window.scrollTo(0, y), pos.y)
    await settle(page)
    const zones = await page.evaluate(collect)
    const { found, passing } = pairs(zones, pos.edge)
    let shot = null
    if (found.length && results.filter((r) => r.found.length && r.shot).length < SHOTS) {
      shot = `overlap-${target.look}-${vw}-${pos.label.replace(/[:.]/g, '_')}.jpg`
      await page.screenshot({ path: resolve(OUT, shot), type: 'jpeg', quality: 70, captureBeyondViewport: false })
    }
    results.push({ ...pos, zones: zones.length, found, passing: passing.length, shot })
  }
  await page.close()
  return { look: target.look, vw, holds: holds.map((h) => h.id), errors, results }
}

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] })
const runs = []
for (const vw of VPS) {
  const batch = await Promise.all(targets.map((t) => auditOne(browser, t, vw)))
  for (const r of batch) {
    const n = r.results.reduce((a, x) => a + x.found.length, 0)
    console.log(`${r.look.padEnd(3)} ${String(vw).padStart(4)}  positions ${r.results.length}  holds [${r.holds.join(', ')}]  overlaps ${n}${r.errors.length ? `  errors ${r.errors.length}` : ''}`)
    runs.push(r)
  }
}
await browser.close()

const total = runs.reduce((a, r) => a + r.results.reduce((b, x) => b + x.found.length, 0), 0)
const lines = [`# Overlap audit`, '', `${new Date().toISOString()} · min ${MIN}px · page step ${PAGE_STEP} · hold step ${HOLD_STEP}`, '', `**Total counted overlaps: ${total}**`, '']
lines.push('| look | vp | positions | holds | counted | passing (not counted) | errors |', '|---|---|---|---|---|---|---|')
for (const r of runs) {
  const n = r.results.reduce((a, x) => a + x.found.length, 0)
  const p = r.results.reduce((a, x) => a + x.passing, 0)
  lines.push(`| ${r.look} | ${r.vw} | ${r.results.length} | ${r.holds.join(', ') || '-'} | ${n} | ${p} | ${r.errors.join('; ') || 0} |`)
}
for (const r of runs) {
  const bad = r.results.filter((x) => x.found.length)
  if (!bad.length) continue
  lines.push('', `## ${r.look} @ ${r.vw}`)
  for (const x of bad) {
    lines.push(`- **${x.label}** (y ${x.y})${x.shot ? ` ![](${x.shot})` : ''}`)
    for (const f of x.found) lines.push(`  - ${f.kinds}: ${f.a} × ${f.b} · ${f.w}×${f.h}px at ${f.x},${f.y} · opacity ${f.ops.join('/')}`)
  }
}
writeFileSync(resolve(OUT, 'overlap-audit.md'), lines.join('\n') + '\n')
writeFileSync(resolve(OUT, 'overlap-audit.json'), JSON.stringify({ total, runs }, null, 1))
console.log(`\ncounted overlaps: ${total} → ${resolve(OUT, 'overlap-audit.md')}`)
process.exit(total ? 1 : 0)
