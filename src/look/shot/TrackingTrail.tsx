// shot · T3, the tracking-line trail (D120; the details lab's T3, harvest lamalama.md: the pointer
// leaves a trace in the site's own material). Thin horizontal lines with a red and a teal offset,
// like the tracking noise of a video deck; a line's length is the pointer's speed and it lives
// 450ms. On the black bands the lines are cream, on paper they are ink (read once per line from the
// band under the pointer, no blend layer over the page). One fixed canvas, pointer-events none; the
// loop runs only while a line lives, so the page at rest draws nothing. A finger leaves the same
// lines while it moves. Off under OS reduced motion (unless ?motion=full), the widget's "stop
// animations" and ?reduce=1.
import { useEffect, useRef } from 'react'
import { useAmbientMotion, useReducedMotion } from '../../hooks/useReducedMotion'

const LIFE_MS = 450
const MAX_LINES = 40
/** the bands that are black (home opening, inner-page opening, header, footer) */
const DARK = '.shot-hero, .sp-top, .mw-head, .mw-foot'

interface Line { x: number; y: number; len: number; born: number; dark: boolean }

const strictReduce = () => /[?&]reduce=1(&|$)/.test(window.location.search)
const forceFull = () => /[?&]motion=full(&|$)/.test(window.location.search)

function paint(ctx: CanvasRenderingContext2D, l: Line, a: number) {
  const x0 = l.x - l.len / 2
  ctx.fillStyle = `rgba(200, 55, 45, ${0.32 * a})`
  ctx.fillRect(x0 - 2, l.y, l.len, 1)
  ctx.fillStyle = `rgba(30, 140, 170, ${0.32 * a})`
  ctx.fillRect(x0 + 2, l.y + 0.5, l.len, 1)
  ctx.fillStyle = l.dark ? `rgba(237, 231, 218, ${0.6 * a})` : `rgba(26, 25, 23, ${0.5 * a})`
  ctx.fillRect(x0, l.y, l.len, 1)
}

export default function TrackingTrail() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const ambient = useAmbientMotion()
  const on = ambient && (!reduced || forceFull()) && !strictReduce()

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!on || !cv || !ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    const size = () => {
      w = window.innerWidth; h = window.innerHeight
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()

    const lines: Line[] = []
    let raf = 0
    let px = -1
    let py = -1
    const frame = (now: number) => {
      ctx.clearRect(0, 0, w, h)
      for (let i = lines.length - 1; i >= 0; i--) {
        const age = (now - lines[i].born) / LIFE_MS
        if (age >= 1) { lines.splice(i, 1); continue }
        paint(ctx, lines[i], (1 - age) * (1 - age))
      }
      raf = lines.length ? requestAnimationFrame(frame) : 0
    }
    const move = (x: number, y: number) => {
      if (px >= 0) {
        const speed = Math.hypot(x - px, y - py)
        if (speed > 1.5 && lines.length < MAX_LINES) {
          const dark = Boolean(document.elementFromPoint(x, y)?.closest(DARK))
          const born = performance.now()
          const len = Math.min(150, 14 + speed * 3.2)
          for (let k = speed > 14 ? 2 : 1; k > 0; k--) lines.push({ x, y: Math.round(y + (Math.random() - 0.5) * 18), len, born, dark })
        }
      }
      px = x; py = y
      if (!raf && lines.length && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const reset = () => { px = -1; py = -1 }
    const onPointer = (e: PointerEvent) => { if (e.pointerType !== 'touch') move(e.clientX, e.clientY) }
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY) }
    const onHidden = () => {
      if (!document.hidden) return
      cancelAnimationFrame(raf); raf = 0; lines.length = 0; ctx.clearRect(0, 0, w, h)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchstart', reset, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    document.addEventListener('visibilitychange', onHidden)
    window.addEventListener('resize', size)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchstart', reset)
      document.documentElement.removeEventListener('pointerleave', reset)
      document.removeEventListener('visibilitychange', onHidden)
      window.removeEventListener('resize', size)
    }
  }, [on])

  if (!on) return null
  return (
    <canvas
      ref={ref}
      className="shot-trail"
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 45 }}
    />
  )
}
