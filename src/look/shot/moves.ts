// shot · the moves (SPEC 1.7): what the things on the desk do as the visitor scrolls past them.
// Every helper writes only transform or opacity (scaleY on lines), reads layout only on refresh,
// and toggles .is-scrubbing while it scrubs. Full / CALM / REDUCE per helper: CALM keeps the move
// (the visitor's own scroll drives it) with small angles; REDUCE does nothing, the CSS rest pose is
// the last frame. Holds pass a timeline (`tl`) whose length is 1, so positions are progress.
import type { MotionEngine } from '../../motion/motion-engine'
import { DEPTH, landRange, safeB, scrubbing, type Px } from './camera'

type El = HTMLElement

/** An object or card put down on the table. For paper that carries text, `toZ` must be 0 (rule 1). */
export function setDown(t: MotionEngine, el: El, o: { tilt?: number; fromZ?: number; toZ?: number; y?: number; art?: Px } = {}) {
  if (t.REDUCE) return
  const { tilt = 22, fromZ = -4, toZ = 0, y = 20, art = 0 } = o
  const c = t.CALM
  t.gsap.fromTo(el,
    { rotateX: c ? Math.min(tilt, 6) : tilt, rotateZ: c ? fromZ / 3 : fromZ, y: c ? y / 3 : y, transformPerspective: DEPTH, transformOrigin: '50% 100%' },
    { rotateX: 0, rotateZ: toZ, y: 0, transformOrigin: '50% 100%', ease: 'none',
      scrollTrigger: { trigger: el, ...landRange(t, el, art), scrub: true, invalidateOnRefresh: true, onToggle: scrubbing(el) } })
}

/** A thing lying flat stands up to face the camera. */
export function standUp(t: MotionEngine, el: El, o: { from?: number } = {}) {
  if (t.REDUCE) return
  const from = t.CALM ? Math.min(o.from ?? 72, 30) : o.from ?? 72
  t.gsap.fromTo(el,
    { rotateX: from, transformPerspective: DEPTH, transformOrigin: '50% 100%' },
    { rotateX: 0, transformOrigin: '50% 100%', ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 55%', scrub: true, onToggle: scrubbing(el) } })
}

/** Slides in from the inline-start side (the right in Hebrew), turning to its rest angle. CALM: short, no turn. */
export function slideIn(t: MotionEngine, el: El, o: { dx?: number; fromZ?: number; toZ?: number } = {}) {
  if (t.REDUCE) return
  const { fromZ = 14, toZ = 6 } = o
  const dx = t.CALM ? 16 : o.dx ?? 40
  t.gsap.fromTo(el,
    { x: t.RTL ? dx : -dx, rotateZ: t.CALM ? toZ : fromZ },
    { x: 0, rotateZ: toZ, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: true, onToggle: scrubbing(el) } })
}

/** The cassette's reels turn with the scroll (the visitor drives them, so CALM keeps them). */
export function reels(t: MotionEngine, items: Element[], trigger: Element) {
  if (t.REDUCE || !items.length) return
  t.gsap.fromTo(items, { rotate: 0 }, { rotate: -540, ease: 'none',
    scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true, onToggle: scrubbing(...items) } })
}

/** A photo develops: the table-coloured wash over it clears (REDUCE: the wash is display none in CSS). */
export function develop(t: MotionEngine, wash: Element, trigger: Element) {
  if (t.REDUCE) return
  t.gsap.fromTo(wash, { opacity: 1 }, { opacity: 0, ease: 'none',
    scrollTrigger: { trigger, start: 'top 80%', end: 'top 45%', scrub: true } })
}

/**
 * The laptop lands and its lid opens, inside a hold timeline over [at, at + span] (LaunchHold's
 * OPEN maths: the lid from -86deg to -6deg). The perspective is on the stage, never on a
 * transformed ancestor, so no transformPerspective here. CALM: lands from 20deg.
 */
export function openLaptop(tl: gsap.core.Timeline, lap: Element, lid: Element, o: { from?: number; fromZ?: number; at?: number; span?: number; calm?: boolean } = {}) {
  const { at = 0, span = 0.3, fromZ = 0 } = o
  const from = o.calm ? Math.min(o.from ?? 55, 20) : o.from ?? 55
  tl.fromTo(lap, { rotateX: from, rotateZ: fromZ }, { rotateX: 0, rotateZ: 0, ease: 'power2.out', duration: span }, at)
  // inOut, not out: with power3.out the lid was already open at a tenth of the span, so the
  // opening itself never registered (critic, 16.10)
  tl.fromTo(lid, { rotateX: -86 }, { rotateX: -6, ease: 'power2.inOut', duration: span }, at)
}

/**
 * The camera turns a little around the laptop and back, so the release pose is frontal: rotateY
 * 0 → amp over 0-0.5, amp → 0 over 0.5-1. amp 4 below 1100px, 8 above. Skipped under CALM.
 */
export function orbit(tl: gsap.core.Timeline, cam: Element, amp: number, calm = false) {
  if (calm || !amp) return
  tl.fromTo(cam, { rotateY: 0 }, { rotateY: amp, ease: 'sine.inOut', duration: 0.5 }, 0)
  tl.fromTo(cam, { rotateY: amp }, { rotateY: 0, ease: 'sine.inOut', duration: 0.5, immediateRender: false }, 0.5)
}

/** An element's offset inside `root`, from the offset chain (transforms do not change it). */
function offsetIn(el: El, root: El, axis: 'offsetTop' | 'offsetLeft') {
  let v = 0
  for (let n: El | null = el; n; n = n.offsetParent as El | null) {
    if (n === root) return v
    v += n[axis]
  }
  // root is not on el's offset chain (not positioned): both from the document
  let r = 0
  for (let n: El | null = root; n; n = n.offsetParent as El | null) r += n[axis]
  return v - r
}
const topIn = (el: El, root: El) => offsetIn(el, root, 'offsetTop')

export interface InkLineOpts {
  /** the element the line runs along (its height is the line's length) */
  track: El
  /** the line's fill, scaled 0 → 1 on Y from the top */
  fill: El
  /** the dots on the line (may be empty) */
  nodes: El[]
  start?: string
  end?: string
  /** the last node the drawn line has reached (-1: none), called only when it changes, both directions */
  onReach?: (reached: number) => void
}

/**
 * The ink line draws down its track with the scroll and reports which dot it has reached. The node
 * fractions are measured on refresh; the reach follows the drawn (scrubbed) line, so a dot fills
 * exactly when the line arrives at it. REDUCE: the fill is full in CSS and every node is reached.
 */
export function inkLine(t: MotionEngine, o: InkLineOpts) {
  const { track, fill, nodes, start = 'top 70%', end = 'bottom 70%', onReach } = o
  if (t.REDUCE) {
    if (nodes.length) onReach?.(nodes.length - 1)
    return null
  }
  let fracs: number[] = []
  let last = Number.NaN
  const measure = () => {
    const h = track.offsetHeight || 1
    fracs = nodes.map((n) => (topIn(n, track) + n.offsetHeight / 2) / h)
  }
  const report = (p: number) => {
    if (!onReach) return
    let count = 0
    for (const f of fracs) if (f <= p) count++
    const reached = count - 1
    if (reached !== last) { last = reached; onReach(reached) }
  }
  measure()
  // the trigger may refresh inside the tween's constructor, before `tween` is assigned
  let tween: gsap.core.Tween | null = null
  const progress = () => tween?.progress() ?? 0
  tween = t.gsap.fromTo(fill, { scaleY: 0, transformOrigin: '50% 0%' }, {
    scaleY: 1, transformOrigin: '50% 0%', ease: 'none',
    onUpdate: () => report(progress()),
    scrollTrigger: {
      trigger: track, start, end, scrub: t.CALM ? true : 0.5, invalidateOnRefresh: true,
      onRefresh: () => { measure(); report(progress()) },
      onToggle: scrubbing(fill),
    },
  })
  report(progress())
  return tween
}

export interface PullBackMatchedOpts {
  /** the tall wrapper (data-hold="pullback") */
  hold: Element
  /** the camera layer inside the sticky stage: the desk and the phone */
  layer: El
  /** the real letter (#contact .ct__form), never transformed */
  real: El
  /** the miniature letter inside the phone (.shot-mini__letter) */
  mini: El
  id: string
}

/**
 * S9, the pull-back: at progress 0 the camera is as close as the real letter's width (the miniature
 * letter at the real letter's width and centre) and looks at the middle of the phone's screen, in
 * the band above the dock line; then it pulls back to scale 1, with a rotateX bump 0 → 10 → 0 (not
 * under CALM). Matching the letter's bottom to the stage's top edge (the first version) left the
 * first two screens of the hold on the phone's bezel and the bare table under it (critic and
 * audit, 16.10). No opacity anywhere. Everything is measured on refresh from the offset chain
 * (transforms ignored). Callers return before this under REDUCE and the short policy.
 */
export function pullBackMatched(t: MotionEngine, o: PullBackMatchedOpts) {
  const { layer, real, mini } = o
  const stage = (layer.parentElement ?? layer) as El
  let m: { s0: number; ox: number; oy: number; x0: number; y0: number } | null = null
  const get = () => {
    if (m) return m
    const s0 = real.offsetWidth / (mini.offsetWidth || 1)
    const lx = offsetIn(layer, stage, 'offsetLeft')
    const ly = topIn(layer, stage)
    const ox = stage.clientWidth / 2 - lx
    const oy = stage.clientHeight / 2 - ly
    const miniLeft = offsetIn(mini, layer, 'offsetLeft')
    const miniCx = miniLeft + mini.offsetWidth / 2
    // the phone's screen (the Thing's face around the miniature site), its centre in layer y
    const face = (mini.closest('.thing__face') as El | null) ?? mini
    const faceCy = topIn(face, layer) + face.offsetHeight / 2
    // the real letter's centre in stage x (the page scrolls vertically only; x is layout-stable)
    const realCx = real.getBoundingClientRect().left + real.offsetWidth / 2 - stage.getBoundingClientRect().left
    const x0 = realCx - (lx + ox + (miniCx - ox) * s0)
    const y0 = (stage.clientHeight - safeB(t)) / 2 - (ly + oy + (faceCy - oy) * s0)
    m = { s0, ox, oy, x0, y0 }
    return m
  }
  const tl = t.holdTimeline(o.hold, { id: o.id, scrub: t.CALM ? true : 0.6, onRefreshInit: () => { m = null } })
  tl.fromTo(layer,
    { scale: () => get().s0, x: () => get().x0, y: () => get().y0, transformPerspective: DEPTH, transformOrigin: () => `${get().ox}px ${get().oy}px` },
    { scale: 1, x: 0, y: 0, ease: 'power1.inOut', duration: 1, immediateRender: true }, 0)
  if (!t.CALM) {
    tl.fromTo(layer, { rotateX: 0 }, { rotateX: 10, ease: 'sine.inOut', duration: 0.5, immediateRender: false }, 0)
    tl.fromTo(layer, { rotateX: 10 }, { rotateX: 0, ease: 'sine.inOut', duration: 0.5, immediateRender: false }, 0.5)
  }
  return tl
}
