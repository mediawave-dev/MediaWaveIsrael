// The Horizon logo in motion (DECISIONS #53). Everything comes from the mark itself: the
// drop on the i is the colour of the Wave, and the mark is a horizon, a liquid level in a disc.
//
//   1. A drop falls from above into the empty disc.            (the drop path, transform)
//   2. The disc opens out of the impact, its two halves parted, and closes to the gap.
//   3. The horizon sloshes and settles like liquid finding its level. Because the mark is a
//      circle, tilting the horizon is a rotation of the whole mark: exact at rest, compositor
//      friendly, and the outline never moves.
//   4. "Media", then "Wave", rise from their baseline.         (behind the Logo's clip)
//   5. One droplet leaps out of the wave on a true ballistic arc (a quadratic curve walked at
//      constant speed = constant gravity), its tail trailing, and lands on the i as its dot
//      with a small squash. The drop that made the wave becomes the dot.
//
// After the ident the mark stays alive: scroll speed (and, on a mouse, the pointer) tilts the
// horizon on a damped spring, so it sloshes and settles back to the exact logo.
// Only transform and opacity are written; at rest every part is back at the design.

import gsap from 'gsap'
import type { MotionEngine } from '../../motion/motion-engine.js'

const sel = <T extends Element>(svg: SVGSVGElement, s: string) => svg.querySelector<T>(s)

/** Translation of an element's parent <g transform="translate(..)">, to bring the mark into its space. */
function parentShift(el: SVGGraphicsElement | null): [number, number] {
  const m = (el?.parentNode as SVGGraphicsElement | null)?.transform?.baseVal?.consolidate()?.matrix
  return m ? [m.e, m.f] : [0, 0]
}

/** The ident as a paused timeline (about 1.8 s); play it, or let a ScrollTrigger scrub it. */
export function buildIdent(svg: SVGSVGElement): gsap.core.Timeline {
  const mark = sel<SVGGElement>(svg, '[data-part="mark"]')!
  const half = [sel<SVGPathElement>(svg, '[data-part="mark-a"]')!, sel<SVGPathElement>(svg, '[data-part="mark-b"]')!]
  const drop = sel<SVGPathElement>(svg, '[data-part="drop"]')
  const rise = [sel<SVGGElement>(svg, '[data-rise="media"]'), sel<SVGGElement>(svg, '[data-rise="wave"]')].filter(Boolean) as SVGGElement[]
  const quiet = [sel(svg, '[data-part="tag"]'), sel(svg, '[data-part="rules"]')].filter(Boolean)

  // geometry, read once, in SVG user units
  const mb = mark.getBBox()
  const r = mb.width / 2
  const cx = mb.x + r
  const cy = mb.y + mb.height / 2
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })

  // 1. the falling drop (only when the variant has a name; the mark alone gets a drop of its own size)
  let dropRest = { x: 0, y: 0, h: 0 }
  let toLocal = (x: number, y: number) => ({ x, y })
  if (drop) {
    const db = drop.getBBox()
    const [gx, gy] = parentShift(drop)
    dropRest = { x: db.x + db.width / 2, y: db.y + db.height / 2, h: db.height }
    toLocal = (x, y) => ({ x: x - gx - dropRest.x, y: y - gy - dropRest.y })
    const from = toLocal(cx, cy - r * 2.6)
    const hit = toLocal(cx, cy - r * 0.15)
    // one origin for every drop tween (its base, where it sits on the i): changing the origin
    // mid-flight makes GSAP shift the translation to compensate, and the dot would land off
    tl.fromTo(drop, { x: from.x, y: from.y, scaleX: 1.35, scaleY: 1.9, rotation: 0, opacity: 0, transformOrigin: '50% 100%' },
      { opacity: 1, duration: 0.08 }, 0)
      .to(drop, { y: hit.y, duration: 0.4, ease: 'power2.in' }, 0)
      .to(drop, { opacity: 0, scaleX: 0.4, scaleY: 0.4, duration: 0.05 }, 0.4)
  }

  // 2. the disc opens out of the impact, halves parted along the wave's normal, then closing
  tl.fromTo(mark, { scale: 0.06, rotation: -26, transformOrigin: '50% 50%' },
    { scale: 1, duration: 0.62, ease: 'expo.out' }, 0.38)
    .fromTo(mark, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.38)
    .fromTo(half[0], { y: -r * 0.16 }, { y: 0, duration: 0.75, ease: 'power3.out' }, 0.4)
    .fromTo(half[1], { y: r * 0.16 }, { y: 0, duration: 0.75, ease: 'power3.out' }, 0.4)

  // 3. the horizon sloshes and finds its level (a damped swing, each half-period a bit longer)
  const swing = [15, -8, 4, -1.6, 0]
  let at = 0.42
  swing.forEach((deg, i) => {
    const d = 0.17 + i * 0.035
    tl.to(mark, { rotation: deg, duration: d, ease: 'sine.inOut' }, at)
    at += d
  })

  // 4. the name rises from its baseline: Media, then Wave
  rise.forEach((g, i) => {
    tl.fromTo(g, { y: 82 }, { y: 0, duration: 0.55, ease: 'power3.out' }, 0.62 + i * 0.09)
  })
  if (quiet.length) tl.fromTo(quiet, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' }, 1.05)

  // 5. the droplet leaps out of the wave and lands on the i
  if (drop) {
    const p0 = toLocal(cx + r * 0.96, cy - r * 0.12) // the wave's right crest, where it meets the rim
    const p2 = { x: 0, y: 0 }
    const p1 = { x: (p0.x + p2.x) / 2, y: Math.min(p0.y, p2.y) - Math.max(r * 1.1, dropRest.h * 3) }
    // the arc as keyframes, not a per-frame callback: a seek or a scroll scrub renders it too
    const STEPS = 16
    const frames = Array.from({ length: STEPS }, (_, k) => {
      const t = (k + 1) / STEPS
      const u = 1 - t
      const x = u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x
      const y = u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y
      const vx = 2 * u * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
      const vy = 2 * u * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
      // a drop flies round end first, its tail trailing: the tip points against the motion
      const rotation = (Math.atan2(vy, vx) * 180) / Math.PI - 90
      const s = 0.5 + 0.5 * t
      return { x, y, rotation, scaleX: s, scaleY: s, duration: 0.44 / STEPS, ease: 'none' }
    })
    const rot0 = (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI - 90 // the take-off heading
    tl.set(drop, { x: p0.x, y: p0.y, scaleX: 0.5, scaleY: 0.5, rotation: rot0, opacity: 0 }, 1.17)
      .to(drop, { opacity: 1, duration: 0.05 }, 1.17)
      .to(drop, { keyframes: frames }, 1.17)
      // the landing: a short squash on the stem of the i, then the exact dot
      .to(drop, { scaleX: 1.2, scaleY: 0.78, rotation: 0, x: 0, y: 0, duration: 0.07, ease: 'power2.out' }, 1.61)
      .to(drop, { scaleX: 1, scaleY: 1, duration: 0.2, ease: 'power2.out' }, 1.68)
  }
  // the last frame is the design, exactly: every transform the ident wrote is removed
  tl.set([drop, mark, ...half, ...rise].filter(Boolean), { clearProps: 'transform,opacity' }, '>')
  return tl
}

/** The living horizon: scroll speed and the pointer tilt it on a damped spring. Returns a cleanup. */
export function liveHorizon(svg: SVGSVGElement, engine: MotionEngine, opts: { hover?: Element | null; ready?: () => boolean } = {}) {
  const mark = sel<SVGGElement>(svg, '[data-part="mark"]')
  if (!mark) return () => {}
  gsap.set(mark, { transformOrigin: '50% 50%' })
  const setRot = gsap.quickSetter(mark, 'rotation', 'deg') as (v: number) => void
  let rot = 0
  let vel = 0
  let pointer = 0
  let resting = true
  const stopped = () => document.documentElement.classList.contains('disable-animations')
  const tick = () => {
    if (opts.ready && !opts.ready()) { rot = 0; vel = 0; resting = true; return } // the ident owns the mark
    const v = engine.getVelocity() // CALM: always 0, no velocity effects
    const target = stopped() ? 0 : Math.max(-14, Math.min(14, -v / 160)) + pointer
    vel = (vel + (target - rot) * 0.085) * 0.86
    rot += vel
    if (Math.abs(rot) < 0.02 && Math.abs(vel) < 0.02 && target === 0) {
      if (!resting) { rot = 0; vel = 0; setRot(0); resting = true }
      return
    }
    resting = false
    setRot(rot)
  }
  gsap.ticker.add(tick)
  const host = opts.hover
  const onMove = (e: Event) => {
    const pe = e as PointerEvent
    if (pe.pointerType !== 'mouse' || !host) return
    const b = host.getBoundingClientRect()
    pointer = ((pe.clientX - b.left) / b.width - 0.5) * 18
  }
  const onLeave = () => { pointer = 0 }
  if (host && engine.FINE) {
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
  }
  return () => {
    gsap.ticker.remove(tick)
    host?.removeEventListener('pointermove', onMove)
    host?.removeEventListener('pointerleave', onLeave)
  }
}
