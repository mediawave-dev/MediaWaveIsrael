import puppeteer from 'puppeteer'
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.goto('http://localhost:4173/services/memory-videos', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r=>setTimeout(r,1500))
const hero = await p.evaluate(() => {
  const img = document.querySelector('section img[src*="photo"]')
  return img ? { naturalW: img.naturalWidth, naturalH: img.naturalHeight, w: Math.round(img.getBoundingClientRect().width) } : { found:false }
})
console.log('hero img:', JSON.stringify(hero))
await p.screenshot({ path: 'g:/tmp/mediawave-audit/wave-lab/live-svg/local-fixed-hero.png', clip:{x:520,y:120,width:400,height:340} })
await b.close()
