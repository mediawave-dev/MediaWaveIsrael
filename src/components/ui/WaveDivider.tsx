import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * WaveDivider — living, animated section separators (the brand signature).
 *
 * Every divider is real moving water: 2-3 stacked wave layers sliding
 * horizontally at different speeds and opposite directions. The wave tiles
 * are PERIODIC (the end slope mirrors the start slope), so translating a
 * doubled path by exactly one period loops seamlessly — pure transform,
 * compositor-only.
 *
 * Layers pause offscreen (useInView) and freeze under prefers-reduced-motion
 * (CSS), where the stacked layers still read as a static organic wave.
 */

type WaveVariant = 'a' | 'b' | 'c'

const PERIOD = 1440

interface WaveTile {
  y0: number
  // cubic segments: [c1x, c1y, c2x, c2y, x, y]
  segs: number[][]
}

// Each tile wraps smoothly: the last control point mirrors the first
// departure vector, so slope(0) === slope(1440) and the loop has no seam.
const TILES: Record<WaveVariant, WaveTile> = {
  a: {
    y0: 55,
    segs: [
      [120, 35, 240, 28, 380, 34],
      [520, 40, 600, 74, 740, 72],
      [880, 70, 960, 44, 1100, 44],
      [1240, 44, 1320, 75, 1440, 55],
    ],
  },
  b: {
    y0: 45,
    segs: [
      [100, 65, 200, 78, 330, 70],
      [470, 61, 540, 25, 690, 22],
      [840, 19, 900, 55, 1030, 60],
      [1170, 65, 1340, 25, 1440, 45],
    ],
  },
  c: {
    y0: 60,
    segs: [
      [180, 30, 320, 24, 520, 40],
      [720, 56, 860, 80, 1060, 68],
      [1200, 60, 1260, 90, 1440, 60],
    ],
  },
}

/** Two periods of the tile, closed to the bottom (y=101 avoids seams) */
function buildWavePath(tile: WaveTile, periods = 2): string {
  let d = `M0,${tile.y0}`
  for (let p = 0; p < periods; p++) {
    const off = p * PERIOD
    for (const [c1x, c1y, c2x, c2y, x, y] of tile.segs) {
      d += ` C${c1x + off},${c1y} ${c2x + off},${c2y} ${x + off},${y}`
    }
  }
  d += ` L${periods * PERIOD},101 L0,101 Z`
  return d
}

const PATHS: Record<WaveVariant, string> = {
  a: buildWavePath(TILES.a),
  b: buildWavePath(TILES.b),
  c: buildWavePath(TILES.c),
}

// back layer uses a DIFFERENT silhouette so crests peek organically
const BACK_OF: Record<WaveVariant, WaveVariant> = { a: 'c', b: 'a', c: 'b' }
const MID_OF: Record<WaveVariant, WaveVariant> = { a: 'b', b: 'c', c: 'a' }

interface WaveDividerProps {
  /** Which wave silhouette leads (front layer) */
  variant?: WaveVariant
  /** Fill color = the color of the section the wave "hands over" to */
  fill: string
  /** Mirror vertically (wave sits at the top of a section) */
  flip?: boolean
  /** 3 layers = extra depth for the dramatic boundaries */
  layers?: 2 | 3
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
  layers = 2,
  bg,
  className = '',
  height = 'clamp(32px, 6.5vw, 104px)',
}: WaveDividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '120px' })
  const run = inView ? ' wave-running' : ''

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
        viewBox={`0 0 ${PERIOD} 100`}
        preserveAspectRatio="none"
        focusable="false"
        style={{ display: 'block', transform: flip ? 'scaleY(-1)' : undefined }}
      >
        <path
          d={PATHS[BACK_OF[variant]]}
          fill={fill}
          opacity={0.3}
          className={`wave-layer wave-slide-back${run}`}
        />
        {layers === 3 && (
          <path
            d={PATHS[MID_OF[variant]]}
            fill={fill}
            opacity={0.5}
            className={`wave-layer wave-slide-mid${run}`}
          />
        )}
        <path d={PATHS[variant]} fill={fill} className={`wave-layer wave-slide-front${run}`} />
      </svg>
    </div>
  )
}

export default WaveDivider
