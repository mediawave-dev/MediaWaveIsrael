import puppeteer from 'puppeteer'
const b = await puppeteer.launch({ headless: 'new' })
for (let i=1;i<=12;i++){
  await new Promise(r=>setTimeout(r,45000))
  const p = await b.newPage()
  await p.setViewport({ width: 1440, height: 900 })
  try {
    await p.goto('https://mediawave.co.il/services/memory-videos?v='+i+Math.random(), { waitUntil: 'networkidle0', timeout: 60000 })
    await new Promise(r=>setTimeout(r,1500))
    const nat = await p.evaluate(()=>{const img=document.querySelector('section img[src*="photo"]');return img?img.naturalWidth:-1})
    console.log('poll '+i+': naturalWidth='+nat)
    if (nat>0){
      await p.screenshot({ path:'g:/tmp/mediawave-audit/wave-lab/live-svg/PROD-fixed.png', clip:{x:520,y:120,width:400,height:340} })
      console.log('SVG RENDERS ON PRODUCTION')
      await p.close(); break
    }
  } catch(e){ console.log('poll '+i+' err:', e.message.slice(0,60)) }
  await p.close()
}
await b.close()
