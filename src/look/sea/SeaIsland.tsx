// sea · the header that does not follow you (Nati, 20.10: "no top menu that keeps following the scroll;
// let the visitor choose whether it shows"). At the top of every page the title pill is whole. Past the
// opening it folds into an island: only the mark in dots (SeaWay), small, at the top centre. It speaks
// only when something changes: entering a chapter, it opens just wide enough for the chapter's line,
// says it, and folds again. A tap on the island opens the whole pill (the menu, the sound, the
// accessibility panel) and a pin keeps it open for the rest of the visit; scrolling on closes it.
// Keyboard: tabbing into the header opens it (focus-within), so every control stays reachable.
// Gate `head` (lab.ts): island, away (the pill scrolls away and comes back when you scroll up),
// sticky (the pill follows, as before). [קופי: נתי] the labels.
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { opt } from './lab'

const PIN = 'mw-sea-pin'
const SPEAK_MS = 2600

export default function SeaIsland() {
  const head = opt('head')
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(() => { try { return sessionStorage.getItem(PIN) === '1' } catch { return false } })
  const openAt = useRef(0)
  const measure = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const html = document.documentElement.classList
    html.add(`sea-head-${head}`)
    let lastY = window.scrollY
    let upFor = 0
    let speakT = 0
    let pending = 0
    // (D199) the scroll position and the screen's height are read in the scroll event (layout is clean
    // there): read in the frame, after the scroll scenes wrote their styles, they forced a layout each frame
    let sy = window.scrollY
    let vh = window.innerHeight
    const update = () => {
      pending = 0
      const y = sy
      const under = y > vh * 0.35
      html.toggle('sea-under', under)
      if (head === 'island') {
        if (open && Math.abs(y - openAt.current) > 360) setOpen(false)
        html.toggle('sea-fold', under && !pinned && !open)
      }
      if (head === 'away') {
        // it comes back after a deliberate scroll up, and goes on the way down
        upFor = y < lastY ? upFor + (lastY - y) : 0
        html.toggle('sea-gone', under && upFor < 60 && y > lastY - 1)
      }
      lastY = y
    }
    const onScroll = () => { sy = window.scrollY; vh = window.innerHeight; if (!pending) pending = requestAnimationFrame(update) }
    // a new chapter: the island opens just wide enough to say its line, then folds again
    const onWay = (e: Event) => requestAnimationFrame(() => requestAnimationFrame(() => speak((e as CustomEvent<string>).detail)))
    const speak = (line: string) => {
      if (!html.contains('sea-fold') || !measure.current) return
      measure.current.textContent = line
      // on the bar that uses it: on the html element it restyled the whole page at every chapter
      document.querySelector<HTMLElement>('.mw-head__bar')?.style.setProperty('--speak-w', `${Math.ceil(measure.current.offsetWidth)}px`)
      html.add('sea-speak')
      window.clearTimeout(speakT)
      speakT = window.setTimeout(() => html.remove('sea-speak'), SPEAK_MS)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) setOpen(false) }
    const onDown = (e: PointerEvent) => { if (open && !(e.target as Element | null)?.closest?.('.mw-head, .mw-menu')) setOpen(false) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('sea:way', onWay)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      cancelAnimationFrame(pending)
      window.clearTimeout(speakT)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('sea:way', onWay)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
      html.remove(`sea-head-${head}`, 'sea-fold', 'sea-speak', 'sea-gone', 'sea-under', 'sea-open')
    }
  }, [head, open, pinned, pathname])

  useEffect(() => { document.documentElement.classList.toggle('sea-open', open) }, [open])
  useEffect(() => { document.documentElement.classList.toggle('sea-pinned', pinned) }, [pinned])

  if (head !== 'island') return null
  return (
    <>
      {/* a pointer's way in; the keyboard opens the header by tabbing into it */}
      <button
        type="button"
        className="sea-island__open"
        tabIndex={-1}
        aria-hidden="true"
        data-cursor="לפתוח את התפריט"
        // on the press, not the click: the island grows under the finger before the click would land
        // it stays a moment longer to take the click that follows, so the tap never lands on the home link
        onPointerDown={(e) => {
          e.preventDefault()
          openAt.current = window.scrollY
          setOpen(true)
          const html = document.documentElement.classList
          html.add('sea-swallow')
          window.setTimeout(() => html.remove('sea-swallow'), 500)
        }}
        onClick={(e) => e.preventDefault()}
      />
      <button
        type="button"
        className="sea-island__pin"
        aria-pressed={pinned}
        aria-label={pinned ? 'לשחרר את הכותרת' : 'להשאיר את הכותרת פתוחה'}
        data-cursor={pinned ? 'לשחרר' : 'להשאיר פתוח'}
        onClick={() => {
          const next = !pinned
          setPinned(next)
          try { sessionStorage.setItem(PIN, next ? '1' : '0') } catch { /* private mode */ }
          if (!next) setOpen(false)
        }}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <circle cx="8" cy="4" r="2.4" />
          <circle cx="8" cy="9" r="1.1" /><circle cx="8" cy="11.6" r="0.9" /><circle cx="8" cy="14" r="0.7" />
          <circle cx="5" cy="7" r="0.8" /><circle cx="11" cy="7" r="0.8" />
        </svg>
      </button>
      <span ref={measure} className="sea-way__line sea-island__measure" aria-hidden="true" />
    </>
  )
}
