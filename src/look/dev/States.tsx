// Dev only (/states?look=k|m|km): the look's button family in its seven states, plus a live
// one that runs idle -> loading -> sent | error. KM shows both grounds. Never built.

import { useEffect, useRef, useState } from 'react'
import { LookButton } from '@look/button'
import { LOOK } from '../look'
import type { BtnForce, BtnState } from '../buttons/StateButton'
import './states.css'

const STRIP: { label: string; state: BtnState; force?: BtnForce; disabled?: boolean }[] = [
  { label: 'מנוחה', state: 'idle' },
  { label: 'ריחוף', state: 'idle', force: 'hover' },
  { label: 'לחיצה', state: 'idle', force: 'pressed' },
  { label: 'פוקוס מקלדת', state: 'idle', force: 'focus' },
  { label: 'שולח', state: 'loading' },
  { label: 'נשלח', state: 'sent' },
  { label: 'שגיאה', state: 'error' },
  { label: 'מושבת', state: 'idle', disabled: true },
]

function Live() {
  const [state, setState] = useState<BtnState>('idle')
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const run = (fail: boolean) => {
    timers.current.forEach(clearTimeout)
    setState('loading')
    timers.current = [
      window.setTimeout(() => setState(fail ? 'error' : 'sent'), 1500),
      window.setTimeout(() => setState('idle'), 4600),
    ]
  }
  return (
    <div className="st__live">
      <LookButton type="button" state={state} live onClick={() => state === 'idle' && run(false)}>שליחת הודעה</LookButton>
      <button type="button" className="st__fail" onClick={() => run(true)}>להדגים שגיאה</button>
    </div>
  )
}

function Ground({ theme }: { theme?: 'dark' | 'light' }) {
  return (
    <section className="st" data-theme={theme}>
      <h1>{LOOK === 'k' ? 'כפתור המוצר' : LOOK === 'shot' ? 'המקש' : 'העדשה'}{theme ? (theme === 'dark' ? ' · במה' : ' · חלל') : ''}</h1>
      <Live />
      <ul className="st__strip">
        {STRIP.map((s) => (
          <li key={s.label}>
            <LookButton state={s.state} force={s.force} disabled={s.disabled}>בואו נדבר על הפרויקט שלכם</LookButton>
            <span>{s.label}</span>
          </li>
        ))}
        <li><LookButton size="sm">בואו נדבר</LookButton><span>קטן (כותרת)</span></li>
        <li><LookButton block>שליחת הודעה</LookButton><span>ברוחב מלא (טופס)</span></li>
        {LOOK === 'shot' && STRIP.slice(0, 7).map((s) => (
          <li key={`paper-${s.label}`}>
            <LookButton className="key--paper" state={s.state} force={s.force}>צרו קשר</LookButton>
            <span>מקש נייר · {s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function States() {
  useEffect(() => { document.getElementById('static-header')?.remove() }, [])
  return LOOK === 'km' ? <><Ground theme="dark" /><Ground theme="light" /></> : <Ground />
}
