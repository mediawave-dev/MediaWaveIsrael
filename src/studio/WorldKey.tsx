// studio · a world's main key made of the glass key (D219), in that world's own colour and material
// (design/sample-sites-effects.rtl.md). It starts and stays a real link with the world's own plain button inside;
// the optics are a lazy chunk that loads after the page and an idle moment, so a world's first load is no heavier.
// Never inside the frame of /your-site/, the still tier or a browser without WebGL2: the plain button is the key.
// [קופי: נתי] the second state's words, the site's own.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { track } from '../utils/analytics'
import type { GlassLook } from '../look/sea/optical/glass-key'
import { waForStyle } from './lead'
import { tierNow, type Tier } from './motion'
import { PREVIEW } from './preview'
import type { StyleDef } from './registry'
import './world-key.css'

const AFTER = 'פותחים וואטסאפ'

/** a colour of the world's CSS, as the shader wants it */
export const hex = (h: string): readonly [number, number, number] => {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]
}

interface Props {
  def: StyleDef
  tier: Tier
  label: string
  /** the world's own button class: what shows until the glass is on, and for good without it */
  plain: string
  look: GlassLook
  /** clay's pointer pill names what it is over */
  pill?: string
  children?: ReactNode
}

export default function WorldKey({ def, tier, label, plain, look, pill, children }: Props) {
  const stage = useRef<HTMLDivElement>(null)
  const link = useRef<HTMLAnchorElement>(null)
  const face = useRef<HTMLSpanElement>(null)
  const [live, setLive] = useState(false)
  const href = waForStyle(def)
  const location = `styles_hero_${def.id}`

  useEffect(() => {
    const el = stage.current
    const a = link.current
    if (!el || !a || PREVIEW || tier === 'still') return
    let alive = true
    let idle = 0
    let dispose: (() => void) | null = null
    // every mount gets its own canvas: a context that was let go can never be handed back to the next one
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    const reset = () => { dispose?.(); dispose = null; canvas.remove(); el.style.height = ''; a.style.width = ''; a.style.height = '' }
    const fallBack = () => { reset(); if (alive) setLive(false) }
    const go = () => {
      void Promise.all([import('../look/sea/optical/glass-key'), document.fonts.ready]).then(([m]) => {
        if (!alive || !face.current) return
        el.prepend(canvas)
        dispose = m.mountGlassKey(el, canvas, a, {
          label, after: AFTER, look, typeFrom: face.current,
          reduce: tierNow() !== 'full',
          onArrive: () => {
            track('cta_click', { location })
            // no features string: with noopener in it window.open returns null even when the tab opened
            const w = window.open(href, '_blank')
            if (w) w.opener = null
            else window.location.assign(href)
          },
          onLost: fallBack,
        })
        if (dispose) setLive(true)
        else canvas.remove()
      }).catch(fallBack)
    }
    const later = () => {
      if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(go, { timeout: 1800 })
      else idle = window.setTimeout(go, 800)
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      if (document.readyState === 'complete') later()
      else window.addEventListener('load', later, { once: true })
    }, { rootMargin: '120% 0px' })
    io.observe(el)
    return () => {
      alive = false
      io.disconnect()
      window.removeEventListener('load', later)
      window.cancelIdleCallback?.(idle)
      window.clearTimeout(idle)
      reset()
      setLive(false)
    }
  }, [tier, label, look, href, location])

  // inside the frame of /your-site/ the world keeps exactly the button it always had
  if (PREVIEW) return <a className={plain} href={href} target="_blank" rel="noopener noreferrer" data-pill={pill}>{label}{children}</a>

  return (
    <div ref={stage} className={`st-key${live ? ' is-live' : ''}`}>
      <a
        ref={link}
        className="st-key__hit"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        data-pill={pill}
        onClick={() => { if (!live) track('cta_click', { location }) }}
      >
        <span ref={face} className={`st-key__face ${plain}`}>{label}{children}</span>
      </a>
    </div>
  )
}
