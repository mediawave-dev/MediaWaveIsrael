// Cross-page landing probe (review round 2, N1): from inner pages, the header, the menu, the header
// key and the footer must land their home chapter at the header line; so must a direct /#hash load.
//   node scripts/qa/cross-page.mjs http://localhost:4191
import puppeteer from 'puppeteer'

const BASE = (process.argv[2] || 'http://localhost:4191').replace(/\/$/, '')
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const CASES = [
  { name: 'header link #faq from a service page', vp: [1440, 900], url: '/services/landing-pages/', click: '.mw-head__nav a[href="/#faq"]', target: 'faq' },
  { name: 'header key #contact from a service page', vp: [1440, 900], url: '/services/seo-promotion/', click: '.mw-head a[href="#contact"]', target: 'contact' },
  { name: 'menu link #faq from a service page', vp: [390, 844], url: '/services/chatbots/', menu: true, click: '.mw-menu a[href="/#faq"]', target: 'faq' },
  { name: 'footer link #contact from terms', vp: [390, 844], url: '/terms/', click: 'footer a[href="/#contact"], footer a[href="#contact"]', target: 'contact' },
  { name: 'direct load /#faq', vp: [390, 844], url: '/#faq', target: 'faq' },
  { name: 'direct load /#services', vp: [1440, 900], url: '/#services', target: 'services' },
]

const browser = await puppeteer.launch({ headless: true })
let fails = 0
for (const c of CASES) {
  const page = await browser.newPage()
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.setViewport({ width: c.vp[0], height: c.vp[1] })
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'rejected') } catch { /* private mode */ } })
  await page.goto(BASE + c.url, { waitUntil: 'load' })
  await wait(2500)
  let note = ''
  try {
    if (c.menu) { await page.click('.mw-head__burger'); await wait(700) }
    if (c.click) {
      const sel = c.click.split(', ')
      let clicked = false
      for (const s of sel) { const h = await page.$(s); if (h) { await h.evaluate((el) => el.click()); clicked = true; break } }
      if (!clicked) note = 'no link ' + c.click
    }
  } catch (e) { note = String(e.message || e).slice(0, 80) }
  await wait(6000)
  const r = await page.evaluate((id) => {
    const el = document.getElementById(id)
    const head = document.querySelector('.mw-head')?.getBoundingClientRect().bottom ?? 0
    return { path: location.pathname + location.hash, top: el ? Math.round(el.getBoundingClientRect().top) : null, head: Math.round(head), y: Math.round(scrollY) }
  }, c.target)
  const ok = r.top !== null && Math.abs(r.top - r.head) <= 24
  if (!ok) fails++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name}: ${r.path} target top ${r.top} vs header ${r.head} (scrollY ${r.y}) ${note}`)
  await page.close()
}
await browser.close()
console.log(fails ? `${fails} failed` : 'all landed')
process.exit(fails ? 1 : 0)
