// sun · the opener (D296, Nati 18.11.2026: an opening screen that says "היי אנחנו MediaWave, ואנחנו טובים בלהביא לכם
// לקוחות."; D297: with the sound of the waves, and every motion smooth). The idea is the name: a wave that brings
// customers. The page is a beach seen from above.
//   wave one runs up the sand and, going back, leaves the greeting;
//   wave two leaves the statement, and message bubbles (the customers) stay on the shore where it dropped them;
//   wave three covers the whole screen, and going back it uncovers the site itself, still wet.
// Under the cover the page boots and paints exactly as it does without the opener (the wheel's own opening
// included): a page that waited for the wave painted its largest picture seconds late (Lighthouse LCP 2.2 s to 3.5 s).
// index.html decides before first paint (html.mw-intro, html.mw-intro-cover: a mint cover from sun.css); entry.tsx
// starts this only then. Without a real GPU (no WebGL, or a software renderer) it lifts the cover at once.
// The sea is one WebGL fragment shader (shader.ts); the bubbles are DOM, riding the same edge the shader draws (the
// same two lines of maths); the sound is made in WebAudio from the same numbers (sound.ts).
// A touch on the water makes a ring and, the first time, turns the sound on. "Skip", a key or a scroll sends wave
// three at once. Nothing here runs in the prerender, with ?calm=1, ?reduce=1, or after "ללא אנימציות" is switched on.
import './opener.css'
import { FRAG, VERT } from './shader'
import { OPENER } from '../content'
import { buildSea, LEVEL, makeSea, pinkNoise } from './sound'

/** A wave: the water rises by `a` over `up` seconds and settles at `to` over `down`. Waves add up, so one that
    arrives while the last is still going out meets it without a jolt (the level and its speed stay continuous). */
type Pulse = { t: number; up: number; down: number; a: number; to: number }
type Bub = { el: HTMLElement; body: HTMLElement; dots: HTMLElement[]; x: number; y: number; s: number; w: number; rot: number; state: 0 | 1 | 2 | 3; ph: number; born: number; land: number; fl: number; n: number }

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ramp = (t: number, at: number, d: number) => clamp((t - at) / d)
const outCubic = (u: number) => 1 - Math.pow(1 - u, 3)
const inOut = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * u)
const backOut = (u: number) => 1 + 2.4 * Math.pow(u - 1, 3) + 1.4 * Math.pow(u - 1, 2)
/** A run up the beach: it gathers from standing (no jerk at the start), is fastest a fifth of the way in, and dies out. */
const rise = (u: number) => 1 - Math.pow(1 - Math.pow(u, 1.5), 3)

/** The score, in seconds. W3 is where the last wave starts unless the visitor sends it sooner. */
const W1 = 0.15, W2 = 2.3, W3 = 5.9
const SHOW1 = 0.9, SHOW2 = 3.05, MARK = 4.55
const UP3 = 1.05, FADE = 1.5, END = 2.9
const A0 = 0.036, A1 = 0.03
/** The sea's resolutions, in canvas pixels per CSS pixel, and the time the probe's frame of full water may take (ms).
    The probe includes the wait for the answer, so 13 leaves a 60 Hz frame its margin: measured on Iris Xe, 8 to 11.5
    at the starting resolution on a phone screen and at 1440 and 1920 wide, all of which then hold 60 frames a second. */
const SCALES = [2, 1.5, 1.25, 1, 0.75]
const BUDGET = 13

export function startOpener(): void {
  const html = document.documentElement
  const w = window as unknown as { __mwIntro?: boolean; __mwOpener?: unknown; __mwSea?: HTMLCanvasElement }
  if (w.__mwIntro) return
  w.__mwIntro = true
  try { sessionStorage.setItem('mw-wave-intro', '1') } catch { /* private mode: it plays again next page, no harm */ }

  const root = document.createElement('div')
  root.className = 'opener'
  root.innerHTML = `<div class="opener__life" aria-hidden="true"></div><div class="opener__say" aria-hidden="true"></div><p class="opener__sr">${OPENER.hi} ${OPENER.say}</p>
<div class="opener__ui"><button type="button" class="opener__sound" aria-label="${OPENER.soundAria}" aria-pressed="false"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9.5v5h3.6L12 18V6L7.6 9.5H4z" fill="currentColor"/><path class="opener__on" d="M15.5 9.2a4 4 0 0 1 0 5.6M18 6.8a7.4 7.4 0 0 1 0 10.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path class="opener__no" d="M15.6 9.6l4.8 4.8m0-4.8l-4.8 4.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><span lang="en" dir="ltr"></span></button><button type="button" class="opener__skip" aria-label="${OPENER.skipAria}"><span lang="en" dir="ltr">${OPENER.skip}</span><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 6l-6 6 6 6m7-12l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`
  const cv = document.createElement('canvas')
  cv.className = 'opener__sea'
  cv.setAttribute('aria-hidden', 'true')
  root.prepend(cv)
  const life = root.children[1] as HTMLElement
  const say = root.children[2] as HTMLElement
  const soundBtn = root.querySelector('.opener__sound') as HTMLButtonElement
  const soundLabel = soundBtn.lastElementChild as HTMLElement

  // ---- the sound: armed from the start, on at the visitor's first touch
  const paintSound = () => {
    const s = sea.state()
    root.dataset.sound = s
    if (sea.cost()) root.dataset.audio = sea.cost()
    soundBtn.hidden = s === 'none'
    soundBtn.setAttribute('aria-pressed', s === 'on' ? 'true' : 'false')
    soundLabel.textContent = s === 'on' ? OPENER.sound[1] : s === 'off' ? OPENER.sound[2] : OPENER.sound[0][window.matchMedia('(hover: hover) and (pointer: fine)').matches ? 1 : 0]
  }
  const sea = makeSea(() => paintSound())
  /** where the plips go: the live sea, or (dev) the offline render */
  let sink: { plip: (i: number, vol?: number) => void } = sea
  paintSound()

  let ended = false
  let opened = false
  let raf = 0
  const open = () => {
    if (opened) return
    opened = true
    html.classList.remove('mw-intro-cover')
    root.classList.remove('opener--sand')
    root.classList.add('opener--open')
    window.dispatchEvent(new Event('mw-intro-open'))
  }
  const cleanup: (() => void)[] = []
  const end = (fade = true) => {
    if (ended) return
    ended = true
    open()
    cancelAnimationFrame(raf)
    cleanup.forEach((f) => f())
    sea.fade()
    window.setTimeout(() => sea.close(), 2600)
    html.classList.remove('mw-intro')
    window.dispatchEvent(new Event('mw-intro-end'))
    // The sea's context is never torn down while the page lives: destroying it (loseContext, or the canvas being
    // collected) is a frame of 100 to 280 ms on the GPU, and it would fall on the page the visitor has just been
    // given. The canvas shrinks to one pixel and stays in the window's keeping.
    const rest2 = () => { root.remove(); w.__mwSea = cv }
    if (!fade) { rest2(); return }
    root.classList.add('opener--out')
    window.setTimeout(rest2, 650)
  }

  const gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: true })
  if (!gl) { end(false); return }
  document.body.appendChild(root)

  // ---- the program, compiled off the main thread where the browser can (a synchronous compile is a long task).
  //      Nothing is ASKED of the context here: every question (an extension, the renderer's name) waits for the GPU
  //      process to have finished making the context, and asked in this first task that wait was 100 to 140 ms of
  //      the page's boot (traced). The questions are put a few frames later (`ask`), when the answers are ready.
  let par: { COMPLETION_STATUS_KHR: number } | null = null
  /** A real GPU, or the page as it always was. A headless Chrome hands out its software renderer without calling it
      a caveat, so the renderer is asked for its name as well (a lab run without a GPU: the sea, drawn on the CPU,
      would cost seconds of blocking). */
  const ask = () => {
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    if (/swiftshader|llvmpipe|software|basic render/i.test(String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)))) return false
    par = gl.getExtension('KHR_parallel_shader_compile')
    return true
  }
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s }
  const prog = gl.createProgram()!
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const tex = gl.createTexture()
  const U: Record<string, WebGLUniformLocation | null> = {}
  const linked = () => !par || gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR)
  const ready = () => {
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false
    gl.useProgram(prog)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    for (const n of ['uRes', 'uT', 'uL', 'uAmp', 'uSurge', 'uBack', 'uK', 'uWet', 'uShow', 'uText', 'uWave', 'uMark', 'uMarkP', 'uDrop']) U[n] = gl.getUniformLocation(prog, n)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.uniform1i(U.uText, 0)
    return true
  }

  // ---- the stage: sizes, the sentence as a texture, where each thing stands
  let W = 1, H = 1, asp = 1, K = 1, scale = 1
  let rest = 0.15, p1 = 0.85, p2 = 0.7
  let waveBox = [0, 0, 0, 0], markBox = [0, 0, 1, 1]
  let bubs: Bub[] = []
  let lines: HTMLElement[] = []
  let lineBox: [number, number][] = []
  const font = (px: number) => `700 ${px}px "MW Head", "MW Head Fallback", Arial, sans-serif`

  const stage = () => {
    W = root.clientWidth || window.innerWidth
    H = root.clientHeight || window.innerHeight
    asp = W / H
    // one and a half lobes of swash across a phone, three across a desk
    K = (Math.PI * clamp(asp * 1.7, 1.35, 3.2)) / asp
    cv.width = Math.round(W * scale)
    cv.height = Math.round(H * scale)
    gl.viewport(0, 0, cv.width, cv.height)

    const narrow = W < 720
    const big = OPENER.split
    const c = document.createElement('canvas')
    c.width = cv.width; c.height = cv.height
    const x = c.getContext('2d')!
    x.scale(scale, scale)
    x.fillStyle = '#000'; x.fillRect(0, 0, W, H)
    x.globalCompositeOperation = 'lighter'
    x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'alphabetic'
    x.font = font(100)
    const widest = Math.max(...big.map((s) => x.measureText(s).width))
    const fB = Math.min(((W * 0.88) / widest) * 100, H * (narrow ? 0.074 : 0.135), 150)
    const fA = fB * (narrow ? 0.76 : 0.62)
    const blockH = fA * 0.8 + fB * 1.2 + (big.length - 1) * fB * 1.14 + fB * 0.12
    const top = narrow ? H * 0.275 - blockH * 0.1 : H * 0.47 - blockH * 0.62
    const y1 = top + fA * 0.8
    const yB = big.map((_, i) => y1 + fB * 1.2 + i * fB * 1.14)
    const cx = W / 2
    const all = (g: CanvasRenderingContext2D) => {
      g.font = font(fA); g.fillText(OPENER.hi, cx, y1)
      g.font = font(fB); big.forEach((s, i) => g.fillText(s, cx, yB[i]))
    }
    // r: the greeting. g: the statement.
    x.font = font(fA); x.fillStyle = '#f00'; x.fillText(OPENER.hi, cx, y1)
    x.font = font(fB); x.fillStyle = '#0f0'; big.forEach((s, i) => x.fillText(s, cx, yB[i]))
    // b: a soft halo of all of it: a shadow thrown from text drawn off the canvas (ctx.filter is not everywhere),
    // made on a canvas a quarter of the size and stretched back: a blur this wide over the full canvas was a long task
    const q = 0.25 * scale
    const hc = document.createElement('canvas')
    hc.width = Math.ceil(W * q); hc.height = Math.ceil(H * q)
    const hx = hc.getContext('2d')!
    hx.direction = 'rtl'; hx.textAlign = 'center'; hx.textBaseline = 'alphabetic'
    hx.fillStyle = '#000'; hx.shadowColor = '#00f'; hx.shadowBlur = fB * 0.42 * q; hx.shadowOffsetX = 30000
    hx.scale(q, q); hx.translate(-30000 / q, 0)
    all(hx); all(hx)
    x.drawImage(hc, 0, 0, W, H)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c)

    // "Wave" takes the logo's teal: its box inside the Latin run, which sits left of the Hebrew words
    x.font = font(fA)
    const cut = OPENER.hi.indexOf('MediaWave')
    const xR = cx + x.measureText(OPENER.hi).width / 2
    const wHeb = x.measureText(OPENER.hi.slice(0, cut)).width
    const wMW = x.measureText('MediaWave').width
    const v = (y: number) => 1 - y / H
    waveBox = [(xR - wHeb - wMW + x.measureText('Media').width) / W, v(y1 + fA * 0.3), (xR - wHeb) / W, v(y1 - fA)]
    // the marker under the last word (the full stop stands to its left)
    x.font = font(fB)
    const lastLine = big[big.length - 1]
    const yL = yB[big.length - 1]
    const left = cx - x.measureText(lastLine).width / 2 + x.measureText('.').width
    markBox = [(left - fB * 0.07) / W, v(yL + fB * 0.16), (left + x.measureText(OPENER.last).width + fB * 0.07) / W, v(yL - fB * 0.26)]

    // how high each wave has to climb to cover what it leaves behind
    rest = narrow ? 0.15 : 0.13
    p1 = v(top) + 0.035 + (A0 + A1) * 0.64
    p2 = v(y1 + fB * 0.32) + 0.03 + (A0 + A1) * 0.64
    // the shore the bubbles are left on: between the sentence and the resting sea. A resize (a phone's address bar,
    // a turned screen) moves the ones that are already there; it never takes them back to the sea.
    const hi = v(yL + fB * (narrow ? 0.55 : 0.5)), lo = rest + (narrow ? 0.085 : 0.075)
    const spots: [number, number, number][] = narrow
      ? [[0.80, 0.86, 56], [0.55, 0.52, 46], [0.27, 0.92, 62], [0.14, 0.40, 44], [0.74, 0.20, 50], [0.42, 0.08, 40]]
      : [[0.87, 0.66, 84], [0.75, 0.14, 66], [0.64, 0.84, 92], [0.53, 0.30, 70], [0.42, 0.90, 78], [0.31, 0.20, 88], [0.20, 0.72, 70], [0.94, 0.10, 58], [0.09, 0.26, 62], [0.70, 0.52, 54]]
    if (bubs.length !== spots.length) {
      life.textContent = ''
      bubs = spots.map((_, i) => {
        const el = document.createElement('span')
        el.className = `ob${i % 2 ? ' ob--l' : ''}`
        el.innerHTML = '<span class="ob__b"><i></i><i></i><i></i></span>'
        life.appendChild(el)
        const body = el.firstElementChild as HTMLElement
        return { el, body, dots: Array.from(body.children) as HTMLElement[], x: 0, y: 0, s: 0, w: 0, rot: ((i * 37) % 13) - 6, state: 0, ph: i * 1.7, born: 0, land: -1, fl: 1, n: i }
      })
    }
    spots.forEach(([bx, by, s], i) => {
      const b = bubs[i]
      b.x = bx; b.y = lo + (hi - lo) * by; b.s = s
      b.w = Math.round(s * (narrow ? clamp(W / 390, 0.82, 1.1) : clamp(H / 900, 0.8, 1.15)))
      b.el.style.setProperty('--s', `${b.w}px`)
      // until the wave lifts it, a bubble lies in its place at full size and one hundredth of an opacity: nobody can
      // see it, but the browser has painted it and given it its layer. Ten bubbles first painted in the frame the
      // second wave arrived cost that frame (33 ms, measured at the same moment in every run).
      if (b.state === 0) warm(b)
    })
    // the same sentence once more, on top, at the screen's full resolution: the sea's canvas draws it under the water
    // (bent, and at the sea's own resolution, which a dense or a weak phone lowers); above the waterline these two
    // small canvases take over, drawn by the same calls at the same places, as sharp as any heading on the site.
    // Canvases and not text on purpose: text that appears seconds in would become the page's largest paint (LCP).
    say.textContent = ''
    lines = []
    lineBox = []
    const dpr = Math.min(window.devicePixelRatio || 1, 3)
    if (dpr > scale + 0.01) {
      const sharp = (from: number, to: number, paint: (g: CanvasRenderingContext2D) => void) => {
        const c2 = document.createElement('canvas')
        const y0 = Math.floor(from), h = Math.ceil(to) - y0
        c2.className = 'opener__ln'
        c2.width = Math.round(W * dpr); c2.height = Math.round(h * dpr)
        c2.style.cssText = `top:${y0}px;width:${c2.width / dpr}px;height:${c2.height / dpr}px`
        const g = c2.getContext('2d')!
        g.scale(dpr, dpr); g.translate(0, -y0)
        g.direction = 'rtl'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'
        paint(g)
        say.appendChild(c2)
        lineBox.push([y0, h])
        return c2
      }
      const wx0 = waveBox[0] * W, wx1 = waveBox[2] * W
      lines = [
        sharp(y1 - fA * 1.15, y1 + fA * 0.4, (g) => {
          g.font = font(fA)
          // "Wave" in the logo's teal: the line is drawn twice, each time through its own window
          g.save(); g.beginPath(); g.rect(0, 0, wx0, H); g.rect(wx1, 0, W - wx1, H); g.clip(); g.fillStyle = '#13241F'; g.fillText(OPENER.hi, cx, y1); g.restore()
          g.save(); g.beginPath(); g.rect(wx0, 0, wx1 - wx0, H); g.clip(); g.fillStyle = '#0F8478'; g.fillText(OPENER.hi, cx, y1); g.restore()
        }),
        sharp(yB[0] - fB * 1.15, yL + fB * 0.4, (g) => { g.font = font(fB); g.fillStyle = '#13241F'; big.forEach((t2, k) => g.fillText(t2, cx, yB[k])) }),
      ]
    }
    shown = ['', '']
    cuts = [-1, -1]
    build()
  }

  // ---- the water's level over time: the resting sea plus every wave on its way in or out
  let pulses: Pulse[] = []
  let w3 = W3
  const pulseAt = (p: Pulse, t: number) => {
    const x = t - p.t
    if (x <= 0) return 0
    return x < p.up ? p.a * rise(x / p.up) : p.a + (p.to - p.a) * inOut(clamp((x - p.up) / p.down))
  }
  const levelAt = (t: number) => { let L = rest; for (const p of pulses) L += pulseAt(p, t); return L }
  const build = () => {
    pulses = []
    // each wave is sized so that, on top of whatever is still moving, its crest reaches the line it has to cover
    const add = (t: number, up: number, down: number, crest: number, to = 0) => {
      let under = 0
      for (const p of pulses) under += pulseAt(p, t + up)
      pulses.push({ t, up, down, a: crest - rest - under, to })
    }
    if (w3 > W1) add(W1, 1.0, 1.55, p1)
    if (w3 > W2) add(W2, 0.95, 1.7, p2)
    add(w3, UP3, 1.6, 1.16 + (A0 + A1) * 0.64, -0.3 - rest)
  }
  const lobes = (x: number, t: number) => {
    const a = x * K + t * 0.07 + 1.7, b = x * K * 1.73 - t * 0.05 + 4.2
    return Math.sqrt(Math.sin(a) ** 2 + 0.004) * 0.62 + Math.sqrt(Math.sin(b) ** 2 + 0.004) * 0.38
  }

  // ---- the state one step moves. Two clocks: `clock` always runs (the sea is alive from its first frame), `t` is the
  //      score's time and starts only when the page under the cover has finished booting (see the frame loop).
  let t = 0, clock = 0, armed = false, L = rest, surge = 0, back = 0, amp = A0
  let wet = [rest + 0.02, A0, 0.8, 0]
  const drops = new Float32Array(18).fill(-99)
  let dropI = 0
  let fadedSound = false
  const warm = (b: Bub) => {
    b.el.style.opacity = '0.01'
    b.el.style.transform = `translate3d(${(b.x * W).toFixed(1)}px,${(H * (1 - b.y)).toFixed(1)}px,0)`
    b.body.style.transform = 'none'
  }
  const reset = () => {
    t = 0; clock = 0; L = rest; surge = 0; back = 0; amp = A0; wet = [rest + 0.02, A0, 0.8, 0]; drops.fill(-99); dropI = 0
    bubs.forEach((b) => { b.state = 0; b.land = -1; b.fl = 1; b.el.style.display = ''; b.el.classList.remove('ob--on'); warm(b) })
  }
  const front = (xu: number) => L + amp * (lobes(xu, clock) - 0.64) + 0.01 * Math.sin(xu * K * 0.5 + clock * 0.9)
  const breath = () => 0.5 + 0.5 * Math.sin(clock * 1.9)
  const ring = (xu: number, lv: number) => drops.set([xu, lv, clock], (dropI++ % 6) * 3)

  const step = (dt: number) => {
    if (dt <= 0) return
    clock += dt
    if (armed) t += dt
    const Ln = levelAt(t) + 0.007 * Math.sin(clock * 1.9) + 0.004 * Math.sin(clock * 3.1 + 1)
    const v = (Ln - L) / dt
    surge += (clamp(v * 1.3) - surge) * Math.min(1, dt * 7)
    back += (clamp(-v * 2.2) - back) * Math.min(1, dt * (v < 0 ? 6 : 1.3))
    L = Ln
    amp = A0 + A1 * surge
    if (L + 0.012 > wet[0]) wet = [L + 0.012, amp, 1, clock]
    else wet[2] *= Math.exp(-dt / (opened ? 1.5 : 9))

    // the bubbles: lifted by the edge when it passes over their place, left there when it goes back
    for (const b of bubs) {
      if (b.state === 3) continue
      const xu = b.x * asp
      const f = front(xu) - 0.018 - (b.s / H) * 0.32
      if (b.state === 0) { if (t >= W2 && f > b.y) { b.state = 1; b.born = clock; b.fl = 1; b.el.style.opacity = '' } else continue }
      else if (b.state === 1 && f <= b.y) {
        b.state = 2; b.land = clock; b.el.classList.add('ob--on')
        ring(xu, b.y - (b.s / H) * 0.2)
        sink.plip(b.n)
      } else if (b.state === 2 && f > b.y + 0.006) { b.state = 1; b.land = -1; b.el.classList.remove('ob--on') }
      // how much it floats: it eases between rocking on the water and lying still, so being set down is never a snap
      b.fl += ((b.state === 1 ? 1 : 0) - b.fl) * Math.min(1, dt * 7)
      const lv = Math.max(b.y, f)
      const py = H * (1 - lv) + Math.sin(clock * 3.1 + b.ph) * 3 * b.fl
      const px = b.x * W + Math.sin(clock * 1.7 + b.ph) * 4 * b.fl
      const r = b.rot + (Math.sin(clock * 2.3 + b.ph) * 9 - b.rot) * b.fl
      b.el.style.transform = `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0) rotate(${r.toFixed(1)}deg)`
      // it grows as the wave lifts it, gives a little when it is set down, and then its three dots start writing
      const k = backOut(ramp(clock, b.born, 0.5))
      const sq = b.land < 0 ? 0 : Math.pow(1 - ramp(clock, b.land, 0.5), 2) * Math.cos(ramp(clock, b.land, 0.5) * 7)
      b.body.style.transform = `scale(${(k * (1 + 0.09 * sq)).toFixed(3)},${(k * (1 - 0.15 * sq)).toFixed(3)})`
      for (let j = 0; j < 3; j++) {
        const u = b.land < 0 ? 1 : (((clock - b.land - 0.25 - j * 0.16) % 1.2) + 1.2) % 1.2 / 1.2
        const up = b.land >= 0 && clock - b.land > 0.25 + j * 0.16 && u < 0.55 ? Math.sin((Math.PI * u) / 0.55) : 0
        b.dots[j].style.opacity = (0.2 + 0.65 * up).toFixed(2)
        b.dots[j].style.transform = `translateY(${(-0.075 * up * b.w).toFixed(1)}px)`
      }
      if (py < -90) { b.state = 3; b.el.style.display = 'none' }
    }

    if (!opened && L - amp * 0.64 - 0.035 > 1) open()
    root.classList.toggle('opener--ui', clock > 0.5 && t < w3)
    if (!fadedSound && t > w3 + FADE && !held) { fadedSound = true; sea.fade() }
    if (t > w3 + END && !held) end()
  }

  let shown = ['', '']
  let cuts = [-1, -1]
  const draw = () => {
    const gone = 1 - ramp(t, w3 + 0.85, 0.2)
    const s1 = w3 > SHOW1 + 0.3 ? ramp(t, SHOW1, 0.25) * gone : 0
    const s2 = w3 > SHOW2 + 0.3 ? ramp(t, SHOW2, 0.25) * gone : 0
    // the sharp lines show only on dry sand: each is cut off level, a hair above the highest point of the water's
    // edge (between that cut and the edge the sea's own copy shows, a shade softer, for the moment the foam passes).
    // A level cut is a plain rectangle to the compositor; a cut that followed the edge was a full-screen mask
    // painted again every frame, on exactly the phones that have the least to spare.
    if (lines.length) {
      let top = 0
      for (let i = 0; i <= 12; i++) top = Math.max(top, front((i / 12) * asp))
      const dry = H * (1 - top - 0.017)
      lines.forEach((el, i) => {
        const o = (i ? s2 : s1) >= 1 ? '1' : '0'
        if (shown[i] !== o) { shown[i] = o; el.style.opacity = o }
        if (o === '1') {
          const cut = Math.round(clamp(lineBox[i][0] + lineBox[i][1] - dry, 0, lineBox[i][1]))
          if (cuts[i] !== cut) { cuts[i] = cut; el.style.clipPath = `inset(0 0 ${cut}px 0)` }
        }
      })
    }
    gl.uniform2f(U.uRes, cv.width, cv.height)
    gl.uniform1f(U.uT, clock)
    gl.uniform1f(U.uL, L)
    gl.uniform1f(U.uAmp, amp)
    gl.uniform1f(U.uSurge, surge)
    gl.uniform1f(U.uBack, back)
    gl.uniform1f(U.uK, K)
    gl.uniform4f(U.uWet, wet[0], wet[1], wet[2], wet[3])
    gl.uniform2f(U.uShow, s1, s2)
    gl.uniform4f(U.uWave, waveBox[0], waveBox[1], waveBox[2], waveBox[3])
    gl.uniform4f(U.uMark, markBox[0], markBox[1], markBox[2], markBox[3])
    gl.uniform1f(U.uMarkP, w3 > MARK ? outCubic(ramp(t, MARK, 0.55)) : 0)
    gl.uniform3fv(U.uDrop, drops)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  /** What one frame of full, running water costs this GPU at the current resolution (ms): the frame is drawn and,
      when `wait` is set, one pixel is read back, which waits for the GPU. Asked before the sea is shown, so the
      resolution is settled before the first wave and never changes under the visitor's eyes.
      The first such frame is drawn WITHOUT waiting (the warm-up): on Windows the driver compiles the shader for real
      at its first draw, 0.4 s, and reading a pixel back made the page's main thread sit through it (Lighthouse:
      1.5 s of blocking). The frame loop waits until frames run on time again and only then asks, three times. */
  const dearest = (wait: boolean) => {
    const keep = { L, surge, back, wet }
    L = 1.3; surge = 1; back = 0.5; wet = [1.3, A0, 1, 0]
    const px = new Uint8Array(4)
    const once = () => { const a = performance.now(); draw(); if (wait) gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); return performance.now() - a }
    // the least of three: under the cover the page is still painting itself, and a probe that shared the GPU with
    // that read 15 ms where the next run read 11. A renderer that needs a tenth of a second is not asked again.
    let ms = once()
    if (wait && ms < 100) ms = Math.min(ms, once(), once())
    L = keep.L; surge = keep.surge; back = keep.back; wet = keep.wet
    return ms
  }

  // ---- the hand: a touch on the water, the two buttons, the keys, a scroll
  const skip = () => {
    if (!live) { end(false); return } // "let me in" before the sea is even up: the page, at once
    if (ended || t >= w3) return
    armed = true
    w3 = t
    build()
  }
  const stopped = () => html.classList.contains('disable-animations') || html.classList.contains('calm')
  const onClick = (e: MouseEvent) => {
    const at = e.target as Element
    if (at.closest('.opener__sound')) { sea.toggle(); return }
    sea.wake()
    if (at.closest('.opener__skip')) { skip(); return }
    if (!live || opened) return
    const xu = (e.clientX / W) * asp, lv = 1 - e.clientY / H
    ring(xu, lv)
    if (lv < front(xu)) sink.plip(5, 0.12)
  }
  const onKey = (e: KeyboardEvent) => {
    const onButton = !!(e.target as Element | null)?.closest?.('button, a, input, select, textarea')
    if (e.key === 'Escape' || ((e.key === 'Enter' || e.key === ' ') && !onButton)) { sea.wake(); skip() }
  }
  const onWheel = (e: Event) => { if (!opened) { e.preventDefault(); skip() } }
  // a finger that travels means "scroll": on with the page. A tap that slips a little is still a tap.
  let tx = 0, ty = 0
  const onTouchStart = (e: TouchEvent) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY }
  const onTouchMove = (e: TouchEvent) => { if (!opened && Math.hypot(e.touches[0].clientX - tx, e.touches[0].clientY - ty) > 28) skip() }
  const mo = new MutationObserver(() => { if (stopped()) end(false) })
  mo.observe(html, { attributes: true, attributeFilter: ['class'] })
  root.addEventListener('click', onClick)
  window.addEventListener('keydown', onKey)
  window.addEventListener('wheel', onWheel, { passive: false })
  root.addEventListener('touchstart', onTouchStart, { passive: true })
  root.addEventListener('touchmove', onTouchMove, { passive: true })
  let px0 = -99, py0 = -99
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !live || opened || Math.hypot(e.clientX - px0, e.clientY - py0) < 46) return
    px0 = e.clientX; py0 = e.clientY
    const xu = (e.clientX / W) * asp, lv = 1 - e.clientY / H
    if (lv < front(xu) - 0.01) ring(xu, lv)
  }
  root.addEventListener('pointermove', onPointer)
  let rz = 0
  const onResize = () => { clearTimeout(rz); rz = window.setTimeout(() => { if (!ended && live) stage() }, 120) }
  window.addEventListener('resize', onResize)
  cleanup.push(() => {
    mo.disconnect(); clearTimeout(rz)
    window.removeEventListener('keydown', onKey); window.removeEventListener('wheel', onWheel); window.removeEventListener('resize', onResize)
  })

  // ---- the clock. The sea starts only when the program is linked and the faces are in.
  let live = false
  let last = 0
  let held = false
  let counted = 0
  let quiet = 0
  let linkedAt = 0
  let liveAt = 0
  let warmAt = 0
  let asked = false
  let pollAt = performance.now() + 300
  let calm = 0
  let cost = 0
  const paces: number[] = []
  const t0 = performance.now()
  const fonts = Promise.race([
    Promise.all([document.fonts.load(font(40), 'היי אנחנו'), document.fonts.load(font(40), 'MediaWave')]),
    new Promise((r) => setTimeout(r, 1800)),
  ])
  let fontsIn = false
  void fonts.then(() => { fontsIn = true })
  const frame = (now: number) => {
    if (ended) return
    raf = requestAnimationFrame(frame)
    if (!live) {
      if (now - t0 > 4500 || stopped()) { end(false); return }
      if (!asked) {
        if (now - t0 < 150) return
        asked = true
        if (!ask()) { end(false); return }
      }
      // "is it linked yet?" is itself a question the GPU process answers in turn, behind the compile it is asked
      // about: put every frame, it held the main thread for 70 and 150 ms (traced). It is put first after a third
      // of a second, by when a phone has long finished, and then six times a second.
      if (!linkedAt && now >= pollAt) { pollAt = now + 160; if (linked()) linkedAt = now }
      if (!fontsIn || !linkedAt) return
      if (!warmAt) {
        if (!ready()) { end(false); return }
        scale = Math.min(window.devicePixelRatio || 1, 2)
        stage()
        dearest(false)
        warmAt = last = now
        return
      }
      // the warm-up frame is on its way through the driver: ask only once three frames in a row have come on time
      calm = now - last < 28 ? calm + 1 : 0
      last = now
      if (calm < 3 && now - warmAt < 1500) return
      // a GPU that cannot draw full water in time draws fewer pixels, never fewer frames
      cost = dearest(true)
      // smooth or not at all: where even the lowest resolution would miss its frames, the visitor gets the page
      const lowest = SCALES[SCALES.length - 1]
      if (cost * (lowest / scale) ** 2 > BUDGET * 1.5) { root.dataset.live = `slow/${cost.toFixed(0)}`; end(false); return }
      if (cost > BUDGET) {
        const want = scale * Math.sqrt(BUDGET / cost)
        scale = SCALES.find((s) => s < scale && s <= want) ?? SCALES[SCALES.length - 1]
        stage()
      }
      live = true
      // for the checks: ms until the program linked / until the sea was up / the probe's frame cost / the resolution
      root.dataset.live = `${Math.round(linkedAt - t0)}/${Math.round(performance.now() - t0)}/${cost.toFixed(1)}/${scale}`
      last = liveAt = performance.now()
      draw() // the resting sea, over the probe's frame of full water, before the canvas starts to fade in
      sea.prepare()
      return
    }
    const real = now - last
    // the first wave waits for quiet (fourteen frames on time in a row, two seconds at most): under the cover the page
    // is still booting and painting itself for the first time, on the main thread and on the GPU, and a wave that
    // stutters is worse than a sea that laps a moment longer
    if (!armed) { quiet = real < 28 ? quiet + 1 : 0; armed = quiet >= 14 || now - liveAt > 2000; if (armed) root.dataset.go = '1' }
    // the cover's painted sea (sun.css) has done its work once the real one has faded in over it
    if (!opened && now - liveAt > 600) root.classList.add('opener--sand')
    const dt = clamp(real / 1000, 0, 0.05)
    last = now
    if (!held) { step(dt); sea.drive(surge, back, L, breath()) }
    if (ended) return
    draw()
    if (counted >= 0 && !held && armed) {
      // the safety net behind the probe: if the frames still run late for half a second (the median, so one long
      // task does not count), the sea gives up one step of resolution, once
      counted++
      if (counted > 6) paces.push(real)
      if (counted === 36) {
        counted = -1
        const i = SCALES.indexOf(scale)
        if (paces.sort((a2, b2) => a2 - b2)[15] > 26 && i >= 0 && i < SCALES.length - 1) { scale = SCALES[i + 1]; stage() }
      }
    }
  }
  raf = requestAnimationFrame(frame)

  if (import.meta.env.DEV) {
    // for stills, films and the sound's file: stand at a moment (the state is replayed from zero), or render what the
    // sea would sound like over the whole score, as a WAV
    w.__mwOpener = {
      seek: (to: number) => { held = true; armed = true; reset(); while (t < to) step(1 / 60) },
      play: () => { held = false },
      info: () => ({ t, L, scale, cost, W, H, live, opened, ended, sound: sea.state() }),
      wav: async (secs = 9.2) => {
        const rate = 44100
        const off = new OfflineAudioContext(2, Math.ceil(rate * secs), rate)
        const voice = buildSea(off, pinkNoise(rate))
        voice.out.gain.setValueAtTime(0, 0); voice.out.gain.setTargetAtTime(LEVEL, 0.02, 0.12)
        const keep = sink
        sink = { plip: (i, vol) => voice.plip(i, clock + 0.005, vol) }
        held = true; armed = true; reset()
        let out = false
        while (clock < secs) {
          step(1 / 60)
          voice.set(surge, back, L, breath(), clock)
          if (!out && t > w3 + FADE) { out = true; voice.out.gain.setTargetAtTime(0, clock, 0.5) }
        }
        sink = keep
        const buf = await off.startRendering()
        const n = buf.length, pcm = new Int16Array(n * 2), l = buf.getChannelData(0), r = buf.getChannelData(1)
        for (let i = 0; i < n; i++) { pcm[i * 2] = clamp(l[i], -1, 1) * 32767; pcm[i * 2 + 1] = clamp(r[i], -1, 1) * 32767 }
        const head = new DataView(new ArrayBuffer(44))
        const str = (o: number, s: string) => { for (let i = 0; i < s.length; i++) head.setUint8(o + i, s.charCodeAt(i)) }
        str(0, 'RIFF'); head.setUint32(4, 36 + pcm.byteLength, true); str(8, 'WAVEfmt '); head.setUint32(16, 16, true); head.setUint16(20, 1, true); head.setUint16(22, 2, true)
        head.setUint32(24, rate, true); head.setUint32(28, rate * 4, true); head.setUint16(32, 4, true); head.setUint16(34, 16, true); str(36, 'data'); head.setUint32(40, pcm.byteLength, true)
        const bytes = new Uint8Array(44 + pcm.byteLength)
        bytes.set(new Uint8Array(head.buffer), 0); bytes.set(new Uint8Array(pcm.buffer), 44)
        let bin = ''
        for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
        return btoa(bin)
      },
    }
  }
}
