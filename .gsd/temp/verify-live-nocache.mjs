import puppeteer from 'puppeteer'
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width: 1440, height: 900 })
// Service hero
await p.goto('https://mediawave.co.il/services/memory-videos', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r=>setTimeout(r,1800))
const hero = await p.evaluate(()=>{const img=document.querySelector('section img[src*="photo"]');return img?{nat:img.naturalWidth,h:img.naturalHeight}:{found:false}})
console.log('SERVICE hero naturalWidth:', JSON.stringify(hero))
await p.screenshot({ path:'g:/tmp/mediawave-audit/wave-lab/live-svg/PROD-nocache-hero.png', clip:{x:520,y:120,width:400,height:340} })
// Home card
await p.goto('https://mediawave.co.il/', { waitUntil: 'networkidle0', timeout: 60000 })
await p.evaluate(()=>{const h=[...document.querySelectorAll('h3')].find(e=>e.textContent.includes('סרטוני זיכרונות'));h?.scrollIntoView({block:'center'})})
await new Promise(r=>setTimeout(r,2000))
const card = await p.evaluate(()=>{const img=document.querySelector('img[src*="photo"]');return img?{nat:img.naturalWidth}:{found:false}})
console.log('HOME card naturalWidth:', JSON.stringify(card))
await p.screenshot({ path:'g:/tmp/mediawave-audit/wave-lab/live-svg/PROD-nocache-card.png', clip:{x:40,y:120,width:400,height:600} })
await b.close()
