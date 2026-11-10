// QA · the pen (D232, in the hero since D233): the ink film in the hero's disc, checked on a served build.
//   node scripts/qa/ink-sign.mjs http://localhost:4317 [out-dir]
// 1. At five sizes (a phone, a small phone, a phone on its side, a desktop, a short desktop): the disc and the
//    words share the first screen without touching, nothing overflows sideways, the film starts by itself after
//    the opening, the page's largest paint is still text (never the film), the hold moves the sheet to the middle
//    of the screen and gives the words back on the way up, the film runs to its end and leaves Replay, and the
//    page logged no error.
//    The disc is centred in its slot and never a coin; during the hold the WhatsApp dock may take the keys' place.
// 2. Autoplay refused (play() rejects): the signed sheet and Play, never an empty sheet.
// 3. The accessibility stop switch pressed while the film runs: the film stops and the signed sheet shows.
// 4. ?calm=1: the signed sheet, no file fetched; Play fetches and plays it.
// 5. ?reduce=1: only the signed sheet (no video, no control).
// 6. JavaScript off: the signed sheet as a plain picture inside the disc.
// 7. ?hero=reel: the old hero and its focus pull, with none of the new hero's classes left on the root.
// Screenshots land in the out dir. Exits 1 when a check fails.
import puppeteer from 'puppeteer'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const base = process.argv[2] ?? 'http://localhost:4317'
const out = process.argv[3] ?? 'G:/tmp/ink/shots'
await mkdir(out, { recursive: true })

const SIZES = [
  { name: '390', w: 390, h: 844, phone: true },
  { name: '320', w: 320, h: 568, phone: true },
  { name: '844x390', w: 844, h: 390, phone: true },
  { name: '1440', w: 1440, h: 900 },
  { name: '1440x700', w: 1440, h: 700 },
]
const fails = []
const check = (ok, what) => { if (!ok) fails.push(what); process.stdout.write(`${ok ? 'ok  ' : 'FAIL'} ${what}\n`) }
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ headless: true, userDataDir: 'G:/tmp/ink/chrome-profile', args: ['--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11', '--autoplay-policy=no-user-gesture-required'] })

/** The home page with consent stored and the lead popup off; the largest paints are recorded from the start. */
async function open(size, query, before) {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|consent|gtag|analytics/i.test(m.text())) errors.push(m.text()) })
  await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: size.phone ? 2 : 1, isMobile: !!size.phone, hasTouch: !!size.phone })
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem('mw_cookie_consent', 'rejected'); sessionStorage.setItem('leadModalClosed', 'true') } catch { /* private mode */ }
    window.__lcp = []
    new PerformanceObserver((list) => { for (const e of list.getEntries()) window.__lcp.push({ tag: e.element?.tagName ?? '', cls: String(e.element?.className ?? ''), size: e.size }) }).observe({ type: 'largest-contentful-paint', buffered: true })
  })
  if (before) await page.evaluateOnNewDocument(before)
  await page.goto(`${base}/?${query}&lead=off`, { waitUntil: 'load' })
  return { page, errors }
}
const state = (page) => page.evaluate(() => {
  const v = document.querySelector('.sea-sign__src'), b = document.querySelector('.sea-sign__again'), c = document.querySelector('canvas.sea-sign__film')
  const br = b?.getBoundingClientRect()
  return {
    video: v ? { src: (v.currentSrc || v.getAttribute('src') || '').split('/').pop(), t: v.currentTime, paused: v.paused, ended: v.ended } : null,
    button: b ? { offered: !b.hidden, word: b.textContent, box: br ? [Math.round(br.width), Math.round(br.height), Math.round(br.top), Math.round(br.bottom)] : null } : null,
    shows: c?.dataset.shows ?? null,
  }
})
const playing = (page, ms = 20000) => page.waitForFunction(() => { const v = document.querySelector('.sea-sign__src'); return !!v && !v.paused && v.currentTime > 0.6 }, { timeout: ms }).then(() => true, () => false)

try {
  for (const size of SIZES) {
    const { page, errors } = await open(size, 'motion=full')
    const there = await page.evaluate(() => !!document.querySelector('.sea-hero .sea-sign'))
    check(there, `${size.name}: the pen's disc is in the hero`)
    if (!there) { await page.close(); continue }
    check(await playing(page), `${size.name}: the film started by itself after the opening`)
    const lay = await page.evaluate(() => {
      const d = document.querySelector('.sea-sign__disc').getBoundingClientRect(), w = document.querySelector('.sea-hero .sea-in').getBoundingClientRect(), h1 = document.querySelector('.sea-h1').getBoundingClientRect()
      const apart = d.bottom <= w.top + 1 || d.right <= w.left + 1 || w.right <= d.left + 1
      const wrap = document.querySelector('.sea-focus'), hero = document.querySelector('.sea-hero')
      const slot = document.querySelector('.sea-spot--ink').getBoundingClientRect()
      return { disc: [Math.round(d.left), Math.round(d.top), Math.round(d.width)], off: Math.abs(d.left + d.width / 2 - (slot.left + slot.width / 2)), apart, inside: d.top >= 0 && d.bottom <= innerHeight + 1 && h1.top >= 0, overflow: document.documentElement.scrollWidth - innerWidth, hold: wrap.classList.contains('is-plain') ? 0 : wrap.offsetHeight - hero.offsetHeight, lcp: window.__lcp.at(-1) ?? null }
    })
    check(lay.apart && lay.inside, `${size.name}: the disc and the words share the first screen without touching (disc ${lay.disc})`)
    check(lay.disc[2] >= 96 && lay.off < 3, `${size.name}: the disc is centred in its slot and at least 96 px wide (${lay.disc[2]} px, ${lay.off.toFixed(1)} px off centre)`)
    check(lay.overflow <= 0, `${size.name}: no sideways overflow (${lay.overflow})`)
    check(!!lay.lcp && lay.lcp.tag !== 'CANVAS' && lay.lcp.tag !== 'VIDEO' && lay.lcp.tag !== 'IMG', `${size.name}: the largest paint is text, not the film (${lay.lcp?.tag} ${String(lay.lcp?.cls).slice(0, 30)})`)
    const src = (await state(page)).video?.src
    check(src === (size.w < 768 ? 'ink-m.webm' : 'ink.webm'), `${size.name}: the right encode (${src})`)
    await page.screenshot({ path: path.join(out, `${size.name}-drawing.png`), captureBeyondViewport: false })
    if (lay.hold > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(lay.hold * 0.6))
      await wait(700)
      const st = await page.evaluate(() => { const d = document.querySelector('.sea-sign__disc').getBoundingClientRect(); return { cx: d.left + d.width / 2, cy: d.top + d.height / 2, w: d.width, words: Number(getComputedStyle(document.querySelector('.sea-hero .sea-in')).opacity), vw: innerWidth, vh: innerHeight, paused: document.querySelector('.sea-sign__src').paused, overflow: document.documentElement.scrollWidth - innerWidth, dock: document.documentElement.classList.contains('sea-focus-out') } })
      check(Math.abs(st.cx - st.vw / 2) < 6 && Math.abs(st.cy - st.vh / 2) < st.vh * 0.12 && st.w >= lay.disc[2] && st.w <= st.vw * 1.25 && st.words < 0.05 && !st.paused, `${size.name}: the hold brings the sheet to the middle and closer, the words step back, the film goes on (${Math.round(st.cx)}, ${Math.round(st.cy)}, ${Math.round(st.w)})`)
      check(st.overflow <= 0 && st.dock, `${size.name}: on the stage nothing overflows sideways and the dock is told the keys have left`)
      await page.screenshot({ path: path.join(out, `${size.name}-stage.png`), captureBeyondViewport: false })
      await page.evaluate(() => window.scrollTo(0, 0))
      await wait(600)
      const back = await page.evaluate(() => ({ words: getComputedStyle(document.querySelector('.sea-hero .sea-in')).opacity, moved: document.querySelector('.sea-sign__disc').style.transform, dock: document.documentElement.classList.contains('sea-focus-out') }))
      check(back.words === '1' && back.moved === '' && !back.dock, `${size.name}: back at the top the words and the sheet are where they were`)
    } else {
      process.stdout.write(`     ${size.name}: no hold here (the hero is taller than the screen): a plain hero\n`)
    }
    await page.waitForFunction(() => document.querySelector('.sea-sign__src')?.ended === true, { timeout: 40000 }).catch(() => {})
    await wait(400)
    const end = await state(page)
    check(!!end.video?.ended && !!end.button?.offered && end.button.word.startsWith('Replay'), `${size.name}: the film ended and Replay is offered`)
    check(!!end.button?.box && end.button.box[0] >= 44 && end.button.box[1] >= 44 && end.button.box[2] >= 0 && end.button.box[3] <= size.h, `${size.name}: Replay is a 44 px target on the screen (${end.button?.box})`)
    await page.screenshot({ path: path.join(out, `${size.name}-signed.png`), captureBeyondViewport: false })
    check(errors.length === 0, `${size.name}: no page errors${errors.length ? ` (${errors.slice(0, 3).join(' | ')})` : ''}`)
    await page.close()
  }

  // autoplay refused: the browser rejects every play() that the page starts by itself
  {
    const { page } = await open(SIZES[0], 'motion=full', () => { HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException('refused', 'NotAllowedError')) } })
    await page.waitForFunction(() => { const b = document.querySelector('.sea-sign__again'); return !!b && !b.hidden }, { timeout: 20000 }).catch(() => {})
    await wait(600)
    const s = await state(page)
    check(s.shows === 'signed' && !!s.button?.offered && s.button.word.startsWith('Play'), `refused: the signed sheet and Play, not an empty sheet (${JSON.stringify(s)})`)
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
    const plain = await page.evaluate(() => document.querySelector('.sea-focus').classList.contains('is-plain'))
    check(ran && !!s.video?.paused && s.shows === 'signed' && !s.button?.offered && plain, `stop switch: the film stops, the signed sheet shows, no control, and the hold lets go (${JSON.stringify(s)})`)
    await page.close()
  }

  // calm: on request only
  {
    const { page } = await open(SIZES[0], 'calm=1')
    await wait(4500)
    const s = await state(page)
    check(s.shows === 'signed' && s.video?.src === '' && !!s.button?.offered && s.button.word.startsWith('Play'), `calm: the signed sheet, no file fetched, Play offered (${JSON.stringify(s)})`)
    await page.evaluate(() => document.querySelector('.sea-sign__again')?.click())
    check(await playing(page, 12000), 'calm: Play fetches the film and plays it')
    await page.close()
  }

  // reduce: a picture, no film
  {
    const { page } = await open(SIZES[0], 'reduce=1')
    await wait(2500)
    const s = await state(page)
    check(!s.video && !s.button && s.shows === 'signed', `reduce: the signed sheet as a picture, no film, no control (${JSON.stringify(s)})`)
    await page.screenshot({ path: path.join(out, 'reduce-390.png'), captureBeyondViewport: false })
    await page.close()
  }

  // JavaScript off: the prerendered page alone
  {
    const page = await browser.newPage()
    await page.setJavaScriptEnabled(false)
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    await page.goto(`${base}/`, { waitUntil: 'load' })
    await wait(800)
    const s = await page.evaluate(() => {
      const img = document.querySelector('.sea-sign__disc img'), d = document.querySelector('.sea-sign__disc')?.getBoundingClientRect()
      const r = img?.getBoundingClientRect()
      return img && d && r ? { loaded: img.naturalWidth > 0, fills: Math.abs(r.left - d.left) < 2 && Math.abs(r.top - d.top) < 2 && Math.abs(r.width - d.width) < 2, w: Math.round(r.width) } : null
    })
    check(!!s && s.loaded && s.fills && s.w >= 96, `no JavaScript: the signed sheet is a picture that fills the disc (${JSON.stringify(s)})`)
    await page.screenshot({ path: path.join(out, 'nojs-390.png'), captureBeyondViewport: false })
    await page.close()
  }

  // the gate: the old hero, whole
  {
    const { page, errors } = await open(SIZES[3], 'motion=full&hero=reel')
    await wait(6000)
    const s = await page.evaluate(() => ({ cls: document.documentElement.className.match(/sea-hero-\w+/g), pen: !!document.querySelector('.sea-sign'), lens: !!document.querySelector('.sea-focus__lens'), hold: (() => { const w = document.querySelector('.sea-focus'), h = document.querySelector('.sea-hero'); return w.classList.contains('is-plain') ? 0 : Math.round((w.offsetHeight - h.offsetHeight) / innerHeight * 100) })() }))
    check(s.cls?.length === 1 && s.cls[0] === 'sea-hero-reel' && !s.pen && s.lens && (s.hold === 0 || s.hold === 110) && errors.length === 0, `?hero=reel: the old hero and its own hold, none of the new hero's classes (${JSON.stringify(s)}${errors.length ? ' ' + errors[0] : ''})`)
    await page.close()
  }
} finally {
  await browser.close()
}
process.stdout.write(fails.length ? `\n${fails.length} failed\n` : '\nall checks passed\n')
process.exit(fails.length ? 1 : 0)
