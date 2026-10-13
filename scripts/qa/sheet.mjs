// Contact sheet of screenshots: node scripts/qa/sheet.mjs out.png cols scale files...
import sharp from 'sharp'
const [out, cols, scale, ...files] = process.argv.slice(2)
const metas = await Promise.all(files.map((f) => sharp(f).metadata()))
const w = Math.round(metas[0].width * +scale), h = Math.round(metas[0].height * +scale)
const c = +cols, rows = Math.ceil(files.length / c)
const tiles = await Promise.all(files.map((f) => sharp(f).resize(w, h).toBuffer()))
await sharp({ create: { width: c * w + (c - 1) * 6, height: rows * h + (rows - 1) * 6, channels: 3, background: '#ff00ff' } })
  .composite(tiles.map((b, i) => ({ input: b, left: (i % c) * (w + 6), top: Math.floor(i / c) * (h + 6) }))).png().toFile(out)
