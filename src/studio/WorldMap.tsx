// The map of worlds (D189): what the guide and the bar's "Worlds" button open. Five living previews (D215)
// (filmed from each world), the one you are in marked, and the way to say "this one" on WhatsApp. A real
// dialog: focus moves in, Escape and the close button leave, focus returns to what opened it.
import { useEffect, useRef } from 'react'
import './portal.css'
import { STYLES, type StyleDef } from './registry'
import { waForStyle } from './lead'
import { track } from '../utils/analytics'

/** `current`: the world you are in (the studio); none on the main site, where the map is the invitation. */
export default function WorldMap({ current, onClose, onPick, onHome }: { current: StyleDef | null; onClose: () => void; onPick: (s: StyleDef, at: { x: number; y: number }) => void; onHome?: (e: { preventDefault: () => void }) => void }) {
  const box = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null
    close.current?.focus({ preventScroll: true })
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab' || !box.current) return
      const f = [...box.current.querySelectorAll<HTMLElement>('button, a[href]')]
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', key)
    document.documentElement.classList.add('wm-open')
    return () => { document.removeEventListener('keydown', key); document.documentElement.classList.remove('wm-open'); back?.focus?.({ preventScroll: true }) }
  }, [onClose])

  return (
    <div className="wm" ref={box} role="dialog" aria-modal="true" aria-labelledby="wm-t" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="wm__panel">
        <header className="wm__head">
          <p className="wm__k" lang="en" dir="ltr">( Choose a world )</p>
          {/* [קופי: נתי] */}
          <h2 id="wm-t" className="wm__t">לאיזה עולם עוברים?</h2>
          {/* [קופי: נתי] on the main site the map explains itself in one line */}
          {!current && <p className="wm__sub">אותו אתר בחמישה סגנונות. בוחרים עולם, והאתר משתנה מול העיניים.</p>}
          <button type="button" className="wm__x" ref={close} onClick={onClose} aria-label="סגירה">×</button>
        </header>
        <ul className="wm__grid">
          {STYLES.map((s, i) => {
            const here = s.id === current?.id
            return (
              <li key={s.id} style={{ ['--i' as string]: i }}>
                <button
                  type="button"
                  className="wm__world"
                  aria-current={here || undefined}
                  aria-label={`${s.name}: ${s.feel}${here ? ' (העולם הנוכחי)' : ''}`}
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect()
                    if (here) { onClose(); return }
                    onPick(s, { x: r.left + r.width / 2, y: r.top + r.height / 2 })
                  }}
                >
                  <span className="wm__pic" aria-hidden="true">
                    <img src={`/media/styles/${s.id}.webp`} width={360} height={640} alt="" />
                    <video src={`/media/styles/${s.id}.mp4`} muted loop playsInline autoPlay preload="auto" onPlaying={(e) => { e.currentTarget.dataset.on = '1' }} />
                  </span>
                  <span className="wm__meta" aria-hidden="true">
                    <span className="wm__n">0{i + 1}</span>
                    <span className="wm__name">{s.name}</span>
                    {here && <span className="wm__here" lang="en" dir="ltr">You are here</span>}
                    <span className="wm__by">{s.feel}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        {/* [קופי: נתי] (D217) the same worlds with the visitor's own name in them */}
        <a className="wm__home wm__own" href="/your-site/" onClick={() => track('cta_click', { location: `worldmap_yoursite${current ? `_${current.id}` : ''}` })}>
          <span className="wm__home-k" lang="en" dir="ltr">( Your site )</span>
          <span>האתר שלכם ב-60 שניות</span>
        </a>
        {/* [קופי: נתי] the way back to the sea of dots, in the studio's map (D199) */}
        {current && onHome && (
          <a className="wm__home" href="/" onClick={onHome}>
            <span className="wm__home-k" lang="en" dir="ltr">( Home )</span>
            <span>חזרה לאתר הראשי</span>
          </a>
        )}
        {current && (
          <a className="wm__want" href={waForStyle(current)} target="_blank" rel="noopener noreferrer"
            onClick={() => track('cta_click', { location: `styles_want_${current.id}` })}>
            {/* [קופי: נתי] */}
            אני רוצה את העולם הזה <span aria-hidden="true">←</span>
          </a>
        )}
      </div>
    </div>
  )
}
