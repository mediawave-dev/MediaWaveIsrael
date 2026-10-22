// The contact form as a window of an old role-playing game (D206, Nati picked "A" of three retro
// directions: "super intuitive, comfortable and experiential"). The form keeps its fields and its logic
// (Contact.tsx); this adds the window's chrome and its two live pieces:
// - the cursor ▶ at the window's start edge: it rests, dimmed, at the first row, and jumps in steps to the
//   row that takes the focus (or, with a mouse, the row under it), with the menu's blip (sound.select);
// - the block caret: while the text caret sits at the end of a field (nearly always while typing) a cream
//   block blinks where the next letter goes, measured on a mirror of the field; solid while typing.
//   Anywhere else (moving inside the text, a selection) the native caret takes over.
// [קופי: נתי] the window's tab "PLAYER 1"
import { useEffect, type RefObject } from 'react'
import { select } from './sound'

const ROWS = '.ct__field, .key'
type Field = HTMLInputElement | HTMLTextAreaElement

const MIRRORED = [
  'boxSizing', 'width', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth',
  'borderBottomWidth', 'borderLeftWidth', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontStretch', 'letterSpacing',
  'lineHeight', 'textTransform', 'textIndent', 'tabSize', 'direction', 'textAlign', 'wordSpacing',
] as const

const isField = (el: Element | null): el is Field => el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement

/** where the next letter goes when the caret is at the end of the field, in the field's own box; null when the
    caret is elsewhere or the spot is scrolled out of sight */
function endCaret(el: Field, mirror: HTMLDivElement): { x: number; y: number; h: number; rtl: boolean } | null {
  const end = el.value.length
  if (el.selectionStart !== end || el.selectionEnd !== end) return null
  const cs = getComputedStyle(el)
  for (const k of MIRRORED) mirror.style[k] = cs[k]
  mirror.style.whiteSpace = el instanceof HTMLTextAreaElement ? 'pre-wrap' : 'pre'
  mirror.textContent = el.value
  const mark = document.createElement('span')
  mark.textContent = '​'
  mirror.appendChild(mark)
  const x = mark.offsetLeft - el.scrollLeft
  const y = mark.offsetTop - el.scrollTop
  const h = mark.offsetHeight
  if (x < 0 || x > el.offsetWidth || y < 0 || y + h > el.offsetHeight) return null
  return { x, y, h, rtl: cs.direction === 'rtl' }
}

/** The window's behaviour, on the form element. Off for every look but the sea's. */
export function useRpgWindow(ref: RefObject<HTMLElement>, on: boolean) {
  useEffect(() => {
    const box = ref.current
    if (!on || !box) return
    const ptr = box.querySelector<HTMLElement>('.rpg__ptr')
    const caret = box.querySelector<HTMLElement>('.rpg__caret')
    if (!ptr || !caret) return
    const mirror = document.createElement('div')
    // fixed and hidden: an absolute mirror off the left edge would widen an RTL page (a sideways scroll)
    Object.assign(mirror.style, { position: 'fixed', top: '0', left: '0', zIndex: '-1', visibility: 'hidden', pointerEvents: 'none', overflowWrap: 'break-word', borderStyle: 'solid', height: 'auto' })
    document.body.appendChild(mirror)
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    // the cursor: one row at a time
    let at: Element | null = null
    const place = (row: Element | null, quiet = false) => {
      if (!row) return
      const target = row.matches('.ct__field') ? row.querySelector('input, textarea') ?? row : row
      const r = target.getBoundingClientRect()
      const b = box.getBoundingClientRect()
      const y = r.top - b.top + Math.min(r.height / 2, 26)
      ptr.style.transform = `translateY(${Math.round(y)}px)`
      if (row !== at && !quiet) select()
      if (row !== at && row.hasAttribute('data-invalid')) {
        ptr.removeAttribute('data-shake')
        void ptr.offsetWidth
        ptr.setAttribute('data-shake', '')
      }
      at = row
    }
    const focusedRow = () => (box.contains(document.activeElement) ? document.activeElement?.closest(ROWS) ?? null : null)
    const rest = () => {
      const row = focusedRow()
      if (row) { ptr.setAttribute('data-on', ''); place(row, true); return }
      ptr.removeAttribute('data-on')
      place(box.querySelector(ROWS), true)
    }

    // the block caret
    let frame = 0
    let typing = 0
    const draw = () => {
      frame = 0
      const el = document.activeElement
      const spot = isField(el) && box.contains(el) ? endCaret(el, mirror) : null
      if (!spot || !isField(el)) {
        caret.removeAttribute('data-on')
        if (isField(el)) el.style.caretColor = ''
        return
      }
      const r = el.getBoundingClientRect()
      const b = box.getBoundingClientRect()
      const size = parseFloat(getComputedStyle(el).fontSize)
      const w = Math.round(size * 0.52)
      const h = Math.round(size * 1.12)
      const x = r.left - b.left + spot.x + (spot.rtl ? -w - 1 : 1)
      const y = r.top - b.top + spot.y + (spot.h - h) / 2
      caret.style.width = `${w}px`
      caret.style.height = `${h}px`
      caret.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`
      caret.setAttribute('data-on', '')
      el.style.caretColor = 'transparent'
    }
    const redraw = () => { if (!frame) frame = requestAnimationFrame(draw) }
    const onInput = () => {
      caret.setAttribute('data-typing', '')
      window.clearTimeout(typing)
      typing = window.setTimeout(() => caret.removeAttribute('data-typing'), 480)
      redraw()
    }
    const onFocusIn = (e: FocusEvent) => {
      ptr.setAttribute('data-on', '')
      place((e.target as Element).closest(ROWS))
      redraw()
    }
    const onFocusOut = (e: FocusEvent) => {
      if (isField(e.target as Element)) (e.target as Field).style.caretColor = ''
      window.setTimeout(() => { rest(); redraw() }, 0)
    }
    const onOver = (e: PointerEvent) => {
      if (!fine || e.pointerType !== 'mouse') return
      const row = (e.target as Element).closest(ROWS)
      if (row && box.contains(row)) { ptr.setAttribute('data-on', ''); place(row) }
    }
    const onLeave = () => { if (fine) rest() }
    const onSelection = () => { if (box.contains(document.activeElement)) redraw() }
    const ro = new ResizeObserver(() => { rest(); redraw() })

    box.addEventListener('focusin', onFocusIn)
    box.addEventListener('focusout', onFocusOut)
    box.addEventListener('input', onInput)
    box.addEventListener('scroll', redraw, true)
    box.addEventListener('pointerover', onOver)
    box.addEventListener('pointerleave', onLeave)
    document.addEventListener('selectionchange', onSelection)
    ro.observe(box)
    rest()
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(typing)
      box.removeEventListener('focusin', onFocusIn)
      box.removeEventListener('focusout', onFocusOut)
      box.removeEventListener('input', onInput)
      box.removeEventListener('scroll', redraw, true)
      box.removeEventListener('pointerover', onOver)
      box.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('selectionchange', onSelection)
      ro.disconnect()
      mirror.remove()
    }
  }, [ref, on])
}

/** The window's chrome: the frame, the tab, the cursor, the block caret and the "more" prompt. */
export function RpgChrome() {
  return (
    <>
      <span className="rpg__frame" aria-hidden="true"><i /></span>
      <span className="rpg__tab" lang="en" aria-hidden="true">PLAYER 1</span>
      <span className="rpg__ptr" aria-hidden="true" />
      <span className="rpg__caret" aria-hidden="true" />
      <span className="rpg__more" aria-hidden="true" />
    </>
  )
}
