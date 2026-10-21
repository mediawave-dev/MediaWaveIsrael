// The guide (D189): no button sits on the page. Now and then a little world, a disc split by a moving
// wave with a thin ring around it (the brand's horizon, in each world's colours), arcs in from the edge
// with a fine comet trail, hovers by the thumb and offers another world;
// ignored, it flies off and comes back later (after the visitor finishes a chapter, never more than every
// 30 s, five times a visit at most, and once more at the letter). Tapped, it opens the map of worlds.
// Keyboard and screen readers use the bar's "Worlds" button instead (the guide is aria-hidden).
import { useEffect, useRef, useState } from 'react'
import './portal.css'
import type { Tier } from './motion'

type Phase = 'away' | 'in' | 'hover' | 'out'

export interface GuidePlan {
  /** what marks a chapter on this page (the studio: [data-ch]; the main site: [data-chapter]) */
  chapters: string
  /** never closer than this (ms), never more than this many times a visit */
  cool: number
  max: number
  /** how long it rests before it flies off (ms) */
  stay: number
  /** when it first comes (ms after it is mounted) */
  first: number
  /** the line it says (English: a label, D-English micro-labels) */
  say: string
  /** the chapter that always calls it once more */
  last?: string
}

export const STUDIO_PLAN: GuidePlan = { chapters: '[data-ch]', cool: 30000, max: 5, stay: 7000, first: 4200, say: 'Visit another world', last: 'contact' }

/** where it rests: by the thumb if that spot is free, else the next free one; never on a button, a link,
    a field or a line of text (it looks at what lies under each candidate before it lands) */
let spot = { x: 0, y: 0 }
const BUSY = 'a, button, input, textarea, summary, label, h1, h2, h3, p, li, video, img, span, .st-sound'
/** a span is busy only when it holds text of its own (a label, a number), not when it wraps a decoration */
const ownText = (el: HTMLElement) => el.tagName !== 'SPAN' || [...el.childNodes].some((n) => n.nodeType === 3 && !!n.textContent?.trim())
/** the boxes that must stay clear: not the guide's own parts, the map or the travel title, and not a wrapper
    the size of the screen (a label is small) */
function busyBoxes(w: number, h: number): DOMRect[] {
  return [...document.querySelectorAll<HTMLElement>(BUSY)]
    .filter((el) => ownText(el) && !el.closest('.gd, .gd-trail, .wm, .st-title'))
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.bottom > 0 && r.top < h && r.right > 0 && r.left < w && r.width * r.height < w * h * 0.4)
}
function pickPerch(): { x: number; y: number } | null {
  const w = window.innerWidth
  const h = window.innerHeight
  const m = w < 760
  const c = m
    ? [[w - 52, h - 150], [52, h - 150], [w - 52, h * 0.58], [52, h * 0.58], [w - 52, h * 0.3], [52, h * 0.3]]
    : [[w - 150, h - 190], [150, h - 190], [w - 110, h * 0.5], [110, h * 0.5]]
  // what must stay clear: every button, link, field and line of text on screen, measured as boxes (a hit test
  // would miss text that ignores the pointer)
  const boxes = busyBoxes(w, h)
  // the disc (60 px) and its label (about 180 px toward the middle of the screen)
  const free = ([x, y]: number[]) => {
    const left = x < w / 2
    const box = { l: Math.min(x - 34, left ? x : x - 190), r: Math.max(x + 34, left ? x + 190 : x), t: y - 34, b: y + 34 }
    return boxes.every((r) => r.right < box.l || r.left > box.r || r.bottom < box.t || r.top > box.b)
  }
  // nowhere clear: it skips this visit and tries again at the next chapter
  const hit = c.find(free)
  if (!hit) return null
  spot = { x: hit[0], y: hit[1] }
  return spot
}
/** a sideways row holds the screen: its cards keep moving under any spot, so the guide stays away */
function rowHolds(): boolean {
  const mid = window.innerHeight / 2
  return [...document.querySelectorAll<HTMLElement>('.is-sideways')].some((el) => { const r = el.getBoundingClientRect(); return r.top < mid && r.bottom > mid })
}
/** is the resting spot still clear (content moves: a sideways row, a scrolled page)? */
function stillFree(): boolean {
  if (rowHolds()) return false
  const w = window.innerWidth
  const h = window.innerHeight
  const { x, y } = spot
  const left = x < w / 2
  const box = { l: Math.min(x - 34, left ? x : x - 190), r: Math.max(x + 34, left ? x + 190 : x), t: y - 34, b: y + 34 }
  return busyBoxes(w, h).every((r) => r.right < box.l || r.left > box.r || r.bottom < box.t || r.top > box.b)
}
const perch = () => spot

const bez = (a: number, b: number, c: number, d: number, t: number) => {
  const u = 1 - t
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d
}

export default function Guide({ color, tier, open, onOpen, plan = STUDIO_PLAN }: { color: string; tier: Tier; open: boolean; onOpen: (at: { x: number; y: number }) => void; plan?: GuidePlan }) {
  const el = useRef<HTMLButtonElement>(null)
  const sparks = useRef<SVGSVGElement>(null)
  const [phase, setPhase] = useState<Phase>('away')
  const state = useRef({ phase: 'away' as Phase, shown: 0, last: -plan.cool, t0: 0, from: { x: 0, y: 0 }, to: { x: 0, y: 0 }, c1: { x: 0, y: 0 }, c2: { x: 0, y: 0 }, x: -100, y: -100 })

  // the frame loop sleeps while the guide is away (D198) and wakes when it sets off
  const wake = useRef<() => void>(() => {})
  const clear = useRef<() => void>(() => {})
  const go = (p: Phase) => { state.current.phase = p; setPhase(p); if (p !== 'away') wake.current(); else clear.current() }

  // the flight itself: a bezier in, a hover that bobs on two sines, a bezier out; sparks fall behind it
  useEffect(() => {
    if (tier === 'still') return
    let raf = 0
    let lastSpark = 0
    const trail: [number, number][] = []
    const lit: boolean[] = []
    let lastCheck = 0
    // (D199) the spot is checked again only after the page moved (each check measures every label on screen)
    let moved = false
    const onMove = () => { moved = true }
    window.addEventListener('scroll', onMove, { passive: true })
    const tick = (now: number) => {
      const s = state.current
      if (s.phase === 'away' || !el.current) { raf = 0; return }
      raf = requestAnimationFrame(tick)
      const k = (now - s.t0) / 1000
      let x = s.x
      let y = s.y
      if (s.phase === 'in' || s.phase === 'out') {
        const dur = s.phase === 'in' ? 1.5 : 1.2
        const q = Math.min(1, k / dur)
        const e = s.phase === 'in' ? 1 - Math.pow(1 - q, 3) : q * q
        x = bez(s.from.x, s.c1.x, s.c2.x, s.to.x, e) + Math.sin(k * 9) * 6 * (1 - q)
        y = bez(s.from.y, s.c1.y, s.c2.y, s.to.y, e) + Math.cos(k * 7) * 5 * (1 - q)
        if (q >= 1) {
          if (s.phase === 'in') { s.t0 = now; go('hover') } else { go('away'); x = -100; y = -100; trail.length = 0 }
        }
      } else if (s.phase === 'hover') {
        const p = perch()
        x = p.x + Math.sin(k * 1.3) * 9 + Math.sin(k * 3.1) * 3
        y = p.y + Math.sin(k * 2.1) * 7
        if (!open && (now - s.t0 > plan.stay || (moved && now - lastCheck > 500 && ((lastCheck = now), (moved = false), !stillFree())))) flyOff(now)
      }
      const dx = x - s.x
      s.x = x
      s.y = y
      el.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${Math.max(-18, Math.min(18, dx * 3)).toFixed(1)}deg)`
      // the comet trail: the last positions, drawn as one path that thins and fades toward its tail
      trail.unshift([x, y])
      if (trail.length > 26) trail.length = 26
      // (D198) a segment's opacity and width depend only on its place, so they are written when it appears
      // or goes, not every frame; while the guide only bobs in place the trail redraws at 20 fps
      if (sparks.current && now - lastSpark > (s.phase === 'hover' ? 50 : 16)) {
        lastSpark = now
        const segs = sparks.current.children
        for (let i = 0; i < segs.length; i++) {
          const a = trail[i]
          const b = trail[i + 1]
          const seg = segs[i] as SVGLineElement
          if (!a || !b) {
            if (lit[i]) { seg.setAttribute('opacity', '0'); lit[i] = false }
            continue
          }
          seg.setAttribute('x1', a[0].toFixed(1)); seg.setAttribute('y1', a[1].toFixed(1))
          seg.setAttribute('x2', b[0].toFixed(1)); seg.setAttribute('y2', b[1].toFixed(1))
          if (!lit[i]) {
            seg.setAttribute('opacity', (0.7 * (1 - i / segs.length)).toFixed(2))
            seg.setAttribute('stroke-width', (2.6 * (1 - i / segs.length) + 0.3).toFixed(2))
            lit[i] = true
          }
        }
      }
    }
    const flyOff = (now: number) => {
      const s = state.current
      const w = window.innerWidth
      s.from = { x: s.x, y: s.y }
      s.to = { x: s.x < w / 2 ? w + 80 : -80, y: -60 }
      s.c1 = { x: s.x - 40, y: s.y - 160 }
      s.c2 = { x: (s.x + s.to.x) / 2, y: window.innerHeight * 0.2 }
      s.t0 = now
      go('out')
    }
    wake.current = () => { if (!raf) raf = requestAnimationFrame(tick) }
    // away (flown off, or tapped open): no trail left on the screen
    clear.current = () => {
      trail.length = 0
      const segs = sparks.current?.children ?? []
      for (let i = 0; i < segs.length; i++) { segs[i].setAttribute('opacity', '0'); lit[i] = false }
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); raf = 0; wake.current = () => {}; window.removeEventListener('scroll', onMove) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier, open])

  // when it comes: once soon after arriving, then when a chapter is finished (cooled down), and at the letter
  useEffect(() => {
    if (tier === 'still') return
    const call = () => {
      const s = state.current
      const now = performance.now()
      if (s.phase !== 'away' || s.shown >= plan.max || now - s.last < plan.cool || open) return
      const p = rowHolds() ? null : pickPerch()
      if (!p) return
      s.shown += 1
      s.last = now
      const w = window.innerWidth
      const h = window.innerHeight
      const left = Math.random() < 0.5
      s.from = { x: left ? -60 : w + 60, y: h * (0.25 + Math.random() * 0.25) }
      s.to = p
      s.c1 = { x: w * (left ? 0.25 : 0.75), y: h * 0.1 }
      s.c2 = { x: w * (left ? 0.55 : 0.45), y: h * 0.75 }
      s.x = s.from.x
      s.y = s.from.y
      s.t0 = now
      go('in')
    }
    const first = window.setTimeout(call, plan.first)
    let seen = 'hero'
    let settle = 0
    const onScroll = () => {
      window.clearTimeout(settle)
      settle = window.setTimeout(() => {
        const line = window.innerHeight * 0.5
        const el = [...document.querySelectorAll<HTMLElement>(plan.chapters)].find((c) => { const r = c.getBoundingClientRect(); return r.top <= line && r.bottom > line })
        const here = el?.dataset.ch ?? el?.dataset.chapter ?? el?.id ?? ''
        if (here && here !== seen) {
          seen = here
          if (plan.last && here === plan.last) state.current.last = -plan.cool
          call()
        }
      }, 650)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(first); clearTimeout(settle); window.removeEventListener('scroll', onScroll) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier, open])

  if (tier === 'still') return null
  return (
    <>
      <svg className="gd-trail" ref={sparks} aria-hidden="true" style={{ ['--gd' as string]: color }}>
        {Array.from({ length: 25 }, (_, i) => <line key={i} opacity="0" strokeLinecap="round" />)}
      </svg>
      <button
        type="button"
        ref={el}
        className="gd"
        data-phase={phase}
        data-side={typeof window !== 'undefined' && spot.x && spot.x < window.innerWidth / 2 ? 'r' : 'l'}
        aria-hidden="true"
        tabIndex={-1}
        style={{ ['--gd' as string]: color }}
        onClick={() => { const s = state.current; onOpen({ x: s.x, y: s.y }); go('away') }}
      >
        <svg className="gd__body" viewBox="-32 -32 64 64" aria-hidden="true">
          <defs>
            <clipPath id="gd-disc"><circle r="15" /></clipPath>
          </defs>
          <circle className="gd__glow" r="28" />
          <g className="gd__ring"><ellipse rx="25" ry="7.5" transform="rotate(-18)" /></g>
          <circle className="gd__sky" r="15" />
          <g clipPath="url(#gd-disc)">
            <path className="gd__sea" d="M-46 1c6-4 11-4 17 0s11 4 17 0 11-4 17 0 11 4 17 0 11-4 17 0 11 4 17 0V20h-102z" />
          </g>
          <circle className="gd__rim" r="15" />
        </svg>
        <span className="gd__say" lang="en" dir="ltr">{plan.say}</span>
      </button>
    </>
  )
}
