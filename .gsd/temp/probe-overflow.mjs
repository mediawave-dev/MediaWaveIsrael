import puppeteer from 'puppeteer'
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: 320, height: 900, isMobile: true, hasTouch: true })
await p.goto('http://localhost:4173' + (process.argv[2] || '/services/memory-videos'), { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2500))
const culprits = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth
  const out = []
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect()
    if (r.width > vw + 1 || r.right > vw + 1 || r.left < -1) {
      out.push({
        tag: el.tagName,
        cls: String(el.className).slice(0, 90),
        w: Math.round(r.width),
        left: Math.round(r.left),
        right: Math.round(r.right),
        text: (el.textContent || '').trim().slice(0, 40),
      })
    }
  }
  return { vw, sw: document.documentElement.scrollWidth, out: out.slice(0, 12) }
})
console.log('viewport', culprits.vw, 'scrollWidth', culprits.sw)
for (const c of culprits.out) console.log(JSON.stringify(c))
await b.close()
