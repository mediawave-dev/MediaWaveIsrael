// The board Nati picks from, round 2. Each proposal: lit on a dark stage, one colour on white, beside the name on the
// site's mint, and as app icon and favicon at their real sizes. Two proposals per phone image.
import { createRequire } from 'module'
import fs from 'fs'
import { MARKS, THEMES, nameMark, id } from './mw2-marks.mjs'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const OUT = 'C:/tmp/night/logo/out2/'
const require = createRequire(ROOT + 'package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')
const ts = fs.readFileSync(ROOT + 'src/components/ui/logo-paths.ts', 'utf8')
const ART = Function('return ' + ts.slice(ts.indexOf('= {') + 2).replace(/;?\s*$/, ''))()
const part = (p) => ART.compact.parts.find((x) => x.part === p)
const first = (d) => d.slice(0, d.indexOf('Z') + 1), rest = (d) => d.slice(d.indexOf('Z') + 1)
const art = { M: first(part('media').d), W: first(part('wave').d), mediaRest: rest(part('media').d), waveRest: rest(part('wave').d), drop: part('drop').d }
const b64 = (p) => fs.readFileSync(ROOT + 'public/fonts/' + p).toString('base64')

const svg = (o, height, cls = '') => `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="${o.vb || `0 0 ${o.w} ${o.h}`}" height="${(+height).toFixed(1)}" width="${(height * o.w / o.h).toFixed(1)}">${o.body}</svg>`
/** the lit version: the two tones as soft vertical light, top to bottom of the mark */
const hero = (m) => { const u = id(), probe = m.draw(THEMES.lit, art), y0 = probe.vb ? +probe.vb.split(' ')[1] : 0
  const o = m.draw({ a: `url(#${u}a)`, b: `url(#${u}b)`, o: '#B5EDE4', g: '#0B1714', t: `url(#${u}b)`, ra: '#F7FDFB', rb: '#22BBA8' }, art)
  const grad = (n, c0, c1) => `<linearGradient id="${u}${n}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${y0 + probe.h}"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient>`
  o.body = `<defs>${grad('a', '#FFFFFF', '#D5F1EC')}${grad('b', '#3BDDC9', '#17A693')}</defs>` + o.body; return o }
/** the present wordmark alone */
const name = (dark) => { const gx = 104, [, y, w, h] = ART.compact.viewBox.split(' ').map(Number), a = dark ? '#fff' : '#13241F', t = dark ? '#2CC5B3' : '#0F8478'
  const g = (p, fill) => `<g transform="${p.group}"><path fill="${fill}"${p.transform ? ` transform="${p.transform}"` : ''} d="${p.d}"/></g>`
  return { vb: `${gx} ${y} ${w - gx} ${h}`, w: w - gx, h, body: g(part('media'), a) + g(part('drop'), t) + g(part('wave'), t) } }
const fit = (o, box, k = 1) => Math.min(box * 0.6 * k, box * 0.74 * k * o.h / o.w)

const tile = (m, n) => {
  const wide = (o) => o.w > o.h * 1.5
  const H = hero(m), D = m.draw({ ...THEMES.day, t: '#0F8478' }, art), K = m.draw(THEMES.ink, art)
  const tiny = (th) => m.draw({ ...th, tiny: true }, art)
  const isName = m.key === 'name'
  const stage = isName ? svg(H, 74, 'glow') : svg(H, wide(H) ? Math.min(210, 520 * H.h / H.w) : 236, 'glow')
  const mono = isName ? svg(K, 30) : svg(K, wide(K) ? 62 : 92)
  const lock = isName ? svg(D, 44) : `${svg(D, wide(D) ? 40 : 58)}<span style="width:${wide(D) ? 16 : 14}px"></span>${svg(name(false), 30)}`
  const icons = isName
    ? `<span class="note">לאייקון של האפליקציה ולדפדפן נשאר העיגול של היום</span>`
    : `<span class="app">${svg(hero(m), fit(H, 76))}</span><span class="app tq">${svg(tiny(THEMES.snow), fit(H, 76))}</span><span class="app l">${svg(D, fit(D, 76))}</span>
       <span class="sz"><span class="fav">${svg(tiny(THEMES.lit), fit(H, 32, 1.12))}</span><em>32</em></span><span class="sz"><span class="fav l">${svg(tiny(THEMES.day), fit(D, 32, 1.12))}</span><em>32</em></span>
       <span class="sz"><span class="fav s16">${svg(tiny(THEMES.snow), fit(H, 16, 1.3))}</span><em>16</em></span><span class="sz"><span class="fav l s16">${svg(tiny(THEMES.ink), fit(D, 16, 1.3))}</span><em>16</em></span>`
  return `<section class="t">
    <header><b>${n}</b><div><h2>${m.he}</h2><p>${m.idea}</p></div></header>
    <div class="stage"><i class="tl">MW / ${String(n).padStart(2, '0')} · ${m.en}</i><i class="bl">${m.spec}</i>${stage}</div>
    <div class="row"><div class="cell w">${mono}</div><div class="cell mint">${lock}</div></div>
    <div class="icons">${icons}</div></section>`
}
const css = `
@font-face{font-family:MWH;src:url(data:font/woff2;base64,${b64('eft/artzisraeli.woff2')})}
@font-face{font-family:MWT;src:url(data:font/woff2;base64,${b64('eft/tirosh.woff2')})}
@font-face{font-family:MWL;src:url(data:font/woff2;base64,${b64('mediawave-font1-Bold.woff2')})}
body{margin:0;background:#0B1714;width:800px;font-family:MWT,MWL,Arial,sans-serif}
.t{background:#0B1714;border-bottom:14px solid #fff}
header{display:flex;gap:18px;align-items:center;direction:rtl;padding:22px 26px 18px}
header b{flex:none;width:56px;height:56px;border-radius:50%;background:#2CC5B3;color:#0B1714;display:grid;place-items:center;font:700 27px Arial}
h2{margin:0;font:700 31px/1.1 MWH,MWL,Arial;color:#fff}p{margin:6px 0 0;font:17px/1.45 MWT,Arial;color:#A9C4BE}
.stage{position:relative;height:340px;display:grid;place-items:center;
  background:radial-gradient(60% 70% at 50% 52%,#17382F 0,#0E211C 55%,#0B1714 100%)}
.stage::before{content:"";position:absolute;inset:0;background-image:linear-gradient(#ffffff0a 1px,transparent 1px),linear-gradient(90deg,#ffffff0a 1px,transparent 1px);background-size:32px 32px;background-position:16px 10px;
  -webkit-mask-image:radial-gradient(70% 80% at 50% 50%,#000 30%,transparent 100%)}
.stage i{position:absolute;font:600 11px/1 Consolas,monospace;letter-spacing:.14em;color:#5E8C83;font-style:normal;direction:ltr}
.tl{top:14px;left:20px}.bl{bottom:14px;left:20px}
.glow{position:relative;filter:drop-shadow(0 18px 34px rgba(44,197,179,.22))}
.row{display:grid;grid-template-columns:290px 1fr}
.cell{height:138px;display:flex;align-items:center;justify-content:center}.cell.w{background:#fff}.cell.mint{background:#C9E8E2}
.icons{display:flex;align-items:center;justify-content:center;gap:14px;padding:20px 0 22px;background:#0B1714}
.app{width:76px;height:76px;border-radius:18px;background:linear-gradient(160deg,#1A3B34,#0A1512);display:grid;place-items:center;box-shadow:0 0 0 1px #ffffff1f inset}
.app.l{background:#fff}.app.tq{background:linear-gradient(160deg,#2CC5B3,#0F8478)}
.sz{display:grid;justify-items:center;gap:6px}.sz em{font:600 10px Consolas,monospace;color:#5E8C83;font-style:normal}
.fav{width:32px;height:32px;border-radius:7px;background:#0A1512;display:grid;place-items:center;box-shadow:0 0 0 1px #ffffff2a inset}.fav.l{background:#fff}
.fav.s16{width:16px;height:16px;border-radius:4px;margin:8px}
.note{font:16px MWT,Arial;color:#A9C4BE;direction:rtl}`

const list = process.argv[2] ? process.argv[2].split(',') : ['fold', 'shards', 'lines', 'roll', 'pulse', 'pixels', 'comb']
const all = [...MARKS, nameMark]
const picks = list.map((k) => all.find((m) => m.key === k))
const b = await puppeteer.launch({ headless: 'new' })
const pg = await b.newPage()
await pg.setViewport({ width: 800, height: 1000, deviceScaleFactor: 1.5 })
fs.mkdirSync(OUT, { recursive: true })
for (let k = 0; k * 2 < picks.length; k++) {
  const pair = picks.slice(k * 2, k * 2 + 2)
  await pg.setContent(`<style>${css}</style><main>${pair.map((m, j) => tile(m, k * 2 + j + 1)).join('')}</main>`)
  await pg.evaluate(() => document.fonts.ready)
  await (await pg.$('main')).screenshot({ path: `${OUT}mw2-${k + 1}.png` })
  await sharp(`${OUT}mw2-${k + 1}.png`).jpeg({ quality: 90 }).toFile(`${OUT}mw2-${k + 1}.jpg`)
}
await b.close()
console.log('ok', picks.length)
