import puppeteer from 'puppeteer'
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
const failed = []
p.on('requestfailed', r => failed.push(r.url() + ' :: ' + (r.failure()?.errorText||'')))
p.on('response', r => { if (r.url().includes('photo') && r.url().includes('svg')) console.log('SVG response:', r.status(), r.headers()['content-type']) })
await p.setViewport({ width: 1440, height: 900 })
// SERVICE PAGE (hero SVG, above fold)
await p.goto('https://mediawave.co.il/services/memory-videos', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r=>setTimeout(r,2000))
const heroImg = await p.evaluate(() => {
  const img = document.querySelector('section img[src*="photo"]')
  if (!img) return { found: false }
  return { found: true, complete: img.complete, naturalW: img.naturalWidth, naturalH: img.naturalHeight, w: img.getBoundingClientRect().width, h: img.getBoundingClientRect().height, src: img.getAttribute('src') }
})
console.log('SERVICE hero img:', JSON.stringify(heroImg))
await p.screenshot({ path: 'g:/tmp/mediawave-audit/wave-lab/live-svg/service-hero.png', clip:{x:520,y:120,width:400,height:320} })
// HOME card
await p.goto('https://mediawave.co.il/', { waitUntil: 'networkidle0', timeout: 60000 })
await p.evaluate(()=>{const h=[...document.querySelectorAll('h3')].find(e=>e.textContent.includes('סרטוני זיכרונות'));h?.scrollIntoView({block:'center'})})
await new Promise(r=>setTimeout(r,2500))
const cardImg = await p.evaluate(() => {
  const imgs=[...document.querySelectorAll('img[src*="photo"]')]
  return imgs.map(img=>({complete:img.complete,naturalW:img.naturalWidth,w:Math.round(img.getBoundingClientRect().width),src:img.getAttribute('src')}))
})
console.log('HOME card imgs:', JSON.stringify(cardImg))
await p.screenshot({ path: 'g:/tmp/mediawave-audit/wave-lab/live-svg/home-card.png', clip:{x:40,y:150,width:400,height:560} })
console.log('FAILED requests:', failed.filter(f=>f.includes('photo')).join(' | ') || 'none photo-related')
await b.close()
