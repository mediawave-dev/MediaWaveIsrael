// Ten ways to bring the initials MW into the MediaWave logo (refresh; the Horizon disc and the wordmark are the equity).
// Every letter comes from the logo's own wordmark paths, so the initials and the name are one hand.
// Renders tiles with: the element large, the element beside the present logo, and small sizes on light and dark.
import { createRequire } from 'module'
import fs from 'fs'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const require = createRequire(ROOT + 'package.json')
const puppeteer = require('puppeteer'); const sharp = require('sharp')

// ---- the logo's own art
const ts = fs.readFileSync(ROOT + 'src/components/ui/logo-paths.ts', 'utf8')
const ART = Function('return ' + ts.slice(ts.indexOf('= {') + 2).replace(/;?\s*$/, ''))()
const part = (v, p) => ART[v].parts.find((x) => x.part === p)
const C = ART.compact
const first = (d) => d.slice(0, d.indexOf('Z') + 1)
const rest = (d) => d.slice(d.indexOf('Z') + 1)
const M = first(part('compact', 'media').d)          // x 7.2 .. 77.8, y -70.3 .. 0
const W = first(part('compact', 'wave').d)           // x 2.2 .. 97.1
const INK = '#13241F', TQ = '#14A390', TQT = '#0F8478'
const pal = (dark) => (dark ? { a: '#FFFFFF', b: '#2CC5B3', t: '#2CC5B3', g: INK } : { a: INK, b: TQ, t: TQT, g: '#FFFFFF' })

/** the present logo, compact (disc and name), or the name alone / the disc alone */
const logo = (c, what = 'all') => {
  const [x, y, w, h] = C.viewBox.split(' ').map(Number)
  const draw = (p, fill) => `<g${p.group ? ` transform="${p.group}"` : ''}><path fill="${fill}"${p.transform ? ` transform="${p.transform}"` : ''} d="${p.d}"/></g>`
  const mark = draw(part('compact', 'mark-a'), c.a) + draw(part('compact', 'mark-b'), c.b)
  const name = draw(part('compact', 'media'), c.a) + draw(part('compact', 'drop'), c.t) + draw(part('compact', 'wave'), c.t)
  if (what === 'mark') return { vb: `-2 -70 100 100`, body: mark, w: 100, h: 100 }
  if (what === 'name') { const gx = Number(/translate\(([\d.]+)/.exec(part('compact', 'media').group)[1]); return { vb: `${gx} ${y} ${w - gx} ${h}`, body: name, w: w - gx, h } }
  return { vb: C.viewBox, body: mark + name, w, h }
}
const svg = (o, height) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.vb}" height="${height}" width="${(height * o.w / o.h).toFixed(1)}">${o.body}</svg>`

// the sea line used to slice things: one soft S, like the disc's own
const seaTop = (x0, x1, y, amp) => { const w = x1 - x0; return `M${x0} ${y - amp * .2}C${x0 + w * .22} ${y - amp} ${x0 + w * .38} ${y - amp} ${x0 + w * .5} ${y}S${x0 + w * .8} ${y + amp} ${x1} ${y + amp * .1}` }
const above = (x0, x1, y, amp, top) => `${seaTop(x0, x1, y, amp)}V${top}H${x0}Z`
const below = (x0, x1, y, amp, bot) => `${seaTop(x0, x1, y, amp)}V${bot}H${x0}Z`
let uid = 0
const id = () => 'c' + (++uid)

const P = [
  // 1 the sliced monogram: the logo's own device (two tones cut by a sea line) moved onto the letters
  { he: 'האותיות חתוכות בקו הים', idea: 'מה שקורה לעיגול קורה גם לאותיות. קו ים חוצה אותן, כהה מעל וטורקיז מתחת.',
    draw: (c) => { const u = id(), l = id(); return { vb: '0 -76 190 82', w: 190, h: 82, body:
      `<defs><clipPath id="${u}"><path transform="translate(0 -3)" d="${above(-5, 200, -27, 7, -90)}"/></clipPath><clipPath id="${l}"><path transform="translate(0 3)" d="${below(-5, 200, -27, 7, 20)}"/></clipPath></defs>
       <g clip-path="url(#${u})" fill="${c.a}"><path d="${M}"/><path transform="translate(86 0)" d="${W}"/></g>
       <g clip-path="url(#${l})" fill="${c.b}"><path d="${M}"/><path transform="translate(86 0)" d="${W}"/></g>` } } },
  // 2 the signal: M and W share one stroke and become a single line, a waveform
  { he: 'קו אחד רציף, כמו גל של סיגנל', idea: 'ה-M וה-W חולקות קו אחד והופכות לקו רציף אחד, שנקרא גם כצורת גל.',
    draw: (c) => { const k = id(), l = id(), r = id(); const pts = 'M-3.1 10L22 -70L44 -28L66 -70L88 0L110 -42L132 0L157.1 -80'; return { vb: '-8 -72 170 74', w: 170, h: 74, body:
      `<defs><clipPath id="${k}"><rect x="-20" y="-70" width="200" height="70"/></clipPath><clipPath id="${l}"><rect x="-20" y="-90" width="97" height="120"/></clipPath><clipPath id="${r}"><rect x="77" y="-90" width="120" height="120"/></clipPath></defs>
       <g clip-path="url(#${k})" fill="none" stroke-width="13.5" stroke-linejoin="miter" stroke-miterlimit="1.5"><path clip-path="url(#${l})" stroke="${c.a}" d="${pts}"/><path clip-path="url(#${r})" stroke="${c.b}" d="${pts}"/></g>` } } },
  // 3 the reflection: M stands on the sea line, and what the water shows under it is a W
  { he: 'ההשתקפות', idea: 'ה-M עומדת על קו הים, וההשתקפות שלה במים היא W.',
    draw: (c) => ({ vb: '0 -80 86 160', w: 86, h: 160, body:
      `<path fill="${c.a}" transform="translate(0 -6)" d="${M}"/><path fill="${c.b}" transform="translate(0 6) scale(1 -1)" d="${M}"/>
       <path fill="none" stroke="${c.a}" stroke-width="2.2" stroke-linecap="round" d="M-2 0H88" opacity="0"/>` }) },
  // 4 the hinge: the disc itself stands between the two letters
  { he: 'העיגול בין שתי האותיות', idea: 'הסמל הקיים עומד בין ה-M ל-W כמו ציר, והשם הופך לחתימה קצרה.',
    draw: (c) => { const mk = logo(c, 'mark'); return { vb: '0 -76 278 82', w: 278, h: 82, body:
      `<path fill="${c.a}" d="${M}"/><g transform="translate(96 -17) scale(.74)">${mk.body}</g><path fill="${c.t}" transform="translate(172 0)" d="${W}"/>` } } },
  // 5 the disc whose horizon is the MW signal
  { he: 'קו האופק של העיגול הוא MW', idea: 'העיגול נשאר, אבל הקו שחוצה אותו הוא האותיות MW בקו אחד.',
    draw: (c) => { const k = id(), u = id(), l = id(); const z = 'M-52 22L-33 -16L-20 6L-7 -16L7 16L20 -6L33 16L52 -22'; return { vb: '-50 -50 100 100', w: 100, h: 100, body:
      `<defs><clipPath id="${k}"><circle r="48"/></clipPath><clipPath id="${u}"><path d="${z}V-60H-52Z"/></clipPath><clipPath id="${l}"><path d="${z}V60H-52Z"/></clipPath></defs>
       <g clip-path="url(#${k})"><rect clip-path="url(#${u})" x="-50" y="-50" width="100" height="100" fill="${c.a}"/><rect clip-path="url(#${l})" x="-50" y="-50" width="100" height="100" fill="${c.b}"/>
       <path d="${z}" fill="none" stroke="${c.g}" stroke-width="7" stroke-linejoin="miter" stroke-miterlimit="3"/></g>` } } },
  // 6 the two-crest horizon: the closest to today. From below the line is an m, from above a w
  { he: 'קו ים עם שני גלים', idea: 'הכי קרוב ללוגו של היום. קו הים מקבל שני גלים, מלמטה הוא m ומלמעלה w.',
    draw: (c) => { const k = id(), u = id(), l = id(); const z = 'M-50 8C-44 8 -40 -14 -25 -14S-8 8 0 8S10 -14 25 -14S44 8 50 8'; return { vb: '-50 -50 100 100', w: 100, h: 100, body:
      `<defs><clipPath id="${k}"><circle r="48"/></clipPath><clipPath id="${u}"><path d="${z}V-60H-50Z"/></clipPath><clipPath id="${l}"><path d="${z}V60H-50Z"/></clipPath></defs>
       <g clip-path="url(#${k})"><rect clip-path="url(#${u})" x="-50" y="-50" width="100" height="100" fill="${c.a}"/><rect clip-path="url(#${l})" x="-50" y="-50" width="100" height="100" fill="${c.b}"/>
       <path d="${z}" fill="none" stroke="${c.g}" stroke-width="6.5"/></g>` } } },
  // 7 MW standing on the horizon inside the disc
  { he: 'MW עומדות על האופק', idea: 'קו הים יורד נמוך יותר, והאותיות עומדות מעליו בתוך העיגול, כמו ספינה על האופק.',
    draw: (c) => { const k = id(), l = id(); const z = seaTop(-50, 50, 18, 6); return { vb: '-50 -50 100 100', w: 100, h: 100, body:
      `<defs><clipPath id="${k}"><circle r="48"/></clipPath><clipPath id="${l}"><path d="${z}V60H-50Z"/></clipPath></defs>
       <g clip-path="url(#${k})"><rect x="-50" y="-50" width="100" height="100" fill="${c.a}"/><rect clip-path="url(#${l})" x="-50" y="-50" width="100" height="100" fill="${c.b}"/><path d="${z}" fill="none" stroke="${c.g}" stroke-width="5"/>
       <g fill="${c.g}" transform="translate(-38 3) scale(.4)"><path d="${M}"/><path transform="translate(86 0)" d="${W}"/></g></g>` } } },
  // 8 the dot matrix: the letters in the dots of the old site's sea, cut by the same line
  { he: 'אותיות מנקודות', idea: 'MW בנויות מנקודות, כמו ים הנקודות של האתר הקודם, וקו הים צובע אותן בשני גוונים.',
    draw: (c) => { const Mm = ['X...X', 'XX.XX', 'X.X.X', 'X...X', 'X...X', 'X...X', 'X...X'], Ww = ['X...X', 'X...X', 'X...X', 'X...X', 'X.X.X', 'XX.XX', 'X...X']; let s = ''
      const dot = (col, row) => { const x = col * 13 + 6.5, y = row * 13 + 6.5; const sea = 45.5 - 13 * Math.sin((x / 156) * Math.PI * 2) * 0.9; s += `<circle cx="${x}" cy="${y}" r="5" fill="${y < sea ? c.a : c.b}"/>` }
      Mm.forEach((r, row) => [...r].forEach((ch, col) => ch === 'X' && dot(col, row))); Ww.forEach((r, row) => [...r].forEach((ch, col) => ch === 'X' && dot(col + 7, row)))
      return { vb: '0 0 156 91', w: 156, h: 91, body: s } } },
  // 9 the name in two lines: the initials make a dark column, the rest of each word is turquoise
  { he: 'השם בשתי שורות', idea: 'Media מעל Wave. האותיות M ו-W כהות ויוצרות טור, ושאר האותיות בטורקיז.',
    draw: (c) => { const md = part('compact', 'media').d, wv = part('compact', 'wave').d, dr = part('compact', 'drop').d; return { vb: '0 -80 330 178', w: 330, h: 178, body:
      `<g><path fill="${c.a}" d="${first(md)}"/><path fill="${c.t}" d="${rest(md)}"/><path fill="${c.t}" d="${dr}"/></g>
       <g transform="translate(5 92)"><path fill="${c.a}" d="${first(wv)}"/><path fill="${c.t}" d="${rest(wv)}"/></g>` } } },
  // 10 the W is a wave: the second letter is drawn with the sea line's own curve
  { he: 'ה-W היא גל', idea: 'ה-M נשארת אות, וה-W מצוירת כגל רך, באותו קו של קו הים שבעיגול.',
    draw: (c) => { const k = id(); return { vb: '0 -76 200 82', w: 200, h: 82, body:
      `<defs><clipPath id="${k}"><rect x="80" y="-70.3" width="130" height="70.3"/></clipPath></defs><path fill="${c.a}" d="${M}"/>
       <path clip-path="url(#${k})" fill="none" stroke="${c.b}" stroke-width="13.6" d="M88 -84C98 -84 104 -6.800 116 -6.800C128 -6.800 131 -48 141.500 -48C152 -48 155 -6.800 167 -6.800C179 -6.800 185 -84 195 -84"/>` } } },
]

const light = pal(false), dark = pal(true)
const tile = (p, i) => {
  const big = p.draw(light), sm = p.draw(light), rv = p.draw(dark)
  const inDisc = [4, 5, 6].includes(i)      // proposals that change the disc itself: the lockup is the new disc with the name
  const bigH = big.h > big.w * 1.2 ? 230 : big.w > big.h * 2 ? 120 : 190
  const lock = inDisc
    ? `${svg(sm, 58)}<span style="width:14px"></span>${svg(logo(light, 'name'), 36)}`
    : i === 8 ? svg(sm, 110)
    : `${svg(sm, sm.h > sm.w ? 86 : 50)}<span class="rule"></span>${svg(logo(light), 34)}`
  const lockD = inDisc
    ? `${svg(rv, 46)}<span style="width:12px"></span>${svg(logo(dark, 'name'), 28)}`
    : i === 8 ? svg(rv, 84)
    : `${svg(rv, rv.h > rv.w ? 70 : 40)}<span class="rule" style="background:#ffffff55"></span>${svg(logo(dark), 27)}`
  const small = (o, px) => svg(o, Math.min(px * 0.66, px * 0.8 * o.h / o.w))
  return `<section class="t"><header><b>${i + 1}</b><div><h2>${p.he}</h2><p>${p.idea}</p></div></header>
    <div class="big">${svg(big, bigH)}</div>
    <div class="lock">${lock}</div>
    <div class="dark"><div class="lockd">${lockD}</div>
      <div class="ic"><span class="app">${small(rv, 64)}</span><span class="app app--l">${small(sm, 64)}</span><span class="fav">${small(rv, 32)}</span><span class="fav fav--l">${small(sm, 32)}</span></div></div></section>`
}
const css = `body{margin:0;background:#fff;font-family:Arial,sans-serif;width:800px}
.t{border-bottom:10px solid #fff}header{display:flex;gap:16px;align-items:center;background:#EEF5F3;padding:14px 20px;direction:rtl}
header b{flex:none;width:54px;height:54px;border-radius:50%;background:#13241F;color:#fff;display:grid;place-items:center;font:700 26px Arial}
h2{margin:0;font:700 25px Arial;color:#13241F}p{margin:3px 0 0;font:16px/1.35 Arial;color:#3F4D48}
.big{height:270px;display:grid;place-items:center;background:#fff}
.lock{height:130px;display:flex;align-items:center;justify-content:center;gap:0;background:#F7FAF9;border-block:1px solid #E3ECE9}
.rule{width:2px;height:44px;background:#13241F33;margin:0 20px}
.dark{background:#13241F;display:flex;align-items:center;justify-content:space-between;padding:22px 26px;gap:16px}
.lockd{display:flex;align-items:center}.ic{display:flex;align-items:center;gap:10px}
.app{width:64px;height:64px;border-radius:15px;background:#0A1512;display:grid;place-items:center;box-shadow:0 0 0 1px #ffffff22}.app--l{background:#fff}
.fav{width:32px;height:32px;border-radius:7px;background:#0A1512;display:grid;place-items:center;box-shadow:0 0 0 1px #ffffff22}.fav--l{background:#fff}`
const b = await puppeteer.launch({ headless: 'new' })
const pg = await b.newPage()
await pg.setViewport({ width: 800, height: 1000, deviceScaleFactor: 1.5 })
fs.mkdirSync('C:/tmp/night/logo/out', { recursive: true })
for (let k = 0; k < 5; k++) {
  await pg.setContent(`<style>${css}</style>${tile(P[k * 2], k * 2)}${tile(P[k * 2 + 1], k * 2 + 1)}`)
  const el = await pg.$('body'); await el.screenshot({ path: `C:/tmp/night/logo/out/mw-${k + 1}.png` })
  await sharp(`C:/tmp/night/logo/out/mw-${k + 1}.png`).jpeg({ quality: 88 }).toFile(`C:/tmp/night/logo/out/mw-${k + 1}.jpg`)
}
// one overview of the ten elements alone, for a first glance
await pg.setContent(`<style>body{margin:0;background:#fff;width:1000px;font-family:Arial}.g{display:grid;grid-template-columns:repeat(5,1fr)}.c{height:190px;display:grid;place-items:center;position:relative;border:1px solid #E3ECE9}.c i{position:absolute;top:8px;right:10px;font:700 18px Arial;font-style:normal;color:#13241F;background:#C9E8E2;border-radius:50%;width:30px;height:30px;display:grid;place-items:center}</style><div class="g">${P.map((p, i) => { const o = p.draw(light); return `<div class="c"><i>${i + 1}</i>${svg(o, o.h > o.w * 1.2 ? 130 : o.w > o.h * 2 ? 62 : 100)}</div>` }).join('')}</div>`)
await (await pg.$('body')).screenshot({ path: 'C:/tmp/night/logo/out/mw-overview.png' })
await b.close()
console.log('ok')
