// shot · the key, "המקש" (DECISIONS #87; lab: design/ideas/buttons/keycap.html). Every button is a
// key from the keyboard on Nati's desk, mostly Enter: the key that runs, sends and confirms. Press
// it and it really goes all the way down. The Hebrew label is the Hebrew legend (bottom-right, as
// on an Israeli keyboard); "Enter" is the Latin legend (top-left), next to a caps-lock style LED.
// Layers, one owner each: .key__shadow opacity, .key__skirt static, .key__cap transform,
// .key__render clip-path (loading: an inverted copy of the face, so the label is never hidden).
// Loading counts real frames at 25 fps (PAL) in the legend; sent latches 2px down with the LED on.
// Tone: ink (lg, block) or paper (sm, the header) by default; `tone` or className="key--paper" picks.

import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { StateButton, type BtnState, type LookButtonProps, type Pointer } from './StateButton'
import './key-button.css'
import WaDots from '../sea/WaDots'
import DotRing from '../parts/DotRing'

export type KeyTone = 'ink' | 'paper'

export interface KeyButtonProps extends LookButtonProps {
  /** ink cap with paper legends, or a paper cap with ink legends. Default: paper for sm, ink otherwise. */
  tone?: KeyTone
  /** what the ink face says (D121): where the key goes. Default by destination; the label when unknown. */
  next?: ReactNode
}


/** A WhatsApp key shows, in the cursor's label (D136, D140), the very message the link will put in the
    chat, so the visitor sees what they are about to send instead of "opens WhatsApp". */
const waPreview = (href?: string) => {
  try { return href ? new URL(href).searchParams.get('text') : null } catch { return null }
}

/** The ink spreads from where the pointer came in: the first point after a leave, as % of the key. */
const inkFrom = (el: HTMLElement, p: Pointer | null) => {
  if (!p) { el.removeAttribute('data-in'); return }
  if (el.hasAttribute('data-in')) return
  el.setAttribute('data-in', '')
  el.style.setProperty('--kx', `${(p.x * 100).toFixed(1)}%`)
  el.style.setProperty('--ky', `${(p.y * 100).toFixed(1)}%`)
}

/** A quick tap still reads as a key that went down (the lab's minimum hold). */
const PRESS_HOLD_MS = 90
/** One PAL frame: 25 fps. */
const FRAME_MS = 40

const pad = (n: number) => String(n).padStart(2, '0')
/** MM:SS:FF at 25 fps. */
export const timecode = (f: number) => `${pad(Math.floor(f / 1500))}:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`

/** Reduced motion, the site's calm and stop switches, or ?reduce=1 (html.motion-reduced): the counter
 *  steps once a second instead of 25 times. Read on every frame, so a switch flipped mid-render applies. */
const calm = (mq: MediaQueryList) => {
  const html = document.documentElement.classList
  return mq.matches || html.contains('disable-animations') || html.contains('motion-reduced') || html.contains('motion-calm')
}

/** Write without replacing the text node React owns. */
const writeText = (el: HTMLElement | null, s: string) => {
  if (!el) return
  if (el.firstChild) el.firstChild.nodeValue = s
  else el.textContent = s
}

/** Count real elapsed frames while loading; write only when the shown frame changes. */
function useTimecode(state: BtnState, nodes: RefObject<HTMLSpanElement>[]) {
  useEffect(() => {
    if (state !== 'loading') return
    const write = (s: string) => nodes.forEach((n) => writeText(n.current, s))
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const t0 = performance.now()
    let last = 0
    let raf = 0
    const tick = () => {
      const f = Math.floor((performance.now() - t0) / FRAME_MS)
      const shown = calm(mq) ? f - (f % 25) : f
      if (shown !== last) { last = shown; write(timecode(shown)) }
      raf = requestAnimationFrame(tick)
    }
    write(timecode(0))
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); write(timecode(0)) }
  }, [state, nodes])
}

// ↵ as printed on the Enter key. It points left, which is "forward" in RTL, so it is not mirrored.
const EnterGlyph = () => (
  <svg className="key__glyph" viewBox="0 0 12 10" aria-hidden="true" focusable="false">
    <path d="M10.6 1v4.6H1.8M4.4 3 1.8 5.6l2.6 2.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const CheckGlyph = () => (
  <svg className="key__glyph" viewBox="0 0 12 10" aria-hidden="true" focusable="false">
    <path d="M1.5 5.4 4.4 8.2 10.5 1.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// where the key goes, printed in the legend: WhatsApp (leaves the site), down the page, or Enter
const WaGlyph = () => (
  <svg className="key__glyph key__glyph--wa" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M6 1.2a4.8 4.8 0 0 0-4.1 7.3L1.3 10.7l2.3-.6A4.8 4.8 0 1 0 6 1.2Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
)
const DownGlyph = () => (
  <svg className="key__glyph" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M6 1.5v8.4M2.6 6.6 6 10l3.4-3.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
type Dest = 'wa' | 'down' | 'enter'
const destOf = (href?: string): Dest => (!href ? 'enter' : href.includes('wa.me') ? 'wa' : href.startsWith('#') || href.startsWith('/#') ? 'down' : 'enter')

/** One print of the face: the label and the aria-hidden Latin legend. Stamped twice (face, render). */
function KeyPrint({ label, tc, dest = 'enter' }: { label: ReactNode; tc: RefObject<HTMLSpanElement>; dest?: Dest }) {
  return (
    <>
      <span className="key__label"><span className="key__mark" aria-hidden="true">!</span>{dest === 'wa' && <WaDots className="key__dest" />}{label}</span>
      <span className="key__legend" aria-hidden="true">
        <span className="key__led" />
        <span className="lg-rest">{dest === 'wa' ? <WaGlyph /> : dest === 'down' ? <DownGlyph /> : <><span className="lg-word">Enter</span><EnterGlyph /></>}</span>
        <span className="lg-run"><span className="key__tc" ref={tc}>00:00:00</span></span>
        <span className="lg-done"><CheckGlyph /></span>
      </span>
    </>
  )
}

export function KeyButton({ tone, next, className = '', ...props }: KeyButtonProps) {
  const faceTc = useRef<HTMLSpanElement>(null)
  const renderTc = useRef<HTMLSpanElement>(null)
  const inkTc = useRef<HTMLSpanElement>(null)
  const dest = destOf(props.href)
  const nodes = useRef([faceTc, renderTc]).current
  useTimecode(props.state ?? 'idle', nodes)
  const paper = (tone ?? (props.size === 'sm' ? 'paper' : 'ink')) === 'paper'

  return (
    <StateButton
      {...props}
      className={`${paper ? 'key--paper ' : ''}${className}`.trim()}
      cls="key"
      pressHold={PRESS_HOLD_MS}
      spaceOnLink={false}
      onPoint={inkFrom}
      render={(label) => (
        <>
          <span className="key__shadow" aria-hidden="true" />
          <span className="key__skirt" aria-hidden="true" />
          <span className="key__cap" data-cursor={dest === 'wa' ? waPreview(props.href) ?? undefined : undefined}>
            <KeyPrint label={label} tc={faceTc} dest={dest} />
            <span className="key__ink" aria-hidden="true">
              <KeyPrint label={next ?? label} tc={inkTc} dest={dest} />
            </span>
            <span className="key__render" aria-hidden="true">
              <KeyPrint label={label} tc={renderTc} dest={dest} />
            </span>
            <DotRing inset={2.2} />
          </span>
        </>
      )}
    />
  )
}
