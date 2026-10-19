// sea · the cursor's label (Lama Lama's structure, our words): a small mono tag in brackets that goes
// with a fine pointer and says what the thing under it does ([data-cursor] on the element). It never
// replaces the pointer and is aria-hidden: every target says the same in its own text or label.
// Off on touch, under ?reduce=1 and with the widget's stop switch; under OS reduced motion it follows
// without easing. [קופי: נתי] every data-cursor string.
import { useEffect, useRef } from 'react'
import { tier } from './field'
import { decode } from './decode'

export default function SeaCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const mode = tier()
    if (!el || mode === 'still' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const pos = { x: 0, y: 0, tx: 0, ty: 0 }
    let raf = 0
    let shown = ''
    const k = mode === 'calm' ? 1 : 0.22
    const loop = () => {
      pos.x += (pos.tx - pos.x) * k
      pos.y += (pos.ty - pos.y) * k
      el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`
      raf = Math.abs(pos.tx - pos.x) + Math.abs(pos.ty - pos.y) > 0.3 ? requestAnimationFrame(loop) : 0
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const t = (e.target as Element | null)?.closest?.<HTMLElement>('[data-cursor]')
      const label = document.documentElement.classList.contains('disable-animations') ? '' : t?.dataset.cursor ?? ''
      if (label !== shown) {
        shown = label
        if (label) void decode(el, label)
        el.classList.toggle('is-on', Boolean(label))
        if (label && !el.dataset.placed) { pos.x = e.clientX + 18; pos.y = e.clientY + 22; el.dataset.placed = '1' }
      }
      pos.tx = e.clientX + 18
      pos.ty = e.clientY + 22
      if (!label) delete el.dataset.placed
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const leave = () => { shown = ''; el.classList.remove('is-on') }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <div ref={ref} className="sea-cursor" aria-hidden="true" />
}
