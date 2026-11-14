// sun · the buttons move (D275, Nati 15.11.2026: "אנימציה איכותית יפהפייה וסופר חלקה שהחיצים זזים וסמל הוואטסאפ זז וכל
// פעם משהו אחר מוצג בכפתור... בחוכמה בכל האתר"). One conductor for the whole page, so the page never fidgets:
//  · one beat at a time, page-wide, every five seconds or so, given to a button that stands well inside the screen
//    and has waited longest; each button takes its beats in turn, so the next time it moves, something else happens:
//      flow  the chevrons step forward twice, a new one coming in behind them
//      type  the handset in the WhatsApp bubble steps aside for three typing dots, then springs back
//      say   the label rolls up and its second line (a fact) takes its place for two seconds, then rolls back
//      dive  ("איך זה עובד", the answer is further down the page) the chevrons turn down and flow down, then turn back
//  · moments that mean something get their own beat: the floating capsule arriving (type), the menu opening (type),
//    the form becoming ready to send (flow), and while it sends, the chevrons keep flowing.
//  · a hand comes first: a pointer on a button flows its chevrons at once, a tap sends them forward, and while the
//    pointer is on any button or the page is scrolling, the conductor waits.
// Nothing moves by itself with ?calm=1; nothing moves at all with "ללא אנימציות" or ?reduce=1, or in the prerender.
// Every beat is a Web Animation of transform and opacity on its own box: the compositor runs it, the page does not
// lay out again, and it ends where it began (nothing is left written on the page).

type Beat = 'flow' | 'type' | 'say' | 'dive'

const html = () => document.documentElement
const frozen = () => html().classList.contains('disable-animations')
const calm = () => frozen() || html().classList.contains('calm')
const resting = () => calm() || html().classList.contains('menu-open')
const PRERENDER = () => !!(window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__

/** A spring as a CSS linear() curve (stiffness, damping, mass 1), with how long it takes to settle. */
function spring(k: number, c: number) {
  const w0 = Math.sqrt(k)
  const z = c / (2 * w0)
  const wd = w0 * Math.sqrt(1 - z * z)
  const x = (t: number) => 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t))
  let end = 0
  for (let t = 0; t < 3; t += 1 / 240) if (Math.abs(1 - x(t)) > 0.003) end = t
  end += 1 / 60
  const pts: string[] = []
  for (let i = 0; i <= 48; i++) pts.push(i === 48 ? '1' : x((end * i) / 48).toFixed(4))
  return { ease: `linear(${pts.join(', ')})`, ms: Math.round(end * 1000) }
}
const linearOk = () => typeof CSS !== 'undefined' && CSS.supports('transition-timing-function', 'linear(0, 1)')
let SOFT = { ease: 'cubic-bezier(.25, 1, .5, 1)', ms: 520 } // settles with no bounce worth seeing
let POP = { ease: 'cubic-bezier(.3, 1.5, .5, 1)', ms: 560 } // a little past, then back
const IN = 'cubic-bezier(.55, 0, .75, .2)'
const STEP = 'cubic-bezier(.6, 0, .25, 1)'

const running = new WeakMap<Element, Animation[]>()
function stop(el: Element) {
  running.get(el)?.forEach((a) => a.cancel())
  running.delete(el)
}
function keep(el: Element, list: Animation[]) {
  running.set(el, list)
  return Promise.all(list.map((a) => a.finished.catch(() => undefined))).then(() => { if (running.get(el) === list) running.delete(el) })
}

/** flow: the chevrons step forward `steps` times; the third chevron comes in behind as the first one leaves. */
function flow(el: Element, steps = 2, ms = 460, delay = 0, iterations = steps) {
  const go = el.querySelector('.go')
  if (!go) return []
  const [a, b, c] = Array.from(go.children) as HTMLElement[]
  const p = (go as HTMLElement).offsetWidth * (7 / 24)
  const o = { duration: ms, delay, iterations, easing: STEP }
  return [
    a.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: `translateX(${-p}px)`, opacity: 0 }], o),
    b.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-p}px)` }], o),
    c.animate([{ transform: `translateX(${p}px)`, opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }], o),
  ]
}

/** type: the handset steps aside, three dots type in the bubble, the handset springs back. */
function type(el: Element) {
  const set = el.querySelector('.glyph__set')
  const dots = Array.from(el.querySelectorAll('.glyph__dots i'))
  if (!set || dots.length < 3) return []
  const T = 2000
  const back = (T - POP.ms) / T
  const list = [set.animate([
    { transform: 'scale(1)', opacity: 1, easing: IN },
    { transform: 'scale(.35)', opacity: 0, offset: 0.1 },
    { transform: 'scale(.35)', opacity: 0, offset: back, easing: POP.ease },
    { transform: 'scale(1)', opacity: 1 },
  ], { duration: T })]
  dots.forEach((d, i) => {
    list.push(d.animate([
      { transform: 'translateY(0) scale(.4)', opacity: 0 },
      { transform: 'translateY(0) scale(1)', opacity: 1, offset: 0.12 },
      { transform: 'translateY(-2.2px) scale(1)', opacity: 1, offset: 0.26 },
      { transform: 'translateY(0) scale(1)', opacity: 0.55, offset: 0.4 },
      { transform: 'translateY(-2.2px) scale(1)', opacity: 1, offset: 0.54 },
      { transform: 'translateY(0) scale(1)', opacity: 0.55, offset: 0.68 },
      { transform: 'translateY(-2.2px) scale(1)', opacity: 1, offset: 0.82 },
      { transform: 'translateY(0) scale(.4)', opacity: 0 },
    ], { duration: 1360, delay: 200 + i * 110, easing: 'ease-in-out' }))
  })
  return list
}

/** say: the label rolls up word by word, in reading order, and the second line rolls in under it; then back. */
function say(el: Element) {
  const box = el.querySelector('.say') as HTMLElement | null
  const a = Array.from(el.querySelectorAll('.say__a .w'))
  const b = Array.from(el.querySelectorAll('.say__b .w'))
  if (!box || !b.length) return []
  const d = Math.round(box.offsetHeight * 0.62)
  const OUT = 300, HOLD = 2300, LAG = 130, GAP = 32
  const x = LAG + SOFT.ms + HOLD // when the second line leaves
  const T = x + LAG + SOFT.ms
  const at = (ms: number) => Math.min(1, ms / T)
  const shown = { transform: 'translateY(0)', opacity: 1, filter: 'blur(0px)' }
  const up = { transform: `translateY(${-d}px)`, opacity: 0, filter: 'blur(2.5px)' }
  const down = { transform: `translateY(${d}px)`, opacity: 0, filter: 'blur(2.5px)' }
  const list: Animation[] = []
  a.forEach((w, i) => list.push(w.animate([
    { ...shown, easing: IN },
    { ...up, offset: at(OUT) },
    { ...down, offset: at(x + LAG), easing: SOFT.ease },
    { ...shown },
  ], { duration: T, delay: i * GAP })))
  b.forEach((w, i) => list.push(w.animate([
    { ...down, easing: SOFT.ease },
    { ...down, offset: at(LAG), easing: SOFT.ease },
    { ...shown, offset: at(LAG + SOFT.ms) },
    { ...shown, offset: at(x), easing: IN },
    { ...up, offset: at(x + OUT) },
    { ...up },
  ], { duration: T, delay: i * GAP })))
  return list
}

/** dive: the chevrons turn to point down the page, flow down, and turn back. */
function dive(el: Element) {
  const go = el.querySelector('.go')
  if (!go) return []
  const T = 2100
  const turn = Math.min(0.3, POP.ms / T)
  return [
    go.animate([
      { transform: 'rotate(0deg)', easing: POP.ease },
      { transform: 'rotate(-90deg)', offset: turn },
      { transform: 'rotate(-90deg)', offset: 1 - turn, easing: POP.ease },
      { transform: 'rotate(0deg)' },
    ], { duration: T }),
    ...flow(el, 2, 420, 480),
  ]
}

const BEATS: Record<Beat, (el: Element) => Animation[]> = { flow: (el) => flow(el), type, say, dive }

function play(el: Element, beat: Beat) {
  stop(el)
  return keep(el, BEATS[beat](el))
}

/** A beat for a moment that means something (the capsule arriving, the menu opening, the form ready). */
export function cue(el: Element | null | undefined, beat: Beat, delay = 0) {
  if (!el || typeof window === 'undefined' || PRERENDER()) return
  window.setTimeout(() => { if (!calm() && el.isConnected) void play(el, beat) }, delay)
}

/** While something is on its way (the form sending), the chevrons keep flowing; off settles them. */
export function keepFlowing(el: Element | null | undefined, on: boolean) {
  if (!el || typeof window === 'undefined') return
  stop(el)
  if (on && !frozen()) running.set(el, flow(el, 1, 520, 0, Infinity))
}

export function startButtons() {
  if (typeof window === 'undefined' || PRERENDER() || typeof Element.prototype.animate !== 'function') return
  if (linearOk()) { SOFT = spring(210, 26); POP = spring(320, 19) }
  // dev only: the recordings play the beats one after another on command
  if (import.meta.env.DEV) (window as unknown as { __mwBeat?: unknown }).__mwBeat = (sel: string, beat: Beat) => { const el = document.querySelector(sel); return el ? play(el, beat) : null }

  // the lens (one of the two materials Nati compares): its refraction is an SVG filter inside backdrop-filter,
  // which only Chromium draws; every other browser keeps the frosted glass underneath it
  if ('userAgentData' in navigator) {
    html().classList.add('lens-ok')
    document.body.insertAdjacentHTML('beforeend', '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><filter id="mw-lens" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="1" seed="5" result="n"/><feGaussianBlur in="n" stdDeviation="3" result="b"/><feDisplacementMap in="SourceGraphic" in2="b" scale="34" xChannelSelector="R" yChannelSelector="G"/></filter></svg>')
  }

  const seen = new Set<Element>()
  const turns = new WeakMap<Element, { n: number; at: number }>()
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) seen.add(e.target)
      else seen.delete(e.target)
    }
  }, { threshold: 0.9 })

  let scrolled = 0
  let pointer: Element | null = null
  window.addEventListener('scroll', () => { scrolled = performance.now() }, { passive: true })

  const conduct = () => {
    let wait = 4600 + Math.random() * 1400
    document.querySelectorAll('[data-beats]').forEach((el) => io.observe(el))
    const now = performance.now()
    if (document.hidden || resting() || pointer) wait = 1500
    else if (now - scrolled < 700) wait = 900
    else {
      const focus = document.activeElement
      let pick: Element | undefined
      let oldest = Infinity
      for (const el of seen) {
        if (!el.isConnected || running.has(el) || el === focus || el.getAttribute('aria-hidden') === 'true') continue
        const at = turns.get(el)?.at ?? 0
        if (at < oldest) { oldest = at; pick = el }
      }
      if (pick) {
        const list = (pick.getAttribute('data-beats') || '').split(' ').filter((b): b is Beat => b in BEATS)
        const t = turns.get(pick) ?? { n: 0, at: 0 }
        if (list.length) void play(pick, list[t.n % list.length])
        turns.set(pick, { n: t.n + 1, at: now })
      } else wait = 1200
    }
    window.setTimeout(conduct, wait)
  }
  // the first beat waits for the hero's opening to finish
  window.setTimeout(conduct, 2600)

  // a hand comes first
  const HAND = '.btn, .tab, .head__cta'
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (fine) {
    let lit: HTMLElement | null = null
    let x = 50
    let raf = 0
    const write = () => { raf = 0; lit?.style.setProperty('--gx', `${x.toFixed(1)}%`) }
    window.addEventListener('pointerover', (e) => {
      const t = (e.target as Element | null)?.closest?.(HAND) ?? null
      if (t === pointer) return
      pointer = t
      if (t && !frozen() && !running.has(t)) void keep(t, flow(t, 1, 380))
    }, { passive: true })
    // the light on the button stands where the pointer is (the sheen reads --gx)
    window.addEventListener('pointermove', (e) => {
      const t = (e.target as Element | null)?.closest?.(HAND) as HTMLElement | null
      if (t !== lit) { lit?.style.removeProperty('--gx'); lit = t }
      if (!t) return
      const r = t.getBoundingClientRect()
      x = Math.min(100, Math.max(0, ((e.clientX - r.left) / Math.max(1, r.width)) * 100))
      if (!raf) raf = requestAnimationFrame(write)
    }, { passive: true })
  }
  document.addEventListener('click', (e) => {
    const t = (e.target as Element | null)?.closest?.(HAND)
    if (t && !frozen() && !t.matches('[type="submit"]')) { stop(t); void keep(t, flow(t, 1, 340)) }
  }, { capture: true, passive: true })

  // "ללא אנימציות" switched on in the middle of a beat: everything stands still at once
  new MutationObserver(() => { if (frozen()) document.querySelectorAll('.btn, .tab, .head__cta').forEach(stop) })
    .observe(html(), { attributes: true, attributeFilter: ['class'] })
}
