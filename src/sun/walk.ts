// sun · the colour walk, in one place (D293: seven vivid colours, a round in 28 s; the same stops as the mark-clear
// keyframes in sun.css, which is what moves the disc, the step rings and the buoys).
// D299 (Nati, 19.11.2026, "one leading colour at a time"): what used to stand in a colour of its own takes a light
// tint of the walk instead, so at any moment the page has one accent. `useWalkTint` hands a section that tint.
import { useEffect, type RefObject } from 'react'

export const WALK_MS = 28000
export const VIVID = ['#12CCBC', '#0CC9D1', '#03C6E6', '#0CC1FD', '#63B9FE', '#83B2FE', '#9BAAFE', '#B0A2FF', '#C896FF', '#E584FB', '#F87CE0', '#FE7FC0', '#FE85A4', '#FF8893', '#FF8A83', '#FE8D70', '#FE8F5B', '#FF933B', '#FF9D05', '#FBAF02', '#F1BC0C', '#D8BF05', '#BABF06', '#9CC409', '#78CA3E', '#46D065', '#0FD18B', '#06CEA7']
export const CLEAR: [number, string][] = [...VIVID.map((c, i) => [i / VIVID.length, c] as [number, string]), [1, VIVID[0]]]

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const at = (stops: [number, string][], k: number) => {
  let i = 0
  while (i < stops.length - 2 && k > stops[i + 1][0]) i++
  const [k0, c0] = stops[i]
  const [k1, c1] = stops[i + 1]
  const t = k1 > k0 ? (k - k0) / (k1 - k0) : 0
  const a = rgb(c0), b = rgb(c1)
  return a.map((v, j) => v + (b[j] - v) * t)
}
/** The walk's colour at `k` (0 to 1 of a round). */
export const walkAt = (stops: [number, string][], k: number) => `rgb(${at(stops, k).map(Math.round).join(' ')})`
/** The same colour let down with white: `white` of 0.62 is a pale ground that ink reads on at 10:1 or more. */
export const tintAt = (k: number, white: number) => `rgb(${at(CLEAR, k).map((v) => Math.round(v + (255 - v) * white)).join(' ')})`

/** Where the walk stands now, read from the disc's own animation, so nothing can drift from it (and so a walk that
    stands still, under the opener, stands still here too). Null where there is no disc on the page. */
let disc: Animation | null = null
export function walkNow(): number | null {
  if (!disc || disc.playState === 'idle') disc = document.getAnimations().find((a) => (a as CSSAnimation).animationName === 'mark-clear') ?? null
  if (!disc) return null
  const now = Number(disc.currentTime ?? 0)
  return (((now % WALK_MS) + WALK_MS) % WALK_MS) / WALK_MS
}

/** While the element is on the screen it carries --tint (pale) and --tint2 (a step stronger) of the walk's colour,
    written six times a second (the stylesheet glides between them). Off the screen nothing is written. With ?calm=1,
    "ללא אנימציות", high contrast, in the prerender or without scripts the variables are absent and the stylesheet's own
    fallback stands. */
export function useWalkTint(ref: RefObject<HTMLElement>, pale = 0.64, strong = 0.34) {
  useEffect(() => {
    const el = ref.current
    if (!el || (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ || typeof IntersectionObserver === 'undefined') return
    const html = document.documentElement
    const still = () => html.classList.contains('calm') || html.classList.contains('disable-animations') || html.classList.contains('high-contrast')
    let live = false
    let timer = 0
    const rest = () => { el.style.removeProperty('--tint'); el.style.removeProperty('--tint2') }
    const tick = () => {
      timer = 0
      if (!live) return
      if (still()) { rest(); return }
      const k = walkNow()
      if (k === null) rest()
      else { el.style.setProperty('--tint', tintAt(k, pale)); el.style.setProperty('--tint2', tintAt(k, strong)) }
      timer = window.setTimeout(tick, 160)
    }
    const io = new IntersectionObserver(([e]) => { live = e.isIntersecting; if (live && !timer) tick() }, { rootMargin: '120px' })
    io.observe(el)
    const mo = new MutationObserver(() => { if (still()) rest(); else if (live && !timer) tick() })
    mo.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => { io.disconnect(); mo.disconnect(); clearTimeout(timer) }
  }, [ref, pale, strong])
}
