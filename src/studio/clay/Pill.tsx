// Léo's cursor pill, read from his bundle: a small yellow pill whose bottom-left corner sits on the
// pointer's tip, following at a frame-rate-free rate of 12/s; fast moves tilt it up to 40 deg and grow it
// up to 2x (rotate(z*40deg) scale(1+|z|)); it pops in with an elastic 0.65 s and shrinks away in 0.3 s.
// It asks for the first click (the tape plays), then speaks only over things that answer to it.
import { useEffect, useRef, useState } from 'react'

export default function Pill({ text, line }: { text: string | null; line?: [string, string] }) {
  const el = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const p = el.current
    if (!p) return
    let x = -200, y = -200, tx = -200, ty = -200, z = 0, raf = 0, last = performance.now(), moved = false
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      tx = e.clientX
      ty = e.clientY
      if (!moved) { moved = true; x = tx; y = ty; setShown(true) }
    }
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const k = 1 - Math.exp(-12 * dt)
      const vx = (tx - x) * k / Math.max(dt, 0.001)
      x += (tx - x) * k
      y += (ty - y) * k
      z += (Math.max(-1, Math.min(1, vx / 2400)) - z) * k
      p.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(-z * 40).toFixed(2)}deg) scale(${(1 + Math.abs(z)).toFixed(3)})`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div className="cl-pill" ref={el} aria-hidden="true">
      <span className="cl-pill__in" data-on={(shown && !!(text || line)) || undefined}>
        {line ? <>{line[0]}<i />{line[1]}</> : text}
      </span>
    </div>
  )
}
