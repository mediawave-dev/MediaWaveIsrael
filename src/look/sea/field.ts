// sea · the dot field (D131): one fixed WebGL canvas behind the whole site, a halftone of MediaWave's
// world. The quiet grain covers the screen; the shapes live in slots. Each chapter lays out a box for its
// shape like an image (data-spot="horizon|laptop|reels|bubble|landing|seo|chat|memory"): above the text
// on a phone, beside it on a wide screen, so no line of text ever sits on a shape (D139, Nati: no text
// over effects). The field draws each scene inside its box, moving with it, and lets its dots gather as
// the box comes into view. Geared parts (the laptop's lid and screen, the services' gears, the reels)
// are written by the chapters through set(); the field only draws.
//
// Tiers (D130): full runs the sea, the ripple and the clock of time; calm (OS reduced motion without
// ?motion=full) freezes time and the ripple, so only what the reader drives moves, and draws only when
// something changed; still (?reduce=1, the widget's stop, the prerender) never starts WebGL and the
// page keeps its static stills. Budget: DPR capped at 1.5, the loop stops while the tab is hidden and
// halves its rate after a few idle seconds; no WebGL, a lost context or a failed compile fall back to
// the stills (html.sea-nogl).
import { FRAG, VERT } from './shader'
import * as sound from './sound'

export type Tier = 'full' | 'calm' | 'still'
type Scene = 'horizon' | 'laptop' | 'reels' | 'bubble' | 'landing' | 'seo' | 'chat' | 'memory' | 'quiet'
const SCENE_INDEX: Record<Scene, number> = { horizon: 0, laptop: 1, reels: 2, bubble: 3, landing: 4, seo: 5, chat: 6, memory: 7, quiet: -1 }
const SCENE_NAME: Scene[] = ['horizon', 'laptop', 'reels', 'bubble', 'landing', 'seo', 'chat', 'memory']
let announced = ''
const N_SCENES = 8

const params = () => (typeof window === 'undefined' ? '' : window.location.search)
/** the review option ?trail=t3: the tracking lines instead of the ripple (one trail per page) */
const T3 = /[?&]trail=t3(&|$)/.test(params())
/** Lama Lama's ground is plain (D157, gates `grain` and `trail`): the quiet grain everywhere, and the
    field's ripple as the pointer's trail, only when the lab asks for them (lab.ts sets the classes) */
const rootHas = (c: string) => typeof document !== 'undefined' && document.documentElement.classList.contains(c)
const GRAIN = () => rootHas('sea-grain-on')
const RIPPLE = () => rootHas('sea-trail-ripple')
/** the trail of small squares (D162, Lama's own); since D163 the finger draws it too */
const SQUARES = () => rootHas('sea-trail-squares')

export function tier(): Tier {
  if (typeof window === 'undefined') return 'still'
  const html = document.documentElement.classList
  if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ || /[?&]reduce=1(&|$)/.test(params())
    || html.contains('disable-animations') || html.contains('motion-reduced')) return 'still'
  // the OS flag no longer calms the site (D160): ?calm=1 does
  if (/[?&]calm=1(&|$)/.test(params()) && !/[?&]motion=full(&|$)/.test(params())) return 'calm'
  return 'full'
}

/** A slot's shape: its centre (CSS px, viewport) and the shape's radius, fitted to the box (the widest
    shapes are about 2.9 radii wide, the tallest 2.25 radii high). */
export function spotGeom(r: DOMRect): { x: number; y: number; r: number } {
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: Math.max(24, Math.min(r.width / 2.9, r.height / 2.25)) }
}

/** The opening's disc: the first horizon slot on the page (the hero's), or the screen's centre. */
export function heroSpot(): { x: number; y: number; r: number } {
  const el = document.querySelector<HTMLElement>('main [data-spot="horizon"], main [data-intro]')
  if (el) return spotGeom(el.getBoundingClientRect())
  const w = window.innerWidth
  const h = window.innerHeight
  return { x: w / 2, y: h * 0.3, r: Math.min(w * 0.3, h * 0.16) }
}

/** The dot grid's cell in CSS px (the opening's particles land on the same grid). */
export const cellCss = (w: number) => (w < 768 ? 7 : 9)
export const dprCap = () => Math.min(1.5, window.devicePixelRatio || 1)


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
/** each scene's slot: x, y, r (device px, y up) and its weight, as the shader reads them */
const S = new Float32Array(N_SCENES * 4)
let W = 0
let H = 0
let DPR = 1
const ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999, e: 0 }
/** the finger on a touch screen (D163): where it lands and moves the field swells like a drop of water */
const press = { x: 0, y: 0, tx: 0, ty: 0, on: 0, e: 0 }
const type = { e: 0, t: 0, until: 0 }
/** the music (D142): its level, and the last bell's ring */
const note = { x: 0, y: 0, e: 0, at: 0 }
let lvl = 0
let amb = 1
let ambT = 1
let dirty = true

// ── the Lama Lama lab's layers (design/harvest/lamalama-deep.rtl.md §9) ──
// The films (D146, D154): up to two clips at once, each in its own slot and texture unit (the hero's
// sunset inside the disc, the film chapter's reels). Each is drawn in the sea's dots and develops into
// colour cell by cell.
export type FilmMode = 'touch' | 'scroll' | 'time' | 'colour'
interface Film {
  id: number
  el: HTMLElement
  video: HTMLVideoElement | null
  poster: HTMLImageElement | null
  mode: FilmMode
  /** a disc (the hero's horizon) instead of the slot's rectangle */
  disc: boolean
  /** wait for the opening to hand over before it shows (the hero's disc is the opening's mark) */
  after: boolean
  /** the chapter's ground (D156): the clip across the whole width of its chapter, a picture above its
      words and breaking into the sea's dots from its bottom edge; the words' block sets the edge */
  veil: boolean
  text: HTMLElement | null
  /** the edge without words (a band with no text over it), and the picture's focus (cover fit) */
  edge0: number
  focus: [number, number]
  /** a dotted top edge (its share of the height), for a ground in the middle of the page */
  top: number
  /** how its edges give way (D158): 0 grain, 1 ordered, 2 soft, 3 backdrop (its material only) */
  style: number
  /** a backdrop changes its clip through a fade (swapFilm): its share now, and the clip waiting */
  fade: number
  swapTo: string | null
  swapPoster: HTMLImageElement | null
  swapping: boolean
  v: [number, number, number, number]
  unit: number
  w: number; wt: number; vis: number; dev: number; devT: number; seenAt: number; ready: number; posterUp: boolean; aspect: number
  r: [number, number, number, number]; pe: number; px: number; py: number; inside: boolean; tapped: boolean; frameNew: boolean; playing: boolean
}
const MAX_FILMS = 2
const films: Film[] = []
let filmSeq = 0
const texs: (WebGLTexture | null)[] = [null, null]
const FR = new Float32Array(MAX_FILMS * 4)
const FK = new Float32Array(MAX_FILMS * 4)
const FP = new Float32Array(MAX_FILMS * 3)
const FA = new Float32Array(MAX_FILMS)
const FS = new Float32Array(MAX_FILMS)
const FV = new Float32Array(MAX_FILMS * 4)
const arrived = () => ambT >= 1 && amb >= 0.999
const grounds: { el: HTMLElement; kind: 1 | 2 }[] = []
const gnd = new Float32Array(8)
const turn = { x: 0, y: 0, cover: 0, reveal: 0, col: [0.929, 0.906, 0.855], anim: null as null | { key: 'cover' | 'reveal'; t0: number; ms: number; done: () => void } }
// ── the pointer's wake and the scroll's stir (D158; Lama Lama's velocity field) ──
const N_FLOW = 12
const flow = Array.from({ length: N_FLOW }, () => ({ x: 0, y: 0, vx: 0, vy: 0, at: -1e9 }))
let flowI = 0
const flowLast = { x: 0, y: 0, at: 0 }
const FLP = new Float32Array(N_FLOW * 4)
const FLE = new Float32Array(N_FLOW)
let flowBusy = false
let scrollV = 0
let svT = 0
let svY = 0
let svAt = 0
function flowPush(x: number, y: number) {
  const now = performance.now()
  if (!flowLast.at || now - flowLast.at > 300) { flowLast.x = x; flowLast.y = y; flowLast.at = now; return }
  const dx = x - flowLast.x
  const dy = y - flowLast.y
  const dt = Math.max(8, now - flowLast.at)
  if (dx * dx + dy * dy < 36 && dt < 40) return
  const p = flow[flowI]
  flowI = (flowI + 1) % N_FLOW
  const k = 16 / dt
  p.x = x; p.y = y; p.vx = dx * k; p.vy = dy * k; p.at = now
  flowLast.x = x; flowLast.y = y; flowLast.at = now
}
function flowUpload(now: number): boolean {
  let live = false
  for (let i = 0; i < N_FLOW; i++) {
    const p = flow[i]
    const sp = Math.min(1, Math.hypot(p.vx, p.vy) / 22)
    const e = mode === 'full' ? Math.exp(-((now - p.at) / 1000) / 0.5) * (0.3 + 0.7 * sp) : 0
    FLE[i] = e < 0.01 ? 0 : e
    if (FLE[i] > 0) live = true
    FLP.set([p.x * DPR, (H - p.y) * DPR, p.vx * DPR, -p.vy * DPR], i * 4)
  }
  return live
}
/** Play, and if the browser refuses (an iPhone in Low Power Mode, a strict autoplay policy), try again
    on the visitor's first touch, click or key: every visit gets its motion (D160). */
const waiting = new Set<HTMLVideoElement>()
let armed = false
function playOrWait(v: HTMLVideoElement, refused?: () => void) {
  v.play().catch(() => {
    refused?.()
    waiting.add(v)
    if (armed) return
    armed = true
    const evs = ['pointerdown', 'touchstart', 'keydown'] as const
    const go = () => {
      armed = false
      evs.forEach((e) => window.removeEventListener(e, go))
      waiting.forEach((w) => { void w.play().catch(() => {}) })
      waiting.clear()
      wake()
    }
    evs.forEach((e) => window.addEventListener(e, go, { passive: true }))
  })
}
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
  U = Object.fromEntries(['uRes', 'uCell', 'uTime', 'uPtr', 'uPtrE', 'uS', 'uG', 'uAmb', 'uC', 'uR', 'uLid', 'uScr', 'uLead', 'uReel', 'uType', 'uTypeT', 'uRew', 'uTxt', 'uNTxt', 'uPad', 'uLvl', 'uNote',
    'uFilm0', 'uFilm1', 'uFilmR', 'uFilmK', 'uFilmP', 'uFilmA', 'uFilmS', 'uFilmV', 'uReel0', 'uReel1', 'uReelR', 'uReelK', 'uReelS', 'uReelV', 'uReelX', 'uGrain', 'uFlowP', 'uFlowE', 'uFlowR', 'uGrainPx', 'uTrail', 'uPress', 'uScrollV', 'uAtlas', 'uImgR', 'uImgU', 'uImgK', 'uImgO', 'uGnd', 'uGE', 'uTurn', 'uTurnC']
    .map((n) => [n, gl!.getUniformLocation(prog!, n)]))
  // each film's texture: one frame at a time from its video (or its poster), clamped, no mipmaps
  for (let u = 0; u < MAX_FILMS; u++) {
    const t = gl.createTexture()
    texs[u] = t
    gl.activeTexture(gl.TEXTURE0 + u)
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([15, 16, 17]))
  }
  gl.uniform1i(U.uFilm0, 0)
  gl.uniform1i(U.uFilm1, 1)
  // the showreel's two takes (D157)
  for (let u = 0; u < 2; u++) {
    const t = gl.createTexture()
    reelTex[u] = t
    gl.activeTexture(gl.TEXTURE2 + u)
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([15, 16, 17]))
  }
  gl.uniform1i(U.uReel0, 2)
  gl.uniform1i(U.uReel1, 3)
  setupAtlas()
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

/** The words (D139): every text block near the screen. The shader dims the dots under each one, so a
    line stays readable wherever a shape passes behind it. The set is kept by an observer; the rects
    are read on scroll (before the frame's writes), on resize and now and then while things move. */
const MAX_TXT = 16
const TEXT = 'main [data-zone="text"], main .sea-tag'
const txt = new Float32Array(MAX_TXT * 4)
let nTxt = 0
let textDirty = true
const nearText = new Set<Element>()
let textIO: IntersectionObserver | null = null

function watchText() {
  textIO ??= new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) nearText.add(e.target); else nearText.delete(e.target) })
    textDirty = true
    wake()
  }, { rootMargin: '30% 0px' })
  textIO.disconnect()
  nearText.clear()
  document.querySelectorAll(TEXT).forEach((el) => textIO?.observe(el))
}

function readText() {
  textDirty = false
  const list: [number, number, number, number, number][] = []
  for (const el of nearText) {
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2 || r.bottom < -40 || r.top > H + 40) continue
    list.push([r.left, r.top, r.right, r.bottom, r.width * r.height])
  }
  if (list.length > MAX_TXT) list.sort((a, b) => b[4] - a[4])
  nTxt = Math.min(MAX_TXT, list.length)
  for (let i = 0; i < nTxt; i++) {
    const [l, t, rr, b] = list[i]
    txt[i * 4] = ((l + rr) / 2) * DPR
    txt[i * 4 + 1] = (H - (t + b) / 2) * DPR
    txt[i * 4 + 2] = ((rr - l) / 2) * DPR
    txt[i * 4 + 3] = ((b - t) / 2) * DPR
  }
}

/** The slots near the screen (an observer keeps the set; a slot's scene can change, as on the services
    stage, and the old scene then fades out where it was). */
const nearSpots = new Set<HTMLElement>()
let spotIO: IntersectionObserver | null = null
const smooth = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t) }

function watchSpots() {
  spotIO ??= new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) nearSpots.add(e.target as HTMLElement); else nearSpots.delete(e.target as HTMLElement) })
    readSpots()
    wake()
  }, { rootMargin: '25% 0px' })
  spotIO.disconnect()
  nearSpots.clear()
  document.querySelectorAll('[data-spot]').forEach((el) => spotIO?.observe(el))
}

/** Each scene's target weight (how far its slot is in view) and where its slot is now. A scene that
    loses its slot keeps its last place, so it fades out where it was. */
function readSpots() {
  wt.fill(0)
  for (const el of nearSpots) {
    const idx = SCENE_INDEX[el.dataset.spot as Scene]
    if (idx === undefined || idx < 0) continue
    const r = el.getBoundingClientRect()
    if (r.height < 4 || r.width < 4) continue
    const vis = Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0))
    const target = smooth(0.12, 0.75, vis / Math.min(r.height, H * 0.9))
    if (target < wt[idx]) continue
    wt[idx] = target
    const g = spotGeom(r)
    S[idx * 4] = g.x * DPR
    S[idx * 4 + 1] = (H - g.y) * DPR
    S[idx * 4 + 2] = g.r * DPR
  }
}

/** The film's slot and the chapters with their own ground, in device px (y up). */
function readLab() {
  readReel()
  readImgs()
  for (const film of films) {
    const r = film.el.getBoundingClientRect()
    if (film.veil) {
      // the whole width, the chapter's height; the edge sits just above the words and climbs as the
      // chapter scrolls away, until the whole clip has broken into dots
      film.r = [0, (H - r.bottom) * DPR, W * DPR, r.height * DPR]
      const tr = film.text?.getBoundingClientRect()
      const e0 = tr && r.height > 4 ? clamp01(1 - (tr.top - r.top) / r.height + 0.1) : film.edge0
      // it starts to climb once a third of the chapter has passed the top, while its words are read
      const lift = smooth(0, 1, (-r.top - r.height * 0.3) / Math.max(1, r.height * 0.7))
      const edge = e0 + (1.14 - e0) * lift
      film.v = [edge, Math.max(0.14, edge * 0.96), film.focus[0], film.focus[1]]
    } else if (film.disc) {
      // the disc's square, where the horizon draws its disc in the same slot
      const g = spotGeom(r)
      film.r = [(g.x - g.r) * DPR, (H - (g.y + g.r)) * DPR, 2 * g.r * DPR, 2 * g.r * DPR]
    } else film.r = [r.left * DPR, (H - r.bottom) * DPR, r.width * DPR, r.height * DPR]
    const vis = Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)) / Math.max(1, Math.min(r.height, H))
    film.vis = vis
    film.wt = r.height > 4 ? (film.veil ? smooth(0, 0.06, vis) : smooth(0.05, 0.5, vis)) : 0
    if (film.mode === 'scroll') film.devT = 1 - smooth(0.08, 0.34, Math.abs((r.top + r.height / 2) / H - 0.5))
  }
  let k = 0
  gnd.fill(0)
  for (const g of grounds) {
    if (k > 1) break
    const r = g.el.getBoundingClientRect()
    if (r.bottom < -40 || r.top > H + 40) continue
    gnd[k * 4] = (H - r.top) * DPR
    gnd[k * 4 + 1] = (H - r.bottom) * DPR
    gnd[k * 4 + 2] = g.kind
    gnd[k * 4 + 3] = 1
    k++
  }
}

function measure() {
  watchSpots()
  watchText()
  readSpots()
  readLab()
  dirty = true
}

function draw() {
  if (!gl || !cv) return
  const cell = cellCss(W) * DPR
  gl.uniform2f(U.uRes, cv.width, cv.height)
  gl.uniform1f(U.uCell, cell)
  gl.uniform1f(U.uTime, time)
  gl.uniform2f(U.uPtr, ptr.x * DPR, (H - ptr.y) * DPR)
  gl.uniform1f(U.uPtrE, mode === 'full' && !T3 && RIPPLE() && !document.documentElement.classList.contains('disable-animations') ? ptr.e : 0)
  for (let i = 0; i < N_SCENES; i++) S[i * 4 + 3] = w[i]
  gl.uniform4fv(U.uS, S)
  gl.uniform4f(U.uG, live.gear[0], live.gear[1], live.gear[2], live.gear[3])
  gl.uniform1f(U.uAmb, amb)
  // the quiet field spreads out from the disc (the hero's slot), or from the screen's centre
  gl.uniform2f(U.uC, S[2] > 0 ? S[0] : W * 0.5 * DPR, S[2] > 0 ? S[1] : H * 0.5 * DPR)
  gl.uniform1f(U.uR, Math.min(W, H) * 0.3 * DPR)
  gl.uniform1f(U.uLid, live.lid)
  gl.uniform4f(U.uScr, live.scr[0], live.scr[1], live.scr[2], live.scr[3])
  gl.uniform1f(U.uLead, live.lead)
  gl.uniform4f(U.uReel, live.reel[0], live.reel[1], live.reel[2], live.reel[3])
  gl.uniform1f(U.uType, type.e)
  gl.uniform1f(U.uTypeT, type.t)
  gl.uniform1f(U.uRew, live.rew)
  gl.uniform4fv(U.uTxt, txt)
  gl.uniform1f(U.uNTxt, nTxt)
  gl.uniform1f(U.uPad, 20 * DPR)
  gl.uniform1f(U.uLvl, lvl)
  gl.uniform4f(U.uNote, note.x, note.y, note.e, ((performance.now() - note.at) / 1000) * 240 * DPR)
  FK.fill(0)
  for (const f of films) {
    uploadFilm(f)
    const u = f.unit
    FR.set([f.r[0], f.r[1], Math.max(1, f.r[2]), Math.max(1, f.r[3])], u * 4)
    FK.set([f.w * f.fade, f.dev, f.veil ? f.top : f.mode === 'touch' ? 1 : 0, f.ready], u * 4)
    FP.set([f.px * DPR, (H - f.py) * DPR, f.pe], u * 3)
    FA[u] = f.aspect
    FS[u] = f.veil ? 2 + f.style : f.disc ? 1 : 0
    FV.set(f.v, u * 4)
  }
  gl.uniform4fv(U.uFilmR, FR)
  gl.uniform4fv(U.uFilmK, FK)
  gl.uniform3fv(U.uFilmP, FP)
  gl.uniform1fv(U.uFilmA, FA)
  gl.uniform1fv(U.uFilmS, FS)
  gl.uniform4fv(U.uFilmV, FV)
  uploadReel()
  drawReel()
  gl.uniform1f(U.uGrain, GRAIN() ? 1 : 0)
  flowBusy = flowUpload(performance.now())
  gl.uniform4fv(U.uFlowP, FLP)
  gl.uniform4fv(U.uFlowE, FLE)
  gl.uniform1f(U.uFlowR, 40 * DPR)
  gl.uniform1f(U.uGrainPx, Math.max(2, Math.round(2 * DPR)))
  gl.uniform1f(U.uTrail, mode === 'full' && SQUARES() && !document.documentElement.classList.contains('disable-animations') ? 1 : 0)
  gl.uniform4f(U.uPress, press.x * DPR, (H - press.y) * DPR, mode === 'full' && !document.documentElement.classList.contains('disable-animations') ? press.e : 0, 64 * DPR)
  gl.uniform1f(U.uScrollV, scrollV)
  drawImgs()
  gl.uniform4fv(U.uGnd, gnd)
  gl.uniform1f(U.uGE, Math.min(140, Math.max(64, H * 0.12)) * DPR)
  gl.uniform4f(U.uTurn, turn.x * DPR, (H - turn.y) * DPR, turn.cover, turn.reveal)
  gl.uniform3f(U.uTurnC, turn.col[0], turn.col[1], turn.col[2])
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
  const k = 1 - Math.pow(1 - 0.1, dt * 60)
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
  // the finger's dome follows it with a little ease, swells in fast and settles out slowly
  const kf = 1 - Math.pow(1 - 0.32, dt * 60)
  press.x = lerp(press.x, press.tx, kf)
  press.y = lerp(press.y, press.ty, kf)
  press.e += (press.on - press.e) * (1 - Math.pow(1 - (press.on ? 0.16 : 0.07), dt * 60))
  if (!press.on && press.e < 0.004) press.e = 0
  if (press.e > 0) moving = true
  // the music moves the dots only in full motion (calm: the music plays, the field keeps still)
  const heard = mode === 'full' && !stopped ? Math.min(1, sound.level() * 4) : 0
  lvl = lerp(lvl, heard, 1 - Math.pow(1 - 0.2, dt * 60))
  if (lvl < 0.004) lvl = 0
  note.e *= Math.pow(0.982, dt * 60)
  if (note.e < 0.01) note.e = 0
  if (lvl > 0 || note.e > 0) moving = true
  if (stepLab(now, dt)) moving = true
  // the wake and the scroll's stir keep it drawing until they settle
  scrollV = lerp(scrollV, mode === 'full' ? svT : 0, 1 - Math.pow(1 - 0.18, dt * 60))
  svT *= Math.pow(0.88, dt * 60)
  if (Math.abs(scrollV) < 0.002 && Math.abs(svT) < 0.002) { scrollV = 0; svT = 0 }
  if (flowBusy || scrollV !== 0) moving = true
  // full: halve the rate after 2.5s with nothing but the sea moving
  if (moving) idleSince = now
  // the words move with transitions too (reveals, the services stage): read them now and then
  if (textDirty || (moving && ++textTick % 6 === 0)) { readText(); readSpots(); readLab() }
  const idle = mode === 'full' && now - idleSince > 2500
  skip = idle ? !skip : false
  if (!skip) draw()
  dirty = false
  if (mode === 'full' || moving) raf = requestAnimationFrame(frame)
  if (first) { first = false; resolveReady(true) }
}
let first = true
let textTick = 0

function wake() {
  dirty = true
  if (!raf && gl && !document.hidden) raf = requestAnimationFrame(frame)
}

const onPtr = (x: number, y: number) => {
  if (mode === 'full' && !document.documentElement.classList.contains('disable-animations')) flowPush(x, y)
  for (const film of films) {
    const r = film.el.getBoundingClientRect()
    film.inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
    if (film.inside) { film.px = x; film.py = y }
  }
  if (ptr.tx < -9000) { ptr.x = x; ptr.y = y }
  ptr.tx = x; ptr.ty = y; ptr.e = 1
  if (mode === 'full') wake()
}
const onPointer = (e: PointerEvent) => { if (e.pointerType !== 'touch') onPtr(e.clientX, e.clientY) }
const onTouch = (e: TouchEvent) => {
  const t = e.touches[0]
  if (!t) return
  press.tx = t.clientX; press.ty = t.clientY
  onPtr(t.clientX, t.clientY)
}
const onTouchStart = (e: TouchEvent) => {
  const t = e.touches[0]
  if (!t || mode !== 'full') return
  press.tx = t.clientX; press.ty = t.clientY
  if (press.e < 0.02) { press.x = t.clientX; press.y = t.clientY }
  press.on = 1
  wake()
}
const onTouchEnd = (e: TouchEvent) => { if (!e.touches.length) { press.on = 0; wake() } }
const onScroll = () => {
  // the scroll's speed stirs the pictures (phones have no pointer to stir them with)
  const now = performance.now()
  const y = window.scrollY
  if (svAt) svT = Math.max(-1, Math.min(1, ((y - svY) / Math.max(8, now - svAt)) * 1000 / 2600))
  svY = y
  svAt = now
  readSpots(); readText(); readLab(); wake()
}
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
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('touchmove', onTouch, { passive: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('touchcancel', onTouchEnd, { passive: true })
  window.addEventListener('load', remeasure)
  document.addEventListener('visibilitychange', onVisible)
  document.fonts?.ready.then(remeasure)
  ro = new ResizeObserver(remeasure)
  ro.observe(document.body)
  mo = new MutationObserver(remeasure)
  mo.observe(document.getElementById('main-content') ?? document.body, { childList: true, subtree: true })
  // each bell rings out from the shape on screen (or the screen's centre)
  sound.onNote((v) => {
    if (mode !== 'full' || document.documentElement.classList.contains('disable-animations')) return
    let top = -1
    for (let i = 0; i < N_SCENES; i++) if (w[i] > 0.3 && (top < 0 || w[i] > w[top])) top = i
    note.x = top >= 0 ? S[top * 4] : W * 0.5 * DPR
    note.y = top >= 0 ? S[top * 4 + 1] : H * 0.5 * DPR
    note.e = v
    note.at = performance.now()
    wake()
  })
  idleSince = performance.now()
  wake()
}

export function stop() {
  cancelAnimationFrame(raf)
  raf = 0
  window.removeEventListener('resize', size)
  window.removeEventListener('scroll', onScroll)
  textIO?.disconnect()
  spotIO?.disconnect()
  window.removeEventListener('pointermove', onPointer)
  window.removeEventListener('touchmove', onTouch)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('touchcancel', onTouchEnd)
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

/** Remeasure the slots now (after a layout change the observers cannot see, e.g. a slot's new scene). */
export const refresh = () => { measure(); wake() }

export const running = () => gl !== null

// dev only: drive the field from the console or a test (scratch state renders)
if (import.meta.env.DEV && typeof window !== 'undefined') (window as unknown as { __seaField?: unknown }).__seaField = { set }

// ── the lab's layers ──

/** A film's frame into its texture: the poster once, then each new video frame while it plays. */
function uploadFilm(f: Film) {
  const tex = texs[f.unit]
  if (!gl || !tex || f.w <= 0.001) return
  const v = f.video
  const fromVideo = Boolean(v && v.readyState >= 2 && !v.paused && f.frameNew)
  if (!fromVideo && (f.posterUp || !f.poster?.complete || !f.poster.naturalWidth)) return
  gl.activeTexture(gl.TEXTURE0 + f.unit)
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  try {
    if (fromVideo && v) { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, v); f.frameNew = false }
    else if (f.poster) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, f.poster)
      f.posterUp = true
      if (!v?.videoWidth) f.aspect = f.poster.naturalWidth / f.poster.naturalHeight
    }
    f.ready = 1
  } catch { /* a broken frame: keep the last one */ }
}

const easeIO = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)

/** One film's development. Returns true while it moves. */
function stepFilm(film: Film, now: number, dt: number): boolean {
  let busy = false
  // the hero's disc waits for the opening to hand over (the disc is the opening's mark)
  const wt = film.after && !arrived() ? 0 : film.wt
  const before = film.w
  film.w = Math.abs(wt - film.w) < 0.002 ? wt : lerp(film.w, wt, 1 - Math.pow(0.9, dt * 60))
  if (film.w !== before) busy = true
  // time: it develops by itself after a moment fully in view, and goes back to dots when it leaves
  if (film.mode === 'time') {
    if (film.vis > 0.7 && wt > 0) { if (!film.seenAt) film.seenAt = now } else film.seenAt = 0
    film.devT = film.seenAt && now - film.seenAt > (film.after ? 1300 : 900) ? 1 : 0
    if (film.seenAt && film.dev < 1) busy = true
  }
  if (film.mode === 'touch') film.devT = film.tapped ? 1 : 0
  // in colour from the start (D157, gate `media`): only its edges are dots
  if (film.mode === 'colour') { film.devT = 1; film.dev = 1 }
  // a backdrop's change: it fades out, takes the next clip, and fades back in once its frame is there
  if (film.swapTo !== null || film.swapping || film.fade < 1) {
    busy = true
    if (film.swapTo !== null) {
      film.fade = Math.max(0, film.fade - dt / 0.28)
      if (film.fade <= 0) {
        const url = film.swapTo
        film.swapTo = null
        film.swapping = true
        if (film.swapPoster) { film.poster = film.swapPoster; film.posterUp = false }
        const v = film.video
        if (v && mode === 'full') {
          v.src = url
          v.load()
          v.addEventListener('loadedmetadata', () => { v.currentTime = Math.random() * Math.max(0, (Number.isFinite(v.duration) ? v.duration : 4) - 3) }, { once: true })
          v.addEventListener('seeked', () => { film.swapping = false; film.frameNew = true; film.playing = false }, { once: true })
        } else film.swapping = false
      }
    } else if (!film.swapping) film.fade = Math.min(1, film.fade + dt / 0.45)
  }
  const rate = film.devT > film.dev ? dt / 1.4 : dt / 0.8
  const d0 = film.dev
  film.dev = film.devT > film.dev ? Math.min(film.devT, film.dev + rate) : Math.max(film.devT, film.dev - rate)
  if (film.dev !== d0) busy = true
  // the finger develops the print around it; when it leaves, the dots come back
  const pe0 = film.pe
  film.pe = film.inside && mode === 'full' ? Math.min(1, film.pe + dt / 0.25) : Math.max(0, film.pe - dt / 0.9)
  if (film.pe !== pe0) busy = true
  // play only while it is on screen (and never in calm or still: nothing plays by itself there)
  const v = film.video
  if (v && mode === 'full' && document.documentElement.classList.contains('disable-animations')) { if (!v.paused) v.pause(); film.playing = false }
  else if (v && mode === 'full') {
    if (film.w > 0.02 && v.paused && !film.playing && v.getAttribute('src')) { film.playing = true; playOrWait(v, () => { film.playing = false }) }
    if (film.w <= 0.02 && !v.paused) { v.pause(); film.playing = false }
    if (!v.paused) busy = true
  }
  return busy
}

/** One frame of the films' development and the page turn. Returns true while something moves. */
function stepLab(now: number, dt: number): boolean {
  let busy = false
  for (const f of films) if (stepFilm(f, now, dt)) busy = true
  if (stepReel(now, dt)) busy = true
  if (stepImgs(dt)) busy = true
  if (turn.anim) {
    const a = turn.anim
    const k = Math.min(1, (now - a.t0) / a.ms)
    turn[a.key] = easeIO(k)
    busy = true
    if (k >= 1) { turn.anim = null; a.done() }
  }
  return busy
}

export interface FilmOpts {
  mode?: FilmMode
  /** draw it inside the slot's disc (the hero's horizon) instead of its rectangle */
  disc?: boolean
  /** wait for the opening to hand over */
  after?: boolean
  /** the chapter's ground: the clip across the chapter, breaking into dots above `text` */
  veil?: boolean
  text?: HTMLElement | null
  /** a ground with no words over it: where its edge sits (0 bottom .. 1 top) */
  edge?: number
  focus?: [number, number]
  top?: number
  style?: number
}

/** Add a film in its slot: its video (null where it must not play) and its poster. Returns its id, or
    null when both texture units are taken. The film shows in dots and develops by its mode. */
export function addFilm(el: HTMLElement, video: HTMLVideoElement | null, poster: HTMLImageElement | null, o: FilmOpts = {}): number | null {
  const used = new Set(films.map((f) => f.unit))
  let unit = -1
  for (let u = 0; u < MAX_FILMS; u++) if (!used.has(u)) { unit = u; break }
  if (unit < 0) return null
  const film: Film = {
    id: ++filmSeq, el, video, poster, mode: o.mode ?? 'time', disc: Boolean(o.disc), after: Boolean(o.after), unit,
    veil: Boolean(o.veil), text: o.text ?? null, edge0: o.edge ?? 0.45, focus: o.focus ?? [0.5, 0.5], top: o.top ?? 0, style: o.style ?? 0, fade: 1, swapTo: null, swapPoster: null, swapping: false, v: [o.edge ?? 0.45, o.edge ?? 0.45, 0.5, 0.5],
    w: 0, wt: 0, vis: 0, dev: 0, devT: 0, seenAt: 0, ready: 0, posterUp: false, aspect: 16 / 9,
    r: [0, 0, 0, 0], pe: 0, px: 0, py: 0, inside: false, tapped: false, frameNew: true, playing: false,
  }
  films.push(film)
  if (video) {
    const vf = video as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number }
    if (vf.requestVideoFrameCallback) {
      const onFrame = () => { film.frameNew = true; if (films.includes(film)) vf.requestVideoFrameCallback!(onFrame) }
      vf.requestVideoFrameCallback(onFrame)
    } else film.frameNew = true
    video.addEventListener('loadedmetadata', () => { if (video.videoWidth) film.aspect = video.videoWidth / video.videoHeight })
  }
  readLab()
  wake()
  return film.id
}

/** A backdrop takes another clip (and its poster), through a fade. */
export function swapFilm(id: number | null, url: string, poster: HTMLImageElement | null) {
  const f = films.find((x) => x.id === id)
  if (!f) return
  f.swapTo = url
  f.swapPoster = poster
  wake()
}

/** Remove a film (its slot left the page). */
export function dropFilm(id: number | null) {
  const i = films.findIndex((f) => f.id === id)
  if (i < 0) return
  const [f] = films.splice(i, 1)
  f.video?.pause()
  wake()
}

/** A tap on a film develops all of it (or takes it back to dots), in the touch mode. */
export function tapFilm(id: number | null) {
  const f = films.find((x) => x.id === id)
  if (f) { f.tapped = !f.tapped; wake() }
}

/** The chapters with their own ground (lab gate `ground`): 1 under the horizon, 2 paper. */
export function setGrounds(list: { el: HTMLElement; kind: 1 | 2 }[]) {
  grounds.length = 0
  grounds.push(...list)
  readLab()
  wake()
}

/** The page turn: cover the page with dots from (x, y) in `col` (0..1 rgb). */
export function turnCover(x: number, y: number, col: [number, number, number], ms = 520): Promise<void> {
  if (!gl) return Promise.resolve()
  turn.x = x; turn.y = y; turn.col = col; turn.reveal = 0
  return new Promise((done) => { turn.anim = { key: 'cover', t0: performance.now(), ms, done }; wake() })
}

/** ...and on the new page, the dots shrink away from the centre outward. */
export function turnReveal(col: [number, number, number], ms = 640): Promise<void> {
  if (!gl) return Promise.resolve()
  turn.col = col; turn.cover = 1; turn.reveal = 0
  return new Promise((done) => {
    turn.anim = { key: 'reveal', t0: performance.now(), ms, done: () => { turn.cover = 0; turn.reveal = 0; dirty = true; done() } }
    wake()
  })
}

// ── the hero's showreel (D157; Lama Lama's hero, studied frame by frame): many takes one after another,
// in full colour behind the headline, the scenery changing all the time. Nothing repeats: each take is
// a clip from the pool, picked at random (none of the last few), started at a random point and held
// for a random time, and each change is one of eight transitions (never one of the last three) with a
// random seed, origin and angle; every take drifts slowly inward. Its bottom edge breaks into the sea's
// dots and climbs as the hero scrolls away. Full motion only; calm shows the first take's poster.
interface ReelSlot { v: HTMLVideoElement; clip: number; fresh: boolean; ready: boolean; started: number; aspect: number }
const N_TYPES = 8
const reel = {
  el: null as HTMLElement | null,
  pool: [] as string[],
  slots: [] as ReelSlot[],
  poster: null as HTMLImageElement | null,
  posterUp: false,
  cur: 0,
  phase: 'idle' as 'idle' | 'hold' | 'trans',
  t0: 0, hold: 0, trans: 0, type: 0, k: 0,
  lastTypes: [] as number[], recent: [] as number[],
  seed: 0, ox: 0.5, oy: 0.5, ang: 0,
  w: 0, wt: 0, vis: 0, dev: 0, devT: 0, seenAt: 0,
  r: [0, 0, 0, 0] as [number, number, number, number], edge: 0.12,
}
const reelTex: (WebGLTexture | null)[] = [null, null]
const RR = new Float32Array(4)

function reelSlot(v: HTMLVideoElement): ReelSlot {
  const s: ReelSlot = { v, clip: -1, fresh: false, ready: false, started: 0, aspect: 16 / 9 }
  const vf = v as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number }
  if (vf.requestVideoFrameCallback) {
    const on = () => { s.fresh = true; if (reel.slots.includes(s)) vf.requestVideoFrameCallback!(on) }
    vf.requestVideoFrameCallback(on)
  }
  v.addEventListener('seeked', () => { s.ready = true; s.fresh = true; if (v.videoWidth) s.aspect = v.videoWidth / v.videoHeight; wake() })
  return s
}

function pickClip(first: boolean): number {
  const n = reel.pool.length
  if (first || n < 2) return 0
  let i = 0
  for (let g = 0; g < 24; g++) { i = Math.floor(Math.random() * n); if (!reel.recent.includes(i)) break }
  reel.recent = [...reel.recent, i].slice(-Math.min(5, n - 1))
  return i
}

/** A take into a slot: a clip at random (the sea first), from a random point. */
function reelLoad(s: ReelSlot, play: boolean, first = false) {
  s.clip = pickClip(first)
  if (first) reel.recent = [0]
  s.ready = false
  const v = s.v
  v.src = reel.pool[s.clip]
  v.load()
  v.addEventListener('loadedmetadata', () => {
    const d = Number.isFinite(v.duration) ? v.duration : 4
    v.currentTime = first ? 0.001 : Math.random() * Math.max(0, d - 3.3)
    if (play) playOrWait(v)
  }, { once: true })
}

const easeIO3 = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

function stepReel(now: number, dt: number): boolean {
  if (!reel.el) return false
  let busy = false
  const wt = arrived() ? reel.wt : 0
  const w0 = reel.w
  reel.w = Math.abs(wt - reel.w) < 0.002 ? wt : lerp(reel.w, wt, 1 - Math.pow(0.9, dt * 60))
  if (reel.w !== w0) busy = true
  // the material develops into colour a moment after the hero is in view (Lama's mechanism 4)
  if (reel.vis > 0.5 && wt > 0) { if (!reel.seenAt) reel.seenAt = now } else reel.seenAt = 0
  reel.devT = reel.seenAt && now - reel.seenAt > 600 ? 1 : 0
  const d0 = reel.dev
  reel.dev = reel.devT > reel.dev ? Math.min(1, reel.dev + dt / 1.9) : Math.max(0, reel.dev - dt / 0.8)
  if (reel.dev !== d0) busy = true
  const S = reel.slots
  if (mode !== 'full' || S.length < 2) return busy
  // the accessibility widget's stop: the reel holds its frame
  if (document.documentElement.classList.contains('disable-animations')) { S.forEach((s) => { if (!s.v.paused) s.v.pause() }); return busy }
  if (reel.w <= 0.02) { S.forEach((s) => { if (!s.v.paused) s.v.pause() }); return busy }
  const A = S[reel.cur]
  const B = S[1 - reel.cur]
  if (reel.phase === 'idle') {
    reelLoad(A, true, true)
    reelLoad(B, false)
    reel.phase = 'hold'
    reel.t0 = now
    reel.hold = 2000
    A.started = now
    return true
  }
  if (A.v.paused && A.ready) playOrWait(A.v)
  if (reel.phase === 'hold') {
    if (now - reel.t0 > reel.hold && B.ready) {
      playOrWait(B.v)
      B.started = now
      let type = 0
      for (let g = 0; g < 24; g++) { type = Math.floor(Math.random() * N_TYPES); if (!reel.lastTypes.includes(type)) break }
      reel.lastTypes = [...reel.lastTypes, type].slice(-3)
      reel.type = type
      reel.trans = 650 + Math.random() * 500
      reel.seed = Math.random() * 97
      reel.ox = 0.2 + Math.random() * 0.6
      reel.oy = 0.3 + Math.random() * 0.55
      reel.ang = Math.random() * Math.PI * 2
      reel.phase = 'trans'
      reel.t0 = now
    }
  } else {
    const x = Math.min(1, (now - reel.t0) / reel.trans)
    reel.k = easeIO3(x)
    if (x >= 1) {
      reel.k = 0
      A.v.pause()
      reel.cur = 1 - reel.cur
      reelLoad(A, false)
      reel.phase = 'hold'
      reel.t0 = now
      reel.hold = 1100 + Math.random() * 1300
    }
  }
  return true
}

function uploadReel() {
  if (!gl || !reel.el || reel.w <= 0.001) return
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  reel.slots.forEach((s, i) => {
    if (!s.ready || !s.fresh || s.v.readyState < 2) return
    gl!.activeTexture(gl!.TEXTURE2 + i)
    gl!.bindTexture(gl!.TEXTURE_2D, reelTex[i])
    try { gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGB, gl!.RGB, gl!.UNSIGNED_BYTE, s.v); s.fresh = false } catch { /* keep the last frame */ }
  })
  // before the first take's first frame (and in calm): its poster
  const first = reel.slots[0]
  if (!reel.posterUp && reel.poster?.complete && reel.poster.naturalWidth && !(first && first.ready)) {
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, reelTex[0])
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, reel.poster); reel.posterUp = true } catch { /* later */ }
  }
}

function readReel() {
  if (!reel.el) return
  const r = reel.el.getBoundingClientRect()
  RR.set([0, (H - r.bottom) * DPR, W * DPR, r.height * DPR])
  reel.vis = Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)) / Math.max(1, Math.min(r.height, H))
  reel.wt = r.height > 4 ? smooth(0, 0.06, reel.vis) : 0
  const lift = smooth(0, 1, (-r.top - r.height * 0.25) / Math.max(1, r.height * 0.7))
  reel.edge = 0.3 + (1.16 - 0.3) * lift
}

function drawReel() {
  if (!gl) return
  const A = reel.slots[reel.cur]
  const B = reel.slots[1 - reel.cur]
  const aspA = A?.aspect ?? (reel.poster?.naturalWidth ? reel.poster.naturalWidth / reel.poster.naturalHeight : 16 / 9)
  const now = performance.now()
  const scale = (s: ReelSlot | undefined) => 1 + 0.08 * clamp01(s && s.started ? (now - s.started) / 6500 : 0)
  gl.uniform4fv(U.uReelR, RR)
  gl.uniform4f(U.uReelK, reel.el ? reel.w : 0, reel.dev, reel.k, reel.type)
  gl.uniform4f(U.uReelS, reel.seed, reel.ox, reel.oy, reel.ang)
  gl.uniform4f(U.uReelV, reel.edge, Math.max(0.26, reel.edge * 0.9), aspA, B?.aspect ?? 16 / 9)
  gl.uniform4f(U.uReelX, scale(A), scale(B), reel.cur, reel.phase === 'trans' ? 1 : 0)
}

/** The hero's showreel: its chapter, the two videos it plays through (null in calm), the first take's
    poster and the pool of clip URLs (the first is the opening take). */
export function setReel(el: HTMLElement | null, vids: HTMLVideoElement[] | null, poster: HTMLImageElement | null, pool: string[] = []) {
  reel.slots.forEach((s) => s.v.pause())
  reel.el = el
  reel.poster = poster
  reel.posterUp = false
  reel.pool = pool
  reel.phase = 'idle'
  reel.cur = 0
  reel.k = 0
  reel.dev = 0
  reel.devT = 0
  reel.seenAt = 0
  reel.w = 0
  reel.recent = []
  reel.slots = (vids ?? []).map(reelSlot)
  readReel()
  wake()
}

// ── live pictures (D158; Lama Lama's webgl_image, translated): every picture on the page that is not a
// clip's ground is drawn by the field from an atlas of eight cells. At rest it is its own material (its
// light as a warm grey grain on a dark tile); when it is "on" (its service on the stage, the pointer on
// it, its row in the middle of a phone's screen) it develops into colour, each time in another way (all
// over, from the point where the pointer came in, from the top down); the pointer's wake stirs it, and
// it drifts inside its frame as the page scrolls. The element holds the place (and the plain picture
// without WebGL); the cells go to the pictures nearest the screen.
interface Img {
  id: number
  el: HTMLElement
  img: HTMLImageElement
  cell: number
  on: number
  c: number
  kind: number
  seed: number
  ox: number
  oy: number
  w: number
  wt: number
  near: boolean
  r: [number, number, number, number]
  par: number
}
const IMG_CELLS = 8
const CELL_W = 512
const CELL_H = 320
const imgs: Img[] = []
let imgSeq = 0
let atlasTex: WebGLTexture | null = null
const cellOf: (Img | null)[] = new Array(IMG_CELLS).fill(null)
const IMR = new Float32Array(IMG_CELLS * 4)
const IMU = new Float32Array(IMG_CELLS * 4)
const IMK = new Float32Array(IMG_CELLS * 4)
const IMO = new Float32Array(IMG_CELLS * 4)
let cellCanvas: HTMLCanvasElement | null = null

function setupAtlas() {
  if (!gl) return
  atlasTex = gl.createTexture()
  gl.activeTexture(gl.TEXTURE4)
  gl.bindTexture(gl.TEXTURE_2D, atlasTex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, CELL_W * 4, CELL_H * 2, 0, gl.RGB, gl.UNSIGNED_BYTE, null)
  gl.uniform1i(U.uAtlas, 4)
}

/** A picture into its cell: cover-fitted to 512 x 320 on a small canvas, then into the atlas. */
function upload(im: Img) {
  if (!gl || !atlasTex || im.cell < 0 || !im.img.naturalWidth) return
  cellCanvas ??= document.createElement('canvas')
  cellCanvas.width = CELL_W
  cellCanvas.height = CELL_H
  const ctx = cellCanvas.getContext('2d')
  if (!ctx) return
  const ir = im.img.naturalWidth / im.img.naturalHeight
  const br = CELL_W / CELL_H
  let sw = im.img.naturalWidth
  let sh = im.img.naturalHeight
  if (ir > br) sw = sh * br; else sh = sw / br
  ctx.drawImage(im.img, (im.img.naturalWidth - sw) / 2, (im.img.naturalHeight - sh) / 2, sw, sh, 0, 0, CELL_W, CELL_H)
  gl.activeTexture(gl.TEXTURE4)
  gl.bindTexture(gl.TEXTURE_2D, atlasTex)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  try { gl.texSubImage2D(gl.TEXTURE_2D, 0, (im.cell % 4) * CELL_W, Math.floor(im.cell / 4) * CELL_H, gl.RGB, gl.UNSIGNED_BYTE, cellCanvas) } catch { /* later */ }
}

function readImgs() {
  for (const im of imgs) {
    const r = im.el.getBoundingClientRect()
    im.r = [r.left * DPR, (H - r.bottom) * DPR, Math.max(1, r.width) * DPR, Math.max(1, r.height) * DPR]
    const visible = r.bottom > 0 && r.top < H && r.width > 2 && r.height > 2 && im.el.dataset.hide !== '1'
    im.near = r.bottom > -H * 0.6 && r.top < H * 1.6 && r.width > 2
    im.wt = visible ? 1 : 0
    // drift inside the frame: the picture sits a little lower as its frame rises
    im.par = ((r.top + r.height / 2) / H - 0.5) * -0.06
    const on = im.el.dataset.on === '1' ? 1 : 0
    if (on !== im.on) {
      im.on = on
      // each change its own way: from where the pointer came in when it did, otherwise at random
      const entered = im.el.dataset.ox !== undefined && on === 1
      im.kind = entered ? 1 : Math.random() < 0.5 ? 0 : 2
      im.seed = Math.random() * 50
      im.ox = entered ? Number(im.el.dataset.ox) : 0.5
      im.oy = entered ? Number(im.el.dataset.oy) : 0.5
    }
  }
  // the cells: free the far pictures', give them to the near ones
  for (let i = 0; i < IMG_CELLS; i++) { const o = cellOf[i]; if (o && (!imgs.includes(o) || !o.near)) { o.cell = -1; cellOf[i] = null } }
  for (const im of imgs) {
    if (im.cell >= 0 || !im.near || !im.img.naturalWidth) continue
    const free = cellOf.indexOf(null)
    if (free < 0) break
    im.cell = free
    cellOf[free] = im
    upload(im)
  }
}

function stepImgs(dt: number): boolean {
  let busy = false
  for (const im of imgs) {
    const w0 = im.w
    im.w = Math.abs(im.wt - im.w) < 0.01 ? im.wt : lerp(im.w, im.wt, 1 - Math.pow(0.85, dt * 60))
    const c0 = im.c
    const rate = mode === 'full' ? (im.on > im.c ? dt / 0.95 : dt / 0.6) : 1
    im.c = im.on > im.c ? Math.min(1, im.c + rate) : Math.max(0, im.c - rate)
    if (im.w !== w0 || im.c !== c0) busy = true
  }
  return busy
}

function drawImgs() {
  if (!gl) return
  IMK.fill(0)
  for (let j = 0; j < IMG_CELLS; j++) {
    const im = cellOf[j]
    if (!im) continue
    IMR.set(im.r, j * 4)
    IMU.set([(j % 4) * 0.25, Math.floor(j / 4) * 0.5, 0.25, 0.5], j * 4)
    IMK.set([im.w, im.c, im.kind, im.id % 4], j * 4)
    IMO.set([im.ox, im.oy, im.par, 1.12], j * 4)
  }
  gl.uniform4fv(U.uImgR, IMR)
  gl.uniform4fv(U.uImgU, IMU)
  gl.uniform4fv(U.uImgK, IMK)
  gl.uniform4fv(U.uImgO, IMO)
}

/** A live picture in its element (data-on="1" develops it; data-ox/oy: where the pointer came in). */
export function addImage(el: HTMLElement, img: HTMLImageElement): number {
  const im: Img = { id: ++imgSeq, el, img, cell: -1, on: 0, c: 0, kind: 0, seed: 0, ox: 0.5, oy: 0.5, w: 0, wt: 0, near: false, r: [0, 0, 1, 1], par: 0 }
  imgs.push(im)
  readImgs()
  wake()
  return im.id
}

export function dropImage(id: number | null) {
  const i = imgs.findIndex((x) => x.id === id)
  if (i < 0) return
  const [im] = imgs.splice(i, 1)
  if (im.cell >= 0) cellOf[im.cell] = null
  wake()
}

/** Remeasure the pictures now (after a state change the observers cannot see). */
export const touchImages = () => { readImgs(); wake() }
