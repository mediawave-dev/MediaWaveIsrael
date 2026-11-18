// A phone picture of one of the home page's questions, opened. node faq-shot.mjs [base] [text in the question] [out.png]
import { createRequire } from 'module'
const require = createRequire('G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/package.json')
const puppeteer = require('puppeteer')
const base = process.argv[2] || 'http://localhost:5189'
const want = process.argv[3] || 'מה כלול במחיר'
const out = process.argv[4] || 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/design/audit/sun/opener/faq-included.png'
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.goto(base + '/?calm=1', { waitUntil: 'networkidle2' })
await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}.consent,.tab{display:none!important}' })
await new Promise((r) => setTimeout(r, 1500))
// the section's state as the page itself reports it, then the one question opened and photographed
const before = await p.evaluate(() => [...document.querySelectorAll('#faq details')].map((d) => d.querySelector('summary').innerText.trim() + (d.open ? ' [open]' : '')))
console.log(before.join(' | '))
const handle = await p.evaluateHandle((w) => {
  const d = [...document.querySelectorAll('#faq details')].find((x) => x.querySelector('summary').textContent.includes(w))
  if (d) { d.open = true; d.scrollIntoView({ block: 'center' }) }
  return d
}, want)
const el = handle.asElement()
if (!el) { console.log('question not found'); await b.close(); process.exit(1) }
console.log(await el.evaluate((d) => d.innerText.replace(/\n+/g, ' / ')))
await el.screenshot({ path: out })
await b.close()
