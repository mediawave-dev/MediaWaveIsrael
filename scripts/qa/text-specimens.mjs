// Body/UI font options on the real KM page (Klein, Betaamango headings). Four frames per option.
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const URL = 'http://localhost:5180/?motion=full'
const GF = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;600&family=IBM+Plex+Sans:wght@400;600&family=Miriam+Libre:wght@400;600&family=Bona+Nova:wght@400;700&family=Cascadia+Code:wght@400;600&display=block'
const OPTS = {
  A: `--text: 'IBM Plex Sans', 'IBM Plex Sans Hebrew', sans-serif; --ui: var(--text); --ui-w: 600;`,
  B: `--text: 'Miriam Libre', sans-serif; --ui: var(--text); --ui-w: 600;`,
  C: `--text: 'Bona Nova', serif; --ui: var(--text); --ui-w: 700;`,
  D: `--text: 'IBM Plex Sans', 'IBM Plex Sans Hebrew', sans-serif; --ui: 'Cascadia Code', monospace; --ui-w: 600;`,
}
const WEIGHT = { A: 400, B: 400, C: 400, D: 400 }
const browser = await puppeteer.launch({ headless: true })
for (const [k, css] of Object.entries(OPTS)) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 860, deviceScaleFactor: 1 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true') } catch {} })
  await page.goto(URL, { waitUntil: 'load', timeout: 60000 })
  await page.addStyleTag({ url: GF })
  await page.addStyleTag({ content: `html[data-look] { ${css} } html[data-look] body { font-family: var(--text); font-weight: ${WEIGHT[k]}; } .mw-consent { display: none !important; }` })
  await page.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 2200))
  const shots = []
  const at = async (sel, dy, name) => {
    await page.evaluate((sel, dy) => { const el = document.querySelector(sel); if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY + dy) }, sel, dy)
    await new Promise((r) => setTimeout(r, 1500))
    const p = `G:/tmp/mw-qa/txt-${k}-${name}.png`
    await page.screenshot({ path: p, captureBeyondViewport: false }); shots.push(p)
  }
  await at('#hero', 0, '1')
  await at('#why-us', -20, '2')
  await page.evaluate(() => { const b = document.querySelector('#faq button[aria-expanded="false"]'); b?.click() })
  await at('#faq', -30, '3')
  await at('#contact', -20, '4')
  await page.close()
  console.log(k, 'ok')
}
await browser.close()
