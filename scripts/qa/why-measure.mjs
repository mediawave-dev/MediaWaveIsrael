import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await page.goto(process.argv[2] || 'http://localhost:4177/', { waitUntil: 'load' })
await page.evaluate(() => document.querySelector('#why-us').scrollIntoView())
await new Promise((r) => setTimeout(r, 2500))
const out = await page.evaluate(() => [...document.querySelectorAll('.why__face')].map((f) => {
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return `${Math.round(b.width)}x${Math.round(b.height)}@${Math.round(b.top - f.getBoundingClientRect().top)}` }
  const art = f.querySelector('.why__art'), icon = art?.firstElementChild, inner = icon?.firstElementChild, gfx = f.querySelector('svg, canvas')
  return { face: r(f), art: r(art), icon: r(icon), inner: r(inner), gfx: gfx ? `${gfx.tagName} ${r(gfx)} attr ${gfx.getAttribute('width')}x${gfx.getAttribute('height')} par=${gfx.getAttribute('preserveAspectRatio')}` : null }
}))
console.log(JSON.stringify(out, null, 1))
await browser.close()
