// shot · the shared paper between pages (cross-document view transitions, D91). The service page's
// hero sheet and hero object carry their names statically (svc-<id>, svc-obj-<id>), and the work
// sample's film print carries film-<slug> on both pages. On the page the visitor leaves, nothing is
// named until the moment of the tap: in `pageswap` only the paper that was tapped (the home label
// and its object, or a small object in a service page's strip) gets the matching names, so exactly
// one paper becomes the next page and nothing else streaks across the screen (critic M1 F2). Where
// View Transitions are not supported, or under reduced motion, the link is an ordinary page load.
export const vt = {
  sheet: (id: string) => ({ viewTransitionName: `svc-${id}` }),
  obj: (id: string) => ({ viewTransitionName: `svc-obj-${id}` }),
  film: (slug: string) => ({ viewTransitionName: `film-${slug}` }),
}

/** Marks for the paper that may become a page: named only at the tap (see onPageSwap). */
export const vtMark = {
  sheet: (id: string) => ({ 'data-vt-sheet': id }),
  obj: (id: string) => ({ 'data-vt-obj': id }),
  /** on the link: which service id the tap leads to */
  to: (id: string) => ({ 'data-vt-to': id }),
}

const NAMED = '[data-vt-sheet], [data-vt-obj]'

function clearNames() {
  document.querySelectorAll<HTMLElement>(NAMED).forEach((el) => { el.style.viewTransitionName = '' })
}

interface SwapEvent extends Event {
  viewTransition: unknown
  activation?: { entry?: { url?: string } } | null
}

function onPageSwap(event: Event) {
  const e = event as SwapEvent
  clearNames()
  const url = e.activation?.entry?.url
  if (!e.viewTransition || !url) return
  let path: string
  try { path = new URL(url).pathname.replace(/\/$/, '') } catch { return }
  const link = [...document.querySelectorAll<HTMLAnchorElement>('a[data-vt-to]')].find((a) => a.pathname.replace(/\/$/, '') === path)
  const id = link?.dataset.vtTo
  if (!id) return
  document.querySelector<HTMLElement>(`[data-vt-sheet="${id}"]`)?.style.setProperty('view-transition-name', `svc-${id}`)
  document.querySelector<HTMLElement>(`[data-vt-obj="${id}"]`)?.style.setProperty('view-transition-name', `svc-obj-${id}`)
}

// once per document, from whichever chunk loads first (the home's tool row or a service page)
if (typeof window !== 'undefined') {
  const w = window as unknown as { __mwVt?: boolean }
  if (!w.__mwVt) {
    w.__mwVt = true
    window.addEventListener('pageswap', onPageSwap)
    // a page restored from the back-forward cache keeps no stale names
    window.addEventListener('pageshow', (e) => { if ((e as PageTransitionEvent).persisted) clearNames() })
  }
}
