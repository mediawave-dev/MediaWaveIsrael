// sea · the glass key (D219): the page's last ask, WhatsApp, made of the site's own dots under real glass. It is a
// real link with its words the whole time: no WebGL, the still tier, or before it loads, it is a plain key. The
// optics load only when it comes near the screen. [קופי: נתי] the second state's words.
import { useEffect, useRef, useState } from 'react'
import { track } from '../../utils/analytics'
import * as field from './field'

interface Props {
  href: string
  label: string
  after: string
  placement: string
}

export default function GlassKey({ href, label, after, placement }: Props) {
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const link = useRef<HTMLAnchorElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = stage.current
    if (!el || field.tier() === 'still') return
    let alive = true
    let dispose: (() => void) | null = null
    // the GPU took the context back, or the code failed to load: the plain key is still a working link
    const fallBack = () => { dispose?.(); dispose = null; if (alive) setLive(false) }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      // the compile waits for an idle moment, so it never lands in the middle of a scroll
      const start = () => {
        void Promise.all([import('./optical/glass-key'), document.fonts.ready]).then(([m]) => {
          if (!alive || !stage.current || !canvas.current || !link.current) return
          dispose = m.mountGlassKey(stage.current, canvas.current, link.current, {
            label, after,
            reduce: field.tier() !== 'full',
            onArrive: () => {
              track('whatsapp_click', { placement })
              // no features string: with noopener in it window.open returns null even when the tab opened
              const w = window.open(href, '_blank')
              if (w) w.opener = null
              else window.location.assign(href)
            },
            onLost: fallBack,
          })
          if (dispose) setLive(true)
        }).catch(fallBack)
      }
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(start, { timeout: 600 })
      else setTimeout(start, 200)
    }, { rootMargin: '120% 0px' })
    io.observe(el)
    return () => { alive = false; io.disconnect(); dispose?.() }
  }, [href, label, after, placement])

  return (
    <div ref={stage} className={`sea-glass${live ? ' is-live' : ''}`}>
      <canvas ref={canvas} aria-hidden="true" />
      <a
        ref={link}
        className="sea-glass__hit"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-zone="text"
        data-cursor="לוואטסאפ"
        draggable={false}
        onClick={() => { if (!live) track('whatsapp_click', { placement }) }}
      >
        <span className="sea-glass__words">{label}</span>
      </a>
    </div>
  )
}
