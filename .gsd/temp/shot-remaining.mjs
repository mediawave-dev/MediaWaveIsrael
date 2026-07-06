import puppeteer from 'puppeteer'
const OUT = 'g:/tmp/mediawave-audit/wave-lab/lottie-sections'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await puppeteer.launch({ headless: 'new' })
async function sectionShot(url, heading, name, vp){
  const p = await b.newPage()
  await p.emulateMediaFeatures([{ name:'prefers-reduced-motion', value:'no-preference' }])
  await p.setViewport({ width:vp.w, height:vp.h, isMobile:vp.w<768, hasTouch:vp.w<768, deviceScaleFactor:2 })
  await p.goto(url, { waitUntil:'networkidle0', timeout:60000 })
  await p.evaluate(async()=>{for(let y=0;y<=document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150))}window.scrollTo(0,0)})
  await wait(900)
  const el = await p.evaluateHandle((h)=>{const n=[...document.querySelectorAll('h1,h2')].find(e=>e.textContent.includes(h));return n?n.closest('section'):null},heading)
  const e=el.asElement()
  if(e){await e.scrollIntoView();await wait(700);try{await e.screenshot({path:`${OUT}/${name}-${vp.w}.png`})}catch(err){console.log(name,'fail',err.message.slice(0,30))}}
  else console.log(name,'not found')
  await p.close()
}
for(const vp of [{w:1440,h:900},{w:390,h:844}]){
  await sectionShot('http://localhost:4173/','למה לעבוד','whyus',vp)
  await sectionShot('http://localhost:4173/services/chatbots','צ׳אטבוטים','svc-hero-chatbots',vp)
}
await b.close();console.log('DONE')
