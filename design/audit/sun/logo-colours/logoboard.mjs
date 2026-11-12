// 20 colour options for the logo, each shown as it sits on the site: in the white corner on the mint field,
// and folded to its mark beside the menu button. The logo art is taken from the running page.
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const INK = '#13241F'
// [name, mark top, mark bottom, "Media", "Wave"]
export const OPTIONS = [
  ['ירוק יער', '#1F7A63', '#0F4A3C', INK, INK],
  ['כהה וירוק, Wave ירוק', INK, '#1F7A63', INK, '#1F7A63'],
  ['מנטה ואמרלד', '#6FD3BD', '#0E7C66', INK, INK],
  ['טורקיז', '#2CC5B3', '#0F8478', INK, INK],
  ['כהה וטורקיז, Wave טורקיז', INK, '#14A390', INK, '#0F8478'],
  ['יער וזהב', '#0F4A3C', '#C3942A', INK, INK],
  ['טורקיז וזהב', '#14A390', '#D2A640', INK, INK],
  ['שמפניה', '#F0DFA8', '#D4B458', INK, INK],
  ['רוז גולד', '#EFC4B2', '#CC8B74', INK, INK],
  ['קורל', '#FF9079', '#E4553A', INK, INK],
  ['כהה וקורל, Wave קורל', INK, '#E4553A', INK, '#D9482D'],
  ['אפרסק', '#FFC29A', '#F08A4B', INK, INK],
  ['שקיעה', '#F9C74F', '#F3722C', INK, INK],
  ['שמש', '#FFE066', '#F2B705', INK, INK],
  ['קובלט', '#5B8DEF', '#1F4FE0', INK, INK],
  ['כהה וקובלט, Wave קובלט', INK, '#1F4FE0', INK, '#1F4FE0'],
  ['תכלת ונייבי', '#7CC8FF', '#17306B', INK, INK],
  ['סגול', '#B197FC', '#6A3FE8', INK, INK],
  ['פוקסיה', '#F78FB3', '#D6336C', INK, INK],
  ['שחור ואפור', INK, '#5C6B66', INK, INK],
]
const b = await puppeteer.launch({ headless: 'new' })
const src = await b.newPage()
await src.goto('http://localhost:5188/?reduce=1', { waitUntil: 'networkidle2' })
const logo = await src.evaluate(() => document.querySelector('.pin__clip svg').outerHTML)
await src.close()
const blob = '<svg class="blob" viewBox="0 0 200 90" preserveAspectRatio="none"><path d="M0 0H200V70C146 100 60 66 0 0Z"/></svg>'
const tile = ([name, ma, mb, a, w], i) => `<div class="tile" style="--logo-a:${a};--logo-b:${w};--mark-a:${ma};--mark-b:${mb}">
  <div class="full">${blob}<span class="lg">${logo}</span></div>
  <div class="fold">${blob}<span class="mk">${logo}</span><i></i></div>
  <div class="cap"><b>${i + 1}</b><span>${name}</span></div></div>`
const html = (from, to) => `<body dir="rtl"><style>
  body{margin:0;background:#111;font-family:Arial;width:780px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .tile{position:relative;height:150px;background:linear-gradient(180deg,#D3EDE8,#C2E4DD);overflow:hidden}
  .blob{position:absolute;top:0;right:0;fill:#fff;filter:drop-shadow(0 6px 12px rgba(19,36,31,.2))}
  .full .blob{width:300px;height:92px} .fold{position:absolute;top:0;left:0;width:120px;height:80px} .fold .blob{width:120px;height:72px;right:auto;left:0;transform:scaleX(-1)}
  .lg{position:absolute;top:19px;right:16px;direction:ltr} .lg svg{height:26px;width:auto;display:block}
  .mk{position:absolute;top:16px;left:14px;width:28px;height:26px;overflow:hidden;direction:ltr} .mk svg{height:26px;width:auto;display:block;max-width:none}
  .fold i{position:absolute;top:22px;left:54px;width:18px;height:2px;background:#13241F;box-shadow:0 5px 0 #13241F,0 10px 0 #13241F;border-radius:2px}
  .mw-logo [data-part="mark"]{--logo-a:var(--mark-a);--logo-b:var(--mark-b)}
  .cap{position:absolute;bottom:12px;right:14px;left:14px;display:flex;align-items:center;gap:10px;color:#13241F;font:700 19px Arial}
  .cap b{flex:none;width:40px;height:40px;border-radius:50%;background:#13241F;color:#fff;display:grid;place-items:center;font:700 20px Arial}
</style><div class="grid">${OPTIONS.slice(from, to).map((o, k) => tile(o, from + k)).join('')}</div></body>`
for (const [n, from, to] of [[1, 0, 10], [2, 10, 20]]) {
  const p = await b.newPage()
  await p.setViewport({ width: 780, height: 5 * 156 - 6, deviceScaleFactor: 2 })
  await p.setContent(html(from, to))
  await p.screenshot({ path: `qa/logo-options-${n}.jpg`, type: 'jpeg', quality: 86 })
  await p.close()
}
await b.close()
console.log('ok')
