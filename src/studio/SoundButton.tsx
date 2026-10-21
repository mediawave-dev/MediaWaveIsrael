// The sound switch (D190): four small bars, dots when off, a wave that follows the music when on (Léo's
// equaliser). Off, it sits in the top bar and scrolls away with it (nothing floats over the worlds); on, it
// docks small in the corner, because a playing sound must always have a visible way to stop it.
import { useEffect, useRef, useState } from 'react'
import { isSoundOn, onSoundChange, setSoundOn, soundLevel } from './sound'

export default function SoundButton() {
  const [on, setOn] = useState(isSoundOn())
  const bars = useRef<HTMLSpanElement[]>([])
  useEffect(() => onSoundChange(setOn), [])
  useEffect(() => {
    let raf = 0
    let amt = 0
    let lv: () => number = () => 0
    if (on) void soundLevel().then((f) => { lv = f })
    const tick = (t: number) => {
      amt += ((on ? 1 : 0) - amt) * 0.08
      const l = on ? 0.35 + lv() * 1.1 : 0
      bars.current.forEach((b, i) => { if (b) b.style.transform = `scaleY(${(((Math.sin(t * 0.006 + i * 1.3) + 1) / 2) * amt * (0.55 + l) + 0.12).toFixed(3)})` })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on])
  return (
    <button type="button" className="st-sound" aria-pressed={on} aria-label={on ? 'השתקת המוזיקה' : 'הפעלת מוזיקה'} onClick={() => void setSoundOn(!on)}>
      <span className="st-sound__bars" aria-hidden="true">{[0, 1, 2, 3].map((i) => <i key={i} ref={(el) => { if (el) bars.current[i] = el }} />)}</span>
      <span className="st-sound__k" lang="en" dir="ltr" aria-hidden="true">{on ? 'Sound on' : 'Sound'}</span>
    </button>
  )
}
