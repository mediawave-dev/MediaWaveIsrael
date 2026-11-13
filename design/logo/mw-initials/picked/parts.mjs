// The MW logo Nati picked on 13.11.2026 (drawn by another agent, pasted by him), joined with the site's own icon:
// the Horizon disc. The M and W outlines are his, untouched. What changes: the colours come from the site, the tagline
// is outlined from mediawave-font1 (no live text), and the disc takes the place of the accent on the rule, so the rule
// becomes the disc's own horizon line.
import fs from 'fs'
const ROOT = 'G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/statement-20261112/'
const ts = fs.readFileSync(ROOT + 'src/components/ui/logo-paths.ts', 'utf8')
const ART = Function('return ' + ts.slice(ts.indexOf('= {') + 2).replace(/;?\s*$/, ''))()
const markPart = (p) => ART.mark.parts.find((x) => x.part === p).d
const TAG = JSON.parse(fs.readFileSync(new URL('./tag.json', import.meta.url)))

export const M = 'M88 305L124 155L160 155L196 245L232 155L268 155L232 305L198 305L220 212L186 292L166 292L144 212L122 305Z'
export const W = 'M232 155L268 155L290 248L324 168L344 168L366 248L388 155L422 155L386 305L350 305L314 215L278 305L242 305Z'
export const BL = '68,185 32,230 68,275', BR = '432,185 468,230 432,275'

export const THEMES = {
  // the site: ink and turquoise on mint or white
  light: { m: ['#2A4A42', '#13241F'], w: ['#27C2AE', '#0F8478'], bl: '#13241F', blo: 0.38, br: '#14A390', bro: 0.7, rule: '#13241F', ruleo: 0.26, tag: '#3F4D48', da: '#13241F', db: '#14A390' },
  dark: { m: ['#FFFFFF', '#CDEDE7'], w: ['#4DE3D0', '#19A996'], bl: '#CDEDE7', blo: 0.5, br: '#2CC5B3', bro: 0.75, rule: '#FFFFFF', ruleo: 0.26, tag: '#A9C4BE', da: '#FFFFFF', db: '#2CC5B3' },
  // the colours of the file he pasted
  source: { m: ['#6B9E9E', '#3B6E6E'], w: ['#99BCBC', '#06B6D4'], bl: '#6B9E9E', blo: 0.55, br: '#06B6D4', bro: 0.55, rule: '#6B9E9E', ruleo: 0.45, tag: '#6B9E9E', da: '#3B6E6E', db: '#06B6D4' },
  ink: { mono: true, m: ['#13241F', '#13241F'], w: ['#13241F', '#13241F'], bl: '#13241F', blo: 0.45, br: '#13241F', bro: 0.45, rule: '#13241F', ruleo: 0.3, tag: '#13241F', da: '#13241F', db: '#13241F' },
}
let uid = 0
const grad = (id, [c0, c1]) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient>`
/** the disc, centred at cx,cy with diameter d */
export const disc = (t, cx, cy, d) => `<g transform="translate(${cx - d / 2} ${cy - d / 2}) scale(${d / 100})"><path fill="${t.da}" d="${markPart('mark-a')}"/><path fill="${t.db}" d="${markPart('mark-b')}"/></g>`
export const letters = (t) => { const u = 'g' + (++uid)
  if (t.mono) return `<defs><mask id="${u}k" maskUnits="userSpaceOnUse" x="60" y="130" width="400" height="200"><rect x="60" y="130" width="400" height="200" fill="#fff"/><path d="${W}" fill="#000" stroke="#000" stroke-width="9" stroke-linejoin="miter"/></mask></defs><path fill="${t.m[0]}" mask="url(#${u}k)" d="${M}"/><path fill="${t.w[0]}" d="${W}"/>`
  return `<defs>${grad(u + 'm', t.m)}${grad(u + 'w', t.w)}</defs><path fill="url(#${u}m)" d="${M}"/><path fill="url(#${u}w)" d="${W}"/>` }
export const brackets = (t, dxL = 0, dxR = 0) => `<g fill="none" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><polyline transform="translate(${dxL} 0)" points="${BL}" stroke="${t.bl}" opacity="${t.blo}"/><polyline transform="translate(${dxR} 0)" points="${BR}" stroke="${t.br}" opacity="${t.bro}"/></g>`
/** the tagline, outlined, set to a width and centred on x */
export const tag = (t, cx, top, width) => { const k = width / (TAG.bbox.x2 - TAG.bbox.x1); return `<path fill="${t.tag}" transform="translate(${cx - width / 2 - TAG.bbox.x1 * k} ${top - TAG.bbox.y1 * k}) scale(${k})" d="${TAG.d}"/>` }

/** 1. the emblem: brackets and MW, the horizon rule with the disc on it, the tagline */
export const emblem = (t, { withTag = true } = {}) => { const cy = 346, d = 44, g = 9
  const body = brackets(t) + letters(t) +
    `<g fill="${t.rule}" opacity="${t.ruleo}"><rect x="105" y="${cy - 1.5}" width="${250 - d / 2 - g - 105}" height="3" rx="1.5"/><rect x="${250 + d / 2 + g}" y="${cy - 1.5}" width="${395 - (250 + d / 2 + g)}" height="3" rx="1.5"/></g>` +
    disc(t, 250, cy, d) + (withTag ? tag(t, 250, 392, 300) : '')
  return { vb: `14 137 472 ${withTag ? 285 : 245}`, w: 472, h: withTag ? 285 : 245, body } }

/** 2. the header lockup: the disc, then MW; brackets optional */
export const lockup = (t, { br = false, d = 132 } = {}) => { const gap = 30, cx = 88 - gap - d / 2, dxL = cx - d / 2 - 22 - 68, x0 = br ? 32 + dxL - 6 : cx - d / 2
  const body = disc(t, cx, 230, d) + letters(t) + (br ? brackets(t, dxL, 0) : '')
  const x1 = br ? 478 : 422
  return { vb: `${x0 - 4} 149 ${x1 - x0 + 8} 162`, w: x1 - x0 + 8, h: 162, body } }

/** the letters alone, and the disc alone */
export const mono = (t) => ({ vb: '84 151 342 158', w: 342, h: 158, body: letters(t) })
export const icon = (t) => ({ vb: '0 0 100 100', w: 100, h: 100, body: disc(t, 50, 50, 100) })
export const svg = (o, height, attrs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.vb}" height="${(+height).toFixed(1)}" width="${(height * o.w / o.h).toFixed(1)}" ${attrs}>${o.body}</svg>`
