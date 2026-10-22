// The moment after a send (D209). Nati (22.10): after the details are sent, "a beautiful animation, like a
// character that comes flying and offers to tour the four sites ... like an interesting, beautiful computer
// game"; he picked "B · the orbit" of three. The guide's little world (D189, D192) flies in on a swoop with
// its halftone trail, grows, and four small worlds burst out of it into an orbit around it, a level select;
// its bubble types the invitation. A world opens through the wave (travel.ts); "( Later )", Escape or the
// veil send it away. The status line ("קיבלנו...") stays above the veil, readable and announced first: the
// scene brings it to the top and waits for it, and after the WhatsApp hand-off it waits for the visitor to
// come back to the tab. Still: no flight, no typing, no orbit, only fades; calm: a slower orbit.
// Sounds go through the site's engine, which is silent unless the visitor's sound is on.
// The bubble's lines: approved by Nati (22.10, "מאושר")
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Isle from '../look/parts/Isle'
import * as sea from '../look/sea/sound'
import { prepareCurtain } from './curtain'
import { tierNow, type Tier } from './motion'
import { STYLES, type StyleDef } from './registry'
import { preloadSound } from './sound'
import { travel } from './travel'
import './portal.css'
import './sent-guide.css'

const SAY = ['ההודעה שלכם אצלנו.', 'עד שנחזור אליכם, רוצים להציץ בארבעה אתרים לדוגמה?']
/** after the WhatsApp hand-off the message waits in WhatsApp; "it is with us" would not be true */
const SAY_LATE = ['תודה שכתבתם לנו.', SAY[1]]
const CPS = 26
const TRAIL = 16

type Phase = 'wait' | 'set' | 'in' | 'out'
interface Geo { w: number; h: number; cx: number; cy: number; rx: number; ry: number; disc: number }

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3)
const easeBack = (x: number) => { const c = 1.70158; const u = clamp(x) - 1; return 1 + (c + 1) * u * u * u + c * u * u }
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))
/** the page is in front again (the WhatsApp hand-off opens another tab or the app) */
const visible = () => new Promise<void>((res) => {
  if (!document.hidden) { res(); return }
  const f = () => { if (!document.hidden) { document.removeEventListener('visibilitychange', f); res() } }
  document.addEventListener('visibilitychange', f)
})

/** a catmull-rom spline through the points, u in 0..1 */
function spline(p: [number, number][], u: number): [number, number] {
  const n = p.length - 1
  const f = clamp(u) * n
  const i = Math.min(n - 1, Math.floor(f))
  const t = f - i
  const [a, b, c, d] = [p[Math.max(0, i - 1)], p[i], p[i + 1], p[Math.min(n, i + 2)]]
  const k = (q: number) => 0.5 * (2 * b[q] + (c[q] - a[q]) * t + (2 * a[q] - 5 * b[q] + 4 * c[q] - d[q]) * t * t + (3 * b[q] - a[q] - 3 * c[q] + d[q]) * t * t * t)
  return [k(0), k(1)]
}

/** bring the status line near the top of the screen, so the veil can leave it clear */
async function frameStatus(status: HTMLElement | null, tier: Tier) {
  if (!status) return
  const want = window.innerWidth < 760 ? 96 : 128
  const top = status.getBoundingClientRect().top
  if (Math.abs(top - want) < 24) return
  window.scrollTo({ top: window.scrollY + top - want, behavior: tier === 'still' ? 'auto' : 'smooth' })
  await wait(tier === 'still' ? 60 : 750)
}

/** the orbit fills the space between the bubble and the "Later" key */
function measure(bubble: HTMLElement): Geo {
  const w = window.innerWidth
  const h = window.innerHeight
  // the layout box (the bubble's entrance moves and scales it)
  const top = bubble.offsetTop + bubble.offsetHeight + 24
  const bottom = h - 76
  const m = w < 760
  const rx = Math.min(w * (m ? 0.33 : 0.2), 210)
  const ry = clamp(Math.min(rx * 0.74, (bottom - top) / 2 - 48), 52, 180)
  return { w, h, cx: w / 2, cy: Math.max(top + ry + 30, (top + bottom) / 2 - 12), rx, ry, disc: m ? 92 : 112 }
}

export default function SentGuide({ late, onDone }: { late: boolean; onDone: () => void }) {
  const navigate = useNavigate()
  const tier = useRef(tierNow()).current
  const [phase, setPhase] = useState<Phase>('wait')
  const [clear, setClear] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const bubble = useRef<HTMLDivElement>(null)
  const say = useRef<HTMLParagraphElement>(null)
  const disc = useRef<HTMLDivElement>(null)
  const orbit = useRef<SVGEllipseElement>(null)
  const trail = useRef<HTMLDivElement>(null)
  const worlds = useRef<(HTMLButtonElement | null)[]>([])
  const S = useRef({ t0: 0, tOut: 0, hold: false, angle: 0, last: 0, typed: -1, out: { x: 0, y: 0 }, leaving: false })
  const go = (p: Phase) => setPhase(p)
  const lines = late ? SAY_LATE : SAY

  // the start: the status line first (at the top, announced), then the scene; the regular guide stands down
  useEffect(() => {
    let dead = false
    const html = document.documentElement
    html.classList.add('sg-seen', 'sg-on')
    if (tier !== 'still') { prepareCurtain(); preloadSound() }
    void (async () => {
      // after the WhatsApp hand-off the tab may only now be leaving: let it go, then wait for the return
      if (late) await wait(900)
      await visible()
      await wait(late ? 600 : 1100)
      const status = document.querySelector<HTMLElement>('#contact .ct__status')
      await frameStatus(status, tier)
      if (dead) return
      setClear(status ? Math.round(status.getBoundingClientRect().bottom + 16) : 0)
      html.classList.add('sg-open')
      go('set')
    })()
    return () => { dead = true; html.classList.remove('sg-open', 'sg-on') }
  }, [late, tier])

  // the bubble is laid out (its text whole, the untyped part invisible); the orbit is measured from it
  const geo = useRef<Geo | null>(null)
  useLayoutEffect(() => {
    if (phase === 'wait' || !bubble.current) return
    const fit = () => {
      if (!bubble.current) return
      const g = (geo.current = measure(bubble.current))
      orbit.current?.setAttribute('cx', String(g.cx)); orbit.current?.setAttribute('cy', String(g.cy))
      orbit.current?.setAttribute('rx', String(g.rx)); orbit.current?.setAttribute('ry', String(g.ry))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [phase === 'wait']) // eslint-disable-line react-hooks/exhaustive-deps

  useFrames({ phase, tier, S, geo, disc, trail, worlds, say, lines, onGone: () => { finish() } })
  // painted once at rest, then opened, so the CSS entrances (bubble, orbit, "Later") run from their start
  useEffect(() => {
    if (phase !== 'set') return
    let id = requestAnimationFrame(() => { id = requestAnimationFrame(() => go('in')) })
    return () => cancelAnimationFrame(id)
  }, [phase])

  // focus: into the bubble once it speaks (the status has been read by then); Tab stays inside; Escape leaves
  useEffect(() => {
    if (phase !== 'in') return
    const id = window.setTimeout(() => say.current?.focus({ preventScroll: true }), tier === 'still' ? 500 : 2300)
    return () => clearTimeout(id)
  }, [phase, tier])
  useEffect(() => {
    if (phase === 'wait' || phase === 'out') return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); leave(); return }
      if (e.key !== 'Tab' || !root.current) return
      const f = [...root.current.querySelectorAll<HTMLElement>('button')]
      const i = f.indexOf(document.activeElement as HTMLElement)
      e.preventDefault()
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length]?.focus()
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  })

  const leave = () => {
    if (S.current.leaving) return
    S.current.leaving = true
    S.current.tOut = performance.now()
    go('out')
  }
  // focus goes back to the status line, not to a field (a field would open the phone's keyboard)
  const finish = () => {
    const to = document.querySelector<HTMLElement>('#contact .ct__status')
    if (to) { to.tabIndex = -1; to.focus({ preventScroll: true }) }
    onDone()
  }
  const pick = (s: StyleDef, el: HTMLElement) => {
    if (S.current.leaving) return
    S.current.leaving = true
    S.current.hold = true
    sea.pop()
    const r = el.querySelector('.sg__sw')?.getBoundingClientRect() ?? el.getBoundingClientRect()
    void travel(s, { x: r.left + r.width / 2, y: r.top + r.height / 2 }, navigate, tier, 'sent_guide')
  }

  if (phase === 'wait') return null
  // on body: a transformed ancestor would make the scene's fixed position relative to the section
  return createPortal(
    <div className="sg" ref={root} data-phase={phase} data-tier={tier} role="dialog" aria-modal="true" aria-labelledby="sg-say" style={{ ['--clear' as string]: `${clear}px` }}>
      <div className="sg__veil" onClick={leave} />
      <svg className="sg__orbit" aria-hidden="true" focusable="false"><ellipse ref={orbit} /></svg>
      <div className="sg__trail" ref={trail} aria-hidden="true">{Array.from({ length: TRAIL }, (_, i) => <i key={i} />)}</div>
      <div className="sg__bubble" ref={bubble}>
        <Isle out={7} radius={20} ink={false} />
        <span className="sg__tag" lang="en" dir="ltr" aria-hidden="true">[ PICK A WORLD ]</span>
        <p className="sg__say" id="sg-say" ref={say} tabIndex={-1} data-line={tier === 'still' ? 'done' : '1'}>
          <b><span className="sg__on" /><i className="sg__c sg__c1" aria-hidden="true" /><span className="sg__off">{lines[0]}</span></b>
          <span className="sg__on" /><i className="sg__c sg__c2" aria-hidden="true" /><span className="sg__off">{lines[1]}</span>
        </p>
      </div>
      {STYLES.map((s, i) => (
        <button
          key={s.id}
          type="button"
          className="sg__w"
          ref={(el) => { worlds.current[i] = el }}
          aria-label={`${s.name}: ${s.feel}`}
          style={{ ['--g' as string]: s.swatch[0], ['--k' as string]: s.swatch[1] }}
          onPointerEnter={() => { S.current.hold = true; sea.select() }}
          onPointerLeave={() => { if (!S.current.leaving) S.current.hold = false }}
          onFocus={() => { S.current.hold = true }}
          onBlur={() => { if (!S.current.leaving) S.current.hold = false }}
          onClick={(e) => pick(s, e.currentTarget)}
        >
          <span className="sg__sw" aria-hidden="true" />
          <span className="sg__n" aria-hidden="true">{s.name}</span>
          <span className="sg__k" lang="en" aria-hidden="true">{`0${i + 1}`}</span>
        </button>
      ))}
      <div className="sg__disc" ref={disc} aria-hidden="true"><Disc /></div>
      <button type="button" className="sg__later" onClick={leave} aria-label="אחר כך" lang="en">( Later )</button>
    </div>,
    document.body,
  )
}

/** the little world (Guide.tsx's disc): a white sky, the moving sea, a dotted ring */
function Disc() {
  return (
    <svg viewBox="-32 -32 64 64" aria-hidden="true" focusable="false">
      <defs><clipPath id="sg-disc"><circle r="15" /></clipPath></defs>
      <circle className="gd__glow" r="28" />
      <g className="gd__ring"><ellipse rx="25" ry="7.5" transform="rotate(-18)" /></g>
      <circle className="gd__sky" r="15" />
      <g clipPath="url(#sg-disc)"><path className="gd__sea" d="M-46 1c6-4 11-4 17 0s11 4 17 0 11-4 17 0 11 4 17 0 11-4 17 0 11 4 17 0V20h-102z" /></g>
      <circle className="gd__rim" r="15" />
    </svg>
  )
}

interface FrameArgs {
  phase: Phase
  tier: Tier
  S: React.MutableRefObject<{ t0: number; tOut: number; hold: boolean; angle: number; last: number; typed: number; out: { x: number; y: number }; leaving: boolean }>
  geo: React.MutableRefObject<Geo | null>
  disc: React.RefObject<HTMLDivElement>
  trail: React.RefObject<HTMLDivElement>
  worlds: React.MutableRefObject<(HTMLButtonElement | null)[]>
  say: React.RefObject<HTMLParagraphElement>
  lines: string[]
  onGone: () => void
}

/** the frame loop: the flight, the burst, the orbit, the typing; and the way out */
function useFrames(a: FrameArgs) {
  const { phase, tier, S } = a
  const gone = useRef(a.onGone)
  gone.current = a.onGone
  useEffect(() => {
    if (phase === 'wait') return
    const hist: [number, number][] = []
    let raf = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const g = a.geo.current
      if (!g) return
      const s = S.current
      // the clock starts with the first painted frame (a hidden tab paints none)
      if (!s.t0) s.t0 = now
      const dt = Math.min(0.05, (now - (s.last || now)) / 1000)
      s.last = now
      if (!s.hold && phase !== 'out') s.angle += dt * (tier === 'full' ? 0.16 : tier === 'calm' ? 0.07 : 0)
      const t = (now - s.t0) / 1000
      const out = phase === 'out' ? (now - s.tOut) / 1000 : -1
      const pos = placeDisc(a, g, t, out)
      hist.unshift(pos)
      if (hist.length > TRAIL + 1) hist.length = TRAIL + 1
      drawTrail(a, hist, t, out)
      placeWorlds(a, g, t, out)
      typeOn(a, t)
      if (out > (tier === 'still' ? 0.45 : 1.15)) { cancelAnimationFrame(raf); gone.current() }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps
}

/** the little world: in on a swoop from the right (the page's reading side), grows, bobs; out up and away */
function placeDisc(a: FrameArgs, g: Geo, t: number, out: number): [number, number] {
  const el = a.disc.current
  if (!el) return [g.cx, g.cy]
  const still = a.tier === 'still'
  const path: [number, number][] = [[g.w + 70, g.cy - g.ry - 140], [g.w * 0.74, g.cy - g.ry - 30], [g.w * 0.18, g.cy - g.ry * 0.2], [g.w * 0.3, g.cy + g.ry * 0.85], [g.cx, g.cy]]
  const fly = still ? 1 : easeOut((t - 0.1) / 1.45)
  let [x, y] = spline(path, fly)
  const grow = still ? 1 : easeBack((t - 1.5) / 0.5)
  let k = (64 + (g.disc - 64) * grow) / 64
  if (fly >= 1) y += Math.sin(t * 2.1) * 4
  let o = still ? clamp(t / 0.4) : clamp(t / 0.15)
  if (out >= 0) {
    if (!a.S.current.out.x) a.S.current.out = { x, y }
    const q = clamp((out - 0.25) / 0.85)
    const from = a.S.current.out
    x = from.x + (g.w * 0.15 - from.x) * q * q
    y = from.y + (-120 - from.y) * q * q
    k *= 1 - 0.4 * q
    if (still) o = 1 - clamp(out / 0.4)
  }
  const prev = spline(path, Math.max(0, fly - 0.02))
  const tilt = fly < 1 ? clamp((x - prev[0]) * 0.8, -18, 18) : 0
  el.style.opacity = o.toFixed(2)
  el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(1)}deg) scale(${k.toFixed(3)})`
  return [x, y]
}

/** the halftone trail: the disc's last positions as dots that shrink and fade toward the tail */
function drawTrail(a: FrameArgs, hist: [number, number][], t: number, out: number) {
  const dots = a.trail.current?.children
  if (!dots) return
  const moving = a.tier !== 'still' && (t < 1.7 || out > 0.2)
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i] as HTMLElement
    const p = hist[i + 1]
    if (!moving || !p) { if (d.style.opacity !== '0') d.style.opacity = '0'; continue }
    const f = 1 - i / dots.length
    d.style.opacity = (0.85 * f).toFixed(2)
    d.style.transform = `translate3d(${p[0].toFixed(1)}px, ${p[1].toFixed(1)}px, 0) scale(${(0.25 + 0.85 * f).toFixed(2)})`
  }
}

/** the four worlds: they burst out of the disc onto the orbit, turn slowly (held while one is pointed at),
    the far ones smaller and behind the disc; on the way out they fall back into it */
function placeWorlds(a: FrameArgs, g: Geo, t: number, out: number) {
  const still = a.tier === 'still'
  a.worlds.current.forEach((el, i) => {
    if (!el) return
    const burst = still ? 1 : easeBack((t - 1.85 - i * 0.07) / 0.7)
    const fall = out < 0 ? 0 : still ? 0 : easeOut(out / 0.4)
    const r = burst * (1 - fall)
    const ang = -Math.PI / 2 + (i * Math.PI) / 2 + a.S.current.angle
    const depth = (Math.sin(ang) + 1) / 2
    const x = g.cx + Math.cos(ang) * g.rx * r
    const y = g.cy + Math.sin(ang) * g.ry * r
    let o = still ? clamp((t - 0.25 - i * 0.12) / 0.4) : clamp(burst * 2)
    if (out >= 0) o = still ? 1 - clamp(out / 0.4) : 1 - fall
    el.style.opacity = o.toFixed(2)
    el.style.zIndex = depth > 0.5 ? '4' : '2'
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${((0.84 + 0.22 * depth) * (0.3 + 0.7 * r)).toFixed(3)})`
    el.style.pointerEvents = o > 0.6 && out < 0 ? 'auto' : 'none'
    if (!el.dataset.named && (still || t > 2.6 + i * 0.1)) el.dataset.named = ''
    if (i === 0 && !still && burst > 0 && !el.dataset.rang) { el.dataset.rang = ''; sea.ok() }
  })
}

/** the bubble types its two lines (the whole text is always there for a screen reader; the rest is invisible) */
function typeOn(a: FrameArgs, t: number) {
  const p = a.say.current
  if (!p || a.tier === 'still') return
  const n = Math.max(0, Math.floor((t - 2.15) * CPS))
  const s = a.S.current
  if (n === s.typed || s.typed >= a.lines[0].length + a.lines[1].length) return
  s.typed = Math.min(n, a.lines[0].length + a.lines[1].length)
  const on = p.querySelectorAll<HTMLElement>('.sg__on')
  const off = p.querySelectorAll<HTMLElement>('.sg__off')
  const n1 = Math.min(s.typed, a.lines[0].length)
  const n2 = Math.max(0, s.typed - a.lines[0].length)
  on[0].textContent = a.lines[0].slice(0, n1); off[0].textContent = a.lines[0].slice(n1)
  on[1].textContent = a.lines[1].slice(0, n2); off[1].textContent = a.lines[1].slice(n2)
  p.dataset.line = s.typed >= a.lines[0].length + a.lines[1].length ? 'done' : n1 < a.lines[0].length ? '1' : '2'
  if (s.typed > 0) sea.typeKey()
}
