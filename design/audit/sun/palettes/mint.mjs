// Palette options on the real page at phone width. Each one overrides the colour tokens of sun.css in the browser only.
// node palettes.mjs [keys...]
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const MINT = { sun: '#E8F3F1', light: '#EDF6F4', deep: '#E4F1EE', pale: '#F3E9CC', ink: '#13241F', ink2: '#3F4D48', cream: '#F5F7F3', soft: '#E6EEEB', line: '#D6DFDB' }
export const PALETTES = [
  { key: 'M1', name: 'המנטה של יעל', note: 'אייקון זהב, שם כהה', ...MINT, logo: '#13241F', extra: '[data-part="mark"]{--logo-a:#E6C769;--logo-b:#C3942A}', chips: ['#E8F3F1', '#13241F', '#E6C769', '#C3942A'] },
  { key: 'M2', name: 'המנטה של יעל', note: 'חצי אייקון ו-Wave בזהב', ...MINT, logo: '#C3942A', extra: '', chips: ['#E8F3F1', '#13241F', '#C3942A', '#F3E9CC'] },
  { key: 'M3', name: 'מנטה עמוקה יותר', note: 'אייקון זהב, שם כהה', ...MINT, sun: '#C9E8E2', light: '#D3EDE8', deep: '#C2E4DD', logo: '#13241F', extra: '[data-part="mark"]{--logo-a:#E6C769;--logo-b:#C3942A}', chips: ['#C9E8E2', '#13241F', '#E6C769', '#C3942A'] },
]
const css = (o) => `:root{--sun:${o.sun};--sun-light:${o.light};--sun-deep:${o.deep};--sun-pale:${o.pale};--sun-sweep:linear-gradient(180deg,${o.light} 0%,${o.deep} 100%);--ink:${o.ink};--ink-2:${o.ink2};--cream:${o.cream};--blue:${o.ink};--blue-ink:${o.ink};--blue-soft:${o.soft};--coral:${o.soft};--line:${o.line};--logo-b:${o.logo}}${o.extra||""}`
const only = process.argv.slice(2)
const W = 390, VH = 844, K = 2
const b = await puppeteer.launch({ headless: 'new' })
const heroes = []
for (const o of PALETTES.filter((x) => !only.length || only.includes(x.key))) {
  // the label, set by the browser so the Hebrew is right
  const lp = await b.newPage()
  await lp.setViewport({ width: W, height: 96, deviceScaleFactor: K })
  await lp.setContent(`<body dir="rtl" style="margin:0;background:#fff;font-family:Arial;display:flex;align-items:center;gap:12px;height:96px;padding:0 14px;box-sizing:border-box">
    <div style="flex:none;width:60px;height:60px;border-radius:50%;background:#111;color:#fff;font:700 26px Arial;display:grid;place-items:center">${o.key}</div>
    <div style="flex:1"><div style="font:700 22px Arial">${o.name}</div><div style="font:15px Arial;color:#555">${o.note}</div></div>
    <div style="display:flex;gap:4px" dir="ltr">${(o.chips || [o.sun, o.pale, o.ink, o.logo]).map((c) => `<span style="width:30px;height:44px;border-radius:6px;background:${c};border:1px solid #0002"></span>`).join('')}</div></body>`)
  const label = await lp.screenshot({ type: 'png' }); await lp.close()

  const p = await b.newPage()
  await p.setViewport({ width: W, height: VH, deviceScaleFactor: K, isMobile: true, hasTouch: true })
  await p.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
  await p.goto('http://localhost:5188/?reduce=1', { waitUntil: 'networkidle2' })
  await p.addStyleTag({ content: css(o) })
  await p.evaluate(() => document.fonts.ready); await new Promise((r) => setTimeout(r, 1000))
  const shot = async (h) => sharp(await p.screenshot({ type: 'png' })).extract({ left: 0, top: 0, width: W * K, height: h * K }).toBuffer()
  const at = async (sel, off) => { const y = await p.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY), sel); await p.evaluate((v) => window.scrollTo(0, v), y + off); await new Promise((r) => setTimeout(r, 700)) }
  const hero = await shot(844)
  await at('#offer', 380); const mid = await shot(640)
  await at('#contact', -20); const circle = await shot(760)
  const parts = [[label, 96], [hero, 844], [mid, 640], [circle, 760]]
  let y = 0; const comp = []
  for (const [input, h] of parts) { comp.push({ input, left: 0, top: y }); y += h * K + 12 }
  await sharp({ create: { width: W * K, height: y - 12, channels: 3, background: '#111' } }).composite(comp).jpeg({ quality: 80 }).toFile(`qa/mint-${o.key}.jpg`)
  heroes.push({ label, hero })
  // contrast of the ink on the field and of the logo colour on white
  const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] }
  const cr = (a, c) => { const [x, y2] = [lum(a), lum(c)].sort((m, n) => n - m); return +((x + 0.05) / (y2 + 0.05)).toFixed(2) }
  console.log(o.key, o.name, 'ink/field', cr(o.ink, o.deep), cr(o.ink, o.light), 'ink2/field', cr(o.ink2, o.deep), 'logo/white', cr(o.logo, '#FFFFFF'), 'white/ink', cr('#FFFFFF', o.ink))
  await p.close()
}
// overview: the six heroes side by side, three to a row
if (false) {
  const tw = 390, th = 96 + 620
  const tiles = await Promise.all(heroes.map(async ({ label, hero }) => sharp({ create: { width: W * K, height: (96 + 620) * K, channels: 3, background: '#fff' } })
    .composite([{ input: label, left: 0, top: 0 }, { input: await sharp(hero).extract({ left: 0, top: 0, width: W * K, height: 620 * K }).toBuffer(), left: 0, top: 96 * K }]).png().toBuffer().then((x) => sharp(x).resize({ width: tw }).toBuffer())))
  await sharp({ create: { width: tw * 3 + 20, height: th * 2 + 10, channels: 3, background: '#111' } })
    .composite(tiles.map((input, i) => ({ input, left: (i % 3) * (tw + 10), top: Math.floor(i / 3) * (th + 10) }))).jpeg({ quality: 84 }).toFile('qa/mint-overview.jpg')
}
await b.close()
