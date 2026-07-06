import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'
const OUT = 'g:/tmp/mediawave-audit/wave-lab/lottie-size'
mkdirSync(OUT, { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await puppeteer.launch({ headless: 'new' })

async function measure(url, label, vps) {
  for (const vp of vps) {
    const p = await b.newPage()
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
    await p.setViewport({ width: vp.w, height: vp.h, isMobile: vp.w < 768, hasTouch: vp.w < 768, deviceScaleFactor: 1 })
    await p.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
    // scroll through so lazy Lotties mount + reveal
    await p.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r=>setTimeout(r,180)) }
      window.scrollTo(0, 0)
    })
    await wait(1200)
    const data = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth
      const hOverflow = document.documentElement.scrollWidth > vw + 1
      // Lottie renders an <svg> inside .lottie or a div; also our SVG <img>
      const nodes = [...document.querySelectorAll('svg[class*="lottie" i], .lottie svg, img[src*="photo"]')]
      // fallback: any svg whose parent has fixed px width from our size prop
      const icons = []
      for (const el of document.querySelectorAll('img[src*="photo"], div > svg')) {
        const r = el.getBoundingClientRect()
        if (r.width < 24 || r.width > 400) continue
        // find nearest card ancestor
        let card = el.closest('.card-glow, [class*="rounded-xl"], [class*="rounded-2xl"], section')
        const cr = card ? card.getBoundingClientRect() : null
        icons.push({
          tag: el.tagName,
          w: Math.round(r.width), h: Math.round(r.height),
          overflowsCard: cr ? (r.right > cr.right + 1 || r.left < cr.left - 1 || r.width > cr.width + 1) : null,
          cardW: cr ? Math.round(cr.width) : null,
        })
      }
      return { vw, hOverflow, count: icons.length, icons: icons.slice(0, 20) }
    })
    console.log(`\n== ${label} @ ${vp.w} == vw=${data.vw} hOverflow=${data.hOverflow} icons=${data.count}`)
    for (const ic of data.icons) console.log(`   ${ic.tag} ${ic.w}x${ic.h}  card=${ic.cardW}  overflowsCard=${ic.overflowsCard}`)
    await p.screenshot({ path: `${OUT}/${label}-${vp.w}.png`, fullPage: true })
    await p.close()
  }
}

const desk = [{w:1440,h:900}]
const all = [{w:320,h:900},{w:390,h:844},{w:768,h:1024},{w:1440,h:900}]
await measure('http://localhost:4173/', 'home', all)
await measure('http://localhost:4173/services/chatbots', 'svc-chatbots', desk)
await measure('http://localhost:4173/services/memory-videos', 'svc-memory', [{w:390,h:844},{w:1440,h:900}])
await b.close()
console.log('\nDONE')
