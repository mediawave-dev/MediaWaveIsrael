// QA · the signature (D232): the ink film on the emptied stage, checked on a served build.
//   node scripts/qa/ink-sign.mjs http://localhost:4317 [out-dir]
// 1. At five sizes (a phone, a small phone, a phone on its side, a desktop, a short desktop) it scrolls to the
//    stage and checks that the sentence, the disc and Replay fit one screen, that nothing overflows sideways, that
//    the film starts by itself, runs to its end and leaves Replay, and that the page logged no error.
// 2. Autoplay refused (play() rejects): the finished sheet and Play, never an empty sheet.
// 3. The accessibility stop switch pressed while the film runs: the film stops and the finished sheet shows.
// 4. ?calm=1: the finished sheet, no file fetched; Play fetches and plays it.
// 5. ?reduce=1: only the finished sheet (no video, no control).
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

/** A page at the stage: consent stored, the lead popup off, scrolled just past the stage's mark. */
async function open(size, query, before) {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|consent|gtag|analytics/i.test(m.text())) errors.push(m.text()) })
  await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: size.phone ? 2 : 1, isMobile: !!size.phone, hasTouch: !!size.phone })
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'rejected'); sessionStorage.setItem('leadModalClosed', 'true') } catch { /* private mode */ } })
  if (before) await page.evaluateOnNewDocument(before)
  await page.goto(`${base}/?${query}&lead=off`, { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'), { timeout: 20000 }).catch(() => {})
  const top = await page.evaluate(() => { const el = document.querySelector('.sea-empty'); return el ? el.getBoundingClientRect().top + window.scrollY : -1 })
  if (top > 0) await page.evaluate((y, h) => window.scrollTo(0, y + h * 0.2), top, size.h)
  return { page, errors, found: top > 0 }
}
const state = (page) => page.evaluate(() => {
  const v = document.querySelector('.sea-sign__film'), b = document.querySelector('.sea-sign__again'), img = document.querySelector('.sea-sign__sheet')
  const br = b?.getBoundingClientRect()
  return {
    video: v ? { src: (v.currentSrc || v.getAttribute('src') || '').split('/').pop(), t: v.currentTime, paused: v.paused, ended: v.ended, shown: getComputedStyle(v).opacity } : null,
    button: b ? { offered: !b.hidden, word: b.textContent, name: b.getAttribute('aria-label'), box: br ? [Math.round(br.width), Math.round(br.height), Math.round(br.top), Math.round(br.bottom)] : null } : null,
    sheet: img ? img.currentSrc.split('/').pop() : null,
  }
})

try {
  for (const size of SIZES) {
    const { page, errors, found } = await open(size, 'motion=full')
    check(found, `${size.name}: the emptied stage is on the page`)
    if (!found) { await page.close(); continue }
    await wait(3200)
    const fit = await page.evaluate(() => {
      const say = document.querySelector('.sea-empty__say')?.getBoundingClientRect(), disc = document.querySelector('.sea-sign__disc')?.getBoundingClientRect(), fig = document.querySelector('.sea-sign')?.getBoundingClientRect()
      return say && disc && fig ? { on: !!document.querySelector('.sea-empty.is-on'), say: [say.top, say.bottom], disc: [disc.top, disc.bottom, disc.width], fig: fig.bottom, vh: innerHeight, overflow: document.documentElement.scrollWidth - innerWidth } : null
    })
    check(!!fit, `${size.name}: the sentence and the signature are in the stage`)
    if (!fit) { await page.close(); continue }
    check(fit.on, `${size.name}: the stage is on`)
    check(fit.say[0] >= 0 && fit.fig <= fit.vh + 1 && fit.say[1] <= fit.disc[0] + 24, `${size.name}: the sentence, the disc and Replay's row fit one screen (top ${Math.round(fit.say[0])}, bottom ${Math.round(fit.fig)} of ${fit.vh}, disc ${Math.round(fit.disc[2])})`)
    check(fit.overflow <= 0, `${size.name}: no sideways overflow (${fit.overflow})`)
    const mid = await state(page)
    check(!!mid.video && !mid.video.paused && mid.video.t > 0.5, `${size.name}: the film started by itself`)
    check(mid.video?.src === (size.w < 768 ? 'ink-m.webm' : 'ink.webm'), `${size.name}: the right encode (${mid.video?.src})`)
    await page.screenshot({ path: path.join(out, `${size.name}-drawing.png`) })
    await page.waitForFunction(() => document.querySelector('.sea-sign__film')?.ended === true, { timeout: 30000 }).catch(() => {})
    await wait(400)
    const end = await state(page)
    check(!!end.video?.ended && !!end.button?.offered && end.button.word === 'Replay' && end.button.name.startsWith('Replay'), `${size.name}: the film ended and Replay is offered`)
    check(!!end.button?.box && end.button.box[0] >= 44 && end.button.box[1] >= 44 && end.button.box[3] <= size.h, `${size.name}: Replay is a 44 px target on the screen (${end.button?.box})`)
    await page.screenshot({ path: path.join(out, `${size.name}-signed.png`) })
    check(errors.length === 0, `${size.name}: no page errors${errors.length ? ` (${errors.slice(0, 3).join(' | ')})` : ''}`)
    await page.close()
  }

  // autoplay refused: the browser rejects every play() that the page starts by itself
  {
    const { page } = await open(SIZES[0], 'motion=full', () => { HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException('refused', 'NotAllowedError')) } })
    await wait(2600)
    const s = await state(page)
    check(s.sheet === 'ink-signed.webp' && s.video?.shown === '0' && !!s.button?.offered && s.button.word === 'Play', `refused: the finished sheet and Play, not an empty sheet (${JSON.stringify(s)})`)
    await page.screenshot({ path: path.join(out, 'refused-390.png') })
    await page.close()
  }

  // the stop switch, pressed while the film runs
  {
    const { page } = await open(SIZES[0], 'motion=full')
    await wait(3000)
    const before = await state(page)
    await page.evaluate(() => document.documentElement.classList.add('disable-animations'))
    await wait(700)
    const s = await state(page)
    check(!!before.video && !before.video.paused && !!s.video?.paused && s.video.shown === '0' && s.sheet === 'ink-signed.webp' && !s.button?.offered, `stop switch: the film stops, the finished sheet shows, no control (${JSON.stringify(s)})`)
    await page.close()
  }

  // calm: on request only
  {
    const { page } = await open(SIZES[0], 'calm=1')
    await wait(2200)
    const s = await state(page)
    check(s.sheet === 'ink-signed.webp' && s.video?.src === '' && !!s.button?.offered && s.button.word === 'Play', `calm: the finished sheet, no file fetched, Play offered (${JSON.stringify(s)})`)
    await page.evaluate(() => document.querySelector('.sea-sign__again').click())
    await wait(2500)
    const p = await state(page)
    check(!!p.video && !p.video.paused && p.video.t > 0.3 && !p.button?.offered, `calm: Play fetches the film and plays it (${JSON.stringify(p.video)})`)
    await page.close()
  }

  // reduce: a picture, no film
  {
    const { page } = await open(SIZES[0], 'reduce=1')
    await page.evaluate(() => document.querySelector('.sea-sign')?.scrollIntoView({ block: 'center' }))
    await wait(1200)
    const s = await state(page)
    const shown = await page.evaluate(() => { const img = document.querySelector('.sea-sign__sheet'); return !!img && img.naturalWidth > 0 && getComputedStyle(document.querySelector('.sea-sign')).opacity === '1' })
    check(!s.video && !s.button && s.sheet === 'ink-signed.webp' && shown, 'reduce: the signed sheet as a picture, no film, no control')
    await page.screenshot({ path: path.join(out, 'reduce-390.png') })
    await page.close()
  }
} finally {
  await browser.close()
}
process.stdout.write(fails.length ? `\n${fails.length} failed\n` : '\nall checks passed\n')
process.exit(fails.length ? 1 : 0)
