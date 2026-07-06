import puppeteer from 'puppeteer'
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
// service page hero
await p.goto('http://localhost:4173/services/memory-videos', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r=>setTimeout(r,1500))
await p.screenshot({ path: 'g:/tmp/mediawave-audit/wave-lab/svg-icon/service-hero.png', clip: {x:420, y:70, width:600, height:420} })
// home services grid — scroll to it
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 60000 })
await p.evaluate(()=>document.querySelector('#services')?.scrollIntoView())
await new Promise(r=>setTimeout(r,1500))
await p.screenshot({ path: 'g:/tmp/mediawave-audit/wave-lab/svg-icon/home-grid.png' })
await b.close()
console.log('done')
