// sun · the logo, second drawing (D265). The Horizon logo (the disc, the name, the drop on the i, "Web Development")
// redrawn in the style of the MW logo Nati picked: heavy capitals leaning forward, one soft diagonal light across each
// half of the name. The path data is in brand-art.ts (generated, never edited by hand).
// It keeps the first logo's structure, so the rules that already style it still apply: the disc's two halves sit in
// <g data-part="mark"> (the slow colour walk of D262), the name in <g data-part="name">, the drop beside it (the
// pinned corner fades both away when it folds down to the disc).
// Colour comes from CSS variables: --logo-a0 to --logo-a (Media), --logo-b0 to --logo-b (Wave), --logo-tag.
import { useId, type CSSProperties } from 'react'
import { BRAND } from './brand-art'

type Props = { /** with the tagline under the name */ tag?: boolean; title?: string; decorative?: boolean; className?: string }

export default function Brand({ tag = false, title = 'MediaWave', decorative = false, className = '' }: Props) {
  const id = useId().replace(/:/g, '')
  const [x, y, w, h] = tag ? BRAND.full : BRAND.compact
  const grad = (k: 'a' | 'b', [x1, y1, x2, y2]: readonly number[]) => (
    <linearGradient id={`${id}${k}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
      <stop offset="0" style={{ stopColor: `var(--logo-${k}0, var(--logo-${k}, currentColor))` }} />
      <stop offset="1" style={{ stopColor: `var(--logo-${k}, currentColor)` }} />
    </linearGradient>
  )
  const cap = (k: 'a' | 'b'): CSSProperties => ({ fill: `url(#${id}${k})` })
  // the lowercase is a hair lighter than the capitals in the typeface; a thin outline in the same light evens them
  const low = (k: 'a' | 'b'): CSSProperties => ({ fill: `url(#${id}${k})`, stroke: `url(#${id}${k})`, strokeWidth: BRAND.weight, strokeLinejoin: 'miter', strokeMiterlimit: 3 })
  return (
    <svg className={`mw-logo mw-logo--v2 ${className}`.trim()} viewBox={`${x} ${y} ${w} ${h}`} style={{ aspectRatio: `${w} / ${h}`, overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg" {...(decorative ? { 'aria-hidden': true, focusable: false } : { role: 'img', 'aria-label': title })}>
      <defs>{grad('a', BRAND.grad.media)}{grad('b', BRAND.grad.wave)}</defs>
      <g data-part="mark">
        <path d={BRAND.markA.d} transform={BRAND.markA.transform} style={{ fill: 'var(--logo-a, currentColor)' }} />
        <path d={BRAND.markB.d} transform={BRAND.markB.transform} style={{ fill: 'var(--logo-b, currentColor)' }} />
      </g>
      <g data-part="name">
        <path d={BRAND.capM} style={cap('a')} /><path d={BRAND.lowM} style={low('a')} />
        <path d={BRAND.capW} style={cap('b')} /><path d={BRAND.lowW} style={low('b')} />
      </g>
      <path data-part="drop" d={BRAND.drop.d} transform={BRAND.drop.transform} style={{ fill: 'var(--mark-b, var(--logo-b, currentColor))' }} />
      {tag && <>
        <path data-part="tag" d={BRAND.tag.d} transform={BRAND.tag.transform} style={{ fill: 'var(--logo-tag, currentColor)' }} />
        <path data-part="rules" d={BRAND.rules} style={{ fill: 'none', stroke: 'var(--logo-tag, currentColor)', strokeWidth: 3.4, strokeOpacity: 0.4, strokeLinecap: 'round' }} />
      </>}
    </svg>
  )
}
