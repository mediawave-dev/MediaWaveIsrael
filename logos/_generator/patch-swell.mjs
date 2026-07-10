// Surgical cleanup of the workflow "Kinetic Signature" mark -> "Swell" concept,
// plus a full horizontal lockup reusing the vectorized wordmark.
import fs from 'node:fs'

const wm = JSON.parse(fs.readFileSync('wordmark.json', 'utf8'))
const OUT = 'preview'

function cleanMark(svg) {
  return svg
    // remove the detached spray flick (floating band-aid)
    .replace(/<path class="mw-spray"[^/]*\/>\s*/g, '')
    // strengthen the echo trails so they survive on navy / frost
    .replace('stroke-opacity="0.5" stroke-width="1.6"', 'stroke-opacity="0.85" stroke-width="2.1"')
}

const darkRaw = fs.readFileSync('wf-preview/wf-kinetic-signature-crest-fan-dark.svg', 'utf8')
const lightRaw = fs.readFileSync('wf-preview/wf-kinetic-signature-crest-fan-light.svg', 'utf8')
const dark = cleanMark(darkRaw)
// Light variant kept pastel fills (1.3-2:1 on frost — contrast failure, flagged by
// adversarial critique). Remap to the readable end of the sky family, crest darkest.
const light = cleanMark(lightRaw)
  .replace('fill="#7DD3FC"', 'fill="#0284C7"')
  .replace('fill="#BAE6FD"', 'fill="#0369A1"')
  .replace('fill="#38BDF8"', 'fill="#075985"')
  .replaceAll('stroke="#38BDF8"', 'stroke="#0369A1"')
fs.writeFileSync(`${OUT}/mediawave-swell-mark-dark.svg`, dark)
fs.writeFileSync(`${OUT}/mediawave-swell-mark-light.svg`, light)

// ---- horizontal lockup around the swell mark ---------------------------------
const inner = (svg) =>
  svg
    .replace(/^[\s\S]*?<\/defs>/, (m) => m) // keep as-is; we extract below
const extract = (svg) => {
  const defs = (svg.match(/<defs>([\s\S]*?)<\/defs>/) || [])[1] || ''
  const body = svg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/<title[\s\S]*?<\/title>\s*/, '')
    .replace(/<desc[\s\S]*?<\/desc>\s*/, '')
    .replace(/<defs>[\s\S]*?<\/defs>\s*/, '')
  return { defs, body }
}

function lockup(markSvg, { dark = true } = {}) {
  const { defs, body } = extract(markSvg)
  const cap = wm.wordmark.capHeight
  const textW = wm.wordmark.full.adv
  const markScale = 1.5
  const wmX = 178
  const blockMid = (-cap + 40) / 2
  // swell mark local content spans roughly x 8..110, y 7..106 -> center it on text block
  const markTy = blockMid - 57 * markScale
  const markTx = -8 * markScale

  const tagS = (textW * 0.88) / wm.tagline.adv
  const tagW = wm.tagline.adv * tagS
  const tagX = wmX + (textW - tagW) / 2
  const tagBase = 40
  const tagCap = 70.3 * tagS
  const lineY = tagBase - tagCap / 2

  const mediaFill = dark ? '#F8FAFC' : '#2A2A2A'
  const waveFill = dark ? '#7DD3FC' : '#0369A1'
  const tagFill = dark ? '#F8FAFC' : '#4A4A4A'
  const tagOp = dark ? 0.62 : 0.78

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -106 ${Math.round(wmX + textW + 26)} 168" role="img" aria-labelledby="mws2-t mws2-d">
  <title id="mws2-t">MediaWave — Web Development</title>
  <desc id="mws2-d">Breaking-wave ribbons beside the MediaWave wordmark</desc>
  <defs>${defs}</defs>
  <g transform="translate(${markTx} ${markTy}) scale(${markScale})">
${body}
  </g>
  <path fill="${mediaFill}" transform="translate(${wmX} 0)" d="${wm.wordmark.media.d}"/>
  <path fill="${waveFill}" transform="translate(${wmX + wm.wordmark.waveOffsetX} 0)" d="${wm.wordmark.wave.d}"/>
  <path fill="${tagFill}" fill-opacity="${tagOp}" transform="translate(${Math.round(tagX * 100) / 100} ${tagBase}) scale(${Math.round(tagS * 10000) / 10000})" d="${wm.tagline.d}"/>
  <line x1="${wmX}" y1="${lineY}" x2="${Math.round((tagX - 16) * 100) / 100}" y2="${lineY}" stroke="${tagFill}" stroke-opacity="${tagOp * 0.55}" stroke-width="1.6"/>
  <line x1="${Math.round((tagX + tagW + 16) * 100) / 100}" y1="${lineY}" x2="${Math.round((wmX + textW) * 100) / 100}" y2="${lineY}" stroke="${tagFill}" stroke-opacity="${tagOp * 0.55}" stroke-width="1.6"/>
</svg>`
}

fs.writeFileSync(`${OUT}/mediawave-swell-horizontal-dark.svg`, lockup(dark, { dark: true }))
fs.writeFileSync(`${OUT}/mediawave-swell-horizontal-light.svg`, lockup(light, { dark: false }))
console.log('swell files written')
