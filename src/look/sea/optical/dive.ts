// sea · the dive's optics (S3): the scroll falls into one dot of the laptop and that dot's disc becomes the film
// chapter. The canvas takes over from the field at the moment the laptop chapter lets go, so it draws the field's
// own laptop (the very GLSL, cut out of shader.ts) in the field's coordinates: the same cell, slot, colours and
// backing resolution, read from the real canvas and the real slot, and the first frame lands on the same pixels.
// It ends on the picture the film chapter opens with, in that chapter's framing, and hands over under a fade.
import * as field from '../field'
import { FRAG } from '../shader'
import { VS, clamp, loopOf, loseContext, watch, type Uniforms } from './engine'

/** A piece of the field's shader, from one marker up to the next: if either moved, the dive does not start. */
function cut(from: string, to: string) {
  const a = FRAG.indexOf(from)
  const b = a < 0 ? -1 : FRAG.indexOf(to, a)
  if (b < 0) throw new Error(`dive: the field's shader has no "${from}" before "${to}"`)
  return FRAG.slice(a, b)
}

const fragment = () => `#version 300 es
precision highp float;
out vec4 frag;
uniform vec2 uRes, uCss, uFit, uFilm, uDot, uAt;
uniform vec4 uMap, uSlot, uScr;
uniform vec3 uLens;
uniform float uDpr, uCell, uTime, uLid, uLead, uZoom, uOthers, uR0, uREnd, uFlat, uEdge, uSoft, uOut, uLvl;
uniform sampler2D uPic;
${cut('const vec3 BG', 'vec2 horizon(')}
${cut('const float HY', 'vec2 reels(')}
vec4 slot(vec4 s) { s.x = (floor(s.x / uCell) + 0.5) * uCell; gCU = uCell / max(s.z, 1.0); gCV = vec2(gCU); return s; }
void main() {
  // css px from the canvas's corner, then the field's device px (y up), then the same pixel inside the dive
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 P = vec2((p.x - uMap.x) * uMap.z, (uMap.y - p.y) * uMap.w);
  vec2 px = (P - uAt) / uZoom + uDot;
  vec3 outc = BG;
  if (uOthers > 0.001) {
    vec2 cell = floor(px / uCell);
    vec2 c = (cell + 0.5) * uCell;
    vec4 s = slot(uSlot);
    vec2 f = laptop((c - s.xy) / s.z, uTime);
    float light = 0.5 + 0.5 * sin(dot(c, vec2(-0.55, 0.83)) / (uCell * 13.0) - uTime * 0.35);
    float fill = smoothstep(0.1, 0.2, f.x) * (1.0 - smoothstep(0.84, 0.9, f.x));
    f.x *= mix(1.0, 0.68 + 0.32 * light, fill);
    float v = clamp(f.x * (1.0 + 0.16 * uLvl), 0.0, 1.0);
    float r = pow(v, 0.62) * uCell * 0.5;
    float a = (1.0 - smoothstep(r - 0.8 / uZoom, r + 0.6 / uZoom, length(px - c))) * step(0.02, v);
    outc = mix(BG, mix(CREAM, BLUE, clamp(f.y, 0.0, 1.0)), a * (0.35 + 0.65 * v) * uOthers);
  }
  // the chosen dot is the way in: its own disc, showing what is behind it
  float R = uR0 * uZoom;
  float d = length(P - uAt);
  float Rc = R / uMap.z;
  float settle = 1.34 - 0.34 * smoothstep(0.0, 1.0, log(max(Rc, 1.0) / 12.0) / log(uREnd / 12.0));
  vec3 pic = texture(uPic, (p - uFilm * 0.5) / (uFit * settle) + 0.5).rgb;
  float inDisc = 1.0 - smoothstep(R - 0.8, R + 0.6, d);
  vec3 lens = mix(uLens, pic, smoothstep(5.0, 44.0, Rc));
  // while the hole is small its edge is lit by the film behind it, and the room around the picture falls off
  float rim = exp(-abs(d / uMap.z - Rc) / 2.2) * smoothstep(3.0, 16.0, Rc) * (1.0 - smoothstep(170.0, 420.0, Rc));
  float vig = 1.0 - smoothstep(0.45, 1.15, length((p - uCss * 0.5) / uCss)) * 0.28 * (1.0 - uFlat);
  outc = mix(outc, lens * mix(1.0, vig, smoothstep(5.0, 44.0, Rc)), inDisc);
  outc += vec3(0.95, 0.55, 0.24) * rim * 0.32 * uOthers;
  // the picture's lower part gives way the way the chapter's ground does, from the bottom up to just above its words,
  // and they come through; what is left lies on the same picture, and fades
  float a = smoothstep(uEdge - uSoft, uEdge, max(0.0, 1.0 - p.y / uFilm.y)) * (1.0 - uOut);
  frag = vec4(clamp(outc, 0.0, 1.0) * a, a);
}`

/** The compile off the main thread where the driver can: a status query alone would block the page until it is done. */
function compile(gl: WebGL2RenderingContext): Promise<{ p: WebGLProgram; u: Uniforms }> {
  const make = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) throw new Error('dive: could not create a shader')
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const p = gl.createProgram()
  if (!p) throw new Error('dive: could not create a program')
  const fs = make(gl.FRAGMENT_SHADER, fragment())
  gl.attachShader(p, make(gl.VERTEX_SHADER, VS))
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  const ext = gl.getExtension('KHR_parallel_shader_compile') as { COMPLETION_STATUS_KHR: number } | null
  return new Promise((done, fail) => {
    const poll = () => {
      if (gl.isContextLost()) { fail(new Error('dive: the context was lost while compiling')); return }
      if (ext && !gl.getProgramParameter(p, ext.COMPLETION_STATUS_KHR)) { requestAnimationFrame(poll); return }
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { fail(new Error(`dive: ${gl.getProgramInfoLog(p) ?? gl.getShaderInfoLog(fs)}`)); return }
      const cache: Uniforms = {}
      done({ p, u: new Proxy(cache, { get: (t, n: string) => (n in t ? t[n] : (t[n] = gl.getUniformLocation(p, n))) }) })
    }
    poll()
  })
}

function picture(url: string) {
  return new Promise<HTMLImageElement>((done, fail) => {
    const i = new Image()
    i.decoding = 'async'
    i.onload = () => done(i)
    i.onerror = () => fail(new Error(`dive: no picture at ${url}`))
    i.src = url
  })
}

/** What only the field knows at this moment, read back from its own program: its clock (the bands of light) and the
    music's level (how far the dots have swollen), so the first frame is the frame it has just drawn. */
function fieldNow(cv: HTMLCanvasElement | null): { time: number; lvl: number } {
  const gl = cv?.getContext('webgl')
  const p = gl?.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null | undefined
  if (!gl || !p) return { time: 0, lvl: 0 }
  const read = (n: string) => { const at = gl.getUniformLocation(p, n); return at ? Number(gl.getUniform(p, at)) || 0 : 0 }
  return { time: read('uTime'), lvl: read('uLvl') }
}

// the laptop's frame, as shader.ts and gears.ts have it when the chapter ends: the lid fully open
const OPEN = (102 * Math.PI) / 180
const HY = -0.39
const HW = 1
const FW = 1.31
const DD = 0.59
const LL = 1.26
/** the way in: on the screen's closing key, just beside where the cursor has tapped it */
const TAPPED = { x: -0.1, y: -0.15 }
const KEY_V = 0.92
const BLUE: [number, number, number] = [0.475, 0.627, 0.773]
const BG: [number, number, number] = [0.059, 0.063, 0.067]

const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }

export interface DiveOptions {
  poster: string
  /** the film chapter: the picture's framing and the end of the dive */
  film: HTMLElement
  /** the laptop chapter's held stage, its slot and its words */
  lap: HTMLElement
  spot: HTMLElement
  onLost: () => void
}

export async function mountDive(root: HTMLElement, stage: HTMLElement, canvas: HTMLCanvasElement, o: DiveOptions) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false })
  if (!gl) return null
  let main: Awaited<ReturnType<typeof compile>>
  let img: HTMLImageElement
  try {
    ;[main, img] = await Promise.all([compile(gl), picture(o.poster)])
  } catch (err) {
    loseContext(gl)
    throw err
  }
  const { p, u: U } = main
  gl.useProgram(p)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const a = gl.getAttribLocation(p, 'a')
  gl.enableVertexAttribArray(a)
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0)
  const tex = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.uniform1i(U.uPic, 0)

  const fieldCanvas = document.querySelector<HTMLCanvasElement>('.sea-field canvas')
  const L = { y0: 0, D: 1, vh: 1, W: 0, H: 0, dpr: 1, cell: 10, sx: 1, sy: 1, left: 0, bottom: 0, dotX: 0, dotY: 0, midX: 0, midY: 0, r0: 1, Z: 100, rEnd: 500, e0: 0.45, w0: 0.43 }
  const words = o.lap.querySelector<HTMLElement>('.sea-in')
  let wordsWere = ''
  let sy = window.scrollY
  let wasLive = false
  const sp = { x: 0, v: 0 }

  function measure() {
    const lapBox = o.lap.getBoundingClientRect()
    const box = o.spot.getBoundingClientRect()
    const fc = fieldCanvas?.getBoundingClientRect()
    if (!fieldCanvas || !fc || !fc.width || !stage.clientWidth) return false
    L.vh = window.innerHeight
    L.W = stage.clientWidth
    L.H = stage.clientHeight
    L.y0 = root.getBoundingClientRect().top + window.scrollY
    L.D = Math.max(1, root.offsetHeight - stage.offsetHeight)
    // the same backing resolution as the field: its own pixels, when the two meet
    L.dpr = field.dprCap()
    const cw = Math.round(L.W * L.dpr)
    const ch = Math.round(L.H * L.dpr)
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw
      canvas.height = ch
      gl!.viewport(0, 0, cw, ch)
    }
    // the field's device px against css px, from the real canvas
    L.sx = fieldCanvas.width / fc.width
    L.sy = fieldCanvas.height / fc.height
    L.left = fc.left
    L.bottom = fc.bottom
    L.cell = field.cellCss(window.innerWidth) * field.dprCap()
    // the laptop's slot with its stage pinned (the stage's top at 0), as readSpots() reads it
    const g = field.spotGeom(new DOMRect(box.left, box.top - lapBox.top, box.width, box.height))
    const f = field.dprCap()
    const sx = (Math.floor((g.x * f) / L.cell) + 0.5) * L.cell
    const sY = (window.innerHeight - g.y) * f
    const sr = g.r * f
    gl!.uniform4f(U.uSlot, g.x * f, sY, sr, 1)
    // the chosen dot: the screen's coordinates back through the lid to one cell of the grid
    const c = Math.cos(OPEN)
    const ex = HY - DD * c + LL * Math.sin(OPEN)
    const ey = HW + (FW - HW) * c
    const unit = L.cell / sr
    const tq = Math.floor(Math.abs(ey - HW) / unit + 0.5)
    const eY = tq < 3 ? HW : HW + Math.sign(ey - HW) * tq * unit
    const lv = TAPPED.y * 0.43 + 0.5
    const qx = TAPPED.x * 0.93 * (HW + (eY - HW) * lv)
    const qy = HY + lv * (ex - HY)
    L.dotX = (Math.floor((sx + qx * sr) / L.cell) + 0.5) * L.cell
    L.dotY = (Math.floor((sY + qy * sr) / L.cell) + 0.5) * L.cell
    L.midX = (L.W * 0.5 - L.left) * L.sx
    L.midY = (L.bottom - L.H * 0.5) * L.sy
    L.r0 = Math.pow(KEY_V, 0.62) * L.cell * 0.5
    // far enough to pass the screen's farthest corner
    L.rEnd = Math.hypot(L.W, L.H) * 0.5 * 1.16
    L.Z = (L.rEnd * L.sx) / L.r0
    const filmH = o.film.offsetHeight
    // where the chapter's ground breaks into dots: field.ts's edge, just above its words
    const said = o.film.querySelector('.sea-in')?.getBoundingClientRect()
    L.e0 = said && filmH ? clamp(1 - (said.top - o.film.getBoundingClientRect().top) / filmH + 0.1) : 0.45
    L.w0 = Math.max(0.14, L.e0 * 0.96)
    const k = Math.max(L.W / img.naturalWidth, filmH / img.naturalHeight)
    gl!.uniform2f(U.uFit, img.naturalWidth * k, img.naturalHeight * k)
    gl!.uniform2f(U.uFilm, L.W, filmH)
    gl!.uniform2f(U.uRes, canvas.width, canvas.height)
    gl!.uniform2f(U.uCss, L.W, L.H)
    gl!.uniform1f(U.uDpr, L.dpr)
    gl!.uniform4f(U.uMap, L.left, L.bottom, L.sx, L.sy)
    gl!.uniform1f(U.uCell, L.cell)
    gl!.uniform2f(U.uDot, L.dotX, L.dotY)
    gl!.uniform1f(U.uR0, L.r0)
    gl!.uniform1f(U.uREnd, L.rEnd)
    gl!.uniform1f(U.uLid, OPEN)
    gl!.uniform4f(U.uScr, 1, 1, 1, 1)
    gl!.uniform1f(U.uLead, 1)
    // the key's dot, as the field mixes it onto the ground
    const av = 0.35 + 0.65 * KEY_V
    gl!.uniform3f(U.uLens, BG[0] + (BLUE[0] - BG[0]) * av, BG[1] + (BLUE[1] - BG[1]) * av, BG[2] + (BLUE[2] - BG[2]) * av)
    return true
  }

  function paint(t: number, out: number) {
    // the dive: slow at first, then all at once, as a fall does
    const dive = clamp(t / 0.92)
    const fall = Math.pow(dive, 2.6)
    const z = Math.exp(Math.log(L.Z) * fall)
    const glide = smooth(0, 0.75, fall)
    gl!.uniform1f(U.uZoom, z)
    gl!.uniform2f(U.uAt, L.dotX + (L.midX - L.dotX) * glide, L.dotY + (L.midY - L.dotY) * glide)
    gl!.uniform1f(U.uOthers, 1 - clamp((z - 7) / 26))
    gl!.uniform1f(U.uFlat, smooth(0.72, 1, fall))
    const open = smooth(0.92, 1, t)
    gl!.uniform1f(U.uEdge, -0.02 + (L.e0 + 0.02) * open)
    gl!.uniform1f(U.uSoft, 0.01 + (L.w0 - 0.01) * open)
    gl!.uniform1f(U.uOut, out)
    gl!.drawArrays(gl!.TRIANGLES, 0, 3)
  }

  const K = 130
  function step(dt: number) {
    const target = sy - L.y0
    if (target < -L.vh || target > L.D + L.vh) { sp.x = target; sp.v = 0 } else {
      const c = 2 * Math.sqrt(K)
      const h = dt / 3
      for (let i = 0; i < 3; i++) { sp.v += (-K * (sp.x - target) - c * sp.v) * h; sp.x += sp.v * h }
    }
    const moving = Math.abs(sp.x - target) > 0.4 || Math.abs(sp.v) > 2
    if (!moving) { sp.x = target; sp.v = 0 }
    // past the hold the stage and the film chapter leave together: the picture lies on its own copy, and fades
    const out = clamp((sp.x - L.D) / (L.vh * 0.26))
    const live = target > 0 && out < 1
    if (live && !wasLive) {
      const now = fieldNow(fieldCanvas)
      gl!.uniform1f(U.uTime, now.time)
      gl!.uniform1f(U.uLvl, now.lvl)
    }
    if (live) paint(clamp(sp.x / L.D), out)
    if (live !== wasLive) { wasLive = live; canvas.style.visibility = live ? 'visible' : 'hidden' }
    // the laptop chapter's words leave first: the laptop stands alone before the fall, and no line ever crosses it
    const stay = live ? (1 - clamp((sy - L.y0) / (L.vh * 0.13))).toFixed(3) : ''
    if (words && stay !== wordsWere) { wordsWere = stay; words.style.opacity = stay }
    return moving
  }
  const loop = loopOf(step)
  const onScroll = () => { sy = window.scrollY; loop.wake() }
  const remeasure = () => { if (measure()) { sy = window.scrollY; loop.wake() } }
  const lost = (e: Event) => { e.preventDefault(); o.onLost() }
  if (measure()) sp.x = sy - L.y0
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', remeasure)
  canvas.addEventListener('webglcontextlost', lost)
  // the widget's stop hides the dive through CSS and the loop stops with it: nothing may stay written on the laptop's words
  const page = document.documentElement
  const stopped = new MutationObserver(() => {
    if (page.classList.contains('disable-animations') || page.classList.contains('motion-reduced')) o.onLost()
  })
  stopped.observe(page, { attributes: true, attributeFilter: ['class'] })
  const ro = new ResizeObserver(remeasure)
  ro.observe(stage)
  ro.observe(document.body)
  const unwatch = watch(stage, loop)

  return () => {
    unwatch()
    ro.disconnect()
    stopped.disconnect()
    loop.show(false)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', remeasure)
    canvas.removeEventListener('webglcontextlost', lost)
    if (words) words.style.opacity = ''
    loseContext(gl)
  }
}
