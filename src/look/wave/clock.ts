// wave · the one clock (D119; method: site-director harvest mr-pandas.md). Every moving part on the
// home page is geared to native scroll at a fixed ratio and eased twice: the scroll position is
// eased once for the whole page, then each part eases toward its own target. One requestAnimationFrame
// loop for every part, running only while something still moves; scrolling wakes it.
// Still (the widget's "stop animations", ?reduce=1, the prerender): every part is drawn once at its
// last frame and the loop never runs. OS reduced motion is the site's CALM tier (mediawave.co.il's own
// policy): parts geared to the scroll still follow it (the reader drives them), while anything that
// plays by itself (the trail, the surprises, the opening's slides) stays off or quiet; ?motion=full
// overrides it for review.
import { useEffect, type RefObject } from 'react'

export type Draw = (p: number, v: number) => void
/** [start, end] of the part's travel in document scroll px, measured on every resize */
export type Range = (el: HTMLElement, vh: number) => [number, number]

interface Part { el: HTMLElement; range: Range; draw: Draw; a: number; b: number; e: number; t: number }

const SCROLL_EASE = 0.16
const PART_EASE = 0.2
const parts = new Set<Part>()
let raf = 0
let sy = -1
let listening = false
// (D199) the native scroll position, read in the scroll event where layout is clean: read in the frame,
// after the other loops had written their styles, it forced a full style and layout every frame
let nowY = typeof window === 'undefined' ? 0 : window.scrollY

export function isStill(): boolean {
  if (typeof window === 'undefined') return true
  const html = document.documentElement.classList
  return Boolean((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__)
    || html.contains('disable-animations') || html.contains('motion-reduced')
    || /[?&]reduce=1(&|$)/.test(window.location.search)
}

/** OS reduced motion (CALM): geared parts run, self-playing ones do not. ?motion=full overrides. */
export function isCalm(): boolean {
  if (typeof window === 'undefined') return false
  // the OS flag no longer calms the site (D160): ?calm=1 does
  return /[?&]calm=1(&|$)/.test(window.location.search) && !/[?&]motion=full(&|$)/.test(window.location.search)
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** The element's top in document px (transforms do not change it). */
export function docTop(el: HTMLElement): number {
  let y = 0
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop
  return y
}

function measure(p: Part) {
  const [a, b] = p.range(p.el, window.innerHeight)
  p.a = a; p.b = Math.max(a + 1, b)
}

function frame() {
  const y = nowY
  sy = sy < 0 ? y : lerp(sy, y, SCROLL_EASE)
  if (Math.abs(sy - y) < 0.3) sy = y
  let moving = sy !== y
  for (const p of parts) {
    p.t = clamp01((sy - p.a) / (p.b - p.a))
    const before = p.e
    p.e = lerp(p.e, p.t, PART_EASE)
    if (Math.abs(p.e - p.t) < 0.0004) p.e = p.t
    if (p.e !== before) p.draw(p.e, p.e - before)
    if (p.e !== p.t) moving = true
  }
  raf = moving ? requestAnimationFrame(frame) : 0
}

const wake = () => { if (!raf && parts.size) raf = requestAnimationFrame(frame) }
const onScroll = () => { nowY = window.scrollY; wake() }
const remeasure = () => { nowY = window.scrollY; parts.forEach(measure); wake() }

function listen() {
  if (listening) return
  listening = true
  nowY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', remeasure)
  window.addEventListener('load', remeasure)
  document.fonts?.ready.then(remeasure)
}

/** Gear one part to the scroll. Returns the unregister function. */
export function gear(el: HTMLElement, range: Range, draw: Draw): () => void {
  const part: Part = { el, range, draw, a: 0, b: 1, e: 0, t: 0 }
  measure(part)
  if (isStill()) { draw(1, 0); return () => {} }
  part.t = clamp01((window.scrollY - part.a) / (part.b - part.a))
  part.e = part.t
  draw(part.e, 0)
  parts.add(part)
  listen()
  // fonts and lazy chunks move things after the first measure
  const late = window.setTimeout(remeasure, 1200)
  return () => { window.clearTimeout(late); parts.delete(part) }
}

/** React: gear the element in `ref` while mounted. */
export function useGear(ref: RefObject<HTMLElement>, range: Range, draw: Draw, deps: unknown[] = []) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return gear(el, range, draw)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** Remeasure every part (after a layout change the clock cannot see, e.g. an accordion). */
export const refreshGears = remeasure
