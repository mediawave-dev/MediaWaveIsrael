/**
 * Spotlight hover for `.spotlight-card` surfaces: a soft sky glow that follows
 * the pointer INSIDE the card (CSS radial-gradient driven by --sx/--sy).
 *
 * Contained-Hover Rule: nothing moves or grows toward a neighbour; the effect is
 * a pseudo-element clipped to the card's own radius. One passive listener for
 * the whole document, coalesced to one style write per frame. Pointer-only:
 * touch devices never pay for it, and the site's accessibility switch turns the
 * pseudo-element off in CSS (html.disable-animations).
 */
export function installSpotlight(): () => void {
  if (typeof window === 'undefined') return () => {}
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {}

  let frame = 0
  let pending: { el: HTMLElement; x: number; y: number } | null = null

  const paint = () => {
    frame = 0
    if (!pending) return
    const { el, x, y } = pending
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--sx', `${Math.round(x - rect.left)}px`)
    el.style.setProperty('--sy', `${Math.round(y - rect.top)}px`)
  }

  const onMove = (event: PointerEvent) => {
    const target = event.target as Element | null
    const card = target?.closest<HTMLElement>('.spotlight-card')
    if (!card) return
    pending = { el: card, x: event.clientX, y: event.clientY }
    if (!frame) frame = requestAnimationFrame(paint)
  }

  document.addEventListener('pointermove', onMove, { passive: true })
  return () => {
    document.removeEventListener('pointermove', onMove)
    if (frame) cancelAnimationFrame(frame)
  }
}
