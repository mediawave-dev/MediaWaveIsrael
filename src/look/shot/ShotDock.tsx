// shot · the dock (SPEC 1.12): one bar at the table's near edge, WhatsApp on the inline-start
// side (thumb reach), the chat trigger on the inline-end side (ChatWidget portals it into the
// slot). It steps aside wherever it would cover something that matters: the hero CTA group
// ([data-dock-hide]), #contact and the footer, the cookie strip (which replaces it) and any
// modal dialog. --safe-b never changes with it, so nothing on the page moves.
import { useEffect, useState } from 'react'
import { WHATSAPP_URLS, getWhatsAppUrl } from '../../utils/whatsapp'
import { track } from '../../utils/analytics'
import WaDots from '../sea/WaDots'
import Brackets from '../parts/Brackets'
// shot-dock.css is imported by ShotHome (the shot entry), not here: Layout imports this file in
// every look, and a CSS import would put the dock's rules into the k, m and km bundles too.

const ZONES = '[data-dock-hide], #contact, footer.mw-foot'

interface ShotDockProps {
  /** ChatWidget's panel is open (Layout already knows; no DOM query needed for it) */
  chatOpen: boolean
  /** Receives the chat trigger's slot element (ChatWidget `triggerSlot`) */
  onSlot: (el: HTMLElement | null) => void
  /** Reports the dock's visibility (ChatWidget `triggerActive` plays Lottie 7 on show) */
  onShownChange?: (shown: boolean) => void
}

/** Is a cookie choice pending or a modal dialog open? Read from the DOM, cheap. */
function isBusy() {
  // a pending cookie choice no longer hides WhatsApp (critic M1 F1): the dock rises above the strip
  return document.querySelector('[aria-modal="true"]') !== null
}

export default function ShotDock({ chatOpen, onSlot, onShownChange }: ShotDockProps) {
  // Hidden until the first observation, so the dock never flashes over the hero's CTAs (and
  // the prerendered and no-JS page carry it hidden: nothing there decides when it may cover text)
  const [covered, setCovered] = useState(true)
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    const watched = new Set<Element>()
    const inView = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inView.add(e.target)
        else inView.delete(e.target)
      }
      setCovered(inView.size > 0)
    }, { threshold: 0 })

    // Chapters mount lazily (#contact lives in a lazy chunk), so the zones are re-scanned on DOM
    // changes, at most once per frame
    const scan = () => {
      let changed = false
      document.querySelectorAll(ZONES).forEach((el) => {
        if (watched.has(el)) return
        watched.add(el)
        io.observe(el)
      })
      watched.forEach((el) => {
        if (el.isConnected) return
        watched.delete(el)
        inView.delete(el)
        io.unobserve(el)
        changed = true
      })
      // The observer reports every new target once; with none (or after a removal) decide here
      if (watched.size === 0 || changed) setCovered(inView.size > 0)
      setBusy(isBusy())
    }

    let frame = 0
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; scan() })
    }
    // Two observers: observing body twice with one observer would replace its first options
    const tree = new MutationObserver(schedule)
    tree.observe(document.body, { childList: true, subtree: true })
    const flags = new MutationObserver(schedule)
    flags.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    flags.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    scan()

    return () => {
      cancelAnimationFrame(frame)
      tree.disconnect()
      flags.disconnect()
      io.disconnect()
    }
  }, [])

  const hidden = covered || busy || chatOpen

  useEffect(() => { onShownChange?.(!hidden) }, [hidden, onShownChange])

  return (
    <div className="shot-dock" data-zone="ui" data-hidden={hidden ? 'true' : 'false'}>
      <a
        className="shot-dock__wa"
        href={WHATSAPP_URLS.general}
        onPointerDown={(e) => { const m = document.querySelector<HTMLElement>('[data-wa]')?.dataset.wa; if (m) e.currentTarget.href = getWhatsAppUrl(m) }}
        onFocus={(e) => { const m = document.querySelector<HTMLElement>('[data-wa]')?.dataset.wa; if (m) e.currentTarget.href = getWhatsAppUrl(m) }}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="כתבו לנו בוואטסאפ"
        onClick={() => track('whatsapp_click', { placement: 'floating' })}
      >
        <WaDots className="shot-dock__wa-icon" />
        <span>וואטסאפ</span>
        <Brackets />
      </a>
      <span className="shot-dock__chat" ref={onSlot} />
    </div>
  )
}
