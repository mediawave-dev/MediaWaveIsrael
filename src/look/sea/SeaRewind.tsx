// sea · S5 (D122): back to the top plays the page backwards like a tape. The scroll runs back through
// every chapter (the reels unwind, the laptop's picture breaks into dots and its lid closes, the disc
// returns), the field's rows slip like a deck's tracking, and a REW counter runs down. The chapter ends
// on the Horizon disc, where the page began. Still and calm: an instant jump, focus on the H1.
import { useRef, useState } from 'react'
import { useMotionEngine } from '../../motion/ScrollEngineProvider'
import { track } from '../../utils/analytics'
import { isCalm, isStill } from '../wave/clock'
import * as field from './field'
import { Tag } from './parts'
import * as sound from './sound'

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function SeaRewind() {
  const engine = useMotionEngine()
  const [on, setOn] = useState(false)
  const count = useRef<HTMLSpanElement>(null)

  const go = () => {
    track('cta_click', { placement: 'rewind' })
    const focusTop = () => document.getElementById('hero-title')?.focus({ preventScroll: true })
    if (isStill() || isCalm() || !engine) { window.scrollTo(0, 0); focusTop(); return }
    const from = window.scrollY
    const duration = Math.min(2.2, 0.9 + from / 9000)
    setOn(true)
    field.set({ rew: 1 })
    sound.rewind(duration)
    const tick = () => {
      if (count.current) count.current.textContent = String(Math.round(window.scrollY / 8)).padStart(4, '0')
      if (window.scrollY > 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    const done = () => { field.set({ rew: 0 }); window.setTimeout(() => setOn(false), 300) }
    engine.scrollTo(0, { duration, easing: easeInOut, onComplete: () => { done(); focusTop() } } as never)
    window.setTimeout(done, duration * 1000 + 900)
  }

  return (
    <div className="sea-end">
      <span className="sea-spot sea-spot--end" data-spot="horizon" aria-hidden="true" />
      <Tag>END OF TAPE</Tag>
      <button type="button" className="sea-rew" onClick={go} data-cursor="◀◀ REW">
        <svg viewBox="0 0 20 12" aria-hidden="true" focusable="false"><path d="M10 1 1 6l9 5zM19 1l-9 5 9 5z" /></svg>
        חזרה להתחלה
      </button>
      <div className={`sea-rew__hud${on ? ' is-on' : ''}`} aria-hidden="true">◀◀ REW <span ref={count}>0000</span></div>
    </div>
  )
}
