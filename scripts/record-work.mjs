// Videos for the work wheel (D259): each card is a real recording of the site, scrolled slowly with all its own motion
// on, played in a loop inside the phone. One source: src/data/work.json. Needs ffmpeg on the PATH.
// Usage: node scripts/record-work.mjs [slug ...]
// Per card: "rec" in work.json, { "top": [from, to, seconds], "s1": [from, to, seconds] }; default [cardTop, cardTop + 2400, 11].
// Writes public/work/<slug>-card-<crop>.mp4 (H.264 plays everywhere; VP9 came out larger) (432 x 864, no sound).
import puppeteer from 'puppeteer'
import { readFileSync, mkdirSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const all = JSON.parse(readFileSync('src/data/work.json', 'utf8'))
const only = process.argv.slice(2)
const list = all.filter((p) => !only.length || only.includes(p.slug))
const TMP = 'C:/tmp/night/rec'
mkdirSync(TMP, { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
for (const p of list) {
  const cuts = [['top', p.top ?? 0], ...(p.scenes ?? []).slice(0, 2).map((y, i) => [`s${i + 1}`, y])]
  for (const [crop, y0] of cuts) {
    const [from, to, secs] = p.rec?.[crop] ?? [y0, y0 + 2400, 11]
    const page = await browser.newPage()
    await page.setViewport({ width: 390, height: 780, deviceScaleFactor: 1.2, isMobile: true, hasTouch: true })
    await page.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
    if (p.still) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.goto(p.captureUrl || p.url, { waitUntil: 'networkidle2', timeout: 90000 }).catch((e) => console.log(p.slug, 'goto:', e.message))
    await wait(2500)
    if (p.hide) await page.addStyleTag({ content: p.hide + ' { display: none !important }' })
    // floating buttons and badges in the lower part of the screen are not the site (the header stays)
    const hideFloating = () => page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el)
        if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
        const r = el.getBoundingClientRect()
        if (r.top > innerHeight * 0.3 && r.height < innerHeight * 0.5) el.style.setProperty('display', 'none', 'important')
      }
    })
    await page.evaluate((v) => window.scrollTo(0, v), from)
    await wait(1500)
    await hideFloating()
    const raw = `${TMP}/${p.slug}-${crop}.webm`
    rmSync(raw, { force: true })
    const rec = await page.screencast({ path: raw })
    // rest at the start, glide down with an ease, rest at the end
    await page.evaluate(async (from, to, secs) => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
      await sleep(1200)
      const t0 = performance.now(), dur = secs * 1000
      await new Promise((done) => {
        const step = (t) => {
          const k = Math.min(1, (t - t0) / dur)
          const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
          window.scrollTo(0, from + (to - from) * e)
          if (k < 1) requestAnimationFrame(step); else done()
        }
        requestAnimationFrame(step)
      })
      await sleep(1200)
    }, from, to, secs)
    await rec.stop()
    await page.close()
    const out = `public/work/${p.slug}-card-${crop}`
    const vf = 'scale=432:864:force_original_aspect_ratio=increase,crop=432:864,fps=30'
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-vf', vf, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${out}.mp4`])
    console.log('  ', out + '.mp4')
  }
}
await browser.close()
