import opentype from 'opentype.js'
import fs from 'node:fs'

// Load fonts, key by REAL weight from OS/2 (google file order is shuffled)
const files = ['outfit-500.ttf', 'outfit-600.ttf', 'outfit-700.ttf']
const fonts = {}
for (const f of files) {
  const buf = fs.readFileSync(f)
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
  fonts[font.tables.os2.usWeightClass] = font
}
console.log('weights loaded:', Object.keys(fonts).join(', '))

// Manual glyph composition — bypasses the GSUB ccmp crash, keeps kerning via kern/GPOS pairs.
function textToPath(font, text, fontSize, { letterSpacing = 0, decimals = 2 } = {}) {
  const scale = fontSize / font.unitsPerEm
  const ls = letterSpacing * fontSize // letterSpacing in em -> px
  const glyphs = [...text].map((c) => font.charToGlyph(c))
  let x = 0
  const full = new opentype.Path()
  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i]
    const p = g.getPath(x, 0, fontSize)
    full.extend(p)
    x += g.advanceWidth * scale
    if (i < glyphs.length - 1) {
      const k = font.getKerningValue(g, glyphs[i + 1])
      x += (Number.isFinite(k) ? k : 0) * scale
      x += ls
    }
  }
  const d = full.toPathData(decimals)
  const bb = full.getBoundingBox()
  return { d, bb, adv: x }
}

const out = {}

const W = 600
const wm = fonts[W]
const media = textToPath(wm, 'Media', 100)
const wave = textToPath(wm, 'Wave', 100)
const full = textToPath(wm, 'MediaWave', 100)
const H = textToPath(wm, 'H', 100)
const xg = textToPath(wm, 'x', 100)

out.wordmark = {
  weight: W,
  fontSize: 100,
  media: { d: media.d, adv: media.adv, bb: media.bb },
  wave: { d: wave.d, adv: wave.adv, bb: wave.bb },
  full: { d: full.d, adv: full.adv, bb: full.bb },
  waveOffsetX: full.adv - wave.adv,
  capHeight: -H.bb.y1,
  xHeight: -xg.bb.y1,
  ascender: (wm.ascender / wm.unitsPerEm) * 100,
  descender: (wm.descender / wm.unitsPerEm) * 100,
}

const tagline = textToPath(fonts[500], 'WEB DEVELOPMENT', 100, { letterSpacing: 0.32 })
out.tagline = { weight: 500, fontSize: 100, d: tagline.d, adv: tagline.adv, bb: tagline.bb }

const mw700 = textToPath(fonts[700], 'MediaWave', 100)
out.wordmark700 = { d: mw700.d, adv: mw700.adv, bb: mw700.bb }

fs.writeFileSync('wordmark.json', JSON.stringify(out, null, 2))
console.log('media adv:', media.adv.toFixed(2), '| full adv:', full.adv.toFixed(2), '| waveOffsetX:', out.wordmark.waveOffsetX.toFixed(2))
console.log('capHeight:', out.wordmark.capHeight.toFixed(2), '| xHeight:', out.wordmark.xHeight.toFixed(2), '| tagline adv:', tagline.adv.toFixed(2))
console.log('d lengths:', media.d.length, wave.d.length, tagline.d.length)
