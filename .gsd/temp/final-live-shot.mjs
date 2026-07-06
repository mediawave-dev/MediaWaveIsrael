import puppeteer from 'puppeteer'
const wait=(ms)=>new Promise(r=>setTimeout(r,ms))
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width:1440, height:900, deviceScaleFactor:2 })
await p.goto('https://mediawave.co.il/',{waitUntil:'networkidle0',timeout:60000})
await p.evaluate(async()=>{for(let y=0;y<=document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150))}window.scrollTo(0,0)})
await wait(1000)
const el = await p.evaluateHandle(()=>{const h=[...document.querySelectorAll('h2')].find(e=>e.textContent.includes('מה אנחנו'));return h?h.closest('section'):null})
const e=el.asElement()
if(e){await e.scrollIntoView();await wait(800);await e.screenshot({path:'g:/tmp/mediawave-audit/wave-lab/PROD-services-final.png'})}
await b.close();console.log('captured')
