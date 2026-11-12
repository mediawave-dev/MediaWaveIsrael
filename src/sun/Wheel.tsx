// sun · the work wheel (D237). The sites we built ride a huge wheel that rises over the hero's horizon,
// the way the Horizon logo's disc sits on its line. One transform on the ring moves everything
// (compositor only). It drifts slowly, stops under a pointer, and a finger or a mouse can spin it.
// The wheel repeats the work list below it, so it is hidden from assistive tech and from the tab order.
// Geometry lives in sun.css (--cw, --ch, --R); 36 slots at 10 degrees, and phones show every second slot.
import { useEffect, useRef } from 'react'
import { PROJECTS, WA } from './content'
import { IconWhatsApp } from './icons'
import { track } from '../utils/analytics'

const SLOTS = 36
const STEP = 360 / SLOTS

type Card = { kind: 'shot'; slug: string; name: string; crop: 'top' | 'mid' } | { kind: 'next' }

/** Every project twice (the top of its page, then further down), with one "yours next" card between. */
function deck(): Card[] {
  const tops: Card[] = PROJECTS.map((p) => ({ kind: 'shot', slug: p.slug, name: p.name, crop: 'top' }))
  // a project whose page is mostly dark further down shows its top only ("crops": 1 in work.json)
  const mids: Card[] = PROJECTS.filter((p) => p.crops !== 1).map((p) => ({ kind: 'shot', slug: p.slug, name: p.name, crop: 'mid' }))
  const unit: Card[] = [...tops, { kind: 'next' }, ...mids]
  return Array.from({ length: SLOTS }, (_, i) => unit[i % unit.length])
}

export default function Wheel() {
  const box = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    const r = ring.current
    if (!el || !r || (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    const html = document.documentElement
    const still = () => html.classList.contains('disable-animations')
    // D160: a regular visit sees the wheel turn even when the OS flag is set (Windows sets it on many machines,
    // Nati's included). What stops it: a pointer on it, the accessibility panel's "ללא אנימציות", ?reduce=1, ?calm=1.
    const calm = /[?&]calm=1(&|$)/.test(location.search)
    let a = 0
    let v = 0 // deg per second from a fling
    let held = false
    let hover = false
    let seen = true
    let raf = 0
    let last = 0
    let moved = 0
    let lastX = 0
    let lastT = 0
    const radius = () => parseFloat(getComputedStyle(el).getPropertyValue('--R')) || 500
    // one card's width of travel every five seconds, whatever the wheel's size
    const drift = () => (window.matchMedia('(min-width: 900px)').matches ? STEP : STEP * 2) / 5

    const paint = () => { r.style.transform = `rotate(${a.toFixed(3)}deg)` }
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0)
      last = t
      if (!held) {
        if (Math.abs(v) > 0.05) { a += v * dt; v *= Math.pow(0.04, dt) } // a fling eases out in about a second
        else if (!hover && !calm && !still()) a -= drift() * dt
      }
      paint()
      raf = seen && !document.hidden ? requestAnimationFrame(tick) : 0
    }
    const run = () => { if (!raf && seen && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick) } }

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      held = true; moved = 0; v = 0; lastX = e.clientX; lastT = e.timeStamp
    }
    const move = (e: PointerEvent) => {
      if (!held) return
      const dx = e.clientX - lastX
      const dt = Math.max(1, e.timeStamp - lastT) / 1000
      const d = (dx / radius()) * (180 / Math.PI)
      a += d; moved += Math.abs(dx); v = d / dt
      lastX = e.clientX; lastT = e.timeStamp
      if (moved > 6 && !el.hasPointerCapture(e.pointerId)) el.setPointerCapture(e.pointerId)
    }
    const up = () => { held = false; v = Math.max(-240, Math.min(240, v)); if (still()) v = 0 }
    // a drag must not open the card it started on
    const click = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation() } }
    const enter = (e: PointerEvent) => { if (e.pointerType === 'mouse') hover = true }
    const leave = (e: PointerEvent) => { if (e.pointerType === 'mouse') hover = false }
    const vis = () => run()
    const io = new IntersectionObserver(([en]) => { seen = en.isIntersecting; run() }, { rootMargin: '80px' })

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('click', click, true)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', vis)
    io.observe(el)
    run()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', vis)
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('click', click, true)
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div className="wheel" ref={box} aria-hidden="true">
      <div className="wheel__ground" />
      <div className="wheel__ring" ref={ring}>
        {deck().map((c, i) => (
          <div className="wheel__slot" key={i} style={{ '--i': i } as React.CSSProperties}>
            {c.kind === 'shot' ? (
              <a className="wheel__card" href={`#work-${c.slug}`} tabIndex={-1} draggable={false} data-crop={c.crop}>
                <img src={`/work/${c.slug}-card-${c.crop}.webp`} alt="" width={448} height={896} draggable={false}
                  loading={i < 3 || i > SLOTS - 3 ? 'eager' : 'lazy'} decoding="async" {...(i === 0 ? { fetchpriority: 'high' } : {})} />
              </a>
            ) : (
              <a className="wheel__card wheel__card--next" href={WA.hero} target="_blank" rel="noopener" tabIndex={-1} draggable={false}
                onClick={() => track('whatsapp_click', { placement: 'wheel_next' })}>
                <IconWhatsApp width={30} height={30} />
                <span>האתר<br />הבא:<br /><b>שלכם</b></span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
