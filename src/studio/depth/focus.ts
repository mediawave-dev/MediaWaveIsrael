// depth · the focus pull on the headline (the lab's C1 rack focus, its front plane). At the top of the page the lens
// is on the words and the cloud behind them is discs; as the reading starts the focus puller's hand moves, the words
// go soft through a real disc with a colour fringe on its rim, and the cloud resolves to points. The real H1 is never
// touched before the scroll begins: it is the LCP, sharp and whole from the first paint. Only once it moves does a
// copy take over, painted word by word on the rects the browser measured for the real words, in the real face; the
// real words stay in the page under it. One small canvas, DPR capped at 2, drawn only while the spring moves.
import { clamp, easeIO, loopOf, loseContext, program, VS, watch } from '../../look/sea/optical/engine'

/** the disc's radius at the end of the pull, as a share of the headline's own size */
const F_FRONT = 0.42
/** how far the page scrolls for the whole pull, in screens: until the words have gone under the scanner's window */
const RUN_PHONE = 0.22
const RUN_WIDE = 0.45
const K = 70

function taps(interior: number, rim: number, rimWeight: number, spread: number) {
  const a = 2.399963
  const out: number[] = []
  for (let i = 0; i < interior; i++) {
    const r = Math.sqrt((i + 0.5) / interior) * spread
    out.push(r * Math.cos(i * a), r * Math.sin(i * a), 1)
  }
  for (let i = 0; i < rim; i++) out.push(Math.cos((interior + i) * a), Math.sin((interior + i) * a), rimWeight)
  return out
}
const TAPS = taps(15, 13, 1.1, 0.86)

const FS = `#version 300 es
precision highp float;
uniform vec2 uRes, uSize;
uniform sampler2D uType;
uniform float uRf, uLod, uCoarse, uJit;
uniform vec3 uTap[${TAPS.length / 3}];
out vec4 frag;
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(.06711056, .00583715)))); }
mat2 spin(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
vec3 fringe(float r) { float f = -.26 * smoothstep(.55, 1., r); return vec3(1. + f, 1., 1. - f); }
void main() {
  vec2 uv = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uRes;
  if (uRf < .4) { frag = textureLod(uType, uv, 0.); return; }
  if (textureLod(uType, uv, uCoarse).a < .001) { frag = vec4(0.); return; }
  vec4 acc = vec4(0.);
  vec3 tot = vec3(0.);
  float totA = 0.;
  mat2 turn = spin((ign(gl_FragCoord.xy + 11.3) - .5) * 2. * uJit);
  for (int i = 0; i < ${TAPS.length / 3}; i++) {
    vec3 t = uTap[i];
    vec3 tint = fringe(length(t.xy));
    vec4 s = textureLod(uType, uv + turn * t.xy * uRf / uSize, uLod);
    acc += vec4(s.rgb * tint, s.a) * t.z;
    tot += t.z * tint;
    totA += t.z;
  }
  frag = vec4(acc.rgb / tot, acc.a / totA);
}`

interface Word { text: string; x: number; top: number; h: number }
interface Box { x: number; y: number; w: number; h: number }

/** every word's own rect, relative to the box the copy is painted in */
function readWords(h1: HTMLElement, at: DOMRect) {
  const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  const out: Word[] = []
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    for (const m of node.data.matchAll(/\S+/g)) {
      range.setStart(node, m.index)
      range.setEnd(node, m.index + m[0].length)
      const r = range.getBoundingClientRect()
      out.push({ text: m[0], x: r.left - at.left, top: r.top - at.top, h: r.height })
    }
  }
  return out
}

function paintWords(words: Word[], font: string, color: string, box: Box, dpr: number) {
  const c = document.createElement('canvas')
  c.width = Math.round(box.w * dpr)
  c.height = Math.round(box.h * dpr)
  const x = c.getContext('2d')
  if (!x) return null
  x.setTransform(dpr, 0, 0, dpr, -box.x * dpr, -box.y * dpr)
  x.font = font
  x.fontKerning = 'normal'
  x.textRendering = 'optimizeLegibility'
  x.direction = 'rtl'
  x.textAlign = 'left'
  x.textBaseline = 'alphabetic'
  x.fillStyle = color
  for (const w of words) {
    const m = x.measureText(w.text)
    const asc = m.fontBoundingBoxAscent
    const des = m.fontBoundingBoxDescent
    x.fillText(w.text, w.x, Math.round((w.top + (asc + des > 0 ? w.h * asc / (asc + des) : w.h * 0.8)) * dpr) / dpr)
  }
  return c
}

export interface FocusHooks {
  /** where the focus is: 0 on the words, 1 on the cloud */
  onFocus: (p: number) => void
  /** the context is gone: the plain headline and a sharp cloud */
  onEnd: () => void
}

export function mountFocus(sheet: HTMLElement, h1: HTMLElement, hooks: FocusHooks): (() => void) | null {
  // forced colours repaint the transparent headline over its own copy: there the real words simply stay
  if (window.matchMedia('(forced-colors: active)').matches) return null
  const canvas = document.createElement('canvas')
  canvas.className = 'dp-focus'
  canvas.setAttribute('aria-hidden', 'true')
  const created = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false })
  if (!created) return null
  const gl = created
  let prog: ReturnType<typeof program>
  try { prog = program(gl, VS, FS) } catch (err) { loseContext(gl); throw err }
  const u = prog.u
  gl.useProgram(prog.p)
  const tri = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, tri)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const a = gl.getAttribLocation(prog.p, 'a')
  gl.enableVertexAttribArray(a)
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0)
  gl.uniform3fv(u.uTap, TAPS)
  gl.uniform1i(u.uType, 0)
  gl.clearColor(0, 0, 0, 0)
  sheet.appendChild(canvas)

  const spring = { x: 0, v: 0, target: 0 }
  let alive = true
  let lit = false
  let box: Box = { x: 0, y: 0, w: 0, h: 0 }
  let dpr = 1
  let rfMax = 20
  let run = 200
  let tex: WebGLTexture | null = null
  let timer = 0
  let unwatch = () => {}

  function build() {
    const at = sheet.getBoundingClientRect()
    const r = h1.getBoundingClientRect()
    if (!r.width) return false
    const cs = getComputedStyle(h1)
    // the real words may be transparent by now: the copy always takes the ink of the headline's own rule
    const ink = lit ? getComputedStyle(sheet).color : cs.color
    rfMax = parseFloat(cs.fontSize) * F_FRONT
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    const pad = Math.ceil(rfMax * 1.3 + 8)
    const x = Math.floor((r.left - at.left - pad) * dpr) / dpr
    const y = Math.floor((r.top - at.top - pad) * dpr) / dpr
    box = { x, y, w: Math.ceil((r.width + pad * 2) * dpr) / dpr, h: Math.ceil((r.height + pad * 2) * dpr) / dpr }
    canvas.width = Math.round(box.w * dpr)
    canvas.height = Math.round(box.h * dpr)
    canvas.style.width = `${box.w}px`
    canvas.style.height = `${box.h}px`
    canvas.style.transform = `translate(${x}px, ${y}px)`
    const copy = paintWords(readWords(h1, at), `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, ink, box, dpr)
    if (!copy) return false
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(u.uRes, canvas.width, canvas.height)
    gl.uniform2f(u.uSize, box.w, box.h)
    gl.activeTexture(gl.TEXTURE0)
    if (tex) gl.deleteTexture(tex)
    tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, copy)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return true
  }

  function draw() {
    const p = easeIO(clamp(spring.x))
    hooks.onFocus(p)
    // the copy and the real words swap in one paint, and only once the page has left the top
    const on = spring.x > 5e-4
    if (on !== lit) {
      lit = on
      h1.classList.toggle('is-lens', on)
      canvas.style.visibility = on ? 'visible' : 'hidden'
    }
    if (!on) return
    const rf = rfMax * p
    gl.uniform1f(u.uRf, rf)
    gl.uniform1f(u.uLod, clamp(Math.log2(Math.max(rf * dpr * 0.335 * 0.9, 1)), 0, 6))
    gl.uniform1f(u.uCoarse, clamp(Math.log2(Math.max(rf * dpr, 1)) + 1, 0, 8))
    gl.uniform1f(u.uJit, Math.PI / 13)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  // the hand of the focus puller: critically damped, always the real dt, so it settles the same at 30 fps
  const loop = loopOf((dt) => {
    const c = 2 * Math.sqrt(K)
    const h = dt / 3
    for (let i = 0; i < 3; i++) { spring.v += (-K * (spring.x - spring.target) - c * spring.v) * h; spring.x += spring.v * h }
    const more = Math.abs(spring.x - spring.target) > 5e-4 || Math.abs(spring.v) > 2e-3
    if (!more) { spring.x = spring.target; spring.v = 0 }
    draw()
    return more
  })

  const readT = () => clamp(window.scrollY / run)
  const measureRun = () => { run = Math.max(1, window.innerHeight * (window.innerWidth < 1100 ? RUN_PHONE : RUN_WIDE)) }
  const onScroll = () => {
    const t = readT()
    if (Math.abs(t - spring.target) > 1e-4) { spring.target = t; loop.wake() }
  }
  const ro = new ResizeObserver(() => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => { if (!alive) return; measureRun(); build(); draw() }, 180)
  })

  function dispose() {
    if (!alive) return
    alive = false
    window.clearTimeout(timer)
    window.removeEventListener('scroll', onScroll)
    canvas.removeEventListener('webglcontextlost', lost)
    unwatch()
    ro.disconnect()
    loop.show(false)
    h1.classList.remove('is-lens')
    loseContext(gl)
    canvas.remove()
  }
  const lost = (e: Event) => { e.preventDefault(); dispose(); hooks.onEnd() }
  canvas.addEventListener('webglcontextlost', lost)

  measureRun()
  if (!build()) { dispose(); return null }
  // a reload lower down the page: the frame is already where the scroll is, nothing plays catch-up
  spring.x = spring.target = readT()
  unwatch = watch(sheet, loop)
  ro.observe(sheet)
  window.addEventListener('scroll', onScroll, { passive: true })
  draw()
  return dispose
}
