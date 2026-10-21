// The invitation to the music (D199, Nati: "something that looks good and clearly says: tap the screen if
// you want music"). A pill in the page's own colours rises at the bottom a moment after you arrive (in the
// worlds: after every switch while the sound is still off): a live equaliser, "Tap anywhere for music" and
// the name of the track. While it shows, a tap anywhere on the page that is not on a control turns the
// music on (a drag or a scroll never does: a phone starts audio only from a tap); the pill itself is a
// button for keyboards and screen readers, and its × says no for the rest of the visit. It leaves by
// itself after ten seconds; the page's own sound switch stays.
// [קופי: נתי] the English micro-labels and the track names
import { useEffect, useRef, useState } from 'react'
import './portal.css'

const CONTROL = 'a, button, input, textarea, select, summary, label, [role="button"], .wm, .gd, .st-invite'
const TEXT = 'h1, h2, h3, p, li, a, button, label, input, span'
/** it never covers words: at the bottom when the bottom band is clear, else just under the header */
function clearAtBottom(): boolean {
  const vh = window.innerHeight
  return ![...document.querySelectorAll<HTMLElement>(TEXT)].some((el) => {
    if (el.closest('.st-invite, .gd, .gd-trail, .wm, .mw-head, .st-bar')) return false
    if (el.tagName === 'SPAN' && ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim())) return false
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && r.bottom > vh - 100 && r.top < vh - 8
  })
}
let declined = false

export interface SoundSource {
  /** is the music playing */
  isOn: () => boolean
  /** start it (called inside the tap) */
  turnOn: () => void
  subscribe: (f: (on: boolean) => void) => () => void
  /** fetch what the tap will need, ahead of it */
  prepare?: () => void
}

export default function SoundInvite({ track, source, cue, delay = 1600 }: { track: string; source: SoundSource; cue: string; delay?: number }) {
  const [show, setShow] = useState(false)
  const [top, setTop] = useState(false)
  const [on, setOn] = useState(source.isOn())
  const down = useRef<{ x: number; y: number; t: number } | null>(null)

  useEffect(() => source.subscribe(() => { const v = source.isOn(); setOn(v); if (v) setShow(false) }), [source])

  // it comes a moment after you arrive (or after `cue` changes), and goes by itself after ten seconds
  useEffect(() => {
    if (on || declined) return
    source.prepare?.()
    const a = window.setTimeout(() => { if (source.isOn()) return; setTop(!clearAtBottom()); setShow(true) }, delay)
    const b = window.setTimeout(() => setShow(false), delay + 10000)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [cue, on, delay, source])

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
    <div className="st-invite" data-on={show || undefined} data-at={top ? 'top' : undefined} aria-hidden={!show}>
      <button type="button" className="st-invite__go" tabIndex={show ? 0 : -1} aria-label="הפעלת המוזיקה" onClick={() => source.turnOn()}>
        <span className="st-invite__eq" aria-hidden="true"><i /><i /><i /><i /><i /></span>
        <span className="st-invite__txt" lang="en" dir="ltr">
          <span className="st-invite__t">Tap anywhere for music</span>
          <span className="st-invite__s">{track}</span>
        </span>
      </button>
      <button type="button" className="st-invite__x" tabIndex={show ? 0 : -1} aria-label="בלי מוזיקה" onClick={() => { declined = true; setShow(false) }}>×</button>
    </div>
  )
}
