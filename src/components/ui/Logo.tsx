import { useId, type CSSProperties } from 'react'
import { LOGO_ART, type LogoPart } from './logo-paths'

/**
 * MediaWave "Horizon" logo (DECISIONS #52): a disc split by a wave into two tones, the
 * wordmark with a drop on the i. Inline SVG; the path data is copied verbatim from
 * logos/horizon by scripts/build-logo-paths.mjs (never redrawn, never set as text).
 *
 * Colour comes only from CSS variables, so the logo inherits each look's palette:
 *   --logo-a    Media and the upper half of the mark
 *   --logo-b    Wave, the drop on the i and the lower half
 *   --logo-tag  the tagline and its rules
 * Klein palette (#58): on dark #FFFFFF / #6E8CFF / #8E9CC8 · on light #0E1016 / #002FA7 /
 * #4E5468 (src/look/looks.css, scripts/brand-palette.mjs).
 *
 * Brand rules: never change the geometry or the space between the mark and the name, never
 * swap the two tones, no shadow, frame or gradient. Keep clear space of half the disc's
 * diameter on every side. Minimum widths: horizontal 160 px, compact 90 px; the mark goes
 * down to 16 px only as the favicon. Size it by height (CSS); the width follows the viewBox.
 *
 * Structure (identical output at rest): the disc's halves sit in <g data-part="mark">, the
 * name in <g data-part="name">, the drop, tagline and rules beside it. With `motion`, the
 * name also gets a clip at its baseline so the ident (logo-motion.ts) can raise it.
 */

export type LogoVariant = keyof typeof LOGO_ART

const PAINT: Record<LogoPart['role'], CSSProperties> = {
  a: { fill: 'var(--logo-a, currentColor)' },
  b: { fill: 'var(--logo-b, currentColor)' },
  t: { fill: 'var(--logo-tag, currentColor)' },
  l: { fill: 'none', stroke: 'var(--logo-tag, currentColor)', strokeWidth: 1.6, strokeOpacity: 0.55 },
}

export interface LogoProps {
  variant?: LogoVariant
  className?: string
  /** Accessible name. Pass decorative when a parent link already names it. */
  title?: string
  decorative?: boolean
  style?: CSSProperties
  /** Add the baseline clip the ident needs (AnimatedLogo passes it). */
  motion?: boolean
}

export default function Logo({ variant = 'compact', className = '', title = 'MediaWave', decorative = false, style, motion = false }: LogoProps) {
  const uid = useId().replace(/:/g, '')
  const art = LOGO_ART[variant]
  const [, , w, h] = art.viewBox.split(' ').map(Number)
  const by = (name: LogoPart['part']) => art.parts.find((p) => p.part === name)
  const path = (p?: LogoPart) =>
    p && <path data-part={p.part} d={p.d} transform={p.transform} style={PAINT[p.role]} />
  const media = by('media')
  const group = media?.group
  const clipId = `mwlg-${uid}`
  return (
    <svg
      className={`mw-logo mw-logo--${variant} ${className}`.trim()}
      viewBox={art.viewBox}
      style={{ aspectRatio: `${w} / ${h}`, overflow: 'visible', ...style }}
      xmlns="http://www.w3.org/2000/svg"
      {...(decorative ? { 'aria-hidden': true, focusable: false } : { role: 'img', 'aria-label': title })}
    >
      {motion && media && (
        <defs>
          {/* everything above the baseline (y 1.5), wider than the name: invisible at rest */}
          <clipPath id={clipId}><rect x="-40" y="-240" width="760" height="241.5" /></clipPath>
        </defs>
      )}
      <g data-part="mark">
        {path(by('mark-a'))}
        {path(by('mark-b'))}
      </g>
      {media && (
        <g transform={group}>
          <g data-part="name" clipPath={motion ? `url(#${clipId})` : undefined}>
            <g data-rise="media">{path(media)}</g>
            <g data-rise="wave">{path(by('wave'))}</g>
          </g>
          {path(by('drop'))}
          {path(by('tag'))}
          {path(by('rules'))}
        </g>
      )}
    </svg>
  )
}

/** The mark alone (the disc). */
export function LogoMark(props: Omit<LogoProps, 'variant'>) {
  return <Logo {...props} variant="mark" />
}
