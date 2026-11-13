// sun · the logo in the pinned corner (D266, Nati's pick 1 of 13.11.2026): the disc beside the name MediaWave in its drawn
// letters. The M and W are the MW logo he picked; the small letters are the same leaning blocks with sharp wedge cuts.
// Path data: brand-art.ts (generated). Same structure as the first logo, so the rules that style it still hold: the disc's
// halves in <g data-part="mark"> (the colour walk of D262), the name in <g data-part="name"> and the drop beside it (the
// corner fades both when it folds down to the disc alone).
// Colour from CSS: --logo-a0 to --logo-a light across "Media", --logo-b0 to --logo-b across "Wave", the drop in --mark-b.
import { useId } from 'react'
import { MARK, WORD } from './brand-art'

export default function Brand({ title = 'MediaWave', decorative = false }: { title?: string; decorative?: boolean }) {
  const id = useId().replace(/:/g, '')
  const [x, y, w, h] = WORD.viewBox
  const { cx, cy, d } = WORD.disc
  const grad = (k: 'a' | 'b', [x1, y1, x2, y2]: readonly number[]) => (
    <linearGradient id={`${id}${k}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
      <stop offset="0" style={{ stopColor: `var(--logo-${k}0, var(--logo-${k}))` }} />
      <stop offset="1" style={{ stopColor: `var(--logo-${k})` }} />
    </linearGradient>
  )
  return (
    <svg className="mw-logo mw-logo--word" viewBox={`${x} ${y} ${w} ${h}`} style={{ aspectRatio: `${w} / ${h}`, overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg" {...(decorative ? { 'aria-hidden': true, focusable: false } : { role: 'img', 'aria-label': title })}>
      <defs>{grad('a', WORD.grad.a)}{grad('b', WORD.grad.b)}</defs>
      <g data-part="mark" transform={`translate(${cx - d / 2} ${cy - d / 2}) scale(${d / 100})`}>
        <path d={MARK.a} style={{ fill: 'var(--logo-a)' }} />
        <path d={MARK.b} style={{ fill: 'var(--logo-b)' }} />
      </g>
      <g data-part="name">
        <path d={WORD.M} fill={`url(#${id}a)`} />
        <path d={WORD.edia} fill={`url(#${id}a)`} />
        <g transform={`translate(${WORD.wx} 0)`}>
          <path d={WORD.W} fill={`url(#${id}b)`} />
          <path d={WORD.ave} fill={`url(#${id}b)`} />
        </g>
      </g>
      <path data-part="drop" d={WORD.drop.d} transform={WORD.drop.transform} style={{ fill: 'var(--mark-b, var(--logo-b))' }} />
    </svg>
  )
}
