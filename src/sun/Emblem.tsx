// sun · the MW mark of the footer (Nati, 13.11.2026). The short form of the name: the M and W of the logo he picked,
// between code brackets, and under them the site's icon (the Horizon disc) sitting on a rule that reads as its horizon,
// with the line WEB DEVELOPMENT. It lives only in the footer; the header keeps the logo with the full name.
// The disc is the same <g data-part="mark"> as in the logo, so it walks through the same colours (D262).
import { useId } from 'react'
import { LOGO_ART } from '../components/ui/logo-paths'
import { EMBLEM } from './emblem-art'

const half = (p: 'mark-a' | 'mark-b') => LOGO_ART.mark.parts.find((x) => x.part === p)!.d

export default function Emblem({ title = 'MediaWave' }: { title?: string }) {
  const id = useId().replace(/:/g, '')
  const { cx, cy, d } = EMBLEM.disc
  const grad = (k: 'm' | 'w') => (
    <linearGradient id={`${id}${k}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" style={{ stopColor: `var(--mw-${k}0)` }} /><stop offset="1" style={{ stopColor: `var(--mw-${k}1)` }} />
    </linearGradient>
  )
  return (
    <svg className="mw-logo mw-emblem" viewBox={EMBLEM.viewBox} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title}>
      <defs>{grad('m')}{grad('w')}</defs>
      <g fill="none" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={EMBLEM.bracketL} style={{ stroke: 'var(--mw-m1)', opacity: 0.38 }} />
        <polyline points={EMBLEM.bracketR} style={{ stroke: 'var(--mark-b)', opacity: 0.7 }} />
      </g>
      <path d={EMBLEM.M} fill={`url(#${id}m)`} /><path d={EMBLEM.W} fill={`url(#${id}w)`} />
      <path d={EMBLEM.rules} fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: 'var(--mw-m1)', opacity: 0.26 }} />
      <g data-part="mark" transform={`translate(${cx - d / 2} ${cy - d / 2}) scale(${d / 100})`}>
        <path d={half('mark-a')} style={{ fill: 'var(--logo-a, currentColor)' }} /><path d={half('mark-b')} style={{ fill: 'var(--logo-b, currentColor)' }} />
      </g>
      <path d={EMBLEM.tag.d} transform={EMBLEM.tag.transform} style={{ fill: 'var(--logo-tag, currentColor)' }} />
    </svg>
  )
}
