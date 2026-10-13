/**
 * The Horizon logo's palette in one place (DECISIONS #58: "Klein", choice 13 of the colour
 * board design/logo-colours.html). Rewrites the colours of every file in logos/horizon and
 * re-renders the raster icons from vector; the geometry is never touched (the path data stays
 * byte for byte). After it: npm run generate:favicons (copies the icons to public/) and
 * npm run generate:og (the share image).
 * Run: node scripts/brand-palette.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BRAND = resolve(ROOT, 'logos/horizon')

export const PALETTE = {
  // for dark grounds (the stage, Klein night #00113D)
  dark: { ground: '#00113D', a: '#FFFFFF', b: '#6E8CFF', t: '#8E9CC8' },
  // for light grounds (the void, paper #FAFAF7)
  light: { ground: '#FAFAF7', a: '#0E1016', b: '#002FA7', t: '#4E5468' },
}

const classes = (p) => `.a{fill:${p.a}}.b{fill:${p.b}}.t{fill:${p.t}}.l{fill:none;stroke:${p.t};stroke-width:1.6;stroke-opacity:0.55}`

// 1. the lockups: swap the four class colours inside each file's <style>
for (const f of readdirSync(BRAND).filter((n) => /^mediawave-(horizontal|compact|stacked|mark)-(dark|light)\.svg$/.test(n))) {
  const p = PALETTE[f.includes('-dark') ? 'dark' : 'light']
  const path = resolve(BRAND, f)
  const s = readFileSync(path, 'utf8')
  const next = s.replace(/<style>[^<]*<\/style>/, `<style>${classes(p)}</style>`)
  if (next === s && !s.includes(classes(p))) throw new Error(`no <style> in ${f}`)
  writeFileSync(path, next)
  console.log(`  ${f}`)
}

// 2. the app tiles (the disc on a square ground) and the adaptive favicon
const disc = (f) => [...readFileSync(resolve(BRAND, f), 'utf8').matchAll(/ d="([^"]+)"/g)].map((m) => m[1])
const [tileA, tileB] = disc('mediawave-app-icon-dark.svg')
for (const k of ['dark', 'light']) {
  const p = PALETTE[k]
  writeFileSync(resolve(BRAND, `mediawave-app-icon-${k}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="MediaWave"><rect width="100" height="100" fill="${p.ground}"/><path fill="${p.a}" d="${tileA}"/><path fill="${p.b}" d="${tileB}"/></svg>`)
  console.log(`  mediawave-app-icon-${k}.svg`)
}
const [favA, favB] = disc('favicon.svg')
const { dark: D, light: L } = PALETTE
writeFileSync(resolve(BRAND, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>.a{fill:${L.a}}.b{fill:${L.b}}@media (prefers-color-scheme:dark){.a{fill:${D.a}}.b{fill:${D.b}}}</style><path class="a" d="${favA}"/><path class="b" d="${favB}"/></svg>`)
console.log('  favicon.svg')

// 3. rasters, rendered from vector at high density then downsampled (never recoloured pixels)
const png = (svg, size, out) => sharp(Buffer.from(svg), { density: 1200 }).resize(size, size).png({ compressionLevel: 9 }).toFile(resolve(BRAND, out))
const appDark = readFileSync(resolve(BRAND, 'mediawave-app-icon-dark.svg'), 'utf8')
await png(appDark, 180, 'apple-touch-icon.png')
await png(appDark, 512, 'icon-512.png')
// the tab icons: the 32 px geometry (deeper wave, wider gap) on a rounded night tile, so the
// two tones read on light and dark tab bars alike (browsers that take SVG use favicon.svg)
const tab = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${D.ground}"/><g transform="translate(4 4) scale(0.75)"><path fill="${D.a}" d="${favA}"/><path fill="${D.b}" d="${favB}"/></g></svg>`
await png(tab, 32, 'favicon-32x32.png')
await png(tab, 16, 'favicon-16x16.png')
console.log('  apple-touch-icon.png, icon-512.png, favicon-32x32.png, favicon-16x16.png')
