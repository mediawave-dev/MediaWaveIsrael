// The visitor's site on air (D217): one frame of the real style studio (/styles/?preview=1), kept in one
// place in the page for the whole visit (moving an iframe in the DOM reloads it), and laid over whatever
// slot the step gives it: the wall's front screen, or the whole screen when the style is chosen. It
// loads while the visitor types their name, so the wall opens on a live world. Words and worlds go to it
// by postMessage (studio/preview.ts); it shows only once the world asked for is painted.
import { useEffect, useRef, useState } from 'react'
import type { StyleId } from '../studio/styles-meta'

/** The frame's own viewport: a phone, so every world lays out as it does on one. */
export const AIR_W = 390
export const AIR_H = 844

/** Where the frame sits: in the page (absolute inside main) on the wall, on the screen (fixed) once chosen. */
export interface Slot { x: number; y: number; w: number; r: number; animate?: boolean; fixed?: boolean }
export interface Words { name: string; field: string; line: string }
export interface Ready { style: StyleId; h1?: { top: number; bottom: number } }

/** The frame's address carries the world and the trade only: the visitor's own words reach it by message
    (nothing they typed is in a request, a log or a referrer). */
function srcFor(style: StyleId, w: Words) {
  const q = new URLSearchParams({ preview: '1', s: style, field: w.field })
  // the site's motion switches reach the frame too: ?calm=1, ?reduce=1 and the accessibility widget's stop
  const here = new URLSearchParams(window.location.search)
  const html = document.documentElement.classList
  if (here.get('calm') === '1') q.set('calm', '1')
  if (here.get('reduce') === '1' || html.contains('disable-animations') || html.contains('motion-reduced')) q.set('reduce', '1')
  return `/styles/?${q.toString()}`
}

export default function Air({ style, words, slot, show, onReady }: {
  style: StyleId
  words: Words
  /** where the frame sits now (null: not placed yet, kept out of sight) */
  slot: Slot | null
  /** the step wants it seen (it still waits for its world to be ready) */
  show: boolean
  onReady: (r: Ready) => void
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  // the first world and words go in the address; later ones by message
  const [src] = useState(() => srcFor(style, words))
  const [live, setLive] = useState<{ style: StyleId; name: string } | null>(null)
  const ready = useRef(onReady)
  ready.current = onReady
  const post = (msg: object) => frame.current?.contentWindow?.postMessage(msg, window.location.origin)
  // what the frame should show now, for its hello and for checking its ready
  const want = useRef({ words, style })
  want.current = { words, style }

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return
      const m = e.data as { type?: string; style?: StyleId; name?: string; h1?: Ready['h1'] }
      const now = want.current
      // listening now: words sent before it was (while it loaded) were lost, so they go again
      if (m?.type === 's60:hello') {
        post({ type: 's60:hero', ...now.words })
        post({ type: 's60:show', style: now.style })
        return
      }
      if (m?.type !== 's60:ready' || !m.style) return
      // painted with an older name: send the words again and wait for the next ready
      if (m.name !== now.words.name) { post({ type: 's60:hero', ...now.words }); return }
      setLive({ style: m.style, name: m.name })
      ready.current({ style: m.style, h1: m.h1 })
    }
    window.addEventListener('message', on)
    return () => window.removeEventListener('message', on)
  }, [])  
  // each keystroke would repaint the world and fit the name again: the words go once the typing rests,
  // a world once the arrows rest
  useEffect(() => {
    const id = window.setTimeout(() => post({ type: 's60:hero', ...words }), 150)
    return () => clearTimeout(id)
  }, [words.name, words.field, words.line]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const id = window.setTimeout(() => post({ type: 's60:show', style }), 90)
    return () => clearTimeout(id)
  }, [style])  


  const k = slot ? slot.w / AIR_W : 1
  const on = show && !!slot && live?.style === style && live.name === words.name
  return (
    <div
      className="s60-air"
      data-on={on || undefined}
      data-animate={slot?.animate || undefined}
      data-fixed={slot?.fixed || undefined}
      aria-hidden="true"
      style={{
        transform: slot ? `translate3d(${slot.x}px, ${slot.y}px, 0) scale(${k})` : 'translate3d(-200vw, 0, 0)',
        ['--air-r' as string]: `${(slot?.r ?? 0) / k}px`,
      }}
    >
      {/* inert: a picture of the visitor's site, not a page to tab through; the wall under it takes the touch */}
      <iframe ref={frame} className="s60-air__frame" src={src} title="האתר שלכם" width={AIR_W} height={AIR_H} tabIndex={-1} {...{ inert: '' }} />
    </div>
  )
}
