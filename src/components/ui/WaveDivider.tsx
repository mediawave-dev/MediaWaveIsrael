import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * WaveDivider — the signature organic section separator (DESIGN-UPGRADE §4.6).
 * Asymmetric, logo-inspired wave paths (NOT generic getwaves arcs).
 *
 * The path fills the BOTTOM of the box with `fill` (= the NEXT section's
 * color) and leaves the top transparent. Use `flip` to mirror vertically
 * when the divider sits at the TOP of a section instead.
 *
 * `drift` adds a second, slower wave layer translating ±18px — the loop is
 * paused offscreen (useInView) and disabled under prefers-reduced-motion.
 */

type WaveVariant = 'a' | 'b' | 'c'

// Wavy top edge, solid bottom. viewBox 0 0 1440 100, drawn to y=101 to
// avoid subpixel seams when stretched with preserveAspectRatio="none".
const PATHS: Record<WaveVariant, string> = {
  // asymmetric single crest, rising toward the right (RTL reading start)
  a: 'M0,56 C180,88 340,20 560,44 C780,68 1000,14 1180,42 C1290,58 1380,40 1440,52 L1440,101 L0,101 Z',
  // double crest with a deep drop — the most "logo-like" silhouette
  b: 'M0,36 C140,72 320,84 520,58 C700,34 820,10 1020,30 C1200,48 1320,76 1440,40 L1440,101 L0,101 Z',
  // one long gentle swell
  c: 'M0,70 C260,28 520,88 800,52 C1040,22 1260,66 1440,44 L1440,101 L0,101 Z',
}

// Drift layers extend past the viewBox so the ±18px loop never shows a gap
const DRIFT_PATHS: Record<WaveVariant, string> = {
  a: 'M-40,48 C200,16 420,76 660,50 C900,26 1120,72 1300,44 C1380,32 1440,52 1480,44 L1480,101 L-40,101 Z',
  b: 'M-40,60 C160,28 360,16 580,42 C800,66 960,80 1140,54 C1300,32 1400,44 1480,60 L1480,101 L-40,101 Z',
  c: 'M-40,40 C240,80 540,24 840,60 C1100,88 1300,36 1480,64 L1480,101 L-40,101 Z',
}

interface WaveDividerProps {
  /** Which wave silhouette to draw */
  variant?: WaveVariant
  /** Fill color = the color of the section the wave "hands over" to */
  fill: string
  /** Mirror vertically (wave sits at the top of a section) */
  flip?: boolean
  /** Second wave layer with a slow horizontal drift */
  drift?: boolean
  /** Solid background behind the transparent part (for in-flow dividers) */
  bg?: string
  /** Positioning classes, e.g. "absolute bottom-0 inset-x-0 z-[2]" */
  className?: string
  height?: string
}

export function WaveDivider({
  variant = 'a',
  fill,
  flip = false,
  drift = false,
  bg,
  className = '',
  height = 'clamp(28px, 6vw, 96px)',
}: WaveDividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '100px' })
  const prefersReducedMotion = useReducedMotion()
  const driftRunning = drift && inView && !prefersReducedMotion

  return (
    <div
      ref={ref}
      className={`wave-divider ${className}`}
      style={{ height, background: bg }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        focusable="false"
        style={{ display: 'block', transform: flip ? 'scaleY(-1)' : undefined }}
      >
        {drift && (
          <path
            d={DRIFT_PATHS[variant]}
            fill={fill}
            opacity={0.4}
            className={driftRunning ? 'wave-drift wave-drift-running' : 'wave-drift'}
          />
        )}
        <path d={PATHS[variant]} fill={fill} />
      </svg>
    </div>
  )
}

export default WaveDivider
