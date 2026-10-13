/**
 * The social share image (public/og-image.png, 1200x630): the Horizon logo, stacked version
 * (DECISIONS #52), on the stage's Klein night (#58) with the tagline in the display face (#59). No
 * gradient, no shadow, nothing behind the logo (brand rules); clear space well beyond half
 * the disc. Run: node scripts/generate-og-image.mjs
 */
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import puppeteer from 'puppeteer'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = resolve(ROOT, 'public/og-image.png')
const STACKED = readFileSync(resolve(ROOT, 'logos/horizon/mediawave-stacked-dark.svg'), 'utf8')
// inlined: a page set from a string may not load file:// fonts
const pub = (f) => `data:font/woff2;base64,${readFileSync(resolve(ROOT, 'public/fonts', f)).toString('base64')}`

const HTML = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<style>
  @font-face { font-family: 'MW Display'; src: url('${pub('EFT_Betaamango.woff2')}') format('woff2'); unicode-range: U+0590-05FF, U+20AA, U+FB1D-FB4F; }
  @font-face { font-family: 'MW Display'; src: url('${pub('Outfit-Latin-500.woff2')}') format('woff2'); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden; background: #00113D;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 72px; /* > half the disc (55 px): the logo's clear space */
    font-family: 'MW Display', sans-serif; direction: rtl;
  }
  .logo { width: 400px; }
  .logo svg { display: block; width: 100%; height: auto; overflow: visible; }
  .line { font-size: 46px; font-weight: 400; color: #FFFFFF; line-height: 1; }
  .url { position: absolute; bottom: 40px; font-size: 22px; font-weight: 400; color: #8E9CC8; direction: ltr; }
</style>
</head>
<body>
  <div class="logo">${STACKED}</div>
  <div class="line">פיתוח אתרים שמביא לקוחות</div>
  <div class="url">mediawave.co.il</div>
</body>
</html>`

async function generate() {
  console.log('Generating OG image (1200x630)...')
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  await page.setContent(HTML, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: OUTPUT, type: 'png' })
  await browser.close()
  console.log(`  → ${OUTPUT}`)
}

generate().catch((err) => { console.error(err); process.exit(1) })
