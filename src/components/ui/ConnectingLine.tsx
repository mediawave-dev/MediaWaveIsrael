import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type ScrollOffsetValue = 'start' | 'end' | 'center' | `${number}` | `${number}px` | `${number}%`
type ScrollOffsetPair = `${ScrollOffsetValue} ${ScrollOffsetValue}`

interface ConnectingLineProps {
  /** The SVG path data for the curve */
  path: string
  /** Color of the line - accepts CSS color or variable */
  color?: string
  /** Stroke width */
  strokeWidth?: number
  /** Whether to use dashed line */
  dashed?: boolean
  /** Dash array pattern */
  dashArray?: string
  /** Opacity of the line */
  opacity?: number
  /** Height of the SVG container */
  height?: number
  /** ViewBox for the SVG */
  viewBox?: string
  /** Scroll trigger offset [start, end] */
  scrollOffset?: [ScrollOffsetPair, ScrollOffsetPair]
  /** Additional className */
  className?: string
  /** Whether line is visible */
  visible?: boolean
}

/**
 * ConnectingLine - A reusable curved SVG path that draws on scroll
 * Inspired by microsoft.ai/about curved lines between sections
 */
export default function ConnectingLine({
  path,
  color = 'var(--color-orange)',
  strokeWidth = 2,
  dashed = true,
  dashArray = '8 12',
  opacity = 0.3,
  height = 120,
  viewBox = '0 0 1440 120',
  scrollOffset = ['start end', 'end start'],
  className = '',
  visible = true,
}: ConnectingLineProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: scrollOffset,
  })

  // Draw line as user scrolls
  const pathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      className={`absolute left-0 right-0 pointer-events-none overflow-visible ${className}`}
      style={{ height }}
    >
      <svg
        className="w-full h-full overflow-visible"
        viewBox={viewBox}
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Main animated path */}
        <motion.path
          d={path}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dashed ? dashArray : undefined}
          style={{
            pathLength,
            opacity,
          }}
          fill="none"
        />

        {/* Optional second "shadow" path for depth */}
        <motion.path
          d={path}
          stroke={color}
          strokeWidth={strokeWidth + 2}
          strokeLinecap="round"
          strokeDasharray={dashed ? dashArray : undefined}
          style={{
            pathLength,
            opacity: opacity * 0.3,
            filter: 'blur(4px)',
          }}
          fill="none"
        />
      </svg>
    </div>
  )
}

// Pre-defined curve paths for different section transitions
export const curvePaths = {
  // Hero → Services: Swooping curve from right
  heroToServices: 'M1440,20 Q1080,100 720,60 Q360,20 0,80',

  // Services → About: Flowing S-curve
  servicesToAbout: 'M0,30 C240,80 480,10 720,50 S960,90 1200,40 S1440,70 1440,50',

  // About → Portfolio: Gentle arc
  aboutToPortfolio: 'M0,60 Q360,10 720,40 T1440,30',

  // Portfolio → Contact: Wave pattern
  portfolioToContact: 'M0,40 C360,80 540,20 720,50 S1080,70 1440,40',

  // Generic gentle wave
  gentleWave: 'M0,50 Q360,80 720,50 T1440,50',

  // Dramatic swoop
  dramaticSwoop: 'M0,100 C200,20 400,80 600,40 S1000,60 1200,30 S1400,50 1440,20',
}

// Preset configurations for different vibes
export const linePresets = {
  subtle: {
    strokeWidth: 1.5,
    opacity: 0.2,
    dashed: true,
    dashArray: '6 10',
  },
  medium: {
    strokeWidth: 2,
    opacity: 0.3,
    dashed: true,
    dashArray: '8 12',
  },
  bold: {
    strokeWidth: 3,
    opacity: 0.4,
    dashed: true,
    dashArray: '10 8',
  },
  solid: {
    strokeWidth: 2,
    opacity: 0.25,
    dashed: false,
  },
}

// Floating decorative blob component
export function FloatingBlob({
  color = 'var(--color-orange)',
  size = 200,
  blur = 60,
  opacity = 0.08,
  top,
  left,
  right,
  bottom,
  className = '',
}: {
  color?: string
  size?: number
  blur?: number
  opacity?: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  className?: string
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${blur}px)`,
        opacity,
        top,
        left,
        right,
        bottom,
      }}
      animate={{
        scale: [1, 1.1, 1],
        x: [0, 10, 0],
        y: [0, -15, 0],
      }}
      transition={{
        duration: 10 + Math.random() * 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// Small floating dot decoration
export function FloatingDot({
  color = 'var(--color-orange)',
  size = 6,
  top,
  left,
  right,
  bottom,
  delay = 0,
  className = '',
}: {
  color?: string
  size?: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        top,
        left,
        right,
        bottom,
      }}
      animate={{
        y: [0, -12, 0],
        scale: [1, 1.3, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

// Grain texture overlay component
export function GrainOverlay({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}
