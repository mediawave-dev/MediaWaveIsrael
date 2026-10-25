/**
 * The social share image (public/og-image.png, 1200x630), in the shot look's bands (D110): the
 * Horizon logo, stacked version, on the black band in its dark tones (cream #F4EFE4 and light
 * Prussian blue #79A0C5, as in the site's header), and a cream band under it with the H1 in Noto Sans Hebrew 800
 * at 75% width, ink on cream. A hard cut between the bands, no gradient, no shadow, nothing behind
 * the logo (brand rules); clear space well beyond half the disc. Run: node scripts/generate-og-image.mjs
 *
 * --blog (D218): one card per published post, public/og/blog-<slug>.png: the dark ground of the site,
 * the horizontal lockup, the post's mono kicker and its title in the display face. Run it after a post
 * is added or its title changes: node scripts/generate-og-image.mjs --blog
 */
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, mkdirSync } from 'fs'
import puppeteer from 'puppeteer'
import { blogPosts } from './blog-posts.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = resolve(ROOT, 'public/og-image.png')
// the dark lockup, in the palette scripts/brand-palette.mjs writes into it (Cyanotype, D117)
const STACKED = readFileSync(resolve(ROOT, 'logos/horizon/mediawave-stacked-dark.svg'), 'utf8')
// inlined: a page set from a string may not load file:// fonts
const pub = (f) => `data:font/woff2;base64,${readFileSync(resolve(ROOT, 'public/fonts/noto', f)).toString('base64')}`

const HTML = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<style>
  @font-face { font-family: 'MW Noto'; src: url('${pub('noto-sans-hebrew-hebrew-standard-normal.woff2')}') format('woff2'); font-weight: 100 900; font-stretch: 62.5% 100%; unicode-range: U+0590-05FF, U+20AA, U+FB1D-FB4F; }
  @font-face { font-family: 'MW Noto'; src: url('${pub('noto-sans-hebrew-latin-standard-normal.woff2')}') format('woff2'); font-weight: 100 900; font-stretch: 62.5% 100%; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: 'MW Noto', sans-serif; direction: rtl; }
  .top { height: 400px; background: #1A1917; display: grid; place-items: center; }
  .logo { width: 360px; }
  .logo svg { display: block; width: 100%; height: auto; overflow: visible; }
  .ask { position: relative; height: 230px; background: #EDE7DA; display: grid; place-items: center; }
  .line { font-size: 76px; font-weight: 800; font-stretch: 75%; color: #1A1917; line-height: 1; }
  .url { position: absolute; bottom: 22px; left: 40px; font-size: 22px; font-weight: 500; color: #4D4942; direction: ltr; }
</style>
</head>
<body>
  <div class="top"><div class="logo">${STACKED}</div></div>
  <div class="ask"><div class="line">אתר שמביא פניות לוואטסאפ</div><div class="url">mediawave.co.il</div></div>
</body>
</html>`

const HORIZONTAL = readFileSync(resolve(ROOT, 'logos/horizon/mediawave-horizontal-dark.svg'), 'utf8')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const kickerOf = (slug) => (/^kicker:\s*(.+)$/m.exec(readFileSync(resolve(ROOT, 'src/content/blog', `${slug}.md`), 'utf8')) || [])[1]?.trim() || 'BLOG'

/** a post's card: the site's ground and type, the title at the start, the address at the foot */
const postHtml = (title, kicker) => HTML.replace(/<body>[\s\S]*<\/body>/, `<body class="post">
  <div class="p-logo">${HORIZONTAL}</div>
  <div class="p-kick">[ ${esc(kicker)} ]</div>
  <div class="p-title">${esc(title)}</div>
  <div class="p-url">mediawave.co.il/blog</div>
</body>`).replace('</style>', `  body.post { position: relative; background: #0F1011; color: #EDE7DA; padding: 64px 72px; }
  .p-logo { width: 300px; }
  .p-logo svg { display: block; width: 100%; height: auto; }
  .p-kick { margin-top: 72px; font: 600 24px/1 Consolas, ui-monospace, monospace; letter-spacing: 0.08em; color: #79A0C5; direction: ltr; text-align: right; }
  .p-title { margin-top: 22px; max-width: 1000px; text-wrap: balance; font-size: 76px; font-weight: 800; font-stretch: 75%; line-height: 1.04; color: #EDE7DA; }
  .p-url { position: absolute; bottom: 48px; left: 72px; font-size: 24px; font-weight: 500; color: #A39D90; direction: ltr; }
</style>`)

async function generateBlog() {
  const posts = blogPosts(ROOT)
  mkdirSync(resolve(ROOT, 'public/og'), { recursive: true })
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  for (const p of posts) {
    await page.setContent(postHtml(p.title, kickerOf(p.slug)), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    const out = resolve(ROOT, 'public/og', `blog-${p.slug}.png`)
    await page.screenshot({ path: out, type: 'png' })
    console.log(`  → ${out}`)
  }
  await browser.close()
}

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

(process.argv.includes('--blog') ? generateBlog() : generate()).catch((err) => { console.error(err); process.exit(1) })
