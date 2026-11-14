/**
 * Brand icons for the build (DECISIONS #52, the Horizon logo). Runs before `vite build`.
 *
 * 1. Copies the designed favicon set from logos/horizon into public/ under the names
 *    index.html and site.webmanifest use. They are design files, never re-rasterized here:
 *    the 16/32 px icons use their own geometry (a deeper wave, a wider gap) to survive at
 *    16 px, and favicon.svg switches tones with the browser's light or dark mode.
 * 2. Rasterizes the horizontal lockup (light palette) onto a padded white canvas as
 *    public/logo.png, the schema.org logo (Organization / Article publisher).
 * Run: node scripts/generate-favicons.mjs
 */
import { copyFileSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = resolve(ROOT, 'public')
const BRAND = resolve(ROOT, 'logos/horizon')

const COPY = ['favicon.svg', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'icon-512.png']

async function schemaLogo() {
  const lockup = readFileSync(resolve(BRAND, 'mediawave-horizontal-light.svg'))
  const W = 1000
  const H = 380
  // 820 px wide leaves clear space well beyond half the disc on every side
  const inner = await sharp(lockup, { density: 300 }).resize({ width: 820, fit: 'contain' }).png().toBuffer()
  await sharp({ create: { width: W, height: H, channels: 4, background: '#FFFFFF' } })
    .composite([{ input: inner, gravity: 'center' }])
    .png()
    .toFile(resolve(PUBLIC, 'logo.png'))
  console.log(`  → public/logo.png (${W}x${H}, horizontal lockup)`)
}

async function generate() {
  console.log('Brand icons from logos/horizon...')
  for (const f of COPY) {
    copyFileSync(resolve(BRAND, f), resolve(PUBLIC, f))
    console.log(`  → public/${f}`)
  }
  await schemaLogo()
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
