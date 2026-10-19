// sea · the sound's one control (D137), in the header pill on every page: on by default (the sound waits
// for the visitor's first gesture), a press turns the soundscape off or on again (aria-pressed). Four
// equaliser bars: flat when off, standing when armed, breathing while it plays (still under reduced
// motion). [קופי: נתי] the label.
import { useSyncExternalStore } from 'react'
import * as sound from './sound'

export default function SoundToggle() {
  const on = useSyncExternalStore(sound.onChange, sound.isOn, () => false)
  const live = useSyncExternalStore(sound.onChange, sound.isRunning, () => false)
  return (
    <button
      type="button"
      className="mw-head__sound"
      aria-pressed={on}
      data-live={live ? '' : undefined}
      aria-label="צליל רקע"
      data-cursor={on ? 'כיבוי הצליל' : 'הפעלת צליל'}
      onClick={() => sound.toggle()}
    >
      <span className="sea-eq" aria-hidden="true"><i /><i /><i /><i /></span>
    </button>
  )
}
