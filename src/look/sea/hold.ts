// sea · the hero's hold, released. The hero is pinned for a stretch of scroll (the focus pull, or the pen's sheet
// taking the stage); where that cannot run (no motion, no WebGL, a hero taller than the screen) the stretch leaves
// the page, and the reader stays where they were.

/** The pinned hero goes back to a plain one: the hold's scroll length leaves the page, and the reader's place on it
    is kept (where the browser's own scroll anchoring has not already kept it). */
export function releaseHold(wrap: HTMLElement, hero: HTMLElement) {
  if (wrap.classList.contains('is-plain')) return
  const pin = parseFloat(getComputedStyle(hero).top) || 0
  const gone = Math.max(0, pin - wrap.getBoundingClientRect().top)
  const after = wrap.nextElementSibling
  const was = after?.getBoundingClientRect().top ?? 0
  wrap.classList.add('is-plain')
  const rose = was - (after?.getBoundingClientRect().top ?? 0)
  if (gone > 0 && rose > 0) window.scrollBy(0, -Math.min(gone, rose))
  window.dispatchEvent(new Event('resize')) // the chapters below measured themselves with the pin
}
