// sea · the glass key's optics and physics (D219). A key of glass lit from its edge, in the site's own material:
// the WhatsApp mark in dots rests under the glass; dragged or tapped, the dots swirl into two read receipts,
// which turn blue when the key arrives. Every optical length is authored for a 198 px glass and scaled by uU.
// Technique from reading Zsolt Kacso's switch; the code, the mark, the words and the moment are ours.
import { LIGHT, OPTICS, VS, clamp, easeIO, loopOf, loseContext, program, rnd, watch } from './engine'
import { WA_DOTS } from '../wa-dots-data'

const FS = `#version 300 es
precision highp float;
out vec4 frag;
uniform vec2 uRes, uTrackH, uK, uKH, uEdge;
uniform float uDpr, uTrackR, uKR, uTheta, uArc, uLed, uLift, uRead, uDotsHalf, uU;
uniform vec3 uLight;
uniform vec4 uLabelBox;
uniform sampler2D uLabel, uDots;
${OPTICS}
float strip(vec2 q){
  float sk = box(q, uKH, uKR).x, a = atan(q.y, q.x);
  float da = abs(atan(sin(a - uTheta), cos(a - uTheta)));
  return length(vec2(sk - max(6.5 * uU, 3.2), max(da - uArc, 0.) * uKH.x * 1.06)) - .95;
}
vec2 label(vec2 p, float lod){ return textureLod(uLabel, (p - uLabelBox.xy) / uLabelBox.zw, lod).rg; }
float dots(vec2 p, float lod){ return textureLod(uDots, (p - uK) / (2. * uDotsHalf) + .5, lod).r; }
float field(vec2 p){ vec2 d = abs(mod(p, 5.) - 2.5) - .8; return 1. - smoothstep(-.4, .4, max(d.x, d.y)); }
vec3 under(vec2 p, float frost, vec2 ca){
  float L = max(strip(p - uK), 0.);
  float wash = (exp(-L / (14. * uU)) * .85 + exp(-L / (55. * uU)) * .32) * uLed;
  vec3 c = vec3(.024, .026, .031);
  c *= 1. - smoothstep(-13., 3., box(p - vec2(0., 6.), uTrackH, uTrackR).x) * .6;
  c += uLight * wash * .42;
  c += field(p) * wash * .1 * (1. - frost);
  float lod = frost * 4.4, s = smoothstep(-5., 5., p.x - uK.x);
  vec2 a = label(p - ca, lod), b = label(p, lod), e = label(p + ca, lod);
  vec3 t = mix(vec3(a.r, b.r, e.r), vec3(a.g, b.g, e.g), s);
  vec3 ink = vec3(.93, .905, .855);
  c = mix(c, ink * .92, clamp(t, 0., 1.));
  vec3 d = vec3(dots(p - ca, lod), dots(p, lod), dots(p + ca, lod));
  vec3 mark = mix(ink, mix(uLight, vec3(1.), .3) * 1.12, uRead) + uLight * wash * .2;
  return mix(c, mark, clamp(d, 0., 1.));
}
void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr - uRes / (2. * uDpr);
  float st = box(p, uTrackH, uTrackR).x;
  float sh = 1. - smoothstep(-8., 26., box(p - vec2(0., 10.), uTrackH, uTrackR).x);
  float sh2 = 1. - smoothstep(-2., 4., box(p - vec2(0., 1.5), uTrackH, uTrackR).x);
  float L = max(strip(p - uK), 0.);
  float edge = smoothstep(0., 30., -box(p, uEdge, 0.).x);
  vec3 add = uLight * (exp(-L / (18. * uU)) * .5 + exp(-L / (72. * uU)) * .2) * uLed * .6 * edge;
  vec4 c = vec4(add, (1. - (1. - sh * .5) * (1. - sh2 * .3)) * edge);
  if (st < 2.) {
    vec3 t = under(p, 0., vec2(0.));
    float ksh = 1. - smoothstep(-6., 13. + uLift * 5., box(p - uK - vec2(0., 5. + uLift * 3.), uKH, uKR).x);
    t *= 1. - ksh * .6;
    float rim = 1. - smoothstep(0., 1.2, abs(st + .75));
    t += rim * mix(.035, .09, smoothstep(-uTrackH.y * .6, uTrackH.y, p.y));
    c = mix(c, vec4(t, 1.), 1. - smoothstep(-.6, .6, st));
  }
  vec3 K = box(p - uK, uKH, uKR);
  float sk = K.x;
  if (sk < 2.) {
    vec2 n = K.yz, q = p - uK;
    float d = max(-sk, 0.), slope = pow(1. - clamp(d / (26. * uU), 0., 1.), 2.6);
    vec2 off = -n * slope * 40. * uU - q * .055;
    vec3 g = under(p + off, .06 + .76 * slope, n * slope * 3.2 * uU + q * .006);
    float vy = clamp((q.y + uKH.y) / (2. * uKH.y), 0., 1.);
    vec3 k = g * .84 + vec3(.135) * (1. - vy * .55);
    float lq = max(strip(q), 0.);
    k += uLight * (exp(-lq / (24. * uU)) * .8 + exp(-lq / (64. * uU)) * .2) * uLed * .8;
    k += uLight * exp(-d / max(2.2 * uU, 1.1)) * exp(-lq / (40. * uU)) * uLed * 1.3;
    float ndl = dot(n, normalize(vec2(-.35, -1.)));
    k += pow(max(ndl, 0.), 2.) * exp(-d / 1.1) * .42;
    k += max(ndl, 0.) * slope * .07;
    k *= 1. - max(-ndl, 0.) * slope * .28;
    k += exp(-d / .7) * .07;
    c = mix(c, vec4(k, 1.), 1. - smoothstep(-.7, .7, sk));
  }
  float ls = strip(p - uK);
  float lm = 1. - smoothstep(-.6, .6, ls);
  vec3 lc = mix(uLight * 1.05, mix(uLight, vec3(1.), .65), smoothstep(-.1, -.8, ls)) * (.8 + .35 * uLed);
  c.rgb = mix(c.rgb, lc, lm);
  c.a = max(c.a, lm);
  c.rgb += uLight * exp(-max(ls, 0.) / max(4.5 * uU, 2.4)) * .55 * uLed * (1. - lm) * edge;
  c.rgb += (hash(gl_FragCoord.xy) - .5) * .02 * max(c.a, min(1., length(add) * 8.));
  frag = vec4(clamp(c.rgb, 0., 1.), c.a);
}`

const POINT_VS = `#version 300 es
in vec4 a;
uniform float uHalf, uPx;
out float vR; out float vB; out float vD;
void main(){
  gl_Position = vec4(a.xy / uHalf, 0., 1.);
  vR = a.z * uPx; vD = vR * 2. + 2.; vB = a.w;
  gl_PointSize = vD;
}`
const POINT_FS = `#version 300 es
precision highp float;
in float vR; in float vB; in float vD;
out vec4 frag;
void main(){
  float d = length(gl_PointCoord - .5) * vD;
  frag = vec4((1. - smoothstep(vR - .6, vR + .4, d)) * clamp(vB, 0., 1.));
}`

// two read receipts on the mark's own 15 x 15 grid: exact diagonals, nothing falls between cells
function receipts() {
  const out: { x: number; y: number }[] = []
  for (let i = 0; i <= 3; i++) out.push({ x: i + 0.5, y: 8 + i + 0.5 })
  for (let i = 1; i <= 7; i++) out.push({ x: 3 + i + 0.5, y: 11 - i + 0.5 })
  out.push({ x: 6.5, y: 10.5 })
  for (let i = 0; i <= 7; i++) out.push({ x: 7 + i + 0.5, y: 11 - i + 0.5 })
  return out
}

type Dot = {
  ax: number; ay: number; ar: number; bx: number; by: number; br: number; bb: number; nx: number; ny: number
  delay: number; curl: number; lift: number; k: number; drag: number; x: number; y: number; vx: number; vy: number
}

// paired by the angle they sweep, so the change reads as one swirl
function pairDots(pitch: number): Dot[] {
  const key = (c: { x: number; y: number }) => ((Math.atan2(c.y - 7.5, c.x - 7.5) + Math.PI * 2.75) % (Math.PI * 2)) + Math.hypot(c.x - 7.5, c.y - 7.5) * 1e-3
  const A = WA_DOTS.map(([x, y, r]) => ({ x, y, r })).sort((p, q) => key(p) - key(q))
  const B = receipts().sort((p, q) => key(p) - key(q))
  let last = -1
  return A.map((a, i) => {
    const j = Math.floor((i * B.length) / A.length)
    const first = j !== last
    last = j
    const b = B[j]
    const dx = (b.x - a.x) * pitch
    const dy = (b.y - a.y) * pitch
    const len = Math.hypot(dx, dy) || 1
    return {
      ax: (a.x - 7.5) * pitch, ay: (a.y - 7.5) * pitch, ar: a.r * pitch * 0.92,
      bx: (b.x - 7.5) * pitch, by: (b.y - 7.5) * pitch, br: 0.6 * pitch, bb: first ? 1 : 0,
      nx: -dy / len, ny: dx / len,
      delay: 0.04 + (1 - a.x / 15) * 0.26 + rnd(0, 0.06),
      curl: rnd(-1, 1) * pitch * 2.8 + (a.y - 7.5) * pitch * 0.16,
      lift: rnd(0.35, 2.1) * pitch,
      k: rnd(260, 460), drag: rnd(0.004, 0.016),
      x: (a.x - 7.5) * pitch, y: (a.y - 7.5) * pitch, vx: 0, vy: 0,
    }
  })
}

export interface GlassKeyOptions {
  label: string
  after: string
  /** no morph and no glide: the end state at once (the calm tier) */
  reduce: boolean
  /** the key arrived: leave for WhatsApp */
  onArrive: () => void
  /** the GPU took the context back: the plain key returns */
  onLost: () => void
}

const MARGIN = 90
const DOTS_HALF = 64
const FBO = 256
const RETURN_AFTER = 2600

export function mountGlassKey(stage: HTMLElement, canvas: HTMLCanvasElement, hit: HTMLAnchorElement, opts: GlassKeyOptions) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true })
  if (!gl) return null
  let main: ReturnType<typeof program>
  let pts: ReturnType<typeof program>
  try {
    main = program(gl, VS, FS)
    pts = program(gl, POINT_VS, POINT_FS)
  } catch (err) {
    loseContext(gl)
    throw err
  }
  const tri = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, tri)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const triA = gl.getAttribLocation(main.p, 'a')
  const ptsA = gl.getAttribLocation(pts.p, 'a')

  const dotsTex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, dotsTex)
  gl.texStorage2D(gl.TEXTURE_2D, 9, gl.RGBA8, FBO, FBO)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, dotsTex, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  const labelTex = gl.createTexture()
  const ptsBuf = gl.createBuffer()

  const L = { W: 0, H: 0, pad: 7, kh: 0, kr: 0, tr: 0, x0: 0, cw: 0, ch: 0 }
  let dpr = 1
  let D: Dot[] = []
  let arr = new Float32Array(0)
  let timer = 0
  const S = {
    p: 0, v: 0, target: 0, drag: false, startX: 0, startP: 0, moved: 0, lastT: 0, dragV: 0, hover: 0, hoverT: 0,
    press: 0, pressT: 0, kick: 0, sp: 0, spv: 0, dir: 1, read: 0, readT: 0, sent: false, arrived: false,
  }

  function drawLabel() {
    const c = document.createElement('canvas')
    c.width = L.W * 2
    c.height = L.H * 2
    const x = c.getContext('2d')
    if (!x) return
    x.scale(2, 2)
    x.font = `600 ${L.W < 380 ? 18 : 19}px ${getComputedStyle(hit).fontFamily}`
    x.direction = 'rtl'
    x.textAlign = 'center'
    x.textBaseline = 'middle'
    // the two states share one texture: red before the glass passes, green after it
    const zone = L.W - L.pad - 2 * L.kh
    x.fillStyle = '#f00'
    x.fillText(opts.label, zone / 2 + 2, L.H / 2 + 1)
    x.globalCompositeOperation = 'lighter'
    x.fillStyle = '#0f0'
    x.fillText(opts.after, L.W - zone / 2 - 2, L.H / 2 + 1)
    gl!.activeTexture(gl!.TEXTURE0)
    gl!.bindTexture(gl!.TEXTURE_2D, labelTex)
    gl!.pixelStorei(gl!.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, c)
    gl!.pixelStorei(gl!.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl!.generateMipmap(gl!.TEXTURE_2D)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR_MIPMAP_LINEAR)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
  }

  function measure() {
    const w = stage.clientWidth
    if (!w) return false
    L.W = Math.min(w, 440)
    L.H = window.innerWidth < 420 ? 104 : 116
    L.kh = (L.H - 2 * L.pad) / 2
    L.kr = L.kh * 0.62
    L.tr = L.H * 0.34
    L.x0 = L.W / 2 - L.pad - L.kh
    stage.style.height = `${L.H}px`
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    L.cw = L.W + 2 * MARGIN
    L.ch = L.H + 2 * MARGIN
    canvas.style.width = `${L.cw}px`
    canvas.style.height = `${L.ch}px`
    canvas.width = Math.round(L.cw * dpr)
    canvas.height = Math.round(L.ch * dpr)
    hit.style.width = `${L.W}px`
    hit.style.height = `${L.H}px`
    D = pairDots(Math.min((L.kh * 1.06) / 15, 4))
    arr = new Float32Array(D.length * 4)
    gl!.bindBuffer(gl!.ARRAY_BUFFER, ptsBuf)
    gl!.bufferData(gl!.ARRAY_BUFFER, arr.byteLength, gl!.DYNAMIC_DRAW)
    drawLabel()
    return true
  }

  function step(dt: number, now: number) {
    const c = gl!
    if (opts.reduce) { S.p = S.target; S.v = 0; S.sp = S.target }
    if (!S.drag && !opts.reduce) {
      const k = 150
      const damp = 2 * Math.sqrt(k) * 0.62
      const n = 4
      const h = dt / n
      for (let i = 0; i < n; i++) { S.v += (-k * (S.p - S.target) - damp * S.v) * h; S.p += S.v * h }
    }
    S.hover += (S.hoverT - S.hover) * Math.min(1, dt * 10)
    S.press += (S.pressT - S.press) * Math.min(1, dt * 18)
    S.kick *= Math.exp(-dt * 3.5)
    S.read += (S.readT - S.read) * Math.min(1, dt * (S.readT ? 5 : 9))

    const pc = clamp(S.p)
    const over = Math.max(-S.p, S.p - 1, 0)
    const stretch = Math.min(Math.abs(S.v) * 5.2, 11)
    const sq = 1 - S.press * 0.035
    const khx = (L.kh + stretch - over * 70) * sq
    const khy = Math.min(L.kh - stretch * 0.45 + over * 20, L.kh + 3) * sq
    let kx = L.x0 - 2 * L.x0 * pc
    if (S.p > 1) kx -= over * 70
    else if (S.p < 0) kx += over * 70

    // the light has its own lagging phase; its direction latches at rest, so a reversal retraces the arc
    const goal = easeIO(pc)
    const lk = 70
    if (!opts.reduce) { S.spv += (-lk * (S.sp - goal) - 2 * Math.sqrt(lk) * S.spv) * dt; S.sp += S.spv * dt }
    const sp = clamp(S.sp)
    if (sp < 0.015) S.dir = 1
    else if (sp > 0.985) S.dir = -1
    const theta = S.dir > 0 ? Math.PI / 2 + Math.PI * sp : Math.PI * 1.5 + Math.PI * (1 - sp)

    const kvx = -S.v * 2 * L.x0
    let settled = true
    D.forEach((d, i) => {
      const e = easeIO(clamp((pc - d.delay) / 0.62))
      const arc = opts.reduce ? 0 : Math.sin(Math.PI * e)
      let x = d.ax + (d.bx - d.ax) * e + d.nx * d.curl * 1.6 * arc
      let y = d.ay + (d.by - d.ay) * e + d.ny * d.curl * 1.6 * arc
      const r = Math.hypot(x, y) || 1
      x += (x / r) * d.lift * arc * 0.55
      y += (y / r) * d.lift * arc * 0.55
      if (opts.reduce) { d.x = x; d.y = y; d.vx = 0; d.vy = 0 } else {
        const cc = 2 * Math.sqrt(d.k) * 0.72
        d.vx += (-d.k * (d.x - x) - cc * d.vx) * dt
        d.vy += (-d.k * (d.y - y) - cc * d.vy) * dt
        d.x += d.vx * dt
        d.y += d.vy * dt
      }
      arr[i * 4] = d.x + clamp(-kvx * d.drag, -9, 9)
      arr[i * 4 + 1] = d.y
      arr[i * 4 + 2] = (d.ar + (d.br - d.ar) * e) * (1 - 0.45 * arc)
      arr[i * 4 + 3] = (1 + (d.bb - 1) * e) * (1 + 0.3 * arc)
      if (Math.abs(d.x - x) + Math.abs(d.y - y) + Math.abs(d.vx) + Math.abs(d.vy) > 0.03) settled = false
    })

    if (S.sent && !S.arrived && S.p > 0.97) {
      S.arrived = true
      S.readT = 1
      S.kick = 1
      navigator.vibrate?.(10)
      timer = window.setTimeout(() => { S.target = 0; S.readT = 0; S.sent = false; S.arrived = false; loop.wake() }, RETURN_AFTER)
      opts.onArrive()
    }

    c.bindFramebuffer(c.FRAMEBUFFER, fbo)
    c.viewport(0, 0, FBO, FBO)
    c.clearColor(0, 0, 0, 0)
    c.clear(c.COLOR_BUFFER_BIT)
    c.useProgram(pts.p)
    c.uniform1f(pts.u.uHalf, DOTS_HALF)
    c.uniform1f(pts.u.uPx, FBO / (2 * DOTS_HALF))
    c.bindBuffer(c.ARRAY_BUFFER, ptsBuf)
    c.bufferSubData(c.ARRAY_BUFFER, 0, arr)
    c.enableVertexAttribArray(ptsA)
    c.vertexAttribPointer(ptsA, 4, c.FLOAT, false, 0, 0)
    c.enable(c.BLEND)
    c.blendEquation(c.MAX)
    c.drawArrays(c.POINTS, 0, D.length)
    c.disable(c.BLEND)
    c.bindFramebuffer(c.FRAMEBUFFER, null)

    c.viewport(0, 0, canvas.width, canvas.height)
    c.useProgram(main.p)
    c.activeTexture(c.TEXTURE1)
    c.bindTexture(c.TEXTURE_2D, dotsTex)
    c.generateMipmap(c.TEXTURE_2D)
    c.activeTexture(c.TEXTURE0)
    c.bindTexture(c.TEXTURE_2D, labelTex)
    const U = main.u
    c.uniform1i(U.uLabel, 0)
    c.uniform1i(U.uDots, 1)
    c.uniform2f(U.uRes, canvas.width, canvas.height)
    c.uniform1f(U.uDpr, dpr)
    c.uniform2f(U.uTrackH, L.W / 2, L.H / 2)
    c.uniform1f(U.uTrackR, L.tr)
    c.uniform2f(U.uK, kx, 0)
    c.uniform2f(U.uKH, khx, khy)
    c.uniform1f(U.uKR, Math.min(L.kr, khx - 1, khy - 1))
    c.uniform2f(U.uEdge, L.cw / 2, L.ch / 2)
    c.uniform1f(U.uU, L.kh / 99)
    c.uniform1f(U.uTheta, theta)
    c.uniform1f(U.uArc, 0.92)
    c.uniform1f(U.uLed, (1 + S.hover * 0.08 + Math.min(Math.abs(S.v) * 0.05, 0.18) + S.kick * 0.14 + S.read * 0.16) * 1.8)
    c.uniform1f(U.uLift, S.hover * (1 - S.press))
    c.uniform1f(U.uRead, S.read)
    c.uniform1f(U.uDotsHalf, DOTS_HALF)
    c.uniform3f(U.uLight, LIGHT[0], LIGHT[1], LIGHT[2])
    c.uniform4f(U.uLabelBox, -L.W / 2, -L.H / 2, L.W, L.H)
    c.bindBuffer(c.ARRAY_BUFFER, tri)
    c.enableVertexAttribArray(triA)
    c.vertexAttribPointer(triA, 2, c.FLOAT, false, 0, 0)
    c.drawArrays(c.TRIANGLES, 0, 3)
    void now
    return S.drag || Math.abs(S.p - S.target) > 8e-4 || Math.abs(S.v) > 2e-3 || Math.abs(S.hover - S.hoverT) > 4e-3 ||
      Math.abs(S.press - S.pressT) > 4e-3 || S.kick > 4e-3 || Math.abs(S.read - S.readT) > 4e-3 || Math.abs(S.sp - goal) > 1e-3 || !settled
  }
  const loop = loopOf(step)

  const send = () => {
    if (S.sent) return
    S.sent = true
    S.target = 1
    S.kick = 1
    loop.wake()
  }
  let viaPointer = false
  const down = (e: PointerEvent) => {
    if (e.button !== 0 || !e.isPrimary) return
    viaPointer = true
    try { hit.setPointerCapture(e.pointerId) } catch { /* the pointer is already gone */ }
    S.pressT = 1
    S.moved = 0
    S.drag = !S.sent
    S.startX = e.clientX
    S.startP = S.p
    S.lastT = performance.now()
    S.dragV = 0
    loop.wake()
  }
  const move = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && S.hoverT !== 1) { S.hoverT = 1; loop.wake() }
    if (!S.drag) return
    const dx = e.clientX - S.startX
    S.moved = Math.max(S.moved, Math.abs(dx))
    let p = S.startP - dx / (2 * L.x0)
    if (p > 1) p = 1 + Math.min((p - 1) * 0.22, 0.2)
    if (p < 0) p = Math.max(p * 0.22, -0.2)
    const t = performance.now()
    S.dragV = S.dragV * 0.6 + ((p - S.p) / (Math.max(1, t - S.lastT) / 1000)) * 0.4
    S.v = S.dragV
    S.p = p
    S.lastT = t
    loop.wake()
  }
  const release = (cancelled: boolean) => {
    S.pressT = 0
    if (S.drag) {
      S.drag = false
      if (cancelled) S.target = S.sent ? 1 : 0
      else if (S.moved < 6 || S.p + S.dragV * 0.15 > 0.55) send()
      else { S.target = 0; S.kick = 0.6 }
    }
    loop.wake()
  }
  const up = () => release(false)
  const cancel = () => { viaPointer = false; release(true) }
  const leave = () => { S.hoverT = 0; loop.wake() }
  // a real link underneath: the pointer path animates first and the key leaves on arrival; Enter, a screen
  // reader or voice control have no pointer, and take the same path from here
  const click = (e: MouseEvent) => {
    e.preventDefault()
    if (!viaPointer) send()
    viaPointer = false
  }
  const stopDrag = (e: DragEvent) => e.preventDefault()
  hit.addEventListener('pointerdown', down)
  hit.addEventListener('pointermove', move)
  hit.addEventListener('pointerup', up)
  hit.addEventListener('pointercancel', cancel)
  hit.addEventListener('pointerleave', leave)
  hit.addEventListener('click', click)
  hit.addEventListener('dragstart', stopDrag)

  const lost = (e: Event) => { e.preventDefault(); opts.onLost() }
  canvas.addEventListener('webglcontextlost', lost)
  // resizing clears a canvas, so every measure paints at once: the key is never blank under its live class
  const paint = () => { if (measure()) step(1 / 60, performance.now()) }
  paint()
  const ro = new ResizeObserver(() => { paint(); loop.wake() })
  ro.observe(stage)
  const unwatch = watch(stage, loop)
  const shown = (e: PageTransitionEvent) => { if (e.persisted) loop.wake() }
  window.addEventListener('pageshow', shown)

  return () => {
    window.clearTimeout(timer)
    window.removeEventListener('pageshow', shown)
    unwatch()
    ro.disconnect()
    loop.show(false)
    hit.removeEventListener('pointerdown', down)
    hit.removeEventListener('pointermove', move)
    hit.removeEventListener('pointerup', up)
    hit.removeEventListener('pointercancel', cancel)
    hit.removeEventListener('pointerleave', leave)
    hit.removeEventListener('click', click)
    hit.removeEventListener('dragstart', stopDrag)
    canvas.removeEventListener('webglcontextlost', lost)
    loseContext(gl)
  }
}
