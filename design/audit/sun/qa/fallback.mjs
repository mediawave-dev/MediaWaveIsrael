// measures how wide the page's own text sets in each web face against plain Arial: the ratio is the fallback's size-adjust
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.goto('http://localhost:5188/?reduce=1', { waitUntil: 'networkidle2' })
await p.evaluate(() => document.fonts.ready)
const out = await p.evaluate(async () => {
  const text = document.querySelector('main').innerText.replace(/\s+/g, ' ').slice(0, 1800)
  const head = [...document.querySelectorAll('h1,h2,h3')].map((e) => e.innerText).join(' ')
  const w = (family, weight, t) => { const s = document.createElement('span'); s.style.cssText = `position:absolute;white-space:nowrap;font:${weight} 40px ${family}`; s.textContent = t; document.body.append(s); const r = s.getBoundingClientRect().width; s.remove(); return r }
  await Promise.all([document.fonts.load('300 40px "MW Lampner"', text), document.fonts.load('600 40px "MW Lampner"', text), document.fonts.load('700 40px "MW Lampner"', text), document.fonts.load('700 40px "MW Head"', head), document.fonts.load('400 40px "MW Head"', head)])
  const r = (a, b) => +(a / b * 100).toFixed(1)
  return {
    lampnerLight: r(w('"MW Lampner"', 400, text), w('Arial', 400, text)),
    lampnerRegular: r(w('"MW Lampner"', 600, text), w('Arial', 400, text)),
    lampnerBold: r(w('"MW Lampner"', 700, text), w('Arial', 700, text)),
    headBold: r(w('"MW Head"', 700, head), w('Arial', 700, head)),
    headLight: r(w('"MW Head"', 400, head), w('Arial', 400, head)),
  }
})
console.log(JSON.stringify(out))
await b.close()
