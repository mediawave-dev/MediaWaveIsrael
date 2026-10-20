// sea · the letter's peek (D175; Nati: "on a phone you don't see the text being drawn, you have to scroll up
// to see it"). Below 1100px the bubble sits above the form, so while the visitor types it is off the
// screen. While a field of the form has focus, a copy of the sign rides at the top of the visible screen
// (over the keyboard's page, following the visual viewport), drawn the same way as the field's bubble
// (shader.ts, D171): the same grid of 2.25 px dots, the plate dim and small, the words lit in full dots,
// the three waiting dots while it is empty, a new letter burning in, in the logo's light blue. A 2D canvas
// in the page, because the field's canvas lies under the page and would show through the form.
// Decorative: aria-hidden, the field itself holds the words.
import { useEffect, useRef } from 'react'
import { AREA, freshOf, paint, type Fresh, type Words } from './words'
import { tier } from './field'

const PITCH = 2.25
const PLATE = 'rgb(175,171,161)'
const LIT = 'rgb(242,236,223)'
const HOT = [179, 222, 255]
/** the bubble's box in its own units (shader.ts bubbleIn): the body and the tail */
const QX = 1.24
const QY0 = -1.0
const QY1 = 0.88

function boxSd(x: number, y: number, bx: number, by: number, r: number) {
  const qx = Math.abs(x) - bx + r
  const qy = Math.abs(y) - by + r
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}
function inTri(x: number, y: number) {
  const ax = -0.45, ay = -0.5, bx = -0.95, by = -0.5, cx = -1.12, cy = -0.98
  const d1 = (x - bx) * (ay - by) - (ax - bx) * (y - by)
  const d2 = (x - cx) * (by - cy) - (bx - cx) * (y - cy)
  const d3 = (x - ax) * (cy - ay) - (cx - ax) * (y - ay)
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0))
}
const inBubble = (x: number, y: number) => boxSd(x, y - 0.1, 1.2, 0.75, 0.35) < 0 || inTri(x, y)
const hash = (x: number, y: number) => { const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h) }
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

interface Dot { x: number; y: number; on: number; hot: boolean; seed: number }

export default function SeaPeek() {
  const box = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = box.current
    const c = cv.current
    const g = c?.getContext('2d')
    if (!el || !c || !g) return
    const html = document.documentElement.classList
    const wide = window.matchMedia('(min-width: 1100px)')
    const moving = () => tier() === 'full' && !html.contains('disable-animations')
    const words = document.createElement('canvas')
    const plate = document.createElement('canvas')
    let v: Words = { name: '', email: '', message: '' }
    let fresh: Fresh | null = null
    let at = -1e9
    let dots: Dot[] = []
    let r = 0
    let dpr = 1
    let raf = 0
    let shown = false

    const val = (id: string) => document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#contact-${id}`)?.value ?? ''
    const has = () => Boolean(v.name.trim() || v.email.trim() || v.message.trim())

    /** size the canvas to the visible screen: the bubble about 42% of it at most */
    const size = () => {
      const vv = window.visualViewport
      const vw = vv?.width ?? window.innerWidth
      const vh = vv?.height ?? window.innerHeight
      dpr = Math.min(3, window.devicePixelRatio || 1)
      r = Math.max(60, Math.min((vw - 32) / (2 * QX), (vh * 0.42) / (QY1 - QY0)))
      const w = Math.round(2 * QX * r)
      const h = Math.round((QY1 - QY0) * r)
      c.style.width = `${w}px`
      c.style.height = `${h}px`
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
      document.documentElement.style.setProperty('--peek-h', `${h + 20}px`)
      // the plate: every dot of the bubble, dim and small, drawn once per size
      plate.width = c.width
      plate.height = c.height
      const pg = plate.getContext('2d')
      if (!pg) return
      pg.clearRect(0, 0, plate.width, plate.height)
      pg.fillStyle = PLATE
      pg.beginPath()
      const p = PITCH * dpr
      const rr = Math.pow(0.36, 0.62) * p * 0.5
      const ox = c.width / 2
      const oy = QY1 * r * dpr
      for (let y = oy - Math.floor(oy / p) * p; y < c.height; y += p) {
        for (let x = ox - Math.floor(ox / p) * p; x < c.width; x += p) {
          if (!inBubble((x - ox) / (r * dpr), (oy - y) / (r * dpr))) continue
          pg.moveTo(x + rr, y)
          pg.arc(x, y, rr, 0, Math.PI * 2)
        }
      }
      pg.fill()
      layout()
    }

    /** the words onto their canvas, then the dots that they light (four samples to a dot) */
    const layout = () => {
      dots = []
      const ox = c.width / 2
      const oy = QY1 * r * dpr
      const p = PITCH * dpr
      if (has()) {
        const w = Math.round(AREA.w * r * dpr)
        const h = Math.round(AREA.h * r * dpr)
        paint(words, w, h, v, moving() ? fresh : null, ((4 * PITCH * dpr) / 0.62))
        const data = words.getContext('2d')?.getImageData(0, 0, w, h).data
        if (!data) return
        const at2 = (qx: number, qy: number) => {
          const u = Math.round(((qx - AREA.x0) / AREA.w) * w)
          const vv = Math.round((1 - (qy - AREA.y0) / AREA.h) * h)
          if (u < 0 || u >= w || vv < 0 || vv >= h) return [0, 0]
          const i = (vv * w + u) * 4
          return [data[i] / 255, data[i + 2] / 255]
        }
        const q4 = (p * 0.25) / (r * dpr)
        for (let y = oy - Math.floor(oy / p) * p; y < c.height; y += p) {
          for (let x = ox - Math.floor(ox / p) * p; x < c.width; x += p) {
            const qx = (x - ox) / (r * dpr)
            const qy = (oy - y) / (r * dpr)
            if (qx < AREA.x0 || qx > AREA.x0 + AREA.w || qy < AREA.y0 || qy > AREA.y0 + AREA.h) continue
            if (!inBubble(qx, qy)) continue
            const s = [at2(qx + q4, qy + q4), at2(qx - q4, qy - q4), at2(qx + q4, qy - q4), at2(qx - q4, qy + q4)]
            const cov = (s[0][0] + s[1][0] + s[2][0] + s[3][0]) / 4
            const on = smooth(0.1, 0.9, cov)
            if (on < 0.02) continue
            dots.push({ x, y, on, hot: (s[0][1] + s[1][1] + s[2][1] + s[3][1]) / 4 > 0.3, seed: hash(x, y) })
          }
        }
      } else {
        // empty: the three waiting dots
        for (let k = 0; k < 3; k++) {
          const cx = 0.45 - k * 0.45
          for (let y = oy - Math.floor(oy / p) * p; y < c.height; y += p) {
            for (let x = ox - Math.floor(ox / p) * p; x < c.width; x += p) {
              const qx = (x - ox) / (r * dpr)
              const qy = (oy - y) / (r * dpr)
              const d = Math.hypot(qx - cx, qy - 0.1)
              if (d < 0.12) dots.push({ x, y, on: 1 - smooth(0.1, 0.12, d), hot: false, seed: 0 })
            }
          }
        }
      }
      cancelAnimationFrame(raf)
      draw()
    }

    const draw = () => {
      raf = 0
      g.clearRect(0, 0, c.width, c.height)
      g.drawImage(plate, 0, 0)
      const age = moving() ? (performance.now() - at) / 1000 : 9
      const p = PITCH * dpr
      const cool = 1 - smooth(0.25, 1.4, age)
      let busy = false
      // the lit dots, the cool ones in one path, the hot ones each in their colour
      g.fillStyle = LIT
      g.beginPath()
      const hot: [number, number, number, number][] = []
      for (const d of dots) {
        const grow = d.hot ? smooth(0, 1, (age - 0.28 * d.seed) / 0.26) : 1
        if (d.hot && grow < 1) busy = true
        const on = d.on * grow
        const rr = Math.pow(0.36 + 0.64 * on, 0.62) * p * 0.5
        if (d.hot && cool > 0.01) { hot.push([d.x, d.y, rr, on * cool]); continue }
        g.moveTo(d.x + rr, d.y)
        g.arc(d.x, d.y, rr, 0, Math.PI * 2)
      }
      g.fill()
      for (const [x, y, rr, k] of hot) {
        g.fillStyle = `rgb(${Math.round(242 + (HOT[0] - 242) * k)},${Math.round(236 + (HOT[1] - 236) * k)},${Math.round(223 + (HOT[2] - 223) * k)})`
        g.beginPath()
        g.arc(x, y, rr, 0, Math.PI * 2)
        g.fill()
      }
      if (hot.length || busy) raf = requestAnimationFrame(draw)
    }

    /** ride the visible screen: under iOS's keyboard the visual viewport moves inside the layout one */
    const place = () => { el.style.transform = `translateY(${window.visualViewport?.offsetTop ?? 0}px)` }

    const read = () => {
      const next = { name: val('name'), email: val('email'), message: val('message') }
      fresh = freshOf(v, next)
      v = next
      at = performance.now()
      if (shown) layout()
    }
    const show = (on: boolean) => {
      if (on === shown || wide.matches) return
      shown = on
      html.toggle('sea-peeking', on)
      if (on) { size(); place() }
    }
    const isField = (t: EventTarget | null) => t instanceof Element && Boolean(t.closest('#contact')) && (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)
    let keep = 0
    const onIn = (e: FocusEvent) => {
      if (!isField(e.target)) return
      v = { name: val('name'), email: val('email'), message: val('message') }
      show(true)
      // once the keyboard is up, the field keeps clear of the peek (scroll-margin-top in sea-site.css)
      window.clearTimeout(keep)
      keep = window.setTimeout(() => { if (shown) (e.target as HTMLElement).scrollIntoView({ block: 'nearest' }) }, 380)
    }
    const onOut = (e: FocusEvent) => { if (!isField(e.relatedTarget)) show(false) }
    const onInput = (e: Event) => { if (isField(e.target)) read() }
    const onVv = () => { if (shown) { size(); place() } }
    document.addEventListener('focusin', onIn)
    document.addEventListener('focusout', onOut)
    document.addEventListener('input', onInput)
    window.visualViewport?.addEventListener('resize', onVv)
    window.visualViewport?.addEventListener('scroll', place)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(keep)
      html.remove('sea-peeking')
      document.removeEventListener('focusin', onIn)
      document.removeEventListener('focusout', onOut)
      document.removeEventListener('input', onInput)
      window.visualViewport?.removeEventListener('resize', onVv)
      window.visualViewport?.removeEventListener('scroll', place)
    }
  }, [])

  return (
    <div ref={box} className="sea-peek" aria-hidden="true">
      <canvas ref={cv} className="sea-peek__sign" />
    </div>
  )
}
