// The page's scroll position and the viewport's height for frame loops (D210). Reading window.scrollY or
// innerHeight inside requestAnimationFrame, after another loop has written styles in the same frame, forces
// the browser to recalculate style and layout first; on a phone that was most of a frame. Scroll and resize
// events run before the frame's callbacks, while the layout is still clean, so the values are read there
// once and every loop takes them from here.
let y = 0
let h = 0
let attached = false

function attach() {
  if (attached || typeof window === 'undefined') return
  attached = true
  y = window.scrollY
  h = window.innerHeight
  window.addEventListener('scroll', () => { y = window.scrollY }, { passive: true })
  window.addEventListener('resize', () => { y = window.scrollY; h = window.innerHeight }, { passive: true })
}

/** window.scrollY as of the last scroll event */
export function scrollTop(): number { attach(); return y }
/** window.innerHeight as of the last resize */
export function viewHeight(): number { attach(); return h }

/** html[data-scrolling] while the page scrolls (on at the first scroll event, off 200 ms after the last): small
    endless decorations hold still meanwhile, so nothing keeps the style dirty for the scroll's reads (D210).
    Only the rules that name it are restyled when it flips; an attribute, not a class, so the observers of
    html's classes (the dock, the policy, the tier) are not woken twice a scroll. */
export function markScrolling(): void {
  if (typeof window === 'undefined') return
  const html = document.documentElement
  let t = 0
  window.addEventListener('scroll', () => {
    if (!t) html.setAttribute('data-scrolling', '')
    window.clearTimeout(t)
    t = window.setTimeout(() => { t = 0; html.removeAttribute('data-scrolling') }, 200)
  }, { passive: true })
}
