/**
 * Generate OG image (1200x630 PNG) using Puppeteer
 * Run: node scripts/generate-og-image.mjs
 */
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = resolve(__dirname, '..', 'public', 'og-image.png')

const HTML = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #8B6F47 0%, #D4A574 50%, #C4956A 100%);
    font-family: 'Segoe UI', Arial, sans-serif;
    direction: rtl;
    overflow: hidden;
    position: relative;
  }
  /* Decorative wave */
  .wave {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    opacity: 0.15;
  }
  .wave svg { width: 100%; height: 100%; }
  /* Decorative circles */
  .circle {
    position: absolute;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.1);
  }
  .circle-1 { width: 300px; height: 300px; top: -80px; right: -60px; }
  .circle-2 { width: 200px; height: 200px; bottom: -40px; left: -30px; }
  .circle-3 { width: 150px; height: 150px; top: 50%; left: 15%; border-color: rgba(255,255,255,0.06); }
  /* Content */
  .content {
    text-align: center;
    z-index: 1;
    padding: 0 80px;
  }
  .brand {
    font-size: 72px;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: 2px;
    margin-bottom: 16px;
    text-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .tagline {
    font-size: 32px;
    color: rgba(255,255,255,0.9);
    font-weight: 400;
    margin-bottom: 32px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.15);
  }
  .divider {
    width: 80px;
    height: 3px;
    background: rgba(255,255,255,0.5);
    margin: 0 auto 28px;
    border-radius: 2px;
  }
  .url {
    font-size: 22px;
    color: rgba(255,255,255,0.7);
    letter-spacing: 1px;
  }
</style>
</head>
<body>
  <div class="circle circle-1"></div>
  <div class="circle circle-2"></div>
  <div class="circle circle-3"></div>
  <div class="wave">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120Z" fill="rgba(255,255,255,0.3)"/>
      <path d="M0,80 C300,40 500,100 800,60 C1000,30 1100,80 1200,70 L1200,120 L0,120Z" fill="rgba(255,255,255,0.2)"/>
    </svg>
  </div>
  <div class="content">
    <div class="brand">MediaWave Israel</div>
    <div class="tagline">פיתוח אתרים מותאם אישית</div>
    <div class="divider"></div>
    <div class="url">mediawave.co.il</div>
  </div>
</body>
</html>`

async function generate() {
  console.log('Generating OG image (1200x630)...')
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630 })
  await page.setContent(HTML, { waitUntil: 'networkidle0' })
  await page.screenshot({ path: OUTPUT, type: 'png' })
  await browser.close()
  console.log(`  → ${OUTPUT}`)
}

generate().catch(err => { console.error(err); process.exit(1) })
