// Which heavy italic carries "edia" and "ave" beside the picked M and W? One row per candidate, same size, same colours.
import { createRequire } from 'module'
import fs from 'fs'
import { word } from './word.mjs'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const require = createRequire(ROOT + 'package.json')
const puppeteer = require('puppeteer')
const fonts = (process.argv[2] ? process.argv[2].split(',') : fs.readdirSync('C:/tmp/night/logo/mw4/fonts')).filter((x) => x.endsWith('.ttf'))
const opts = process.argv[4] ? JSON.parse(process.argv[4]) : {}
const rows = fonts.map((file, i) => { const o = word('C:/tmp/night/logo/mw4/fonts/' + file, opts)
  const vb = `${o.x0 - 6} 135 ${o.x1 - o.x0 + 12} 178`, h = 104, u = 'g' + i
  const grad = (n, c0, c1, x0, x1) => `<linearGradient id="${u}${n}" gradientUnits="userSpaceOnUse" x1="${x0}" y1="155" x2="${x1}" y2="305"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient>`
  return `<div class="r"><i>${file.replace('.ttf', '')} · x-height ${(o.xh / 150).toFixed(2)}</i><svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" height="${h}"><defs>${grad('m', '#2F5249', '#13241F', 88, o.mediaEnd)}${grad('w', '#2CC9B5', '#0F8478', 232 + o.wx, o.x1)}</defs><path fill="url(#${u}m)" d="${o.media}"/><path fill="url(#${u}w)" d="${o.wave}"/></svg></div>` }).join('')
const b = await puppeteer.launch({ headless: 'new' })
const pg = await b.newPage()
await pg.setViewport({ width: 900, height: 800, deviceScaleFactor: 1.5 })
await pg.setContent(`<style>body{margin:0;width:900px;background:#fff;font-family:Arial}.r{position:relative;padding:34px 30px 18px;border-bottom:1px solid #dde7e4}.r i{position:absolute;top:10px;left:30px;font:600 12px Consolas,monospace;color:#5b7770;font-style:normal}</style><main>${rows}</main>`)
await (await pg.$('main')).screenshot({ path: 'C:/tmp/night/logo/mw4/specimen' + (process.argv[3] || '') + '.png' })
await b.close(); console.log('ok')
