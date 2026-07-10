/**
 * Generate the social share image (og-image.png, 1200x630) with Puppeteer.
 * Premium navy surface + the white Swell lockup + Hebrew tagline, on the
 * current sky palette (replaces the old warm-watercolor version).
 * Run: node scripts/generate-og-image.mjs
 */
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = resolve(__dirname, '..', 'public')
const OUTPUT = resolve(PUBLIC, 'og-image.png')
const LOCKUP = readFileSync(resolve(PUBLIC, 'logo-lockup-white.svg'), 'utf8')

const HTML = `<!DOCTYPE html>
<html dir="rtl">
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: 'Heebo', 'Segoe UI', sans-serif; direction: rtl;
    background:
      radial-gradient(60% 90% at 22% 18%, rgba(56,189,248,0.20) 0%, rgba(56,189,248,0) 60%),
      radial-gradient(50% 80% at 82% 88%, rgba(103,232,249,0.16) 0%, rgba(103,232,249,0) 62%),
      linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #0F1F33 100%);
  }
  /* soft ambient wave band across the base */
  .waves { position: absolute; left: 0; right: 0; bottom: 0; height: 240px; opacity: 0.5; }
  .waves svg { width: 100%; height: 100%; }
  .lockup { width: 760px; z-index: 2; filter: drop-shadow(0 10px 40px rgba(0,0,0,0.35)); }
  .lockup svg { width: 100%; height: auto; display: block; }
  .tagline {
    z-index: 2; margin-top: 40px; font-size: 40px; font-weight: 500;
    color: #BAE6FD; letter-spacing: 0.5px;
  }
  .url {
    z-index: 2; margin-top: 22px; font-size: 24px; font-weight: 400;
    color: rgba(248,250,252,0.62); font-family: 'Segoe UI', sans-serif; letter-spacing: 1px;
  }
  .topbar { position: absolute; top: 0; left: 0; right: 0; height: 6px;
    background: linear-gradient(90deg, #38BDF8, #7DD3FC, #67E8F9); }
</style>
</head>
<body>
  <div class="topbar"></div>
  <div class="waves">
    <svg viewBox="0 0 1200 240" preserveAspectRatio="none">
      <path d="M0,150 C220,90 420,190 640,140 C860,92 1010,170 1200,120 L1200,240 L0,240Z" fill="rgba(56,189,248,0.10)"/>
      <path d="M0,180 C260,130 480,210 760,160 C980,122 1090,185 1200,158 L1200,240 L0,240Z" fill="rgba(125,211,252,0.10)"/>
    </svg>
  </div>
  <div class="lockup">${LOCKUP}</div>
  <div class="tagline">פיתוח אתרים שמביא לקוחות</div>
  <div class="url">mediawave.co.il</div>
</body>
</html>`

async function generate() {
  console.log('Generating OG image (1200x630)...')
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  await page.setContent(HTML, { waitUntil: 'load' })
  await page.screenshot({ path: OUTPUT, type: 'png' })
  await browser.close()
  console.log(`  → ${OUTPUT}`)
}

generate().catch((err) => { console.error(err); process.exit(1) })
