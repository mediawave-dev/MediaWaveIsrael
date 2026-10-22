// sea · the finger's streak of light (D166, D167: smooth, the default on phones) and the mouse's hairline
// (D159, the lab's `trail=line`; a mouse's default is Lama's squares in the shader, D162). The mouse's: a
// hairline ribbon that follows the pointer and tapers into nothing a few tenths of a second behind it,
// a soft point of light at its head, and now and then a speck of dust shed from the path that drifts
// and fades (most cream, a few in the logo's light blue). The pointer is followed with a little ease,
// so the line is always smooth. On its own canvas above everything, never in the way of a click. Fine
// pointers and full motion only (no touch, no calm, no ?reduce=1, off with the widget's stop switch).
import { useEffect, useRef } from 'react'
import { tier } from './field'
import { opt } from './lab'

const LIFE = 420
/** a finger's streak lives a little longer (D167) */
const LIFE_T = 560
const CREAM = '237, 231, 218'
const BLUE = '121, 160, 197'

interface P { x: number; y: number; t: number }
interface Dust { x: number; y: number; vx: number; vy: number; age: number; life: number; r: number; c: string }

/** the path as a smooth curve (Catmull-Rom through the points), one sample every step px */
function smoothPath(p: P[], step: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = []
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], d = p[Math.min(p.length - 1, i + 2)]
    const n = Math.max(1, Math.ceil(Math.hypot(c.x - b.x, c.y - b.y) / step))
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t
      out.push({
        x: 0.5 * (2 * b.x + (c.x - a.x) * t + (2 * a.x - 5 * b.x + 4 * c.x - d.x) * t2 + (3 * b.x - a.x - 3 * c.x + d.x) * t3),
        y: 0.5 * (2 * b.y + (c.y - a.y) * t + (2 * a.y - 5 * b.y + 4 * c.y - d.y) * t2 + (3 * b.y - a.y - 3 * c.y + d.y) * t3),
      })
    }
  }
  if (p.length) out.push({ x: p[p.length - 1].x, y: p[p.length - 1].y })
  return out
}

export default function SeaTrail() {
  const cv = useRef<HTMLCanvasElement>(null)
  // a mouse draws it with the lab's trail=line; a finger by default (D166, finger=line): the same on the
  // server and the client, the effect decides which pointer this screen has
  const on = opt('trail') === 'line' || opt('finger') === 'line'

  useEffect(() => {
    const el = cv.current
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!on || !el || tier() !== 'full' || (fine ? opt('trail') !== 'line' : opt('finger') !== 'line')) return
    const ctx = el.getContext('2d')
    if (!ctx) return
    // a soft dot of light, stamped along the finger's curve (D167: the drawn line showed its joints)
    const sprite = document.createElement('canvas')
    sprite.width = sprite.height = 64
    const sg = sprite.getContext('2d')
    if (sg) {
      const gr = sg.createRadialGradient(32, 32, 0, 32, 32, 32)
      gr.addColorStop(0, `rgba(${CREAM}, 1)`)
      gr.addColorStop(0.35, `rgba(${CREAM}, 0.42)`)
      gr.addColorStop(1, `rgba(${CREAM}, 0)`)
      sg.fillStyle = gr
      sg.fillRect(0, 0, 64, 64)
    }
    const html = document.documentElement.classList
    const ptr = { x: 0, y: 0, at: 0, seen: false }
    const head = { x: 0, y: 0 }
    let pts: P[] = []
    let dust: Dust[] = []
    let travel = 0
    let glow = 0
    let raf = 0
    let last = 0
    let dpr = 1
    // (D210) seen only while a streak is drawn: an idle full-screen layer with mix-blend-mode still made the
    // compositor blend the whole screen over the moving sea every frame
    const live = (on: boolean) => { if (on) el.dataset.live = ''; else delete el.dataset.live }
    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      el.width = Math.round(window.innerWidth * dpr)
      el.height = Math.round(window.innerHeight * dpr)
    }
    const frame = (now: number) => {
      raf = 0
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now
      const stopped = html.contains('disable-animations')
      // the head follows the pointer with a little ease
      const k = 1 - Math.pow(1 - (fine ? 0.38 : 0.26), dt * 60)
      const hx = head.x + (ptr.x - head.x) * k
      const hy = head.y + (ptr.y - head.y) * k
      const step = Math.hypot(hx - head.x, hy - head.y)
      head.x = hx
      head.y = hy
      if (step > 0.4) pts.push({ x: hx, y: hy, t: now })
      pts = pts.filter((p) => now - p.t < (fine ? LIFE : LIFE_T))
      // a speck of dust every so often along the path
      travel += step
      if (fine && travel > 22 && !stopped) {
        travel = 0
        const a = Math.random() * Math.PI * 2
        dust.push({ x: hx, y: hy, vx: Math.cos(a) * 9, vy: Math.sin(a) * 9 + 4, age: 0, life: 0.55 + Math.random() * 0.5, r: 0.6 + Math.random() * 0.8, c: Math.random() < 0.25 ? BLUE : CREAM })
        if (dust.length > 60) dust.shift()
      }
      dust.forEach((d) => { d.age += dt; d.x += d.vx * dt; d.y += d.vy * dt; d.vx *= 0.96; d.vy *= 0.96 })
      dust = dust.filter((d) => d.age < d.life)
      const idle = now - ptr.at > 1100 || stopped
      glow += ((idle ? 0 : 1) - glow) * (1 - Math.pow(0.88, dt * 60))

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, el.width, el.height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const n = pts.length
      // a finger (D167): a smooth streak of light. A soft glow stamped along the curve, wider and brighter
      // toward the finger, a fine bright line inside it drawn as one stroke, and a soft light at its head
      if (!fine) {
        const s = smoothPath(pts, 2.5)
        const m = s.length
        for (let i = 0; i < m; i++) {
          const a = m > 1 ? i / (m - 1) : 1
          const r = 2.5 + 11 * Math.pow(a, 1.3)
          ctx.globalAlpha = 0.07 * Math.pow(a, 1.6) * glow
          ctx.drawImage(sprite, s[i].x - r, s[i].y - r, 2 * r, 2 * r)
        }
        ctx.globalAlpha = 1
        if (m > 1) {
          const g = ctx.createLinearGradient(s[0].x, s[0].y, s[m - 1].x, s[m - 1].y)
          g.addColorStop(0, `rgba(${CREAM}, 0)`)
          g.addColorStop(1, `rgba(${CREAM}, ${0.5 * glow})`)
          ctx.strokeStyle = g
          ctx.lineWidth = 1.1
          ctx.beginPath()
          ctx.moveTo(s[0].x, s[0].y)
          for (let i = 1; i < m; i++) ctx.lineTo(s[i].x, s[i].y)
          ctx.stroke()
        }
        if (glow > 0.01) {
          ctx.globalAlpha = 0.5 * glow
          ctx.drawImage(sprite, head.x - 14, head.y - 14, 28, 28)
          ctx.globalAlpha = 1
        }
        if (pts.length || glow > 0.01) raf = requestAnimationFrame(frame)
        else { last = 0; live(false) }
        return
      }
      // a mouse (the lab's trail=line): the hairline ribbon, thin and faint at the tail, brighter toward the head
      for (let i = 1; i < n; i++) {
        const a = i / (n - 1)
        const p0 = pts[i - 1]
        const p1 = pts[i]
        const m0x = i > 1 ? (pts[i - 2].x + p0.x) / 2 : p0.x
        const m0y = i > 1 ? (pts[i - 2].y + p0.y) / 2 : p0.y
        const m1x = (p0.x + p1.x) / 2
        const m1y = (p0.y + p1.y) / 2
        ctx.strokeStyle = `rgba(${CREAM}, ${(0.05 + 0.6 * Math.pow(a, 1.7)) * glow})`
        ctx.lineWidth = 0.35 + 1.5 * Math.pow(a, 1.4)
        ctx.beginPath()
        ctx.moveTo(m0x, m0y)
        ctx.quadraticCurveTo(p0.x, p0.y, m1x, m1y)
        ctx.stroke()
      }
      // the head: a soft point of light
      if (glow > 0.01) {
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 7)
        g.addColorStop(0, `rgba(${CREAM}, ${0.85 * glow})`)
        g.addColorStop(0.28, `rgba(${CREAM}, ${0.32 * glow})`)
        g.addColorStop(1, `rgba(${CREAM}, 0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(head.x, head.y, 7, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const d of dust) {
        const f = 1 - d.age / d.life
        ctx.fillStyle = `rgba(${d.c}, ${0.7 * f * f * glow})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (pts.length || dust.length || glow > 0.01) raf = requestAnimationFrame(frame)
      else { last = 0; live(false) }
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      if (!ptr.seen) { head.x = e.clientX; head.y = e.clientY; ptr.seen = true }
      ptr.x = e.clientX
      ptr.y = e.clientY
      ptr.at = performance.now()
      if (!raf) { live(true); raf = requestAnimationFrame(frame) }
    }
    const onLeave = () => { ptr.at = 0 }
    // a finger: each touch starts its own line (never one drawn from where the last touch ended)
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      if (e.type === 'touchstart') { pts = []; head.x = t.clientX; head.y = t.clientY; ptr.seen = true }
      ptr.x = t.clientX
      ptr.y = t.clientY
      ptr.at = performance.now()
      if (!raf) { live(true); raf = requestAnimationFrame(frame) }
    }
    const onTouchEnd = (e: TouchEvent) => { if (!e.touches.length) ptr.at = 0 }
    size()
    window.addEventListener('resize', size)
    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    } else {
      window.addEventListener('touchstart', onTouch, { passive: true })
      window.addEventListener('touchmove', onTouch, { passive: true })
      window.addEventListener('touchend', onTouchEnd, { passive: true })
      window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [on])

  if (!on) return null
  return <canvas ref={cv} className="sea-trail" aria-hidden="true" />
}
