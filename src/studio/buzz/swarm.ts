// The swarm, Buzz's flight model read from its bundle (design/styles/buzz/harvest.rtl.md §2), flying our
// bees: little chat bubbles with wings, the inquiries a site brings in. Every bee drifts on two sine
// waves, cruises at 58 px/s, and in 18% of its own 2.3-4.2 s cycle darts across half the screen; they
// keep apart, flee a mouse, are pulled softly home (homes spread on the plastic-number sequence) and
// fly in from outside the box over 1.05 s.

export interface SwarmOptions { count: number; pointer: boolean; delay?: number; /** the bee's box in px (CSS: 28 x 22, the escort 22 x 17) */ size?: [number, number]; /** px/s added to every bee's vertical speed (the scroll's wind) */ wind?: () => number; /** seconds per wing stroke (0: still wings) */ flap?: number }
export interface Swarm { stop: () => void; pause: (on: boolean) => void }

interface Bee { up: boolean; s: number; x: number; y: number; vx: number; vy: number; h: number; hx: number; hy: number; sx: number; sy: number; flip: number; rot: number }

const PLASTIC = 1.324717957244746
const A1 = 1 / PLASTIC
const A2 = 1 / (PLASTIC * PLASTIC)
const TAU = Math.PI * 2
const frac = (v: number) => v - Math.floor(v)

/** A chat bubble with wings: the wings flutter (CSS), the three dots type. (D199) The wings are their own
    HTML layer under the bubble, so their flutter is a transform the compositor runs: inside the SVG it was
    a main-thread restyle and SVG repaint of every wing of every bee, every frame (88 bees on a phone). */
const BEE = '<span class="bz-bee__w"><svg viewBox="0 0 40 32" focusable="false">'
  + '<g class="w"><ellipse cx="14" cy="8.5" rx="7.2" ry="4.6" transform="rotate(-24 14 8.5)"/><ellipse cx="26" cy="8.5" rx="7.2" ry="4.6" transform="rotate(24 26 8.5)"/></g>'
  + '</svg></span><svg class="bz-bee__b" viewBox="0 0 40 32" focusable="false">'
  + '<path class="b" d="M12.5 10.5h15a8.5 8.5 0 0 1 0 17h-13.2l-6.1 3.6 1.6-4.6a8.5 8.5 0 0 1 2.7-16z"/>'
  + '<g class="d"><circle cx="13.6" cy="19" r="2"/><circle cx="20" cy="19" r="2"/><circle cx="26.4" cy="19" r="2"/></g>'
  + '</svg>'

export function makeBee(i: number): HTMLElement {
  const el = document.createElement('span')
  el.className = `bz-bee bz-bee--${i % 3 === 0 ? 'lime' : 'sky'}`
  el.setAttribute('aria-hidden', 'true')
  el.style.setProperty('--bz-d', `${(-((i * 0.137) % 1) * 0.16).toFixed(3)}s`)
  el.innerHTML = BEE
  return el
}

/** (D210) The flying bees are drawn on one canvas per swarm: as DOM, every bee's inline transform was a style
    recalculation and a layer to composite every frame (and each wing stroke a layout), which held Buzz at 30
    frames a second on a phone. The bee is rasterised once per colour and wing stroke from the same drawing. */
const PAD = 4
function beeSvg(body: string, ink: string, down: boolean, px: number): string {
  const wing = `<g fill="rgba(255,255,255,0.72)" stroke="${ink}" stroke-width="1.3"${down ? ' transform="translate(0 13.6) scale(1 0.42) translate(0 -13.6)"' : ''}>`
    + '<ellipse cx="14" cy="8.5" rx="7.2" ry="4.6" transform="rotate(-24 14 8.5)"/><ellipse cx="26" cy="8.5" rx="7.2" ry="4.6" transform="rotate(24 26 8.5)"/></g>'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-PAD} ${-PAD} ${40 + 2 * PAD} ${32 + 2 * PAD}" width="${(40 + 2 * PAD) * px}" height="${(32 + 2 * PAD) * px}">${wing}`
    + `<path fill="${body}" stroke="${ink}" stroke-width="1.7" stroke-linejoin="round" d="M12.5 10.5h15a8.5 8.5 0 0 1 0 17h-13.2l-6.1 3.6 1.6-4.6a8.5 8.5 0 0 1 2.7-16z"/>`
    + `<g fill="${ink}"><circle cx="13.6" cy="19" r="2"/><circle cx="20" cy="19" r="2"/><circle cx="26.4" cy="19" r="2"/></g></svg>`
}
/** four sprites: [sky up, sky down, lime up, lime down], each a canvas at `px` device px per drawing unit */
async function sprites(host: HTMLElement, px: number): Promise<HTMLCanvasElement[]> {
  const cs = getComputedStyle(host)
  const v = (n: string, d: string) => cs.getPropertyValue(n).trim() || d
  const ink = v('--bz-ink', '#231e1e')
  const bodies = [v('--bz-b', '#d7e7f6'), v('--bz-lime', '#dbfa52')]
  const out: HTMLCanvasElement[] = []
  for (const body of bodies) {
    for (const down of [false, true]) {
      const im = new Image()
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(beeSvg(body, ink, down, px))
      await im.decode()
      const c = document.createElement('canvas')
      c.width = Math.ceil((40 + 2 * PAD) * px)
      c.height = Math.ceil((32 + 2 * PAD) * px)
      c.getContext('2d')?.drawImage(im, 0, 0, c.width, c.height)
      out.push(c)
    }
  }
  return out
}

export function createSwarm(host: HTMLElement, opt: SwarmOptions): Swarm {
  const DPR = Math.min(2, window.devicePixelRatio || 1)
  const [bw, bh] = opt.size ?? [28, 22]
  // a drawing unit on screen (the 40 x 32 drawing meets the box), and the sprites at twice the device scale
  const unit = Math.min(bw / 40, bh / 32)
  const cv = document.createElement('canvas')
  cv.className = 'bz-swarm__cv'
  cv.setAttribute('aria-hidden', 'true')
  host.appendChild(cv)
  const ctx = cv.getContext('2d')
  let art: HTMLCanvasElement[] = []
  void sprites(host, unit * DPR * 1.5).then((list) => { art = list }).catch(() => {})
  const bees: Bee[] = []
  let W = host.clientWidth
  let H = host.clientHeight
  const homes = () => bees.forEach((b, i) => {
    b.hx = W * 0.12 + frac(0.5 + A1 * (i + 1)) * W * 0.76
    b.hy = H * 0.14 + frac(0.5 + A2 * (i + 1)) * H * 0.72
  })
  for (let i = 0; i < opt.count; i++) {
    const s = frac(Math.sin(i * 91.7 + 3.1) * 43758.5453)
    const a = s * TAU
    const r = Math.max(W, H) * 0.7 + 46
    const sx = W / 2 + Math.cos(a) * r
    const sy = H / 2 + Math.sin(a) * r
    bees.push({ up: true, s, x: sx, y: sy, vx: 0, vy: 0, h: a + Math.PI, hx: 0, hy: 0, sx, sy, flip: 1, rot: 0 })
  }
  homes()

  let px = -1e5
  let py = -1e5
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = host.getBoundingClientRect()
    px = e.clientX - r.left
    py = e.clientY - r.top
  }
  if (opt.pointer) window.addEventListener('pointermove', onMove, { passive: true })
  const fit = () => { cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR) }
  fit()
  const ro = new ResizeObserver(() => { W = host.clientWidth; H = host.clientHeight; homes(); fit() })
  ro.observe(host)

  const flap = opt.flap ?? 0.13
  const start = performance.now() + (opt.delay ?? 0)
  let last = performance.now()
  let raf = 0
  let paused = false

  const step = (now: number) => {
    raf = requestAnimationFrame(step)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (paused || now < start) return
    const t = now / 1000
    const enter = Math.min(1, (now - start) / 1050)
    const ease = 1 - Math.pow(1 - enter, 3)
    if (ctx) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height) }
    const dw = (40 + 2 * PAD) * unit
    const dh = (32 + 2 * PAD) * unit
    let i = 0
    for (const b of bees) {
      const s = b.s
      b.h += (Math.sin(t * (0.27 + 0.4 * s) + TAU * s) + 0.6 * Math.sin(t * (0.13 + 0.11 * s) + 7 * s)) * 1.15 * dt
      // edges: turn the heading back in
      const edge = Math.min(b.x, W - b.x, b.y, H - b.y)
      if (edge < 110) {
        const want = Math.atan2(H / 2 - b.y, W / 2 - b.x)
        let d = want - b.h
        d = Math.atan2(Math.sin(d), Math.cos(d))
        b.h += d * 3.2 * (1 - Math.max(0, edge) / 110) * dt
      }
      const cruise = Math.max(58 * 0.46, 58 * (1 + 0.32 * Math.sin(t * (0.42 + 0.28 * s) + TAU * s)))
      const w = frac(t * (0.24 + 0.2 * s) + 5.37 * s)
      const k = w < 0.18 ? Math.sin((Math.PI * w) / 0.18) : 0
      const speed = cruise + W * 1.1 * k
      const resp = Math.min(1, (2.4 + 11 * k) * dt)
      b.vx += (Math.cos(b.h) * speed - b.vx) * resp
      b.vy += (Math.sin(b.h) * speed - b.vy) * resp
      for (const o of bees) {
        if (o === b) continue
        const dx = b.x - o.x
        const dy = b.y - o.y
        const d = Math.hypot(dx, dy)
        if (d > 0.01 && d < 66) { const f = (1300 * (1 - d / 66)) / d; b.vx += (dx / d) * f * dt; b.vy += (dy / d) * f * dt }
      }
      if (opt.pointer) {
        const dx = b.x - px
        const dy = b.y - py
        const d = Math.hypot(dx, dy)
        if (d > 0.01 && d < 380) { const f = (1600 * (1 - d / 380)) / d * 60; b.vx += (dx / d) * f * dt; b.vy += (dy / d) * f * dt }
      }
      if (opt.wind) b.vy += opt.wind() * (0.6 + 0.8 * s) * dt * 3
      const out = b.x < 0 || b.x > W || b.y < 0 || b.y > H ? 1 : 0
      b.vx += (b.hx - b.x) * (0.18 + 0.9 * out) * dt
      b.vy += (b.hy - b.y) * (0.18 + 0.9 * out) * dt
      const damp = Math.pow(0.97, dt * 60)
      b.vx *= damp
      b.vy *= damp
      b.x += b.vx * dt
      b.y += b.vy * dt
      const sp = Math.hypot(b.vx, b.vy)
      if (Math.abs(b.vx) > 4) b.flip = b.vx < 0 ? -1 : 1
      const tilt = sp > 6 ? Math.max(-0.6, Math.min(0.6, Math.atan2(b.vy, Math.abs(b.vx)))) : 0
      b.rot += (tilt - b.rot) * 0.18
      const x = b.sx + (b.x - b.sx) * ease
      const y = b.sy + (b.y - b.sy) * ease
      // the wings beat in two strokes, each bee on its own phase
      if (flap) b.up = Math.floor(t / flap + b.s * 7) % 2 === 0
      // translate, mirror, tilt: about the bee's centre, as the DOM bee turned
      const sprite = art[(i % 3 === 0 ? 2 : 0) + (b.up ? 0 : 1)]
      i++
      if (!ctx || !sprite) continue
      const r = b.rot * b.flip
      const c = Math.cos(r)
      const sn = Math.sin(r)
      ctx.setTransform(DPR * b.flip * c, DPR * sn, -DPR * b.flip * sn, DPR * c, DPR * x, DPR * y)
      ctx.drawImage(sprite, -dw / 2, -dh / 2, dw, dh)
    }
  }
  raf = requestAnimationFrame(step)

  return {
    stop: () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      cv.remove()
    },
    // a paused swarm (off screen) also stops its wings
    pause: (on) => { paused = on; host.classList.toggle('is-paused', on); if (!on) last = performance.now() },
  }
}

/** Under the still tier: the bees sit at their homes, nothing moves. */
export function placeStill(host: HTMLElement, count: number): () => void {
  const els: HTMLElement[] = []
  const W = host.clientWidth
  const H = host.clientHeight
  for (let i = 0; i < count; i++) {
    const el = makeBee(i)
    const x = W * 0.12 + frac(0.5 + A1 * (i + 1)) * W * 0.76
    const y = H * 0.14 + frac(0.5 + A2 * (i + 1)) * H * 0.72
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    host.appendChild(el)
    els.push(el)
  }
  return () => els.forEach((e) => e.remove())
}
