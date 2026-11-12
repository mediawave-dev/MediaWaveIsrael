// Palette options on the real page at phone width. Each one overrides the colour tokens of sun.css in the browser only.
// node palettes.mjs [keys...]
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
export const PALETTES = [
  { key: 'A', name: 'שמש וקובלט', note: 'הצהוב של היום, לוגו בכחול', sun: '#FFC40C', light: '#FFCF41', deep: '#FFC20E', pale: '#FFE9A6', ink: '#171717', ink2: '#4A4A4A', cream: '#F0F0F0', soft: '#EBEBEB', line: '#DADADA', logo: '#1F4FE0' },
  { key: 'B', name: 'קורל', note: 'אלמוג חם, לוגו באדום קורל', sun: '#FF7F66', light: '#FF9079', deep: '#FF7359', pale: '#FFD9D0', ink: '#1B1212', ink2: '#4F4442', cream: '#F6F1EF', soft: '#EFE7E4', line: '#E2D8D4', logo: '#DC3F25' },
  { key: 'C', name: 'מנטה', note: 'ירוק רענן, לוגו בירוק עמוק', sun: '#6FE3B4', light: '#86EBC3', deep: '#5EDCA9', pale: '#D2F6E6', ink: '#0E231C', ink2: '#3E4F49', cream: '#EFF4F1', soft: '#E4ECE8', line: '#D3DED8', logo: '#0A8259' },
  { key: 'D', name: 'שמיים', note: 'תכלת, לוגו בכחול', sun: '#7CC8FF', light: '#94D3FF', deep: '#6BBFFF', pale: '#D6EEFF', ink: '#0D1B3A', ink2: '#3F4A63', cream: '#EFF3F8', soft: '#E3EAF2', line: '#D2DBE6', logo: '#1463E0' },
  { key: 'E', name: 'לילך', note: 'סגול בהיר, לוגו בסגול', sun: '#C3B1FF', light: '#D0C2FF', deep: '#B8A4FF', pale: '#ECE6FF', ink: '#1A1433', ink2: '#48425E', cream: '#F2F0F8', soft: '#E8E4F2', line: '#D9D4E6', logo: '#6A3FE8' },
  { key: 'F', name: 'תפוז', note: 'כתום, לוגו בכתום אדום', sun: '#FFA23A', light: '#FFB25C', deep: '#FF9930', pale: '#FFE2C2', ink: '#1C1410', ink2: '#51463F', cream: '#F6F2EE', soft: '#EEE7E1', line: '#E1D8D0', logo: '#D9441B' },
]
const css = (o) => `:root{--sun:${o.sun};--sun-light:${o.light};--sun-deep:${o.deep};--sun-pale:${o.pale};--sun-sweep:linear-gradient(180deg,${o.light} 0%,${o.deep} 100%);--ink:${o.ink};--ink-2:${o.ink2};--cream:${o.cream};--blue:${o.ink};--blue-ink:${o.ink};--blue-soft:${o.soft};--coral:${o.soft};--line:${o.line};--logo-b:${o.logo}}`
const only = process.argv.slice(2)
const W = 390, VH = 844, K = 2
const b = await puppeteer.launch({ headless: 'new' })
const heroes = []
for (const o of PALETTES.filter((x) => !only.length || only.includes(x.key))) {
  // the label, set by the browser so the Hebrew is right
  const lp = await b.newPage()
  await lp.setViewport({ width: W, height: 96, deviceScaleFactor: K })
  await lp.setContent(`<body dir="rtl" style="margin:0;background:#fff;font-family:Arial;display:flex;align-items:center;gap:12px;height:96px;padding:0 14px;box-sizing:border-box">
    <div style="flex:none;width:60px;height:60px;border-radius:50%;background:#111;color:#fff;font:700 34px Arial;display:grid;place-items:center">${o.key}</div>
    <div style="flex:1"><div style="font:700 22px Arial">${o.name}</div><div style="font:15px Arial;color:#555">${o.note}</div></div>
    <div style="display:flex;gap:4px" dir="ltr">${[o.sun, o.pale, o.ink, o.logo].map((c) => `<span style="width:30px;height:44px;border-radius:6px;background:${c};border:1px solid #0002"></span>`).join('')}</div></body>`)
  const label = await lp.screenshot({ type: 'png' }); await lp.close()

  const p = await b.newPage()
  await p.setViewport({ width: W, height: VH, deviceScaleFactor: K, isMobile: true, hasTouch: true })
  await p.evaluateOnNewDocument(() => { try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch {} })
  await p.goto('http://localhost:5188/?reduce=1', { waitUntil: 'networkidle2' })
  await p.addStyleTag({ content: css(o) })
  await p.evaluate(() => document.fonts.ready); await new Promise((r) => setTimeout(r, 1000))
  const shot = async (h) => sharp(await p.screenshot({ type: 'png' })).extract({ left: 0, top: 0, width: W * K, height: h * K }).toBuffer()
  const at = async (sel, off) => { const y = await p.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY), sel); await p.evaluate((v) => window.scrollTo(0, v), y + off); await new Promise((r) => setTimeout(r, 700)) }
  const hero = await shot(800)
  await at('#offer', 380); const mid = await shot(640)
  await at('#contact', -20); const circle = await shot(760)
  const parts = [[label, 96], [hero, 800], [mid, 640], [circle, 760]]
  let y = 0; const comp = []
  for (const [input, h] of parts) { comp.push({ input, left: 0, top: y }); y += h * K + 12 }
  await sharp({ create: { width: W * K, height: y - 12, channels: 3, background: '#111' } }).composite(comp).jpeg({ quality: 80 }).toFile(`qa/palette-${o.key}.jpg`)
  heroes.push({ label, hero })
  // contrast of the ink on the field and of the logo colour on white
  const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] }
  const cr = (a, c) => { const [x, y2] = [lum(a), lum(c)].sort((m, n) => n - m); return +((x + 0.05) / (y2 + 0.05)).toFixed(2) }
  console.log(o.key, o.name, 'ink/field', cr(o.ink, o.deep), cr(o.ink, o.light), 'ink2/field', cr(o.ink2, o.deep), 'logo/white', cr(o.logo, '#FFFFFF'), 'white/ink', cr('#FFFFFF', o.ink))
  await p.close()
}
// overview: the six heroes side by side, three to a row
if (!only.length) {
  const tw = 390, th = 96 + 620
  const tiles = await Promise.all(heroes.map(async ({ label, hero }) => sharp({ create: { width: W * K, height: (96 + 620) * K, channels: 3, background: '#fff' } })
    .composite([{ input: label, left: 0, top: 0 }, { input: await sharp(hero).extract({ left: 0, top: 0, width: W * K, height: 620 * K }).toBuffer(), left: 0, top: 96 * K }]).png().toBuffer().then((x) => sharp(x).resize({ width: tw }).toBuffer())))
  await sharp({ create: { width: tw * 3 + 20, height: th * 2 + 10, channels: 3, background: '#111' } })
    .composite(tiles.map((input, i) => ({ input, left: (i % 3) * (tw + 10), top: Math.floor(i / 3) * (th + 10) }))).jpeg({ quality: 84 }).toFile('qa/palette-overview.jpg')
}
await b.close()
