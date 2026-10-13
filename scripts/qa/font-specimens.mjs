// Renders the real KM page (Klein palette) with four font options, for Nati to choose from.
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const URL = 'http://localhost:5180/?motion=full'
const FACES = `
@font-face { font-family: 'EFT Betaamango'; src: url('/fonts/EFT_Betaamango.woff2') format('woff2'); font-weight: 400; font-display: block; }
@font-face { font-family: 'EFT OffSet'; src: url('/fonts/EFT_OffSet-Bold.woff2') format('woff2'); font-weight: 700; font-display: block; }`
const GF = 'https://fonts.googleapis.com/css2?family=Bona+Nova:wght@400;700&family=Outfit:wght@300;400;600&display=block'
const OPTS = {
  A: { label: 'A · המקור: EFT Betaamango + EFT OffSet (+ Outfit לאנגלית)', css: `--display: 'Outfit', 'EFT Betaamango', sans-serif; --display-w: 400; --text: 'Outfit', 'EFT OffSet', sans-serif; --ui: 'Outfit', 'EFT OffSet', sans-serif; --ui-w: 700;` },
  B: { label: 'B · Bona Nova לכותרות + EFT OffSet לטקסט', css: `--display: 'Bona Nova', serif; --display-w: 400; --text: 'Outfit', 'EFT OffSet', sans-serif; --ui: 'Outfit', 'EFT OffSet', sans-serif; --ui-w: 700;` },
  C: { label: 'C · EFT Betaamango לכותרות + Bona Nova לטקסט', css: `--display: 'Outfit', 'EFT Betaamango', sans-serif; --display-w: 400; --text: 'Bona Nova', serif; --ui: 'Bona Nova', serif; --ui-w: 700;` },
  D: { label: 'D · היום בבראנץ׳: Assistant + Alef', css: `` },
}
const browser = await puppeteer.launch({ headless: true })
for (const [k, o] of Object.entries(OPTS)) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 860, deviceScaleFactor: 1 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true'); localStorage.setItem('cookie-consent', 'declined') } catch {} })
  await page.goto(URL, { waitUntil: 'load', timeout: 60000 })
  if (o.css) {
    await page.addStyleTag({ url: GF })
    await page.addStyleTag({ content: FACES + `\nhtml[data-look] { ${o.css} } html[data-look] body { font-family: var(--text); }` })
  }
  await page.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 2500))
  await page.screenshot({ path: `G:/tmp/mw-qa/font-${k}-hero.png`, captureBeyondViewport: false })
  // a text section: the FAQ (paper void, headings + questions + an open answer)
  await page.evaluate(() => { const f = document.querySelector('#faq'); const b = f?.querySelector('button[aria-expanded="false"]'); b?.click(); window.scrollTo(0, (f?.getBoundingClientRect().top ?? 0) + scrollY - 40) })
  await new Promise((r) => setTimeout(r, 1800))
  await page.screenshot({ path: `G:/tmp/mw-qa/font-${k}-text.png`, captureBeyondViewport: false })
  const used = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')).filter((v, i, a) => a.indexOf(v) === i).join(', '))
  console.log(k, 'loaded:', used)
  await page.close()
}
await browser.close()
