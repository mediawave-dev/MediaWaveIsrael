import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * Marquee — infinite technology strip between Hero and WhyUs
 * (DESIGN-UPGRADE §4.2). Pure CSS transform loop:
 * - track duplicated once (second copy aria-hidden)
 * - paused on hover and while offscreen
 * - static under prefers-reduced-motion (CSS)
 */

const TECH = [
  'React',
  'TypeScript',
  'Vite',
  'Tailwind CSS',
  'Framer Motion',
  'Cloudflare Pages',
  'Node.js',
  'Core Web Vitals',
]

function TrackGroup({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="marquee-group" aria-hidden={ariaHidden || undefined}>
      {TECH.map((name) => (
        <span key={name} className="marquee-item font-mono-spec">
          <span className="marquee-dot" aria-hidden="true">
            ≈
          </span>
          {name}
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { margin: '100px' })

  return (
    <section
      ref={ref}
      aria-label="הטכנולוגיות שאנחנו עובדים איתן"
      className="marquee-strip"
      data-paused={!inView || undefined}
    >
      <div className="marquee" dir="ltr">
        <div className="marquee-track">
          <TrackGroup />
          <TrackGroup ariaHidden />
        </div>
      </div>
    </section>
  )
}
