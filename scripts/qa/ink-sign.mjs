// QA · the pen (D232; the hero's ground since D234; the films under the sheet, D235), on a served build.
//   node scripts/qa/ink-sign.mjs http://localhost:4317 [out-dir] [extra query, e.g. copy=new: the lab's proposal]
// 1. At each size (phones, a tablet both ways, a phone on its side, desktops tall, short and wide): the sheet
//    covers the hero from the top of the screen and ends inside it, its foot and a strip of what lies under it in
//    view; the right cut and encode play by themselves after the opening; no word stands where the pen, its shadow
//    or the ink ever pass (DARK: measured over every frame of each cut); the words keep AA contrast over the
//    frames they really stand on (read back from the canvas while the film runs) and stand clear of the foot;
//    nothing overflows sideways; the page's largest paint is the hero's own text; a scroll lifts the sheet off the
//    showreel's stage, which stays put and starts its takes; the film runs to its end and leaves Replay under the
//    logo, clear of the words; and the page logged no error.
// 2. A first visit (no stored consent, the cookie strip up): the key stands clear of the strip, on the sheet.
// 3. Autoplay refused (play() rejects): the signed sheet and Play, never an empty sheet.
// 4. The accessibility stop switch pressed while the film runs: the film stops and the signed sheet shows.
// 5. ?calm=1: the signed sheet, no file fetched; Play fetches and plays it.
// 6. ?reduce=1: only the signed sheet (no video, no control), and no room kept for a reel that will not come.
// 7. JavaScript off: paper under the words and the signed sheet as a plain picture, in the cut and at the place the
//    screen asks for.
// 8. A phone turned on its side after the film: the other cut's picture takes the sheet.
// 9. ?hero=reel: the old hero and its focus pull, with none of the new hero's classes left on the root.
// Screenshots land in the out dir. Exits 1 when a check fails.
import puppeteer from 'puppeteer'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const base = process.argv[2] ?? 'http://localhost:4317'
const out = process.argv[3] ?? 'G:/tmp/ink/shots'
const extra = process.argv[4] ? `&${process.argv[4]}` : ''
await mkdir(out, { recursive: true })

// first: the whole hero, its key included, must fit the first screen (the sizes people really open the site at)
const SIZES = [
  { name: '390', w: 390, h: 844, phone: true, first: true },
  { name: '320', w: 320, h: 568, phone: true },
  { name: '360x640', w: 360, h: 640, phone: true, first: true },
  { name: '412x915', w: 412, h: 915, phone: true, first: true },
  { name: '768x1024', w: 768, h: 1024, phone: true, first: true },
  { name: '844x390', w: 844, h: 390, phone: true },
  { name: '1080x810', w: 1080, h: 810, phone: true },
  { name: '1440', w: 1440, h: 900, first: true },
  { name: '1440x700', w: 1440, h: 700, first: true },
  { name: '1366x650', w: 1366, h: 650, first: true },
  { name: '1920x950', w: 1920, h: 950, first: true },
]
// each cut: its shape, the part kept when the screen's shape differs (sea-sign.css has the same numbers), and DARK:
// 50 rows down the film, each the span of its width that gets dark at some moment of the film (null: paper
// throughout). Printed by design/film/ink/calm.py from the rendered frames; render again, measure again.
const CUTS = {
  p: { a: 0.5625, px: 0.5, py: 0.6, dark: [[0.358, 1], [0.327, 1], [0.296, 1], [0.265, 1], [0.241, 0.969], [0.21, 0.938], [0.179, 0.901], [0.167, 0.87], [0.154, 0.84], [0.136, 0.846], [0.111, 0.747], [0.086, 0.728], [0.068, 1], [0.043, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 0.994], [0, 0.957], [0, 0.741], [0, 0.648], [0, 0.414], [0, 0.272], [0, 0.148]] },
  w: { a: 16 / 9, px: 0, py: 0.4, dark: [[0.197, 0.6], [0.191, 0.594], [0.188, 0.597], [0.181, 0.575], [0.175, 0.547], [0.172, 0.537], [0.166, 0.531], [0.163, 0.519], [0.159, 0.509], [0.166, 0.997], [0.172, 1], [0.131, 1], [0.131, 1], [0.113, 1], [0.069, 1], [0.044, 0.938], [0.009, 0.931], [0, 0.884], [0, 0.816], [0, 0.769], [0, 0.681], [0, 0.666], [0, 0.575], [0, 0.547], [0, 0.512], [0, 0.475], [0, 0.397], [0, 0.366], [0, 0.287], [0, 0.25], [0, 0.225], [0, 0.175], [0, 0.094], [0, 0.056], [0, 0.025]] },
}
const cutOf = (size) => (size.w / size.h < 0.95 ? 'p' : 'w')
const fails = []
const check = (ok, what) => { if (!ok) fails.push(what); process.stdout.write(`${ok ? 'ok  ' : 'FAIL'} ${what}\n`) }
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ headless: true, userDataDir: 'G:/tmp/ink/chrome-profile', args: ['--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11', '--autoplay-policy=no-user-gesture-required'] })

/** The home page with consent stored and the lead popup off; the largest paints are recorded from the start. */
async function open(size, query, before, consent = true) {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|consent|gtag|analytics/i.test(m.text())) errors.push(m.text()) })
  await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: size.phone ? 2 : 1, isMobile: !!size.phone, hasTouch: !!size.phone })
  await page.evaluateOnNewDocument((consent) => {
    try { if (consent) localStorage.setItem('mw_cookie_consent', 'rejected'); else localStorage.removeItem('mw_cookie_consent'); sessionStorage.setItem('leadModalClosed', 'true') } catch { /* private mode */ }
    window.__lcp = []
    new PerformanceObserver((list) => { for (const e of list.getEntries()) window.__lcp.push({ tag: e.element?.tagName ?? '', cls: String(e.element?.className ?? ''), size: e.size }) }).observe({ type: 'largest-contentful-paint', buffered: true })
  }, consent)
  if (before) await page.evaluateOnNewDocument(before)
  await page.goto(`${base}/?${query}&lead=off${extra}`, { waitUntil: 'load' })
  return { page, errors }
}
const state = (page) => page.evaluate(() => {
  const v = document.querySelector('.sea-sign__src'), b = document.querySelector('.sea-sign__again'), c = document.querySelector('canvas.sea-sign__film')
  const br = b?.getBoundingClientRect()
  return {
    video: v ? { src: (v.currentSrc || v.getAttribute('src') || '').split('/').pop(), t: v.currentTime, paused: v.paused, ended: v.ended } : null,
    button: b ? { offered: !b.hidden, hit: !b.hidden && (() => { const r = b.getBoundingClientRect(); return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('.sea-sign__again') === b })(), word: b.querySelector('[lang="en"]')?.textContent ?? '', name: [...b.childNodes].filter((n) => n.nodeType !== 1 || n.getAttribute('aria-hidden') !== 'true').map((n) => n.textContent).join(''), box: br ? [Math.round(br.width), Math.round(br.height), Math.round(br.top), Math.round(br.bottom), Math.round(br.left), Math.round(br.right)] : null } : null,
    shows: c?.dataset.shows ?? null, cut: document.querySelector('.sea-sign')?.dataset.cut ?? null, w: c?.width ?? 0,
  }
})
const playing = (page, ms = 20000) => page.waitForFunction(() => { const v = document.querySelector('.sea-sign__src'); return !!v && !v.paused && v.currentTime > 0.6 }, { timeout: ms }).then(() => true, () => false)

/** The words on the sheet: every line's box, in fractions of the film as it lies on the screen, and where the
    words stand against what the pen ever covers. */
const words = (page, cut) => page.evaluate((cut) => {
  const band = document.querySelector('.sea-sign__band').getBoundingClientRect()
  const fw = Math.max(band.width, band.height * cut.a), fh = Math.max(band.height, band.width / cut.a)
  const fx = band.left + (band.width - fw) * cut.px, fy = band.top + (band.height - fh) * cut.py
  const boxes = []
  for (const el of document.querySelectorAll('.sea-hero .sea-in :is(.sea-h1__ln, .sea-lead__ln, .key)')) {
    const range = document.createRange()
    range.selectNodeContents(el)
    for (const r of el.matches('.key') ? [el.getBoundingClientRect()] : range.getClientRects()) if (r.width > 1 && r.height > 1) boxes.push([r.left, r.top, r.right, r.bottom])
  }
  const hit = []
  for (const [l, t, r, b] of boxes) {
    // a line's box is taller than its letters: a tenth of it at the top is air
    const y0 = (t + (b - t) * 0.1 - fy) / fh, y1 = (b - fy) / fh, x0 = (l - fx) / fw, x1 = (r - fx) / fw
    for (let k = Math.max(0, Math.floor(y0 * 50)); k <= Math.min(49, Math.floor(y1 * 50)); k++) {
      const d = cut.dark[k]
      if (d && x0 < d[1] + 0.01 && x1 > d[0] - 0.01) { hit.push({ row: k * 2, box: [Math.round(l), Math.round(t), Math.round(r), Math.round(b)], dark: d }); break }
    }
  }
  const all = boxes.reduce((u, b) => [Math.min(u[0], b[0]), Math.min(u[1], b[1]), Math.max(u[2], b[2]), Math.max(u[3], b[3])], [1e9, 1e9, -1e9, -1e9])
  return { hit, boxes, all: all.map(Math.round), film: [fx, fy, fw, fh], band: [band.left, band.top, band.width, band.height].map(Math.round), vh: innerHeight }
}, cut)

/** The darkest the picture is under the words right now (8 px blocks of the canvas, line by line), as a contrast
    against the headline's ink and the line's grey. */
const under = (page, w) => page.evaluate((w) => {
  const c = document.querySelector('canvas.sea-sign__film'), ctx = c.getContext('2d')
  const [fx, fy, fw, fh] = w.film
  const sx = c.width / fw, sy = c.height / fh
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  let lo = 9
  for (const [l, t, r, b] of w.boxes) {
    const x = Math.max(0, Math.floor((l - fx) * sx)), y = Math.max(0, Math.floor((t - fy) * sy))
    const cw = Math.min(c.width - x, Math.ceil((r - l) * sx)), ch = Math.min(c.height - y, Math.ceil((b - t) * sy))
    if (cw < 8 || ch < 8) continue // a line that stands under the film, on the plain part of the sheet
    const px = ctx.getImageData(x, y, cw, ch).data
    for (let by = 0; by + 8 <= ch; by += 8) for (let bx = 0; bx + 8 <= cw; bx += 8) {
      let L = 0
      for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { const o = ((by + j) * cw + bx + i) * 4; L += 0.2126 * lin(px[o]) + 0.7152 * lin(px[o + 1]) + 0.0722 * lin(px[o + 2]) }
      lo = Math.min(lo, L / 64)
    }
  }
  if (lo === 9) return null
  const on = (hex) => { const n = parseInt(hex, 16); const L = 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); return (lo + 0.05) / (L + 0.05) }
  return { ink: on('0f1011'), grey: on('4d4942') }
}, w)

try {
  for (const size of SIZES) {
    const cut = cutOf(size)
    const { page, errors } = await open(size, 'motion=full')
    const there = await page.evaluate(() => !!document.querySelector('.sea-hero--paper > .sea-sign'))
    check(there, `${size.name}: the sheet is the hero's ground`)
    if (!there) { await page.close(); continue }
    check(await playing(page), `${size.name}: the film started by itself after the opening`)
    const lay = await page.evaluate(() => {
      const s = document.querySelector('.sea-sign').getBoundingClientRect(), hero = document.querySelector('.sea-hero').getBoundingClientRect()
      const lift = document.querySelector('.sea-lift'), cs = (q) => getComputedStyle(document.querySelector(q))
      return {
        sheet: [s.left, s.top, s.right, s.bottom].map(Math.round), hero: Math.round(hero.bottom), covers: s.top <= 0 && s.left <= 0 && s.right >= document.documentElement.clientWidth,
        overflow: document.documentElement.scrollWidth - innerWidth, stay: lift.offsetHeight - document.querySelector('.sea-hero').offsetHeight, lcp: window.__lcp.at(-1) ?? null,
        ink: [cs('.sea-hero .sea-h1').color, cs('.sea-hero .sea-sub').color, cs('.sea-hero .sea-h1').textShadow], key: document.querySelector('.sea-hero .key').getBoundingClientRect().bottom,
        gl: document.documentElement.classList.contains('sea-gl'),
      }
    })
    check(lay.covers, `${size.name}: the sheet covers the hero from the top of the screen (${lay.sheet})`)
    check(lay.ink[0] === 'rgb(15, 16, 17)' && lay.ink[1] === 'rgb(77, 73, 66)' && lay.ink[2] === 'none', `${size.name}: the words are in ink, with no halo (${lay.ink})`)
    const w = await words(page, CUTS[cut])
    check(w.hit.length === 0, `${size.name}: no word stands where the pen passes${w.hit.length ? ` (${JSON.stringify(w.hit.slice(0, 2))})` : ` (words from ${Math.round(100 * w.all[1] / w.vh)}% of the screen)`}`)
    check(lay.key <= lay.sheet[3] - 12, `${size.name}: the key stands on the sheet, clear of its foot (key ends at ${Math.round(lay.key)}, the solid sheet at ${lay.sheet[3]})`)
    // the sheet ends inside the first screen: its foot (the hero's last rows and as many under it) and a strip beneath
    if (size.first) check(lay.hero < size.h - 20 && lay.hero > size.h - 110 && lay.key <= size.h, `${size.name}: the whole hero is on the first screen, and the sheet ends inside it (the hero at ${lay.hero} of ${size.h}, the key at ${Math.round(lay.key)})`)
    else process.stdout.write(`     ${size.name}: the hero ends at ${lay.hero} of ${size.h}, the key at ${Math.round(lay.key)}\n`)
    check(lay.overflow <= 0, `${size.name}: no sideways overflow (${lay.overflow})`)
    check(!!lay.lcp && /^sea-(h1|lead)__ln/.test(String(lay.lcp.cls)), `${size.name}: the largest paint is the hero's own text (${lay.lcp?.tag} ${String(lay.lcp?.cls).slice(0, 30)})`)
    const s0 = await state(page)
    const file = cut === 'p' ? 'ink-p.webm' : size.w >= 1100 ? 'ink-w.webm' : 'ink-w-m.webm'
    check(s0.video?.src === file && s0.cut === cut, `${size.name}: the right cut and encode (${s0.video?.src}, ${s0.cut})`)
    // the words against the frames they stand on, at four moments of the film
    let worst = { ink: 99, grey: 99 }
    for (const at of [2.5, 6, 9.5, 13]) {
      await page.waitForFunction((t) => (document.querySelector('.sea-sign__src')?.currentTime ?? 99) >= t, { timeout: 20000 }, at).catch(() => {})
      const c = await under(page, w)
      if (c) worst = { ink: Math.min(worst.ink, c.ink), grey: Math.min(worst.grey, c.grey) }
      if (at === 6) await page.screenshot({ path: path.join(out, `${size.name}-drawing.png`), captureBeyondViewport: false })
    }
    check(worst.ink >= 7 && worst.grey >= 4.5, `${size.name}: the words keep their contrast over the film (headline ${worst.ink.toFixed(1)}, line ${worst.grey.toFixed(1)})`)
    // the lift: the sheet goes up with the scroll, the films' stage stays where it is and its takes begin
    if (lay.gl) {
      check(lay.stay > size.h, `${size.name}: room is kept for the films under the sheet (${lay.stay} px)`)
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(size.h * 0.55))
      await wait(1600)
      const up = await page.evaluate(() => {
        const st = document.querySelector('.sea-lift__stage').getBoundingClientRect(), s = document.querySelector('.sea-sign').getBoundingClientRect()
        const pen = document.querySelector('.sea-sign__src')
        return { stage: [Math.round(st.top), Math.round(st.height)], sheet: Math.round(s.bottom), takes: [...document.querySelectorAll('.sea-lift__stage video')].filter((v) => v.getAttribute('src')).length, pen: pen.paused || pen.ended, overflow: document.documentElement.scrollWidth - innerWidth }
      })
      check(up.stage[0] === 0 && up.stage[1] >= size.h && up.sheet < size.h * 0.5 && up.takes === 2 && up.overflow <= 0, `${size.name}: a scroll lifts the sheet off the films, which stay put and start (${JSON.stringify(up)})`)
      check(up.pen, `${size.name}: with half the sheet gone the pen rests, so it does not decode beside the films`)
      await page.screenshot({ path: path.join(out, `${size.name}-lift.png`), captureBeyondViewport: false })
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(size.h * 1.04))
      await wait(1800)
      const alone = await page.evaluate(() => Math.round(document.querySelector('.sea-lift__stage').getBoundingClientRect().top))
      check(alone === 0, `${size.name}: with the sheet gone the films have the screen (stage at ${alone})`)
      await page.screenshot({ path: path.join(out, `${size.name}-reel.png`), captureBeyondViewport: false })
      await page.evaluate(() => window.scrollTo(0, 0))
      await wait(900)
      const rest = await page.evaluate(() => [...document.querySelectorAll('.sea-lift__stage video')].every((v) => v.paused))
      check(rest, `${size.name}: back at the top, under the sheet, the films hold their frame`)
    } else {
      process.stdout.write(`     ${size.name}: no WebGL here, so no reel to lift the sheet off\n`)
    }
    await page.waitForFunction(() => document.querySelector('.sea-sign__src')?.ended === true, { timeout: 40000 }).catch(() => {})
    await wait(500)
    const end = await state(page)
    check(!!end.video?.ended && !!end.button?.offered && end.button.word === 'Replay' && end.button.name.startsWith('Replay'), `${size.name}: the film ended and Replay is offered, and its name begins with the word on it (${end.button?.name})`)
    const b = end.button?.box
    // [width, height, top, bottom, left, right]: on the screen, under the header, on no line of the words
    const onWords = !!b && w.boxes.some(([l, t, r, bt]) => b[4] < r && b[5] > l && b[2] < bt && b[3] > t)
    check(!!b && b[0] >= 44 && b[1] >= 44 && b[2] >= 68 && b[3] <= size.h && b[4] >= 0 && b[5] <= size.w && !onWords && end.button.hit, `${size.name}: Replay is a 44 px target under the logo, clear of the header and the words, and a click at its middle reaches it (${b}, ${end.button?.hit})`)
    await page.screenshot({ path: path.join(out, `${size.name}-signed.png`), captureBeyondViewport: false })
    check(errors.length === 0, `${size.name}: no page errors${errors.length ? ` (${errors.slice(0, 3).join(' | ')})` : ''}`)
    await page.close()
  }

  // a first visit: nothing stored, the cookie strip up over the foot of the first screen
  for (const size of [{ name: '320 first visit', w: 320, h: 568, phone: true }, { name: '390x664 first visit', w: 390, h: 664, phone: true }, { name: '1440 first visit', w: 1440, h: 900 }]) {
    const { page } = await open(size, 'motion=full', null, false)
    await playing(page)
    const v = await page.evaluate(() => {
      const strip = document.querySelector('.mw-consent-banner')?.getBoundingClientRect(), key = document.querySelector('.sea-hero .key').getBoundingClientRect(), s = document.querySelector('.sea-sign').getBoundingClientRect()
      return { strip: strip ? Math.round(strip.top) : null, key: Math.round(key.bottom), sheet: Math.round(s.bottom) }
    })
    const w = await words(page, CUTS[cutOf(size)])
    check(v.strip !== null && v.key <= v.strip && v.key <= v.sheet - 12 && w.hit.length === 0, `${size.name}: the key stands clear of the cookie strip, on the sheet, and no word is on the pen's way (${JSON.stringify(v)})`)
    await page.screenshot({ path: path.join(out, `${size.name.replace(/ /g, '-')}.png`), captureBeyondViewport: false })
    await page.close()
  }

  // autoplay refused: the browser rejects every play() that the page starts by itself
  {
    const { page } = await open(SIZES[0], 'motion=full', () => { HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException('refused', 'NotAllowedError')) } })
    await page.waitForFunction(() => { const b = document.querySelector('.sea-sign__again'); return !!b && !b.hidden }, { timeout: 20000 }).catch(() => {})
    await wait(600)
    const s = await state(page)
    check(s.shows === 'signed' && !!s.button?.offered && s.button.word === 'Play', `refused: the signed sheet and Play, not an empty sheet (${JSON.stringify(s)})`)
    await page.screenshot({ path: path.join(out, 'refused-390.png'), captureBeyondViewport: false })
    await page.close()
  }

  // the stop switch, pressed while the film runs
  {
    const { page } = await open(SIZES[0], 'motion=full')
    const ran = await playing(page)
    await page.evaluate(() => document.documentElement.classList.add('disable-animations'))
    await wait(900)
    const s = await state(page)
    check(ran && !!s.video?.paused && s.shows === 'signed' && !s.button?.offered, `stop switch: the film stops, the signed sheet shows, no control (${JSON.stringify(s)})`)
    await page.close()
  }

  // calm: on request only
  {
    const { page } = await open(SIZES[0], 'calm=1')
    await wait(4500)
    const s = await state(page)
    check(s.shows === 'signed' && s.video?.src === '' && !!s.button?.offered && s.button.word === 'Play', `calm: the signed sheet, no file fetched, Play offered (${JSON.stringify(s)})`)
    await page.evaluate(() => document.querySelector('.sea-sign__again')?.click())
    check(await playing(page, 12000), 'calm: Play fetches the film and plays it')
    await page.close()
  }

  // reduce: a picture, no film
  {
    const { page } = await open(SIZES[0], 'reduce=1')
    await wait(2500)
    const s = await state(page)
    const room = await page.evaluate(() => document.querySelector('.sea-lift').offsetHeight - document.querySelector('.sea-hero').offsetHeight)
    check(!s.video && !s.button && s.shows === 'signed' && room === 0, `reduce: the signed sheet as a picture, no film, no control, no room kept for a reel (${JSON.stringify(s)}, ${room})`)
    await page.screenshot({ path: path.join(out, 'reduce-390.png'), captureBeyondViewport: false })
    await page.close()
  }

  // JavaScript off: the prerendered page alone, upright and wide
  for (const size of [SIZES[0], SIZES[7]]) {
    const page = await browser.newPage()
    await page.setJavaScriptEnabled(false)
    await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: size.phone ? 2 : 1, isMobile: !!size.phone, hasTouch: !!size.phone })
    await page.goto(`${base}/`, { waitUntil: 'load' })
    await wait(800)
    const s = await page.evaluate(() => {
      const img = document.querySelector('.sea-sign__sheet img'), band = document.querySelector('.sea-sign__band')?.getBoundingClientRect()
      const r = img?.getBoundingClientRect()
      return img && band && r ? { file: img.currentSrc.split('/').pop(), loaded: img.naturalWidth > 0, fills: Math.abs(r.left - band.left) < 2 && Math.abs(r.top - band.top) < 2 && Math.abs(r.width - band.width) < 2 && Math.abs(r.height - band.height) < 2, at: getComputedStyle(img).objectPosition, cut: document.querySelector('.sea-sign').dataset.cut ?? null, paper: getComputedStyle(document.querySelector('.sea-sign')).backgroundColor, h1: getComputedStyle(document.querySelector('.sea-h1')).color } : null
    })
    const still = `ink-${cutOf(size)}-signed${size.phone ? '-2x' : ''}.webp`, at = cutOf(size) === 'p' ? '50% 60%' : '0% 40%'
    const lift = await page.evaluate(() => document.querySelector('.sea-lift')?.className)
    check(lift === 'sea-lift', `no JavaScript, ${size.name}: the snapshot keeps the films' room, as React's first commit will (${lift})`)
    check(!!s && s.loaded && s.fills && s.file === still && s.at === at && s.cut === null && s.paper === 'rgb(232, 229, 222)' && s.h1 === 'rgb(15, 16, 17)', `no JavaScript, ${size.name}: paper under the words and the signed sheet as a picture, where the screen's shape puts it (${JSON.stringify(s)})`)
    await page.screenshot({ path: path.join(out, `nojs-${size.name}.png`), captureBeyondViewport: false })
    await page.close()
  }

  // a phone turned on its side while the signed sheet shows: the wide cut's picture takes the sheet
  {
    const { page } = await open(SIZES[0], 'calm=1')
    await wait(3000)
    const a = await state(page)
    await page.setViewport({ width: 844, height: 390, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    await wait(1500)
    const b = await state(page)
    check(a.cut === 'p' && a.w === 810 && b.cut === 'w' && b.w === 1600 && b.shows === 'signed', `turned: the sheet takes the other cut's picture (${a.cut} ${a.w} -> ${b.cut} ${b.w} ${b.shows})`)
    await page.close()
  }

  // the gate: the old hero, whole
  {
    const { page, errors } = await open(SIZES[7], 'motion=full&hero=reel')
    await wait(6000)
    const s = await page.evaluate(() => ({ cls: document.documentElement.className.match(/sea-hero-\w+/g), pen: !!document.querySelector('.sea-sign, .sea-lift'), paper: !!document.querySelector('.sea-hero--paper'), lens: !!document.querySelector('.sea-focus__lens'), h1: getComputedStyle(document.querySelector('.sea-h1')).color, hold: (() => { const w = document.querySelector('.sea-focus'), h = document.querySelector('.sea-hero'); return w.classList.contains('is-plain') ? 0 : Math.round((w.offsetHeight - h.offsetHeight) / innerHeight * 100) })() }))
    check(s.cls?.length === 1 && s.cls[0] === 'sea-hero-reel' && !s.pen && !s.paper && s.lens && s.h1 === 'rgb(237, 231, 218)' && (s.hold === 0 || s.hold === 110) && errors.length === 0, `?hero=reel: the old hero and its own hold, none of the new hero's classes (${JSON.stringify(s)}${errors.length ? ' ' + errors[0] : ''})`)
    await page.close()
  }
} finally {
  await browser.close()
}
process.stdout.write(fails.length ? `\n${fails.length} failed\n` : '\nall checks passed\n')
process.exit(fails.length ? 1 : 0)
