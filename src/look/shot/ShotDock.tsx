// shot · the dock (SPEC 1.12): one bar at the table's near edge, WhatsApp on the inline-start
// side (thumb reach), the chat trigger on the inline-end side (ChatWidget portals it into the
// slot). It steps aside wherever it would cover something that matters: the hero CTA group
// ([data-dock-hide]), #contact and the footer, the cookie strip (which replaces it) and any
// modal dialog. --safe-b never changes with it, so nothing on the page moves.
import { useEffect, useState } from 'react'
import { WHATSAPP_URLS, getWhatsAppUrl } from '../../utils/whatsapp'
import { track } from '../../utils/analytics'
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
        <svg className="shot-dock__wa-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span>וואטסאפ</span>
      </a>
      <span className="shot-dock__chat" ref={onSlot} />
    </div>
  )
}
