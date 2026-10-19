// sea · the dot field (D131): one fixed WebGL canvas behind the whole site, a halftone of MediaWave's
// world. Each chapter marks the shape its dots gather into with data-scene (horizon, laptop, reels,
// bubble, landing, seo, chat, memory, quiet; data-scene-m overrides it below 1100px, where the shape
// sits above the text; data-scene-fade sets its crossfade as a share of the screen); the field
// crossfades between them as the reader scrolls, like the prototype. Geared parts (the laptop's lid
// and screen, the services' gears, the reels) are written by the chapters through set(); the field
// only draws.
//
// Tiers (D130): full runs the sea, the ripple and the clock of time; calm (OS reduced motion without
// ?motion=full) freezes time and the ripple, so only what the reader drives moves, and draws only when
// something changed; still (?reduce=1, the widget's stop, the prerender) never starts WebGL and the
// page keeps its static stills. Budget: DPR capped at 1.5, the loop stops while the tab is hidden and
// halves its rate after a few idle seconds; no WebGL, a lost context or a failed compile fall back to
// the stills (html.sea-nogl).
import { FRAG, VERT } from './shader'

export type Tier = 'full' | 'calm' | 'still'
type Scene = 'horizon' | 'laptop' | 'reels' | 'bubble' | 'landing' | 'seo' | 'chat' | 'memory' | 'quiet'
const SCENE_INDEX: Record<Scene, number> = { horizon: 0, laptop: 1, reels: 2, bubble: 3, landing: 4, seo: 5, chat: 6, memory: 7, quiet: -1 }
const SCENE_NAME: Scene[] = ['horizon', 'laptop', 'reels', 'bubble', 'landing', 'seo', 'chat', 'memory']
let announced = ''
const N_SCENES = 8
/** the line a chapter's marker crosses to take over (from the top of the screen), and its crossfade */
const LINE = 0.72
const FADE = 0.4
const WIDE = 1100

const params = () => (typeof window === 'undefined' ? '' : window.location.search)
/** the review option ?trail=t3: the tracking lines instead of the ripple (one trail per page) */
const T3 = /[?&]trail=t3(&|$)/.test(params())

export function tier(): Tier {
  if (typeof window === 'undefined') return 'still'
  const html = document.documentElement.classList
  if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ || /[?&]reduce=1(&|$)/.test(params())
    || html.contains('disable-animations') || html.contains('motion-reduced')) return 'still'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !/[?&]motion=full(&|$)/.test(params())) return 'calm'
  return 'full'
}

/** Where the shape lives (CSS px): above the text on a phone, beside it (inline end, left) when wide. */
export function shapeSpot(w: number, h: number): { x: number; y: number; r: number } {
  if (w < 768) return { x: w * 0.5, y: h * 0.3, r: Math.min(w * 0.3, h * 0.16) }
  if (w < WIDE) return { x: w * 0.5, y: h * 0.32, r: Math.min(w, h) * 0.22 }
  return { x: w * 0.27, y: h * 0.46, r: Math.min(w, h) * 0.22 }
}

/** The dot grid's cell in CSS px (the opening's particles land on the same grid). */
export const cellCss = (w: number) => (w < 768 ? 7 : 9)
export const dprCap = () => Math.min(1.5, window.devicePixelRatio || 1)

interface Marker { el: HTMLElement; scene: number; top: number; fade: number }

interface Live {
  /** the laptop: lid angle (rad); the screen: code typed, code to site, site scrolled, the cursor's tap; the lead */
  lid: number
  scr: [number, number, number, number]
  lead: number
  /** the services' gears: landing, seo, chat, memory */
  gear: [number, number, number, number]
  reel: [number, number, number, number]
  rew: number
}

const live: Live = { lid: 0, scr: [0, 0, 0, 0], lead: 0, gear: [0, 0, 0, 0], reel: [0, 0, 0.44, 0.2], rew: 0 }
const w = new Array<number>(N_SCENES).fill(0)
const wt = new Array<number>(N_SCENES).fill(0)
w[0] = 1
let gl: WebGLRenderingContext | null = null
let prog: WebGLProgram | null = null
let U: Record<string, WebGLUniformLocation | null> = {}
let cv: HTMLCanvasElement | null = null
let mode: Tier = 'still'
let raf = 0
let last = 0
let time = 0
let idleSince = 0
let skip = false
let markers: Marker[] = []
let W = 0
let H = 0
let DPR = 1
const ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999, e: 0 }
const type = { e: 0, t: 0, until: 0 }
let amb = 1
let ambT = 1
let dirty = true
let resolveReady: (ok: boolean) => void = () => {}
/** Resolves after the first frame (true) or when WebGL is not available (false). */
export const ready: Promise<boolean> = new Promise((r) => { resolveReady = r })

const lerp = (a: number, b: number, k: number) => a + (b - a) * k
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

function compile(type: number, src: string): WebGLShader | null {
  if (!gl) return null
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

/** Queue the compile and link without asking for their status: a status query blocks the main thread
    until the driver is done (720ms on Lighthouse's software GPU). With KHR_parallel_shader_compile the
    driver works on it off the main thread and the field polls COMPLETION_STATUS_KHR each frame. */
function queue(): boolean {
  if (!gl) return false
  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  prog = gl.createProgram()
  if (!vs || !fs || !prog) return false
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  return true
}

function compiled(): boolean {
  if (!gl || !prog) return true
  const ext = gl.getExtension('KHR_parallel_shader_compile') as { COMPLETION_STATUS_KHR: number } | null
  return !ext || Boolean(gl.getProgramParameter(prog, ext.COMPLETION_STATUS_KHR))
}

function setup(): boolean {
  if (!gl || !prog) return false
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false
  gl.useProgram(prog)
  const b = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, b)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  U = Object.fromEntries(['uRes', 'uCell', 'uTime', 'uPtr', 'uPtrE', 'uW', 'uW2', 'uG', 'uAmb', 'uC', 'uR', 'uLid', 'uScr', 'uLead', 'uReel', 'uType', 'uTypeT', 'uRew']
    .map((n) => [n, gl!.getUniformLocation(prog!, n)]))
  return true
}

function size() {
  if (!cv || !gl) return
  DPR = dprCap()
  W = window.innerWidth
  H = window.innerHeight
  cv.width = Math.round(W * DPR)
  cv.height = Math.round(H * DPR)
  gl.viewport(0, 0, cv.width, cv.height)
  measure()
  dirty = true
}

/** The chapters' markers, in page order, measured in document px. */
function measure() {
  const wide = W >= WIDE
  const els = [...document.querySelectorAll<HTMLElement>('[data-scene], [data-scene-m]')]
  const y = window.scrollY
  markers = els.flatMap((el) => {
    const name = (!wide && el.dataset.sceneM) || el.dataset.scene
    if (!name || !(name in SCENE_INDEX)) return []
    const fade = Number(el.dataset.sceneFade) || FADE
    return [{ el, scene: SCENE_INDEX[name as Scene], top: el.getBoundingClientRect().top + y, fade }]
  }).sort((a, b) => a.top - b.top)
  dirty = true
}

/** Each scene's weight at this scroll: the chapter whose marker has crossed the line (72% down the
    screen, so the shape changes as the chapter comes in), crossfading over its marker's fade. */
function targets() {
  wt.fill(0)
  if (!markers.length) return
  const line = window.scrollY + H * LINE
  let i = -1
  for (let k = 0; k < markers.length; k++) if (markers[k].top <= line) i = k
  if (i < 0) { if (markers[0].scene >= 0) wt[markers[0].scene] = 1; return }
  const k = clamp01((line - markers[i].top) / (H * markers[i].fade))
  if (markers[i].scene >= 0) wt[markers[i].scene] += k
  if (i > 0 && markers[i - 1].scene >= 0) wt[markers[i - 1].scene] += 1 - k
  else if (i === 0 && markers[0].scene >= 0) wt[markers[0].scene] = 1
}

function draw() {
  if (!gl || !cv) return
  const s = shapeSpot(W, H)
  const cell = cellCss(W) * DPR
  gl.uniform2f(U.uRes, cv.width, cv.height)
  gl.uniform1f(U.uCell, cell)
  gl.uniform1f(U.uTime, time)
  gl.uniform2f(U.uPtr, ptr.x * DPR, (H - ptr.y) * DPR)
  gl.uniform1f(U.uPtrE, mode === 'full' && !T3 && !document.documentElement.classList.contains('disable-animations') ? ptr.e : 0)
  gl.uniform4f(U.uW, w[0], w[1], w[2], w[3])
  gl.uniform4f(U.uW2, w[4], w[5], w[6], w[7])
  gl.uniform4f(U.uG, live.gear[0], live.gear[1], live.gear[2], live.gear[3])
  gl.uniform1f(U.uAmb, amb)
  gl.uniform2f(U.uC, s.x * DPR, (H - s.y) * DPR)
  gl.uniform1f(U.uR, s.r * DPR)
  gl.uniform1f(U.uLid, live.lid)
  gl.uniform4f(U.uScr, live.scr[0], live.scr[1], live.scr[2], live.scr[3])
  gl.uniform1f(U.uLead, live.lead)
  gl.uniform4f(U.uReel, live.reel[0], live.reel[1], live.reel[2], live.reel[3])
  gl.uniform1f(U.uType, type.e)
  gl.uniform1f(U.uTypeT, type.t)
  gl.uniform1f(U.uRew, live.rew)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

function frame(now: number) {
  raf = 0
  if (!gl || document.hidden) return
  const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
  last = now
  // the widget's stop switch (it can come on at any time): only what the reader drives still moves
  const stopped = document.documentElement.classList.contains('disable-animations')
  if (mode === 'full' && !stopped) time += dt
  const k = 1 - Math.pow(1 - 0.08, dt * 60)
  targets()
  let moving = dirty
  for (let i = 0; i < N_SCENES; i++) {
    const before = w[i]
    w[i] = Math.abs(wt[i] - w[i]) < 0.002 ? wt[i] : lerp(w[i], wt[i], k)
    if (w[i] !== before) moving = true
  }
  // the dominant scene, for the sound (sound.ts listens to sea:scene)
  let top = -1
  for (let i = 0; i < N_SCENES; i++) if (wt[i] > 0.5 && (top < 0 || wt[i] > wt[top])) top = i
  const name = top < 0 ? 'quiet' : SCENE_NAME[top]
  if (name !== announced) { announced = name; window.dispatchEvent(new CustomEvent('sea:scene', { detail: name })) }
  const kp = 1 - Math.pow(1 - 0.18, dt * 60)
  ptr.x = lerp(ptr.x, ptr.tx, kp)
  ptr.y = lerp(ptr.y, ptr.ty, kp)
  ptr.e *= Math.pow(0.975, dt * 60)
  if (ptr.e < 0.01) ptr.e = 0
  const typing = now < type.until ? 1 : 0
  type.e = Math.abs(typing - type.e) < 0.01 ? typing : lerp(type.e, typing, 1 - Math.pow(1 - 0.12, dt * 60))
  if (type.e > 0) { type.t += dt; moving = true }
  if (amb !== ambT) { amb = Math.min(ambT, amb + dt / 1.4); moving = true }
  if (live.rew > 0 || ptr.e > 0) moving = true
  // full: halve the rate after 2.5s with nothing but the sea moving
  if (moving) idleSince = now
  const idle = mode === 'full' && now - idleSince > 2500
  skip = idle ? !skip : false
  if (!skip) draw()
  dirty = false
  if (mode === 'full' || moving) raf = requestAnimationFrame(frame)
  if (first) { first = false; resolveReady(true) }
}
let first = true

function wake() {
  dirty = true
  if (!raf && gl && !document.hidden) raf = requestAnimationFrame(frame)
}

const onPtr = (x: number, y: number) => {
  if (ptr.tx < -9000) { ptr.x = x; ptr.y = y }
  ptr.tx = x; ptr.ty = y; ptr.e = 1
  if (mode === 'full') wake()
}
const onPointer = (e: PointerEvent) => { if (e.pointerType !== 'touch') onPtr(e.clientX, e.clientY) }
const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) onPtr(t.clientX, t.clientY) }
const onVisible = () => { if (!document.hidden) { last = 0; wake() } }
let remeasureT = 0
const remeasure = () => { window.clearTimeout(remeasureT); remeasureT = window.setTimeout(() => { measure(); wake() }, 60) }
let ro: ResizeObserver | null = null
let mo: MutationObserver | null = null

/** Start the field on its canvas. Returns false (and the page keeps its stills) when it cannot run. */
export function start(canvas: HTMLCanvasElement): boolean {
  if (gl) return true
  mode = tier()
  const html = document.documentElement.classList
  if (mode === 'still') { html.remove('sea-held'); resolveReady(false); return false }
  cv = canvas
  try {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: false })
  } catch { gl = null }
  const fail = () => {
    gl = null
    html.add('sea-nogl')
    html.remove('sea-held')
    resolveReady(false)
  }
  if (!gl || !queue()) { fail(); return false }
  const t0 = performance.now()
  const poll = () => {
    if (!gl) return
    if (!compiled() && performance.now() - t0 < 8000) { requestAnimationFrame(poll); return }
    if (!setup()) { fail(); return }
    run(canvas)
  }
  requestAnimationFrame(poll)
  return true
}

function run(canvas: HTMLCanvasElement) {
  const html = document.documentElement.classList
  html.add('sea-gl')
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); html.remove('sea-gl'); html.add('sea-nogl') }, { once: true })
  size()
  window.addEventListener('resize', size)
  window.addEventListener('scroll', wake, { passive: true })
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('touchmove', onTouch, { passive: true })
  window.addEventListener('load', remeasure)
  document.addEventListener('visibilitychange', onVisible)
  document.fonts?.ready.then(remeasure)
  ro = new ResizeObserver(remeasure)
  ro.observe(document.body)
  mo = new MutationObserver(remeasure)
  mo.observe(document.getElementById('main-content') ?? document.body, { childList: true, subtree: true })
  idleSince = performance.now()
  wake()
}

export function stop() {
  cancelAnimationFrame(raf)
  raf = 0
  window.removeEventListener('resize', size)
  window.removeEventListener('scroll', wake)
  window.removeEventListener('pointermove', onPointer)
  window.removeEventListener('touchmove', onTouch)
  window.removeEventListener('load', remeasure)
  document.removeEventListener('visibilitychange', onVisible)
  ro?.disconnect()
  mo?.disconnect()
  gl = null
}

/** Geared parts write here (the laptop, the services' gears, the reels, the rewind). */
export function set(patch: Partial<Live>) {
  Object.assign(live, patch)
  wake()
}

/** Someone typed in the contact form: the bubble types for a moment. */
export function typed() {
  type.until = performance.now() + 1100
  wake()
}

/** The opening: hold the quiet field back, then let it spread out from the mark. */
export function holdAmbient() { amb = 0; ambT = 0 }
export function arrive() { ambT = 1; wake() }

/** Remeasure the markers now (after a layout change the observers cannot see). */
export const refresh = () => { measure(); wake() }

export const running = () => gl !== null

// dev only: drive the field from the console or a test (scratch state renders)
if (import.meta.env.DEV && typeof window !== 'undefined') (window as unknown as { __seaField?: unknown }).__seaField = { set }
