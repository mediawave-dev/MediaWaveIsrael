// Screenshots for the work wheel and the work list (src/sun). One source: src/data/work.json.
// Usage: node scripts/capture-work.mjs [slug ...]   (no slug = every project with a url)
// Writes public/work/<slug>-phone.webp (tall phone page), -phone-s.webp (work list), -desk.webp,
// and the wheel's two cards, -card-top.webp and -card-mid.webp.
// A project with "scenes" (offsets in CSS px down its 390 px wide page) also gets -card-s1.webp, -card-s2.webp ...
// Only new cards from the shots on disk: node scripts/capture-work.mjs --cards
import puppeteer from 'puppeteer'
import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'node:fs'

const all = JSON.parse(readFileSync('src/data/work.json', 'utf8'))
const cardsOnly = process.argv.includes('--cards')
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
// "capture": false keeps a project's hand-made shots (the old MediaWave site needs a GPU browser);
// "captureUrl" shoots another address than the public one (an archived copy of a site whose domain lapsed)
const list = all.filter((p) => !cardsOnly && p.url && p.capture !== false && (!only.length || only.includes(p.slug)))
mkdirSync('public/work', { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
for (const p of list) {
  for (const shot of [
    { tag: 'phone', w: 390, h: 844, tall: 2110, mobile: true },
    { tag: 'desk', w: 1440, h: 900, tall: 900, mobile: false },
  ]) {
    const page = await browser.newPage()
    await page.setViewport({ width: shot.w, height: shot.h, deviceScaleFactor: 2, isMobile: shot.mobile, hasTouch: shot.mobile })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    // a returning visitor: no cookie banner, no once-per-visit opening
    await page.evaluateOnNewDocument(() => {
      try { localStorage.setItem('mw_cookie_consent', 'accepted'); sessionStorage.setItem('mw-sea-intro', '1'); sessionStorage.setItem('mw-logo-ident', '1') } catch {}
    })
    await page.goto(p.captureUrl || p.url, { waitUntil: 'networkidle2', timeout: 90000 }).catch((e) => console.log(p.slug, 'goto:', e.message))
    await wait(3000)
    if (shot.tall > shot.h) {
      // walk the page once so lazy images and reveal-on-scroll blocks are in, then back to the top
      for (let y = 0; y <= shot.tall; y += 400) { await page.evaluate((v) => window.scrollTo(0, v), y); await wait(250) }
      await page.evaluate(() => window.scrollTo(0, 0)); await wait(800)
    }
    const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: shot.w, height: shot.tall } })
    await page.close()
    const base = `public/work/${p.slug}-${shot.tag}`
    if (shot.tag === 'phone') {
      await sharp(buf).resize({ width: 640 }).webp({ quality: 72 }).toFile(`${base}.webp`)
      await sharp(buf).resize({ width: 360 }).webp({ quality: 68 }).toFile(`${base}-s.webp`)
    } else {
      await sharp(buf).resize({ width: 1280 }).webp({ quality: 74 }).toFile(`${base}.webp`)
    }
    console.log('  ', base)
  }
  // more scenes of the same page: the phone's own screen at each offset (a card is one screen, 390 x 780)
  if (p.scenes?.length) {
    const page = await browser.newPage()
    await page.setViewport({ width: 390, height: 780, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
    await page.goto(p.captureUrl || p.url, { waitUntil: 'networkidle2', timeout: 90000 }).catch((e) => console.log(p.slug, 'goto:', e.message))
    await wait(3000)
    // walk down to the last scene once, so lazy pictures on the way are loaded
    for (let y = 0; y <= Math.max(...p.scenes) + 780; y += 400) { await page.evaluate((v) => window.scrollTo(0, v), y); await wait(250) }
    for (const [i, y] of p.scenes.entries()) {
      await page.evaluate((v) => window.scrollTo(0, v), y)
      await wait(1200)
      // the viewport itself, not a clip: a clip is in document coordinates, and an RTL page's x origin is not its left edge
      const buf = await page.screenshot({ type: 'png' })
      await sharp(buf).resize({ width: 448 }).webp({ quality: 66 }).toFile(`public/work/${p.slug}-card-s${i + 1}.webp`)
      console.log('  ', `public/work/${p.slug}-card-s${i + 1}`)
    }
    await page.close()
  }
}
await browser.close()

// The wheel cards: two small crops of every project's phone page (its top, and a part further down),
// cut from the shots on disk, so this step needs no network and covers the hand-made shots too.
for (const p of all) {
  const src = `public/work/${p.slug}-phone.webp`
  const { width, height } = await sharp(src).metadata()
  const h = Math.round(width * 2)
  for (const [tag, top] of [['top', 0], ['mid', Math.round((height - h) * 0.46)]]) {
    await sharp(src).extract({ left: 0, top, width, height: h }).resize({ width: 448 }).webp({ quality: 66 }).toFile(`public/work/${p.slug}-card-${tag}.webp`)
  }
  console.log('  ', `public/work/${p.slug}-card-*`)
}
