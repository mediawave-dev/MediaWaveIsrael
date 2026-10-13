// Count composited layers on a phone at a few scroll fractions, and name what makes them.
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const [url, ...fr] = process.argv.slice(2)
const fracs = fr.length ? fr.map(Number) : [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9]
const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true') } catch {} })
const cdp = await page.createCDPSession()
await page.goto(url, { waitUntil: 'load' })
await new Promise((r) => setTimeout(r, 2500))
await cdp.send('DOM.getDocument', { depth: -1 })
let last = null
cdp.on('LayerTree.layerTreeDidChange', (e) => { if (e.layers) last = e.layers })
await cdp.send('LayerTree.enable')
for (const f of fracs) {
  await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), f)
  await new Promise((r) => setTimeout(r, 1200))
  const layers = last || []
  const names = new Map()
  for (const l of layers) {
    let label = 'no-node'
    if (l.backendNodeId) {
      try {
        const { object } = await cdp.send('DOM.resolveNode', { backendNodeId: l.backendNodeId })
        const r = await cdp.send('Runtime.callFunctionOn', { objectId: object.objectId, functionDeclaration: 'function(){const e=this.nodeType===1?this:this.parentElement;if(!e)return "?";const s=e.closest("section,footer,header,[data-theme-layer],.mw-head");return (s?(s.id||s.className.toString().split(" ")[0]):"-")+" > "+e.tagName.toLowerCase()+"."+(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className).toString().split(" ")[0]}', returnByValue: true })
        label = r.result.value
      } catch { label = 'detached' }
    }
    names.set(label, (names.get(label) || 0) + 1)
  }
  const top = [...names].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${v}x ${k}`).join(' | ')
  console.log(`f=${f} layers=${layers.length} :: ${top}`)
}
await browser.close()
