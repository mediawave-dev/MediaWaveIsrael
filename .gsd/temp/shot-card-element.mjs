import puppeteer from 'puppeteer'
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await p.goto('https://mediawave.co.il/', { waitUntil: 'networkidle0', timeout: 60000 })
// find the memory-videos card container and screenshot the element itself
const handle = await p.evaluateHandle(()=>{
  const h=[...document.querySelectorAll('h3')].find(e=>e.textContent.includes('סרטוני זיכרונות'))
  return h ? h.closest('.card-glow') || h.parentElement.parentElement : null
})
await handle.asElement().scrollIntoViewIfNeeded?.()
await new Promise(r=>setTimeout(r,1800))
const el = handle.asElement()
if (el) { await el.screenshot({ path:'g:/tmp/mediawave-audit/wave-lab/live-svg/PROD-card-element.png' }); console.log('card element captured') }
else console.log('card element NOT found')
await b.close()
