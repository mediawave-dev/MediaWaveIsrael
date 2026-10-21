// The invitation to the music (D199, D200). Nati: "something that clearly says: tap the screen for music",
// then: "the button is generic, it does not belong to the site; I want it to come and go now and then,
// smartly". So it is made of the site's own material: a pane of the buttons' smoked glass with their even
// ring of dots, an equaliser of halftone dots that light up like the field, and a mono label that develops
// out of dots (decode.ts) and goes back into them when it leaves.
// When it comes: never while the page is being scrolled (it waits for the reader to pause), first a few
// seconds after arriving, then only after the visitor has travelled on (600 px or a new world) and at least
// 40 s after it last left; three times a visit at most; never with the guide in flight or a dialog open,
// never once the music plays or after its × (for the rest of the visit). It stays seven seconds (longer
// while the pointer rests on it). While it shows, a tap anywhere that is not on a control starts the music
// (a drag or a scroll never does: a phone starts audio only from a tap).
// [קופי: נתי] the English micro-labels and the track names
import { useEffect, useRef, useState } from 'react'
import DotRing from '../look/parts/DotRing'
import { decode, undecode } from '../look/sea/decode'
import './portal.css'

const CONTROL = 'a, button, input, textarea, select, summary, label, [role="button"], .wm, .gd, .snd'
const TEXT = 'h1, h2, h3, p, li, a, button, label, input, span'
const LABEL = 'Tap for sound'
const STAY = 7000
const GAP = 40000
const MAX = 3

/** it never covers words: the band it would sit in (bottom, or just under the header) must be clear */
function bandClear(from: number, to: number): boolean {
  return ![...document.querySelectorAll<HTMLElement>(TEXT)].some((el) => {
    if (el.closest('.snd, .gd, .gd-trail, .wm, .mw-head, .st-bar')) return false
    if (el.tagName === 'SPAN' && ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim())) return false
    const r = el.getBoundingClientRect()
    if (!(r.width > 0 && r.height > 0 && r.bottom > from && r.top < to)) return false
    // words nobody sees (a held stage still faded out, a counter in the dark) do not count
    let o = 1
    for (let e: HTMLElement | null = el; e && o > 0.05; e = e.parentElement) o *= Number(getComputedStyle(e).opacity)
    const c = getComputedStyle(el).color.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255, 1]
    const bg = getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0]
    const same = Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]) < 24
    return o > 0.05 && (c[3] ?? 1) > 0.05 && !same && getComputedStyle(el).visibility !== 'hidden'
  })
}
/** where it can come now: the bottom, else under the header, else nowhere (it waits for the next pause) */
function placeNow(): 'bottom' | 'top' | null {
  const vh = window.innerHeight
  if (bandClear(vh - 110, vh - 8)) return 'bottom'
  if (bandClear(76, 150)) return 'top'
  return null
}

/** something else holds the stage: the guide flying or resting, a dialog, a hidden tab */
const busy = () => document.hidden || document.documentElement.classList.contains('wm-open') || [...document.querySelectorAll<HTMLElement>('.gd')].some((g) => g.dataset.phase && g.dataset.phase !== 'away')

let declined = false
let shown = 0
let leftAt = -GAP

export interface SoundSource {
  /** is the music playing (or not wanted) */
  isOn: () => boolean
  /** start it (called inside the tap) */
  turnOn: () => void
  subscribe: (f: (on: boolean) => void) => () => void
  /** fetch what the tap will need, ahead of it */
  prepare?: () => void
}

export default function SoundInvite({ track, source, cue, delay = 3200 }: { track: string; source: SoundSource; cue: string; delay?: number }) {
  const [show, setShow] = useState(false)
  const [top, setTop] = useState(false)
  const [on, setOn] = useState(source.isOn())
  const label = useRef<HTMLSpanElement>(null)
  const down = useRef<{ x: number; y: number; t: number } | null>(null)
  const hover = useRef(false)

  useEffect(() => source.subscribe(() => { const v = source.isOn(); setOn(v); if (v) setShow(false) }), [source])

  // the schedule: a moment after arriving, then at a pause after the reader has travelled on
  useEffect(() => {
    if (on || declined) return
    source.prepare?.()
    let lastY = window.scrollY
    let travelled = 0
    let scrolling = 0
    let first = window.setTimeout(() => { first = 0; tryShow() }, delay)
    let leave = 0
    const tryShow = () => {
      if (declined || source.isOn() || shown >= MAX || busy() || scrolling) return
      if (performance.now() - leftAt < GAP && shown > 0) return
      const at = placeNow()
      if (!at) return
      shown += 1
      travelled = 0
      setTop(at === 'top')
      setShow(true)
      shownAt = window.scrollY
      const out = () => { if (hover.current) { leave = window.setTimeout(out, 1500); return } shownAt = -1; setShow(false); leftAt = performance.now() }
      leave = window.setTimeout(out, STAY)
    }
    let shownAt = -1
    const onScroll = () => {
      const y = window.scrollY
      travelled += Math.abs(y - lastY)
      lastY = y
      // it was offered at a pause: when the reader moves on, it goes (and never sits over moving words)
      if (shownAt >= 0 && Math.abs(y - shownAt) > 40) { shownAt = -1; window.clearTimeout(leave); setShow(false); leftAt = performance.now() }
      window.clearTimeout(scrolling)
      // a pause in the reading, after real travel: the moment to offer it again
      scrolling = window.setTimeout(() => { scrolling = 0; if (!first && travelled > 600) tryShow() }, 1600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.clearTimeout(first); window.clearTimeout(leave); window.clearTimeout(scrolling); window.removeEventListener('scroll', onScroll) }
  }, [cue, on, delay, source])

  // the label develops out of dots as it arrives, and goes back into them as it leaves
  useEffect(() => {
    const el = label.current
    if (!el) return
    if (show) void decode(el, LABEL, 260)
    else if (el.textContent) void undecode(el)
  }, [show])

  // while it shows: a tap anywhere that is not on a control starts the music
  useEffect(() => {
    if (!show) return
    const pd = (e: PointerEvent) => { down.current = { x: e.clientX, y: e.clientY, t: performance.now() } }
    const pu = (e: PointerEvent) => {
      const d = down.current
      down.current = null
      if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 12 || performance.now() - d.t > 600) return
      if ((e.target as Element | null)?.closest?.(CONTROL)) return
      source.turnOn()
    }
    window.addEventListener('pointerdown', pd, { passive: true })
    window.addEventListener('pointerup', pu, { passive: true })
    return () => { window.removeEventListener('pointerdown', pd); window.removeEventListener('pointerup', pu) }
  }, [show, source])

  return (
    <div className="snd" data-on={show || undefined} data-at={top ? 'top' : undefined} aria-hidden={!show}
      onPointerEnter={() => { hover.current = true }} onPointerLeave={() => { hover.current = false }}>
      <button type="button" className="snd__go" tabIndex={show ? 0 : -1} aria-label="הפעלת המוזיקה" onClick={() => source.turnOn()}>
        <span className="snd__eq" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((c) => (
            <span key={c} className="snd__col" style={{ ['--c' as string]: c }}>{[0, 1, 2, 3].map((r) => <i key={r} style={{ ['--r' as string]: r }} />)}</span>
          ))}
        </span>
        <span className="snd__txt" lang="en" dir="ltr">
          <span className="snd__t" ref={label} />
          <span className="snd__s">{track}</span>
        </span>
      </button>
      <button type="button" className="snd__x" tabIndex={show ? 0 : -1} aria-label="בלי מוזיקה" onClick={() => { declined = true; setShow(false) }}>×</button>
      <DotRing />
    </div>
  )
}
