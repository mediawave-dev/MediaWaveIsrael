// Real-browser load metrics (not Lighthouse's simulation): a phone viewport, 4x CPU, a "slow 4G"
// network, the browser's own LCP / FCP / CLS entries and the long-task total until 6 s.
// Usage: node rum.mjs <url> [runs]
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const [url, runs = '3'] = process.argv.slice(2)
const out = []
for (let i = 0; i < +runs; i++) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  const cdp = await page.createCDPSession()
  await cdp.send('Network.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await page.evaluateOnNewDocument(() => {
    window.__m = { lcp: 0, lcpEl: '', fcp: 0, cls: 0, long: 0 }
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__m.lcp = e.startTime; window.__m.lcpEl = (e.element?.tagName || '') + '.' + (e.element?.className || '') } }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime }).observe({ type: 'paint', buffered: true })
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value }).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.startTime < 6000) window.__m.long += Math.max(0, e.duration - 50) }).observe({ type: 'longtask', buffered: true })
  })
  await page.goto(url, { waitUntil: 'load', timeout: 90000 })
  await new Promise((r) => setTimeout(r, 6000))
  const m = await page.evaluate(() => window.__m)
  out.push(m)
  console.log(`run ${i + 1}: FCP ${Math.round(m.fcp)} LCP ${Math.round(m.lcp)} (${m.lcpEl.slice(0, 40)}) CLS ${m.cls.toFixed(3)} blocking ${Math.round(m.long)} ms`)
  await browser.close()
}
const med = (k) => out.map((m) => m[k]).sort((a, b) => a - b)[Math.floor(out.length / 2)]
console.log(`MEDIAN ${url}: FCP ${Math.round(med('fcp'))} LCP ${Math.round(med('lcp'))} CLS ${med('cls').toFixed(3)} blocking ${Math.round(med('long'))} ms`)
