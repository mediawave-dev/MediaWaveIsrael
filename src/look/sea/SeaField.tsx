// sea · the field's layer (D131): one fixed canvas behind every page of the site (Layout mounts it in
// the shot look). The layer's own background is the no-WebGL still: a plain, quiet dot screen. The
// WebGL field starts at once under the opening (the dots must be there when the veil lifts), else
// after load and idle, so it never competes with the first paint.
import { useEffect, useRef } from 'react'
import * as field from './field'
import { hooks } from './sound'

export default function SeaField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    // the app is up: index.html's safety net keeps the reveals (html.sea-reveal)
    ;(window as unknown as { __seaUp?: boolean }).__seaUp = true
    const unhook = hooks()
    const go = () => { field.start(cv) }
    if (document.documentElement.classList.contains('sea-opening')) { const r = requestAnimationFrame(go); return () => { cancelAnimationFrame(r); unhook() } }
    let idle = 0
    let timer = 0
    const later = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(go, { timeout: 1500 })
      else timer = setTimeout(go, 300) as unknown as number
    }
    if (document.readyState === 'complete') later()
    else window.addEventListener('load', later, { once: true })
    return () => {
      unhook()
      window.removeEventListener('load', later)
      if (idle) window.cancelIdleCallback(idle)
      window.clearTimeout(timer)
    }
  }, [])

  return <div className="sea-field" aria-hidden="true"><canvas ref={ref} /></div>
}
