/**
 * Rasterize public/favicon.svg into the PNG favicon variants referenced by
 * index.html + site.webmanifest. Runs in the build before `vite build` so the
 * PNGs are present in public/ when Vite copies it to dist/ root.
 * Run: node scripts/generate-favicons.mjs
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = resolve(__dirname, '..', 'public')
const SVG = readFileSync(resolve(PUBLIC, 'favicon.svg'))

// Fill for the corners iOS squares off the apple-touch icon (no black corners).
const TILE = '#38BDF8'

/**
 * @param {number} size   output px
 * @param {string} out    filename in public/
 * @param {boolean} opaque flatten transparency onto the brand tile (iOS)
 */
async function png(size, out, opaque = false) {
  // High internal density → the SVG renders large before downscaling, so the
  // 16/32px output stays crisp instead of blurry.
  let img = sharp(SVG, { density: size * 8 }).resize(size, size, { fit: 'contain' })
  if (opaque) img = img.flatten({ background: TILE })
  await img.png().toFile(resolve(PUBLIC, out))
  console.log(`  → public/${out} (${size}x${size})`)
}

/**
 * Rasterize the ink lockup onto a padded white canvas for schema.org logo
 * references (Organization / Article publisher). Wide lockup, generous margin.
 */
async function schemaLogo() {
  const lockup = readFileSync(resolve(PUBLIC, 'logo-lockup-ink.svg'))
  const W = 1000
  const H = 380
  const inner = await sharp(lockup, { density: 300 })
    .resize({ width: 820, fit: 'contain' })
    .png()
    .toBuffer()
  await sharp({ create: { width: W, height: H, channels: 4, background: '#FFFFFF' } })
    .composite([{ input: inner, gravity: 'center' }])
    .png()
    .toFile(resolve(PUBLIC, 'logo.png'))
  console.log(`  → public/logo.png (${W}x${H})`)
}

async function generate() {
  console.log('Generating favicons from public/favicon.svg...')
  await png(16, 'favicon-16x16.png')
  await png(32, 'favicon-32x32.png')
  await png(180, 'apple-touch-icon.png', true)
  await schemaLogo()
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
