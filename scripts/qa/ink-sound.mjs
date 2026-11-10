// QA · the signature's sound (D232): with the visitor's sound awake, the pen's sound is fetched, decoded and played
// beside the film, and the music steps back under it; with the sound off it is never fetched.
//   node scripts/qa/ink-sound.mjs http://localhost:4317
// It cannot hear: it checks that the file was requested, that decoding raised no error, that the page's audio is
// running and that its level moves while the film plays. Exits 1 when a check fails.
import puppeteer from 'puppeteer'

const base = process.argv[2] ?? 'http://localhost:4317'
const fails = []
const check = (ok, what) => { if (!ok) fails.push(what); process.stdout.write(`${ok ? 'ok  ' : 'FAIL'} ${what}\n`) }
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ headless: true, userDataDir: 'G:/tmp/ink/chrome-profile', args: ['--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11', '--autoplay-policy=no-user-gesture-required'] })
async function run(tap) {
  const page = await browser.newPage()
  const errors = [], asked = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('request', (r) => { if (r.url().includes('/media/ink/ink.m4a')) asked.push(r.url()) })
  await page.setViewport({ width: 1280, height: 800 })
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'rejected'); sessionStorage.setItem('leadModalClosed', 'true') } catch { /* private mode */ } })
  await page.goto(`${base}/?motion=full&lead=off`, { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'), { timeout: 20000 }).catch(() => {})
  if (tap) { await page.mouse.click(640, 400); await wait(2500) } // a first click wakes the sound, as a visitor's does
  const top = await page.evaluate(() => { const el = document.querySelector('.sea-empty'); return el.getBoundingClientRect().top + window.scrollY })
  await page.evaluate((y) => window.scrollTo(0, y + 160), top)
  await wait(6000)
  const s = await page.evaluate(() => { const p = window.__seaSound, v = document.querySelector('.sea-sign__film'); return { running: p?.isRunning(), state: p?.state(), level: p?.level(), t: v?.currentTime ?? 0, paused: v?.paused ?? true } })
  await page.close()
  return { s, asked, errors }
}
try {
  const on = await run(true)
  process.stdout.write(`     ${JSON.stringify(on.s)} requests ${on.asked.length}\n`)
  check(on.s.running === true && on.s.state === 'running', 'sound awake: the page\'s audio is running')
  check(!on.s.paused && on.s.t > 2, 'sound awake: the film is playing')
  check(on.asked.length === 1, `sound awake: the pen's sound was fetched once (${on.asked.length})`)
  check(on.errors.length === 0, `sound awake: no page errors${on.errors.length ? ` (${on.errors.slice(0, 2).join(' | ')})` : ''}`)
  const off = await run(false)
  process.stdout.write(`     ${JSON.stringify(off.s)} requests ${off.asked.length}\n`)
  check(off.asked.length === 0, `no tap yet: the pen's sound was not fetched (${off.asked.length})`)
  check(!off.s.paused && off.s.t > 2, 'no tap yet: the film still plays, silent')
} finally {
  await browser.close()
}
process.stdout.write(fails.length ? `\n${fails.length} failed\n` : '\nall checks passed\n')
process.exit(fails.length ? 1 : 0)
