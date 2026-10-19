// sea · the page turn (harvest lamalama-deep.rtl.md §3 #11, in our material): following a link to
// another page, the field's dots swell out from where the visitor clicked, in the turn's colour, until
// they cover the page, and a tape's timecode runs in the middle while the next page comes; there, the
// dots shrink away from the centre outward. Gate `turn` (lab.ts): cream (the page's inverse), blue
// (the logo's sea), off.
// Two kinds of links: the router's (the header and the footer call turnThen around navigate) and plain
// page loads (the services' rows, links inside the pages), caught here after React has had the click.
// A page reached through a turn starts covered from its first paint (index.html, html.sea-turn-in), so
// the swap never flashes. Only in full motion with the field running: otherwise links behave as always.
// The H1 still paints under the cover, so it stays the LCP.
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import * as field from './field'
import { opt } from './lab'

const KEY = 'mw-sea-turn'
const COL: Record<string, { rgb: [number, number, number]; css: string }> = {
  cream: { rgb: [0.929, 0.906, 0.855], css: '#ede7da' },
  blue: { rgb: [0.475, 0.627, 0.773], css: '#79a0c5' },
}

function enabled(): boolean {
  return opt('turn') !== 'off' && field.tier() === 'full' && field.running()
    && !document.documentElement.classList.contains('disable-animations')
}

let spa = false
let tcStart = 0
let tcEl: HTMLSpanElement | null = null
let tcRaf = 0
const pad = (n: number) => String(n).padStart(2, '0')

/** The timecode runs while the page is covered (25 frames a second, a tape's count). */
function runTc() {
  tcStart = performance.now()
  cancelAnimationFrame(tcRaf)
  const html = document.documentElement.classList
  const tick = () => {
    if (!html.contains('sea-turning') && !html.contains('sea-turn-in')) { tcRaf = 0; return }
    const f = Math.floor(((performance.now() - tcStart) / 1000) * 25)
    if (tcEl) tcEl.textContent = `00:00:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`
    tcRaf = requestAnimationFrame(tick)
  }
  tcRaf = requestAnimationFrame(tick)
}

/** Cover the page from (x, y), then go. Without the turn, go at once. */
export function turnThen(x: number, y: number, go: () => void, kind: 'spa' | 'page') {
  if (!enabled() || document.documentElement.classList.contains('sea-turning')) { go(); return }
  const c = COL[opt('turn')] ?? COL.cream
  const html = document.documentElement
  html.style.setProperty('--turn-c', c.css)
  html.classList.add('sea-turning')
  runTc()
  document.body.style.pointerEvents = 'none'
  void field.turnCover(x, y, c.rgb, 460).then(() => {
    document.body.style.pointerEvents = ''
    if (kind === 'page') {
      try { sessionStorage.setItem(KEY, JSON.stringify({ c: c.css, t: Date.now() })) } catch { /* private mode */ }
      // the cover stays while the next document loads (the old one is gone in a moment)
      go()
      return
    }
    spa = true
    go()
  })
}

/** From a click (or a key, which has no pointer): the turn starts where the visitor acted. */
export function turnFrom(e: { clientX?: number; clientY?: number; currentTarget?: EventTarget | null }) {
  const el = e.currentTarget as HTMLElement | null
  if (e.clientX || e.clientY) return { x: e.clientX ?? 0, y: e.clientY ?? 0 }
  const r = el?.getBoundingClientRect?.()
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
}

export default function SeaTurn() {
  const tc = useRef<HTMLSpanElement>(null)
  const { pathname } = useLocation()
  const first = useRef(true)

  useEffect(() => { tcEl = tc.current; return () => { tcEl = null } }, [])

  // a page reached through the dots: reveal it once the field can draw the cover
  useEffect(() => {
    const html = document.documentElement
    if (!html.classList.contains('sea-turn-in')) return
    try { sessionStorage.removeItem(KEY) } catch { /* private mode */ }
    runTc()
    const css = getComputedStyle(html).getPropertyValue('--turn-c').trim() || '#ede7da'
    const c = Object.values(COL).find((v) => v.css === css) ?? COL.cream
    let done = false
    const fade = () => {
      if (done) return
      done = true
      html.classList.add('sea-turn-fade')
      window.setTimeout(() => html.classList.remove('sea-turn-in', 'sea-turn-fade'), 320)
    }
    const cap = window.setTimeout(fade, 1400)
    void field.ready.then((ok) => {
      if (done) return
      if (!ok || field.tier() !== 'full') { fade(); return }
      done = true
      window.clearTimeout(cap)
      html.classList.add('sea-turning', 'sea-turn-rev')
      // the field draws the full cover first, then the CSS one goes
      void field.turnReveal(c.rgb, 620).then(() => html.classList.remove('sea-turning', 'sea-turn-rev'))
      requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('sea-turn-in')))
    })
    return () => window.clearTimeout(cap)
  }, [])

  // a router turn: the new route has rendered; reveal it
  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (!spa) return
    spa = false
    const c = COL[opt('turn')] ?? COL.cream
    window.setTimeout(() => {
      document.documentElement.classList.add('sea-turn-rev')
      void field.turnReveal(c.rgb, 620).then(() => document.documentElement.classList.remove('sea-turning', 'sea-turn-rev'))
    }, 90)
  }, [pathname])

  // plain links to another page (not the router's): cover first, then load it
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '')) return
      if (!enabled()) return
      e.preventDefault()
      turnThen(e.clientX, e.clientY, () => window.location.assign(url.href), 'page')
    }
    window.addEventListener('click', onClick)
    // back from the cache: never leave a cover up
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) document.documentElement.classList.remove('sea-turning', 'sea-turn-in') }
    window.addEventListener('pageshow', onShow)
    return () => { window.removeEventListener('click', onClick); window.removeEventListener('pageshow', onShow) }
  }, [])

  return <span ref={tc} className="sea-turn__tc" aria-hidden="true">00:00:00:00</span>
}
