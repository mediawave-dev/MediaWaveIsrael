import puppeteer from 'puppeteer'
const wait=(ms)=>new Promise(r=>setTimeout(r,ms))
const b = await puppeteer.launch({ headless: 'new' })
for(let i=1;i<=12;i++){
  await wait(45000)
  const p = await b.newPage()
  await p.setCacheEnabled(false)
  await p.setViewport({ width:1440, height:900 })
  try{
    await p.goto('https://mediawave.co.il/?v='+i+Math.random(),{waitUntil:'networkidle0',timeout:60000})
    await p.evaluate(async()=>{for(let y=0;y<=document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150))}window.scrollTo(0,0)})
    await wait(1200)
    const sizes = await p.evaluate(()=>{
      const svgs=[...document.querySelectorAll('div > svg')].map(s=>Math.round(s.getBoundingClientRect().width)).filter(w=>w>=100&&w<=260)
      return svgs.sort((a,b)=>b-a)
    })
    const maxIcon = sizes[0]||0
    console.log('poll '+i+': largest icon='+maxIcon+'px  sample='+sizes.slice(0,6).join(','))
    if(maxIcon>=175){ console.log('ENLARGED LOTTIES LIVE (>=175px present)'); await p.close(); break }
  }catch(e){ console.log('poll '+i+' err', e.message.slice(0,50)) }
  await p.close()
}
await b.close()
