// sun · liquid glass (D275): on a computer, the sheen across a glass button stands where the pointer is, the way light
// moves on Apple's glass (glass.css reads --gx). One listener for the whole page, one write per frame; nothing on touch.
const GLASS = '.btn, .tab, .icon-btn'

export function startGlass() {
  if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  let el: HTMLElement | null = null
  let x = 50
  let raf = 0
  const write = () => { raf = 0; el?.style.setProperty('--gx', `${x.toFixed(1)}%`) }
  window.addEventListener('pointermove', (e) => {
    const t = (e.target as Element | null)?.closest?.(GLASS) as HTMLElement | null
    if (t !== el) { el?.style.removeProperty('--gx'); el = t }
    if (!t) return
    const r = t.getBoundingClientRect()
    x = Math.min(100, Math.max(0, ((e.clientX - r.left) / Math.max(1, r.width)) * 100))
    if (!raf) raf = requestAnimationFrame(write)
  }, { passive: true })
}
