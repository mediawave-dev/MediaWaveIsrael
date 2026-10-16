// shot · the camera (DECISIONS #83, SPEC 1.7). Every move is a transform on one sheet-sized layer,
// never on the page: the document itself scrolls natively, so focus, find-in-page, anchors and the
// browser's own scroll restoration keep working. Every move is scrubbed by scroll (no autoplay), has
// a CALM version (OS reduced motion keeps the shot with small angles) and does nothing under REDUCE
// (the accessibility switch, ?reduce=1, prerender): the last frame is the layout itself.
import type { MotionEngine } from '../../motion/motion-engine'

/** How far the camera is from the paper: the CSS perspective every move uses. */
export const DEPTH = 1100

/**
 * The overview pose the dive starts from, per width. rotateZ is always 0: the H1 is never rotated
 * on Z (the desk props carry the angles). The pre-paint gate (html.shot-dive / shot-dive-calm in
 * shot-hero.css) paints the same numbers, so GSAP takes over without a jump.
 */
export const DIVE_POSES = {
  phone: { rotateX: 16, scale: 0.88 }, // < 768px
  tablet: { rotateX: 18, scale: 0.76 }, // 768-1099px
  desk: { rotateX: 20, scale: 0.64 }, // >= 1100px
  calm: { rotateX: 8, scale: 0.94 }, // OS reduced motion, any width
} as const

export function divePose(t: MotionEngine): { rotateX: number; scale: number } {
  if (t.CALM) return DIVE_POSES.calm
  const w = window.innerWidth
  return w >= 1100 ? DIVE_POSES.desk : w >= 768 ? DIVE_POSES.tablet : DIVE_POSES.phone
}

// --- the dock line ---------------------------------------------------------------------------
// --safe-b (dock, cookie strip, safe area) resolved in px through the .shot-probe ShotHome renders
// (fixed, width 0, height var(--safe-b)). Read once per ScrollTrigger refresh, never per frame.
let safeBCache = -1
const watched = new WeakSet<object>()

export function safeB(t?: MotionEngine): number {
  if (t && !watched.has(t.ScrollTrigger)) {
    watched.add(t.ScrollTrigger)
    t.ScrollTrigger.addEventListener('refreshInit', () => { safeBCache = -1 })
  }
  if (safeBCache < 0) {
    const probe = document.querySelector<HTMLElement>('.shot-probe')
    safeBCache = probe ? probe.offsetHeight : 0
  }
  return safeBCache
}

/** A px number, or a function measured again on every refresh (layout read, never per frame). */
export type Px = number | (() => number)
const px = (v: Px | undefined) => (typeof v === 'function' ? v() : v ?? 0)

/**
 * The element's layout top in document coordinates, ignoring every transform (the offsetTop chain).
 * A trigger that is also the tilted element must be measured this way: ScrollTrigger reads
 * getBoundingClientRect, which includes the element's own tilt and lift, so a refresh mid-landing
 * moved a start by about 28px and an exit by about 370px (measured on the meet sheet). Only for
 * elements in normal flow, never inside a sticky stage.
 */
export function docTop(el: Element) {
  let y = 0
  for (let e = el as HTMLElement | null; e; e = e.offsetParent as HTMLElement | null) y += e.offsetTop
  return y
}

/** The landing's line: the element's top at (viewport - safe-b - art - 8), never above 30%. */
function landLine(t: MotionEngine, art?: Px) {
  return Math.max(innerHeight * 0.3, innerHeight - safeB(t) - px(art) - 8)
}

/**
 * Where a landing ends: the element's top at the landing line, so the landing is over before the
 * first text line under its art band enters the reading band (storyboard rule 2).
 */
export function landEnd(t: MotionEngine, art?: Px) {
  return () => 'top ' + landLine(t, art) + 'px'
}

/**
 * The landing's scroll range as absolute positions measured from layout (docTop), for a trigger
 * that is itself transformed: from its top entering the viewport to its top on the landing line.
 */
export function landRange(t: MotionEngine, el: Element, art?: Px) {
  return {
    start: () => docTop(el) - innerHeight,
    end: () => docTop(el) - landLine(t, art),
  }
}

/** The late exit's range from layout: its bottom passing the top 18%, then leaving the top. */
export function exitRange(el: Element) {
  const bottom = () => docTop(el) + (el as HTMLElement).offsetHeight
  return {
    start: () => bottom() - innerHeight * 0.18,
    end: () => bottom(),
  }
}

/** onToggle for a scrubbed trigger: will-change only while it scrubs (at most 2-3 layers on a phone). */
export const scrubbing = (...els: Element[]) => (self: ScrollTrigger) => {
  for (const el of els) el.classList.toggle('is-scrubbing', self.isActive)
}

// --- the dive --------------------------------------------------------------------------------

export interface DiveOpts {
  /** the tall wrapper whose sticky stage holds `layer` (engine.holdTimeline) */
  hold: Element
  /** what the camera dives onto: the paper model of the site (the hero sheet and the desk) */
  layer: Element
  id: string
  /** the hold's scroll progress, 0-1 (the lens opens over its last 30%) */
  onProgress?: (p: number) => void
}

/** The CSS transform-origin of an element, as its stylesheet sets it (GSAP's own inline value ignored). */
function cssOrigin(el: Element) {
  const style = (el as HTMLElement).style
  const inline = style.transformOrigin
  style.transformOrigin = ''
  const origin = getComputedStyle(el).transformOrigin
  style.transformOrigin = inline
  return origin
}

/**
 * The dive: from the overview of the paper lying on the desk to the sheet filling the screen. The
 * origin is the layer's CSS transform-origin (the H1's own line), the one the pre-paint pose used,
 * so the first GSAP frame equals the painted one; then the pre-paint classes go. Returns the
 * hold's timeline so a caller can add its own beats. Callers return before this under REDUCE.
 */
export function dive(t: MotionEngine, o: DiveOpts) {
  const tl = t.holdTimeline(o.hold, {
    id: o.id,
    scrub: t.CALM ? true : 0.6,
    ...(o.onProgress ? { onUpdate: (self: ScrollTrigger) => o.onProgress?.(self.progress) } : {}),
  })
  tl.fromTo(o.layer,
    { rotateX: () => divePose(t).rotateX, scale: () => divePose(t).scale, rotateZ: 0, transformPerspective: DEPTH, transformOrigin: () => cssOrigin(o.layer) },
    { rotateX: 0, scale: 1, ease: 'power1.inOut', immediateRender: true })
  document.documentElement.classList.remove('shot-dive', 'shot-dive-calm')
  return tl
}

// --- a sheet landing -------------------------------------------------------------------------

export interface LandOpts {
  /** 1 = a full sheet, 0.5 for cards and pads; 0 does nothing */
  strength?: number
  /** px of art above the sheet's first text line (measure on refresh: firstText.offsetTop) */
  art?: Px
  /** false: no landing (a text-first element never lands; the hero sheet starts in the overview) */
  enter?: boolean
  /** false: no late exit tilt (the pad and the letter never tilt) */
  exit?: boolean
}

/**
 * A sheet landing: it comes in lying on the desk and is flat before its first text line enters
 * the reading band (rule 2); it tips away only after its bottom passed the top 18% (rule 3).
 */
export function land(t: MotionEngine, sheet: Element, o: LandOpts = {}) {
  const { strength = 1, art = 0, enter = true, exit = true } = o
  if (t.REDUCE || strength === 0) return
  const tilt = (t.CALM ? 6 : 22) * strength
  const { gsap } = t
  if (enter) {
    gsap.fromTo(sheet,
      { rotateX: tilt, scale: 1 - 0.1 * strength, y: 28 * strength, transformPerspective: DEPTH, transformOrigin: '50% 0%' },
      { rotateX: 0, scale: 1, y: 0, transformOrigin: '50% 0%', ease: 'none',
        scrollTrigger: { trigger: sheet, ...landRange(t, sheet, art), scrub: true, invalidateOnRefresh: true, onToggle: scrubbing(sheet) } })
  }
  if (exit) {
    gsap.fromTo(sheet,
      { rotateX: 0, scale: 1, transformPerspective: DEPTH, transformOrigin: '50% 100%' },
      { rotateX: -tilt * 0.6, scale: 1 - 0.06 * strength, transformOrigin: '50% 100%', immediateRender: false, ease: 'none',
        scrollTrigger: { trigger: sheet, ...exitRange(sheet), scrub: true, invalidateOnRefresh: true, onToggle: scrubbing(sheet) } })
  }
}

// --- the old pull-back (kept for compatibility; the shot uses moves.ts pullBackMatched) ----------

export interface PullBackOpts {
  hold: Element
  /** the miniature of the whole site that shrinks into the phone */
  layer: Element
  /** fades in when the miniature has landed in the screen */
  frame?: Element | null
  id: string
}

/** The pull-back: everything the visitor passed lies on the desk again, then shrinks into a phone. */
export function pullBack(t: MotionEngine, o: PullBackOpts) {
  const tl = t.holdTimeline(o.hold, { id: o.id, scrub: t.CALM ? true : 0.6 })
  tl.fromTo(o.layer,
    { scale: t.CALM ? 1.15 : 2.1, rotateX: t.CALM ? 6 : 26, rotateZ: t.CALM ? -2 : -9, transformPerspective: DEPTH, transformOrigin: '50% 30%' },
    { scale: 1, rotateX: 0, rotateZ: 0, ease: 'power1.inOut' })
  if (o.frame) tl.fromTo(o.frame, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, ease: 'none' }, 0.8)
  return tl
}
