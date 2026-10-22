// A light tap under the finger when one of the site's buttons goes down (Android; nothing elsewhere).
// The buttons say so by carrying their brackets (.btn-br) or a ring of dots (.dot-ring).
let on = false
export function listenHaptics() {
  if (on || typeof navigator === 'undefined' || !('vibrate' in navigator)) return
  on = true
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch') return
    if (document.documentElement.classList.contains('disable-animations')) return
    const b = (e.target as Element | null)?.closest?.('a, button')
    if (b?.querySelector('.btn-br, .dot-ring')) { try { navigator.vibrate(7) } catch { /* not allowed yet */ } }
  }, { passive: true, capture: true })
}
