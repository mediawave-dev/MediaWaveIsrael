// CPU profile of a phone scroll (4x throttle): self time by function and by script.
// Usage: node profile-scroll.mjs <url> [seconds]
import puppeteer from 'file:///G:/Web-Dev/MediaWaveIsrael/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const [url, secs = '40'] = process.argv.slice(2)
const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('leadModalClosed', 'true') } catch {} })
const cdp = await page.createCDPSession()
await page.goto(url, { waitUntil: 'load' })
await new Promise((r) => setTimeout(r, 2500))
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
await cdp.send('Profiler.enable')
await cdp.send('Profiler.setSamplingInterval', { interval: 500 })
await cdp.send('Profiler.start')
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
const steps = Math.round(+secs * 10)
for (let i = 0; i <= steps; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round((total * i) / steps))
  await new Promise((r) => setTimeout(r, 100))
}
const { profile } = await cdp.send('Profiler.stop')
await browser.close()
const byId = new Map(profile.nodes.map((n) => [n.id, n]))
const self = new Map()
const dt = profile.timeDeltas
for (let i = 0; i < profile.samples.length; i++) self.set(profile.samples[i], (self.get(profile.samples[i]) || 0) + (dt[i] || 0))
const fn = new Map(), file = new Map()
for (const [id, us] of self) {
  const cf = byId.get(id).callFrame
  const f = (cf.url || '(native)').split('/').pop().split('?')[0]
  const k = `${cf.functionName || '(anon)'} @ ${f}:${cf.lineNumber}`
  fn.set(k, (fn.get(k) || 0) + us)
  file.set(f, (file.get(f) || 0) + us)
}
const top = (m, n) => [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${(v / 1000).toFixed(0).padStart(6)} ms  ${k}`).join('\n')
console.log('== by script\n' + top(file, 14))
console.log('== by function\n' + top(fn, 28))
