// sea · the anamorphic light: on a service page the finger or pointer becomes a light inside the page's first dark
// picture. It lays one canvas over the band SeaClips already draws and leaves that band alone; the optics load only
// when the band comes near the screen. The still tier gets nothing, the calm tier one still light, and a lost
// context or a failed load simply leaves the picture as it was. The landing page's picture is a bright wall and a
// white phone, not a dark frame, so that page has no light.
import { useEffect } from 'react'
import * as field from './field'
import './sea-anamorphic.css'

const NOT_DARK = new Set(['landing'])

export default function SeaAnamorphic({ id }: { id: string }) {
  useEffect(() => {
    const t = field.tier()
    if (t === 'still' || NOT_DARK.has(id)) return
    const host = document.querySelector<HTMLElement>('.sea-clips__main')
    if (!host) return
    const canvas = document.createElement('canvas')
    canvas.className = 'sea-ana'
    canvas.setAttribute('aria-hidden', 'true')
    let alive = true
    let dispose: (() => void) | null = null
    const stop = () => {
      dispose?.()
      dispose = null
      canvas.remove()
      host.classList.remove('sea-ana-host')
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      // the compile waits for an idle moment, so it never lands in the middle of a scroll
      const start = () => {
        // no GPU (field.ts said so): the picture stays as it is
        if (document.documentElement.classList.contains('sea-nogl')) return
        void import('./optical/anamorphic').then((m) => {
          if (!alive) return
          host.classList.add('sea-ana-host')
          host.appendChild(canvas)
          dispose = m.mountAnamorphic(host, canvas, { still: t !== 'full', onLost: stop })
          if (!dispose) stop()
        }).catch(stop)
      }
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(start, { timeout: 600 })
      else setTimeout(start, 200)
    }, { rootMargin: '120% 0px' })
    io.observe(host)
    return () => { alive = false; io.disconnect(); stop() }
  }, [id])

  return null
}
