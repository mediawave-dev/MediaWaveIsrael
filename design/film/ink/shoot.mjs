// The ink film · one screenshot of a page in this folder: node shoot.mjs hand.html out.png [width] [height]
import puppeteer from 'puppeteer'
import { serve } from './serve.mjs'

const [page = 'hand.html', out = 'out.png', w = '1500', h = '760'] = process.argv.slice(2)
const { server, url } = await serve()
const browser = await puppeteer.launch({ headless: true, args: ['--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11'] })
try {
  const tab = await browser.newPage()
  await tab.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1 })
  tab.on('console', (m) => process.stdout.write(`[page] ${m.text()}\n`))
  tab.on('pageerror', (e) => process.stdout.write(`[error] ${e.message}\n`))
  await tab.goto(`${url}/${page}`, { waitUntil: 'load' })
  await tab.waitForFunction('window.done === true', { timeout: 120000 })
  await tab.screenshot({ path: out })
} finally {
  await browser.close()
  server.close()
}
