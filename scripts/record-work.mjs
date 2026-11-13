// Videos for the work wheel (D259, D260): each card is a recording of the client's site, scrolled with all of its own
// motion, played in a loop inside the phone. One source: src/data/work.json. Needs ffmpeg on the PATH.
//
// D260, frame-exact: the page's clock is ours. A virtual clock replaces performance.now, Date, requestAnimationFrame,
// setTimeout and setInterval, and every CSS animation is paused and stepped by hand. Each frame of the video is one
// step of exactly 1/60 s on that clock, then a screenshot, so the result is a true 60 fps however slowly the machine
// renders: no dropped frames, no jumps. The scroll follows a smooth curve (rest, glide down, rest, glide back up,
// rest), and the first and last half second are blended, so the loop has no seam.
//
// Usage: node scripts/record-work.mjs [slug ...] [--fps=60] [--preview] [--out=dir] [--rec=slug:crop:from:to:secs]
//   [--still=slug:1|0] [--url=slug:address] [--gpu=slug] [--poke=slug]
//   --crop=top|s1: render one card of the slug only.
//   --gpu: render with the machine's graphics card (a page that refuses software WebGL, like the old MediaWave hero).
//   --poke: press a key once before recording (a film that waits for the visitor's first touch). Also "gpu": true and
//   "poke": true on the project in work.json.
// D260 fixes after the first round: the page is always told the motion mode we want (Chrome otherwise follows the
// Windows animation setting); timers set while the page loaded move onto the virtual clock; CSS animations a framework
// restarts are taken over at once; raw files live in the output folder, so two runs never overwrite each other.
//   --preview: 30 fps at half size, fast. --out: another folder than public/work (for trials).
// Per card, in work.json: "rec": { "top": [from, to, secondsDown], "s1": [...] }; default [cardTop, cardTop + 2400, 11].
// Writes public/work/<slug>-card-<crop>.mp4 (H.264, 540 x 1080, 60 fps, CRF 28: at the size the phone shows it, 28 looks the
// same as 24 and weighs about a third less).
import puppeteer from 'puppeteer'
import { readFileSync, mkdirSync, rmSync } from 'node:fs'
import { spawn, execFileSync } from 'node:child_process'

const args = process.argv.slice(2)
const flag = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d }
const PREVIEW = args.includes('--preview')
const FPS = +flag('fps', PREVIEW ? 30 : 60)
const DPR = PREVIEW ? 1 : 2
const OUT_W = PREVIEW ? 270 : 540, OUT_H = OUT_W * 2
const only = args.filter((a) => !a.startsWith('--'))
const OUTDIR = flag('out', 'public/work')
const all = JSON.parse(readFileSync('src/data/work.json', 'utf8'))
const list = all.filter((p) => !only.length || only.includes(p.slug))
const TMP = 'C:/tmp/night/rec'
mkdirSync(TMP, { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// The virtual clock. Off while the page loads (everything runs on real time), on from V.start().
const CLOCK = `(() => {
  const real = {
    now: performance.now.bind(performance), dnow: Date.now,
    raf: window.requestAnimationFrame.bind(window), caf: window.cancelAnimationFrame.bind(window),
    st: window.setTimeout.bind(window), ct: window.clearTimeout.bind(window),
    si: window.setInterval.bind(window), ci: window.clearInterval.bind(window),
  }
  const V = { on: false, t: 0, base: 0, dbase: 0, rafs: new Map(), id: 1e9, timers: new Map() }
  const pre = new Map() // PATCH 2: real timers set before V.start, by their real id
  Object.defineProperty(window, '__vclock', { value: V })
  performance.now = () => (V.on ? V.t : real.now())
  const RealDate = Date
  const vnow = () => (V.on ? V.dbase + (V.t - V.base) : real.dnow())
  function VDate(...a) {
    if (!new.target) return new RealDate(vnow()).toString()
    return a.length ? new RealDate(...a) : new RealDate(vnow())
  }
  VDate.prototype = RealDate.prototype
  VDate.now = vnow; VDate.UTC = RealDate.UTC; VDate.parse = RealDate.parse
  window.Date = VDate
  window.requestAnimationFrame = (cb) => { if (!V.on) return real.raf(cb); const id = ++V.id; V.rafs.set(id, cb); return id }
  window.cancelAnimationFrame = (id) => { if (!V.rafs.delete(id)) real.caf(id) }
  window.setTimeout = (cb, ms, ...a) => {
    if (typeof cb !== 'function') return real.st(cb, ms, ...a)
    if (!V.on) { const x = { cb, a, at: real.now() + Math.max(0, +ms || 0) }; const id = real.st((...y) => { pre.delete(id); cb(...y) }, ms, ...a); pre.set(id, x); return id }
    const id = ++V.id; V.timers.set(id, { cb, at: V.t + Math.max(0, +ms || 0), a }); return id
  }
  window.setInterval = (cb, ms, ...a) => {
    if (typeof cb !== 'function') return real.si(cb, ms, ...a)
    const every = Math.max(4, +ms || 4)
    if (!V.on) { const x = { cb, a, every, at: real.now() + every }; const id = real.si((...y) => { x.at = real.now() + every; cb(...y) }, ms, ...a); pre.set(id, x); return id }
    const id = ++V.id; V.timers.set(id, { cb, at: V.t + every, every, a }); return id
  }
  window.clearTimeout = (id) => { if (pre.delete(id)) return real.ct(id); if (!V.timers.delete(id)) real.ct(id) }
  window.clearInterval = (id) => { if (pre.delete(id)) return real.ci(id); if (!V.timers.delete(id)) real.ci(id) }
  V.start = () => {
    V.base = V.t = real.now(); V.dbase = real.dnow(); V.on = true
    for (const [id, x] of pre) { (x.every ? real.ci : real.ct)(id); V.timers.set(id, { cb: x.cb, a: x.a, every: x.every, at: Math.max(V.t, x.at) }) }
    pre.clear()
  }
  // PATCH 4: take new animations onto the clock. A page that restarts a CSS animation (animation: none, reflow, back) gets a
  // new animation object, but the old one, paused by us, would live on as an ownerless animation and win over the new one;
  // so the older animation with the same target and name is cancelled, as CSS itself would have done.
  const key = (an) => an.animationName || an.transitionProperty || ''
  const adopt = () => {
    const all = document.getAnimations(), born = new Set()
    for (const an of all) {
      if (an.__v !== undefined) continue
      const tg = an.effect && an.effect.target, k = key(an)
      if (tg && k) for (const old of all) if (old !== an && old.__v !== undefined && old.effect && old.effect.target === tg && key(old) === k) { try { old.cancel() } catch (e) {} }
      an.__v = an.currentTime || 0; an.pause(); try { an.currentTime = an.__v } catch (e) {}
      born.add(an)
    }
    return born
  }
  // one step: timers that fall due run in order at their own time, CSS animations move by dt, then the frame's callbacks
  V.step = (dt) => {
    const end = V.t + dt
    for (let guard = 0; guard < 500; guard++) {
      let next = null
      for (const [id, x] of V.timers) if (x.at <= end && (!next || x.at < next[1].at)) next = [id, x]
      if (!next) break
      const [id, x] = next
      V.t = Math.max(V.t, x.at)
      if (x.every) x.at += x.every; else V.timers.delete(id)
      try { x.cb(...x.a) } catch (e) {}
    }
    V.t = end
    const born = adopt()
    for (const an of document.getAnimations()) {
      if (an.__v === undefined || born.has(an)) continue
      an.__v += dt * (an.playbackRate || 1)
      try { an.currentTime = an.__v } catch (e) {}
    }
    for (const v of document.querySelectorAll('video')) { if (!v.paused) v.pause(); if (v.duration) v.currentTime = (v.currentTime + dt / 1000) % v.duration }
    const cbs = [...V.rafs.values()]; V.rafs.clear()
    for (const cb of cbs) { try { cb(V.t) } catch (e) {} }
  }
  // PATCH 3: three posted-message hops (so the framework's own scheduler message, posted from a microtask, runs first),
  // then catch the animations its commit created, at once
  V.flush = () => new Promise((r) => {
    let n = 0
    const ch = new MessageChannel()
    ch.port1.onmessage = () => { if (++n < 3) return ch.port2.postMessage(0); ch.port1.close(); adopt(); r() }
    ch.port2.postMessage(0)
  })
})()`

// C2-smooth ease: starts and stops with no jolt in speed or in acceleration
const smoother = (k) => k * k * k * (k * (k * 6 - 15) + 10)
/** The scroll position at time t (seconds): rest, glide down, rest, glide back up, rest. */
function path(from, to, down) {
  const up = Math.max(3, down * 0.42)
  const seg = [[1.2, from, from], [down, from, to], [1.0, to, to], [up, to, from], [0.9, from, from]]
  const total = seg.reduce((s, x) => s + x[0], 0)
  return {
    total,
    at(t) {
      for (const [d, a, b] of seg) { if (t <= d) return a + (b - a) * smoother(Math.min(1, t / d)); t -= d }
      return from
    },
  }
}

const want = (k, p) => p[k] === true || args.includes(`--${k}=${p.slug}`)
let gpuBrowser = null
const gpu = async () => (gpuBrowser ??= await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--disable-threaded-scrolling', '--disable-threaded-animation'] }))
const browser = await puppeteer.launch({
  headless: 'shell',
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars', '--disable-threaded-scrolling', '--disable-threaded-animation'],
})
for (const p of list) {
  const cuts = [['top', p.top ?? 0], ...(p.scenes ?? []).slice(0, 2).map((y, i) => [`s${i + 1}`, y])]
  for (const [crop, y0] of cuts) {
    if (flag('crop') && flag('crop') !== crop) continue
    // --rec=<slug>:<crop>:<from>:<to>:<secondsDown> tries a range without touching work.json
    const over = args.filter((a) => a.startsWith(`--rec=${p.slug}:${crop}:`)).map((a) => a.split(':').slice(2).map(Number))[0]
    const [from, to, down] = over ?? p.rec?.[crop] ?? [y0, y0 + 2400, 11]
    const tl = path(from, to, down)
    const frames = Math.round(tl.total * FPS)
    const page = await (want('gpu', p) ? await gpu() : browser).newPage()
    await page.setViewport({ width: 390, height: 780, deviceScaleFactor: DPR, isMobile: true, hasTouch: true })
    await page.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
    await page.evaluateOnNewDocument(CLOCK)
    // --still=<slug>:1|0 and --url=<slug>:<address> try a project's reduced mode or another address without touching work.json
    const stillArg = args.find((x) => x.startsWith(`--still=${p.slug}:`))
    const urlArg = args.find((x) => x.startsWith(`--url=${p.slug}:`))
    const still = stillArg ? stillArg.endsWith(':1') : p.still
    const address = urlArg ? urlArg.slice(`--url=${p.slug}:`.length) : p.captureUrl || p.url
    // always say which motion mode we want: Chrome otherwise follows the Windows animation setting (reduce on this machine)
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: still ? 'reduce' : 'no-preference' }])
    await page.goto(address, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch((e) => console.log(p.slug, 'goto:', e.message))
    await page.waitForNetworkIdle({ idleTime: 800, timeout: 30000 }).catch(() => {})
    if (p.hide) await page.addStyleTag({ content: p.hide + ' { display: none !important }' })
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important } ::-webkit-scrollbar { display: none }' })
    // walk the whole range once on real time, so lazy pictures, image sequences and reveal blocks are loaded
    for (let y = Math.min(from, to); y <= Math.max(from, to) + 800; y += 260) { await page.evaluate((v) => window.scrollTo(0, v), y); await wait(160) }
    await page.waitForNetworkIdle({ idleTime: 800, timeout: 30000 }).catch(() => {})
    await page.evaluate((v) => window.scrollTo(0, v), from)
    await wait(1500)
    // floating buttons and badges in the lower part of the screen are not the site (the header stays)
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el)
        if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
        const r = el.getBoundingClientRect()
        if (r.top > innerHeight * 0.3 && r.height < innerHeight * 0.5) el.style.setProperty('display', 'none', 'important')
      }
    })
    if (want('poke', p)) { await page.keyboard.press('Shift'); await wait(600) }
    const dt = 1000 / FPS
    await page.evaluate(() => window.__vclock.start())
    // settle on the virtual clock at the first position before the first frame is kept
    for (let i = 0; i < 45; i++) await page.evaluate(async (y, d) => { window.scrollTo(0, y); window.__vclock.step(d); await window.__vclock.flush() }, from, dt)

    const raw = `${OUTDIR}/${p.slug}-${crop}-raw.mp4`
    rmSync(raw, { force: true })
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-vf', `scale=${OUT_W}:${OUT_H}:flags=lanczos:out_range=tv`, '-color_range', 'tv', '-c:v', 'libx264', '-preset', 'medium', '-crf', '12', '-pix_fmt', 'yuv420p', raw])
    const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))))
    const t0 = Date.now()
    for (let f = 0; f < frames; f++) {
      const y = Math.round(tl.at(f / FPS) * DPR) / DPR
      await page.evaluate(async (yy, d) => { window.scrollTo(0, yy); window.__vclock.step(d); await window.__vclock.flush() }, y, dt)
      const shot = await page.screenshot({ type: 'jpeg', quality: 94, optimizeForSpeed: true })
      if (!ff.stdin.write(shot)) await new Promise((r) => ff.stdin.once('drain', r))
      if (f % (FPS * 5) === 0) process.stdout.write(`   ${p.slug}-${crop} ${f}/${frames}\r`)
    }
    ff.stdin.end()
    await done
    await page.close()

    // the seam: the last X seconds dissolve into the first X, so the loop never jumps
    const X = 0.5, T = frames / FPS
    const out = `${OUTDIR}/${p.slug}-card-${crop}.mp4`
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-filter_complex',
      `[0]split[s1][s2];[s1]trim=${X}:${T},setpts=PTS-STARTPTS,settb=AVTB,fps=${FPS}[a];[s2]trim=0:${X},setpts=PTS-STARTPTS,settb=AVTB,fps=${FPS}[b];[a][b]xfade=transition=fade:duration=${X}:offset=${(T - 2 * X).toFixed(3)},scale=out_range=tv,format=yuv420p[v]`, '-color_range', 'tv',
      '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'veryslow', '-crf', PREVIEW ? '30' : '28', '-profile:v', 'high', '-tune', 'film',
      '-g', String(FPS * 2), '-movflags', '+faststart', out])
    console.log(`   ${out}  ${frames} frames at ${FPS} fps, ${T.toFixed(1)} s, rendered in ${((Date.now() - t0) / 1000).toFixed(0)} s`)
  }
}
await browser.close()
if (gpuBrowser) await gpuBrowser.close()
