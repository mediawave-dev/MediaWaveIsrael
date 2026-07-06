import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'
const OUT = 'g:/tmp/mediawave-audit/wave-lab/lottie-sections'
mkdirSync(OUT, { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await puppeteer.launch({ headless: 'new' })
const sections = [
  { sel: 'section[aria-label="שירותים"]', name: 'services' },
  { sel: 'h2 ::-p-text(למה)', name: 'whyus', fallback: 'section' },
]
async function grab(url, vp, shots) {
  const p = await b.newPage()
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await p.setViewport({ width: vp.w, height: vp.h, isMobile: vp.w<768, hasTouch: vp.w<768, deviceScaleFactor: 2 })
  await p.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  await p.evaluate(async () => { for (let y=0;y<=document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150))} window.scrollTo(0,0) })
  await wait(1000)
  for (const s of shots) {
    const el = await p.evaluateHandle((heading)=>{
      const h=[...document.querySelectorAll('h2,h3')].find(e=>e.textContent.includes(heading))
      return h ? h.closest('section') : null
    }, s.heading)
    const e = el.asElement()
    if (e) { await e.scrollIntoView(); await wait(700); try { await e.screenshot({ path: `${OUT}/${s.name}-${vp.w}.png` }) } catch(err){ console.log(s.name, 'clip fail', err.message.slice(0,40)) } }
    else console.log(s.name, 'not found')
  }
  await p.close()
}
const shots = [
  { name:'whyus', heading:'למה לבחור' },
  { name:'services', heading:'מה אנחנו' },
  { name:'howwework', heading:'איך אנחנו' },
  { name:'contact', heading:'דברו איתנו' },
]
for (const vp of [{w:1440,h:900},{w:390,h:844}]) await grab('http://localhost:4173/', vp, shots)
await b.close()
console.log('DONE')
