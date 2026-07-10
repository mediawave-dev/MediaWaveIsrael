// Compose final MediaWave logo lockups: crest mark + vector wordmark + tagline.
import fs from 'node:fs'
import { crestRibbons } from './gen-mark.mjs'

const wm = JSON.parse(fs.readFileSync('wordmark.json', 'utf8'))
const OUT = process.argv[2] || 'preview'
fs.mkdirSync(OUT, { recursive: true })

const ribbons = crestRibbons()

// ---- palette ----------------------------------------------------------------
const C = {
  frost: '#F8FAFC',
  skyPastel: '#7DD3FC',
  skySoft: '#BAE6FD',
  skyDeep: '#38BDF8',
  skyInk: '#0369A1',
  skyInkStrong: '#075985',
  cyanSoft: '#A5F3FC',
  inkStrong: '#2A2A2A',
  ink: '#4A4A4A',
  navy: '#1E293B',
}

const gradFlow = (id, dark) =>
  dark
    ? `<linearGradient id="${id}" x1="14" y1="90" x2="108" y2="30" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${C.skyDeep}"/><stop offset="0.55" stop-color="${C.skyPastel}"/><stop offset="1" stop-color="${C.cyanSoft}"/>
    </linearGradient>`
    : `<linearGradient id="${id}" x1="14" y1="90" x2="108" y2="30" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${C.skyInkStrong}"/><stop offset="0.6" stop-color="${C.skyInk}"/><stop offset="1" stop-color="#0284C7"/>
    </linearGradient>`

const markGroup = (fill, extra = '') =>
  `<g fill="${fill}"${extra}>
      ${ribbons.map((p, i) => `<path class="rb rb${i}" d="${p}"/>`).join('\n      ')}
    </g>`

// ---- horizontal lockup --------------------------------------------------------
// Composition space: wordmark fontSize 100, baseline y=0.
function horizontal({ dark = true, mono = false, animated = false } = {}) {
  const gid = `flow${dark ? 'D' : 'L'}`
  const markScale = 1.5
  // mark local content: x 9.6..109.5, y 13..95.8 -> scaled ~150x124
  const markW = 100 * markScale
  const gap = 26
  const wmX = 132 * markScale * 0.92 // slight tuck: fan tips fly over the gap
  const textW = wm.wordmark.full.adv // 537.9
  const cap = wm.wordmark.capHeight // 70.3
  // vertical: text block spans -cap .. +tagline baseline(38); mark centered on that
  const blockMid = (-cap + 40) / 2 // ≈ -15
  const markH = 82.8 * markScale
  const markTy = blockMid + markH / 2 - 95.8 * markScale // align mark bottom
  const markTx = -9.6 * markScale + 2

  // tagline: scaled to 88% of wordmark width, centered under it
  const tagS = (textW * 0.88) / wm.tagline.adv
  const tagW = wm.tagline.adv * tagS
  const tagX = wmX + (textW - tagW) / 2
  const tagBase = 40
  const tagCap = 70.3 * tagS
  const lineY = tagBase - tagCap / 2
  const lineGap = 16

  const mediaFill = mono ? (dark ? C.frost : C.inkStrong) : dark ? C.frost : C.inkStrong
  const waveFill = mono ? (dark ? C.frost : C.inkStrong) : dark ? C.skyPastel : C.skyInk
  const tagFill = dark ? C.frost : C.ink
  const tagOp = dark ? 0.62 : 0.78
  const markFill = mono ? (dark ? C.frost : C.inkStrong) : `url(#${gid})`

  const vbX = -6
  const vbW = wmX + textW + 18
  const vbY = -104
  const vbH = 162

  const anim = animated
    ? `<style>
    @media (prefers-reduced-motion: no-preference) {
      .rb { opacity: 0; transform: translate(14px, 10px); animation: mw-rise 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
      .rb0{animation-delay:.05s}.rb1{animation-delay:.13s}.rb2{animation-delay:.21s}.rb3{animation-delay:.29s}.rb4{animation-delay:.37s}
      .wm-media, .wm-wave, .wm-tag { opacity: 0; animation: mw-fade 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
      .wm-media{animation-delay:.35s}.wm-wave{animation-delay:.5s}.wm-tag{animation-delay:.68s}
      @keyframes mw-rise { to { opacity: 1; transform: translate(0,0); } }
      @keyframes mw-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    }
  </style>`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${vbW} ${vbH}" role="img" aria-labelledby="mw-t mw-d">
  <title id="mw-t">MediaWave — Web Development</title>
  <desc id="mw-d">Fan of five tapered wave ribbons beside the MediaWave wordmark with WEB DEVELOPMENT tagline</desc>
  <defs>${mono ? '' : gradFlow(gid, dark)}</defs>${anim}
  <g transform="translate(${r(markTx)} ${r(markTy)}) scale(${markScale})">
    ${markGroup(markFill)}
  </g>
  <g>
    <path class="wm-media" fill="${mediaFill}" transform="translate(${r(wmX)} 0)" d="${wm.wordmark.media.d}"/>
    <path class="wm-wave" fill="${waveFill}" transform="translate(${r(wmX + wm.wordmark.waveOffsetX)} 0)" d="${wm.wordmark.wave.d}"/>
    <g class="wm-tag">
      <path fill="${tagFill}" fill-opacity="${tagOp}" transform="translate(${r(tagX)} ${tagBase}) scale(${r4(tagS)})" d="${wm.tagline.d}"/>
      <line x1="${r(wmX)}" y1="${r(lineY)}" x2="${r(tagX - lineGap)}" y2="${r(lineY)}" stroke="${tagFill}" stroke-opacity="${tagOp * 0.55}" stroke-width="1.6"/>
      <line x1="${r(tagX + tagW + lineGap)}" y1="${r(lineY)}" x2="${r(wmX + textW)}" y2="${r(lineY)}" stroke="${tagFill}" stroke-opacity="${tagOp * 0.55}" stroke-width="1.6"/>
    </g>
  </g>
</svg>`
}

// ---- stacked lockup -----------------------------------------------------------
function stacked({ dark = true } = {}) {
  const gid = `flowS${dark ? 'D' : 'L'}`
  const markScale = 1.9
  const textW = wm.wordmark.full.adv
  const markW = 100 * markScale
  const markX = (textW - markW) / 2 - 9.6 * markScale + 6 // +6: fan mass is left-weighted, optical center
  const cap = wm.wordmark.capHeight
  const wmY = 96.2 * markScale + 20 + cap // mark bottom + gap + capheight

  const tagS = (textW * 0.88) / wm.tagline.adv
  const tagW = wm.tagline.adv * tagS
  const tagX = (textW - tagW) / 2
  const tagBase = wmY + 42
  const tagCap = 70.3 * tagS
  const lineY = tagBase - tagCap / 2

  const mediaFill = dark ? C.frost : C.inkStrong
  const waveFill = dark ? C.skyPastel : C.skyInk
  const tagFill = dark ? C.frost : C.ink
  const tagOp = dark ? 0.62 : 0.78

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 ${r(13 * markScale - 16)} ${r(textW + 28)} ${r(tagBase - 13 * markScale + 44)}" role="img" aria-labelledby="mws-t mws-d">
  <title id="mws-t">MediaWave — Web Development</title>
  <desc id="mws-d">Stacked MediaWave logo: wave ribbons above the wordmark</desc>
  <defs>${gradFlow(gid, dark)}</defs>
  <g transform="translate(${r(markX)} 0) scale(${markScale})">
    ${markGroup(`url(#${gid})`)}
  </g>
  <path fill="${mediaFill}" transform="translate(0 ${r(wmY)})" d="${wm.wordmark.media.d}"/>
  <path fill="${waveFill}" transform="translate(${r(wm.wordmark.waveOffsetX)} ${r(wmY)})" d="${wm.wordmark.wave.d}"/>
  <path fill="${tagFill}" fill-opacity="${tagOp}" transform="translate(${r(tagX)} ${r(tagBase)}) scale(${r4(tagS)})" d="${wm.tagline.d}"/>
  <line x1="0" y1="${r(lineY)}" x2="${r(tagX - 16)}" y2="${r(lineY)}" stroke="${tagFill}" stroke-opacity="${tagOp * 0.55}" stroke-width="1.6"/>
  <line x1="${r(tagX + tagW + 16)}" y1="${r(lineY)}" x2="${r(textW)}" y2="${r(lineY)}" stroke="${tagFill}" stroke-opacity="${tagOp * 0.55}" stroke-width="1.6"/>
</svg>`
}

// ---- mark only + app tile -------------------------------------------------------
function markOnly({ dark = true } = {}) {
  const gid = `flowM${dark ? 'D' : 'L'}`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-labelledby="mwm-t mwm-d">
  <title id="mwm-t">MediaWave mark</title>
  <desc id="mwm-d">Fan of five tapered wave ribbons</desc>
  <defs>${gradFlow(gid, dark)}</defs>
  <g transform="translate(3 4)">${markGroup(`url(#${gid})`)}</g>
</svg>`
}

// Dedicated favicon: 3 ribbons only, widths boosted so nothing dies at 16px.
function favicon() {
  const thick = crestRibbons({ spread: 2.3 })
  const three = [thick[0], thick[2], thick[4]]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="MediaWave">
  <defs>
    <linearGradient id="ftile" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${C.skyDeep}"/><stop offset="1" stop-color="${C.skyInk}"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="27" fill="url(#ftile)"/>
  <g transform="translate(11 6) scale(0.84)" fill="#FFFFFF">
    ${three.map((p) => `<path d="${p}"/>`).join('\n    ')}
  </g>
</svg>`
}

function appTile() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-labelledby="mwa-t mwa-d">
  <title id="mwa-t">MediaWave app icon</title>
  <desc id="mwa-d">White wave ribbons on a sky gradient tile</desc>
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${C.skyDeep}"/><stop offset="1" stop-color="${C.skyInk}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="120" height="120" rx="27" fill="url(#tile)"/>
  <g transform="translate(10 8) scale(0.84)">${markGroup('#FFFFFF')}</g>
</svg>`
}

const r = (n) => Math.round(n * 100) / 100
const r4 = (n) => Math.round(n * 10000) / 10000

const files = {
  'mediawave-crest-horizontal-dark.svg': horizontal({ dark: true }),
  'mediawave-crest-horizontal-light.svg': horizontal({ dark: false }),
  'mediawave-crest-horizontal-dark-animated.svg': horizontal({ dark: true, animated: true }),
  'mediawave-crest-horizontal-mono-white.svg': horizontal({ dark: true, mono: true }),
  'mediawave-crest-horizontal-mono-ink-light.svg': horizontal({ dark: false, mono: true }),
  'mediawave-crest-stacked-dark.svg': stacked({ dark: true }),
  'mediawave-crest-stacked-light.svg': stacked({ dark: false }),
  'mediawave-crest-mark-dark.svg': markOnly({ dark: true }),
  'mediawave-crest-mark-light.svg': markOnly({ dark: false }),
  'mediawave-crest-apptile.svg': appTile(),
  'mediawave-crest-favicon.svg': favicon(),
}
for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(`${OUT}/${name}`, svg)
}
console.log('wrote', Object.keys(files).length, 'files to', OUT)
