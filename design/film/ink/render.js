// The ink film · the renderer. A macro shot of a ballpoint pen drawing the MediaWave logo on a sheet of paper, made from
// nothing but numbers: no footage, no photo, no model file. The page builds the sheet (fibres laid one by one into
// a height map), stamps the ink along the hand's path (hand.js) with the moment each point was reached, and then
// path-traces every frame with a thin lens and an open shutter (shaders.js). render.mjs drives it frame by frame.
//   ?size=1080&spp=96&paper=4096     window.renderFrame(i) -> a PNG data URL of frame i
import { buildHand, at, BALL, LINE, LEAN, DT } from './hand.js'
import { VERT, TRACE, BRIGHT, BLUR, FINISH } from './shaders.js'

const Q = new URLSearchParams(location.search)
const SIZE = Number(Q.get('size') ?? 1080)
const SPP = Number(Q.get('spp') ?? 96)
const PAPER = Number(Q.get('paper') ?? 4096)
export const FPS = 30
const TILE = PAPER * 0.005 // the sheet's tile, mm: five microns a texel
const INK_MM = 0.01 // the ink map's texel, mm
const GROUND = [15 / 255, 16 / 255, 17 / 255] // the site's ground, #0f1011: the film's black
const SHUTTER = 0.5 // half the frame: a 180 degree shutter
const EXPOSURE = Number(Q.get('ev') ?? 0.56)
const APERTURE = Number(Q.get('ap') ?? 0.6) // the lens's radius in the close shot, mm
const LEAD = 1.5 // millimetres the frame runs ahead of the eye while the hand writes
const WIDE = 150 // how far the camera ends from the page: the logo across 58% of the frame, with clear space round it

const hand = buildHand()
const canvas = document.getElementById('c')
canvas.width = canvas.height = SIZE
const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' })
if (!gl) throw new Error('no WebGL2')
if (!gl.getExtension('EXT_color_buffer_float')) throw new Error('no float render targets')
if (!gl.getExtension('OES_texture_float_linear')) throw new Error('no linear float textures')
const dbg = gl.getExtension('WEBGL_debug_renderer_info')
console.log('gpu:', dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'unknown')

// ── the sheet ──
// A seeded generator: the same sheet on every run, so a frame can be rendered again and match its neighbours.
function mulberry(seed) {
  let a = seed >>> 0
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}

/** Paper: tens of thousands of fibres laid across each other, each a soft curved thread, drawn so the tile wraps.
    Returns RGBA8: the slope of the surface in x and z, its height, and a tone for the sheet's colour. */
function buildPaper(N) {
  const rand = mulberry(20261110)
  const cv = document.createElement('canvas')
  cv.width = cv.height = N
  const x = cv.getContext('2d', { willReadFrequently: true })
  x.fillStyle = 'rgb(118,118,118)'
  x.fillRect(0, 0, N, N)
  x.lineCap = 'round'
  const k = N / 4096
  const thread = (len, wid, alpha, light) => {
    const px = rand() * N, py = rand() * N
    // paper has a grain: more fibres run along the machine direction
    const ang = (rand() < 0.4 ? (rand() - 0.5) * 1.1 : rand() * Math.PI) + 0.12
    // a thread is never straight: it bows, and often turns back on itself
    const b1 = (rand() - 0.5) * len * 0.7, b2 = (rand() - 0.5) * len * 0.7
    const dx = Math.cos(ang) * len, dy = Math.sin(ang) * len
    const nx = -Math.sin(ang), ny = Math.cos(ang)
    const c1 = [px + dx * 0.33 + nx * b1, py + dy * 0.33 + ny * b1], c2 = [px + dx * 0.66 + nx * b2, py + dy * 0.66 + ny * b2]
    const reach = Math.abs(b1) + Math.abs(b2) + 8
    x.strokeStyle = light ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`
    x.lineWidth = wid
    for (const ox of [0, -N, N]) for (const oy of [0, -N, N]) {
      const ax = px + ox, ay = py + oy
      if (Math.max(ax, ax + dx) < -reach || Math.min(ax, ax + dx) > N + reach || Math.max(ay, ay + dy) < -reach || Math.min(ay, ay + dy) > N + reach) continue
      x.beginPath(); x.moveTo(ax, ay); x.bezierCurveTo(c1[0] + ox, c1[1] + oy, c2[0] + ox, c2[1] + oy, ax + dx, ay + dy); x.stroke()
    }
  }
  // the body of the sheet: wide soft fibres, then the ones on top, sharper
  const body = Math.round(26000 * k * k)
  for (let i = 0; i < body; i++) thread((260 + rand() * 520) * k, (7 + rand() * 9) * k, 0.035 + rand() * 0.05, rand() < 0.56)
  x.filter = `blur(${1.2 * k}px)`
  x.drawImage(cv, 0, 0)
  x.filter = 'none'
  const top = Math.round(52000 * k * k)
  for (let i = 0; i < top; i++) thread((90 + rand() * 430) * k, (2.2 + rand() * 4.2) * k, 0.03 + rand() * 0.075, rand() < 0.6)
  for (let i = 0; i < top * 0.25; i++) thread((60 + rand() * 200) * k, (1.2 + rand() * 1.6) * k, 0.05 + rand() * 0.1, rand() < 0.7)
  // the threads that stand proud of the sheet and catch the raking light
  const proud = Math.round(5200 * k * k)
  for (let i = 0; i < proud * 2; i++) thread((50 + rand() * 170) * k, (2.4 + rand() * 3.2) * k, 0.06 + rand() * 0.1, rand() < 0.8)
  const src = x.getImageData(0, 0, N, N).data
  const h = new Float32Array(N * N)
  for (let i = 0; i < N * N; i++) h[i] = src[i * 4] / 255 + (rand() - 0.5) * 0.035 // the filler's fine tooth
  let lo = 1, hi = 0
  for (let i = 0; i < N * N; i += 7) { if (h[i] < lo) lo = h[i]; if (h[i] > hi) hi = h[i] }
  const out = new Uint8Array(N * N * 4)
  const RELIEF = 0.017 // mm from the lowest valley to the highest fibre
  const texel = TILE / N
  const gain = RELIEF / (hi - lo) / (2 * texel)
  for (let j = 0; j < N; j++) {
    const up = ((j + N - 1) % N) * N, dn = ((j + 1) % N) * N, row = j * N
    for (let i = 0; i < N; i++) {
      const l = (i + N - 1) % N, r = (i + 1) % N
      const sx = (h[row + r] - h[row + l]) * gain, sz = (h[dn + i] - h[up + i]) * gain
      const o = (row + i) * 4
      out[o] = Math.max(0, Math.min(255, 127.5 + sx * 127.5))
      out[o + 1] = Math.max(0, Math.min(255, 127.5 + sz * 127.5))
      out[o + 2] = Math.max(0, Math.min(255, ((h[row + i] - lo) / (hi - lo)) * 255))
      out[o + 3] = out[o + 2]
    }
  }
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, out)
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  return tex
}

// ── the ink ──
/** The line as a map: for every point near it, how far it is from the centre of the line (in half line widths)
    and the moment the ball first covered it. Two layers, and every stroke keeps to one of them (odd strokes in one,
    even in the other), so where two strokes meet (a bowl and its stem, an outline and its shading) both are kept,
    and a stroke that crosses itself is simply one line. The film then reveals the ink by comparing that moment with
    the frame's time: nothing is animated. */
function buildInk() {
  let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9
  for (let i = 0; i < hand.n; i++) if (hand.on[i]) { x0 = Math.min(x0, hand.x[i]); x1 = Math.max(x1, hand.x[i]); z0 = Math.min(z0, hand.z[i]); z1 = Math.max(z1, hand.z[i]) }
  const word = { cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, w: x1 - x0, h: z1 - z0 }
  const pad = 2.2
  x0 -= pad; z0 -= pad; x1 += pad; z1 += pad
  const W = Math.ceil((x1 - x0) / INK_MM), H = Math.ceil((z1 - z0) / INK_MM)
  const n = W * H
  const u = [new Float32Array(n).fill(9), new Float32Array(n).fill(9)]
  const near = [new Float32Array(n).fill(1e6), new Float32Array(n).fill(1e6)]
  const cover = [new Float32Array(n).fill(1e6), new Float32Array(n).fill(1e6)]
  for (let i = 0; i < hand.n; i++) {
    if (!hand.on[i]) continue
    const px = hand.x[i], pz = hand.z[i], t = i * DT
    const L = hand.k[i] & 1
    const hw = LINE * (0.86 + 0.28 * hand.p[i])
    const R = 3.6 * hw, R2 = R * R
    const i0 = Math.max(0, Math.floor((px - R - x0) / INK_MM)), i1 = Math.min(W - 1, Math.ceil((px + R - x0) / INK_MM))
    const j0 = Math.max(0, Math.floor((pz - R - z0) / INK_MM)), j1 = Math.min(H - 1, Math.ceil((pz + R - z0) / INK_MM))
    for (let j = j0; j <= j1; j++) {
      const dz = z0 + (j + 0.5) * INK_MM - pz
      for (let k = i0; k <= i1; k++) {
        const dx = x0 + (k + 0.5) * INK_MM - px
        const d2 = dx * dx + dz * dz
        if (d2 > R2) continue
        const id = j * W + k
        const un = Math.sqrt(d2) / hw
        if (un < u[L][id]) { u[L][id] = un; near[L][id] = t }
        if (un <= 1 && cover[L][id] > 1e5) cover[L][id] = t
      }
    }
  }
  const data = new Float32Array(n * 4)
  for (let i = 0; i < n; i++) {
    data[i * 4] = u[0][i]; data[i * 4 + 1] = Math.min(cover[0][i], near[0][i])
    data[i * 4 + 2] = u[1][i]; data[i * 4 + 3] = Math.min(cover[1][i], near[1][i])
  }
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, W, H, 0, gl.RGBA, gl.FLOAT, data)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return { tex, box: [x0, z0, 1 / (W * INK_MM), 1 / (H * INK_MM)], word }
}

// ── programs and targets ──
function program(frag) {
  const mk = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src); gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader')
    return s
  }
  const p = gl.createProgram()
  gl.attachShader(p, mk(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, frag))
  gl.bindAttribLocation(p, 0, 'p')
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? 'link')
  const locs = new Map()
  return { p, u: (name) => { if (!locs.has(name)) locs.set(name, gl.getUniformLocation(p, name)); return locs.get(name) } }
}
function target(w, h, linear) {
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, linear ? gl.RGBA16F : gl.RGBA32F, w, h, 0, gl.RGBA, linear ? gl.HALF_FLOAT : gl.FLOAT, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('framebuffer')
  return { tex, fbo, w, h }
}

const quad = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, quad)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
gl.enableVertexAttribArray(0)
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

const t0 = performance.now()
const paper = buildPaper(PAPER)
const ink = buildInk()
console.log(`textures ${Math.round(performance.now() - t0)} ms · film ${hand.duration.toFixed(2)} s · ${Math.round(hand.duration * FPS)} frames`)
const t1 = performance.now()
const trace = program(TRACE.replace('__BALL__', BALL.toFixed(3)))
const bright = program(BRIGHT), blur = program(BLUR), finish = program(FINISH)
console.log(`shaders ${Math.round(performance.now() - t1)} ms`)
const sum = [target(SIZE, SIZE, false), target(SIZE, SIZE, false)]
const half = SIZE >> 1
const bloom = [target(half, half, true), target(half, half, true), target(half, half, true)]

// the steps of the sequence, one irrational per dimension (the generalised golden ratio in 14 dimensions)
const ALPHA = (() => {
  const d = 14
  let phi = 2
  for (let i = 0; i < 60; i++) phi = Math.pow(1 + phi, 1 / (d + 1))
  return new Float32Array(Array.from({ length: d }, (_, i) => Math.pow(1 / phi, i + 1) % 1))
})()

// ── the set: vectors ──
const V = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] },
}
const mix = (a, b, t) => a + (b - a) * t
const clamp01 = (t) => Math.min(1, Math.max(0, t))
const ease = (t) => { const u = clamp01(t); return u * u * u * (u * (u * 6 - 15) + 10) }

/** A softbox aimed at the word: its centre, two half edges, the way it faces. */
function softbox(pos, hw, hh, aim) {
  const n = V.norm(V.sub(aim, pos))
  const u = V.norm(V.cross(n, [0, 1, 0]))
  const v = V.cross(u, n)
  return { pos, u: V.mul(u, hw), v: V.mul(v, hh), n, area: 4 * hw * hh }
}
const AIM = [ink.word.cx, 0, ink.word.cz]
// the key: low, behind and to the side of the sheet, so it rakes across the fibres and the wet line only sparkles
// where a fibre tips it toward the lens (straight behind, the whole fresh line glared white and lost its blue).
// Big enough for the pen's shadow to open into a soft edge away from the tip.
const KEY = { ...softbox(V.add(AIM, [88, 46, -64]), 27, 18, AIM), rad: [82, 75, 66.5] }
const KEY_D2 = V.dot(V.sub(KEY.pos, AIM), V.sub(KEY.pos, AIM))
// a thin cool strip in front: it draws one hard line of light down the brass. It is flagged off the sheet (the
// paper never sees it), as a strip like this would be on a set
const KICK = { ...softbox(V.add(AIM, [-70, 78, 64]), 46, 5, AIM), rad: [22, 25, 30] }

// the pen leans the way a right hand holds it, away from the line just drawn, so the lens sees the wet ink
const LEAN_AXIS = V.norm(LEAN)
const GRIP = 34 // millimetres from the tip to the fingers

function pen(t) {
  const h = at(hand, t)
  // the fingers move the tip, the hand follows late: the barrel tilts a little with every stroke
  let ox = h.x - h.lag[0], oz = h.z - h.lag[1]
  const far = Math.hypot(ox, oz)
  if (far > 1e-6) { const k = (Math.tanh(far / 3.2) * 3.2) / far; ox *= k; oz *= k }
  const axis = V.norm(V.sub(V.mul(LEAN_AXIS, GRIP), [ox * 0.9, 0, oz * 0.9]))
  // the ball's centre: on the sheet it sinks a hair into the groove
  const tip = [h.x, h.y + BALL - (h.on ? 0.012 : 0), h.z]
  return { tip, axis }
}

/** The camera: close on the tip from the front left while the hand draws. When the name is done it swings back to
    the i with the pen and watches the drop land, still close. Only when the pen has left does it rise, turn square
    to the page and pull back until the whole logo sits level in the frame, sharp from end to end. */
function camera(t) {
  const h = at(hand, t)
  const w = ease((t - hand.rise) / hand.crane)
  const turn = ease((t - hand.rise) / (hand.crane * 0.62))
  const push = clamp01(t / hand.named)
  const az = mix(-0.42, 0, w), el = mix(0.52, 1.5, w)
  const dist = mix(mix(17, 21, push), WIDE, w)
  // the eye follows the tip a beat late, so the frame leads it: the pen keeps to the right third
  let near = [h.eye[0] + LEAD, 0, h.eye[1] - 0.3]
  if (t > hand.named) {
    // the way back to the i: the camera leaves with the pen and lands with it, so the pen never leaves the frame
    const from = at(hand, hand.named).eye, back = ease((t - hand.named) / hand.flight)
    near = [mix(from[0] + LEAD, hand.drop[0] + 0.2, back), 0, mix(from[1] - 0.3, hand.drop[1] + 0.8, back)]
  }
  const whole = [ink.word.cx, 0, ink.word.cz]
  const target = [mix(near[0], whole[0], turn), 0, mix(near[2], whole[2], turn)]
  const dir = [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)]
  const pos = V.add(target, V.mul(dir, dist))
  const z = V.norm(V.sub(target, pos))
  const x = V.norm(V.cross(z, [0, 1, 0]))
  const y = V.cross(x, z)
  // the focus rides on the tip itself (before the first touch, on the spot where it will land)
  const sharp = t < hand.touch ? [hand.first[0], 0, hand.first[1]] : t > hand.written ? [hand.last[0], 0, hand.last[1]] : [h.x, 0, h.z]
  const focus = mix(V.dot(V.sub(sharp, pos), z), dist, w)
  return { pos, x, y, z, focus, aperture: mix(APERTURE, 0.45, w), tan: 0.2 }
}

function pass(prog, dst, w, h) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, dst)
  gl.viewport(0, 0, w, h)
  gl.useProgram(prog.p)
}
const bind = (unit, tex, loc) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(loc, unit) }

async function draw(i, spp) {
  const tc = i / FPS
  const open = tc - (SHUTTER / FPS) * 0.5, close = tc + (SHUTTER / FPS) * 0.5
  const p0 = pen(open), p1 = pen(close), cam = camera(open), cam1 = camera(close)
  gl.disable(gl.BLEND)
  gl.bindFramebuffer(gl.FRAMEBUFFER, sum[0].fbo)
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
  let from = 0
  for (let k = 0; k < spp; k++) {
    pass(trace, sum[1 - from].fbo, SIZE, SIZE)
    bind(0, sum[from].tex, trace.u('uSum')); bind(1, paper, trace.u('uPaper')); bind(2, ink.tex, trace.u('uInk'))
    gl.uniform2f(trace.u('uRes'), SIZE, SIZE)
    gl.uniform1i(trace.u('uK'), k)
    gl.uniform1fv(trace.u('uA'), ALPHA)
    gl.uniform1ui(trace.u('uFrame'), i)
    gl.uniform3fv(trace.u('uCamPos'), cam.pos); gl.uniform3fv(trace.u('uCamX'), cam.x); gl.uniform3fv(trace.u('uCamY'), cam.y); gl.uniform3fv(trace.u('uCamZ'), cam.z)
    gl.uniform3fv(trace.u('uCamPos1'), cam1.pos); gl.uniform3fv(trace.u('uCamX1'), cam1.x); gl.uniform3fv(trace.u('uCamY1'), cam1.y); gl.uniform3fv(trace.u('uCamZ1'), cam1.z)
    gl.uniform1f(trace.u('uTan'), cam.tan); gl.uniform1f(trace.u('uFocus'), cam.focus); gl.uniform1f(trace.u('uFocus1'), cam1.focus); gl.uniform1f(trace.u('uAperture'), cam.aperture)
    gl.uniform1f(trace.u('uT0'), open); gl.uniform1f(trace.u('uT1'), close)
    gl.uniform3fv(trace.u('uTip0'), p0.tip); gl.uniform3fv(trace.u('uTip1'), p1.tip); gl.uniform3fv(trace.u('uAxis0'), p0.axis); gl.uniform3fv(trace.u('uAxis1'), p1.axis)
    gl.uniform4fv(trace.u('uInkBox'), ink.box); gl.uniform1f(trace.u('uInkMm'), INK_MM)
    gl.uniform1f(trace.u('uTile'), TILE); gl.uniform1f(trace.u('uPaperPx'), PAPER)
    gl.uniform3fv(trace.u('uKeyPos'), KEY.pos); gl.uniform3fv(trace.u('uKeyU'), KEY.u); gl.uniform3fv(trace.u('uKeyV'), KEY.v); gl.uniform3fv(trace.u('uKeyN'), KEY.n); gl.uniform3fv(trace.u('uKeyRad'), KEY.rad); gl.uniform1f(trace.u('uKeyArea'), KEY.area); gl.uniform1f(trace.u('uKeyD2'), KEY_D2)
    gl.uniform3fv(trace.u('uKickPos'), KICK.pos); gl.uniform3fv(trace.u('uKickU'), KICK.u); gl.uniform3fv(trace.u('uKickV'), KICK.v); gl.uniform3fv(trace.u('uKickN'), KICK.n); gl.uniform3fv(trace.u('uKickRad'), KICK.rad)
    gl.uniform4f(trace.u('uPool'), ink.word.cx, ink.word.cz, 27, 56)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    from = 1 - from
    // let the GPU drain: a long queue of heavy passes can trip the driver's watchdog
    if (k % 6 === 5) { gl.flush(); await new Promise((r) => setTimeout(r, 0)) }
  }
  pass(bright, bloom[0].fbo, half, half)
  bind(0, sum[from].tex, bright.u('uSum')); gl.uniform2f(bright.u('uRes'), half, half); gl.uniform1f(bright.u('uN'), spp); gl.uniform1f(bright.u('uExposure'), EXPOSURE)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
  const blurTo = (src, dst, sx, sy) => {
    pass(blur, dst.fbo, half, half)
    bind(0, src.tex, blur.u('uTex')); gl.uniform2f(blur.u('uRes'), half, half); gl.uniform2f(blur.u('uStep'), sx / half, sy / half)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  const s = SIZE / 1080
  blurTo(bloom[0], bloom[1], 1.5 * s, 0); blurTo(bloom[1], bloom[0], 0, 1.5 * s) // a tight glow, in bloom[0]
  blurTo(bloom[0], bloom[1], 5 * s, 0); blurTo(bloom[1], bloom[2], 0, 5 * s) // and a wide one, in bloom[2]
  pass(finish, null, SIZE, SIZE)
  bind(0, sum[from].tex, finish.u('uSum')); bind(1, bloom[0].tex, finish.u('uBloomA')); bind(2, bloom[2].tex, finish.u('uBloomB'))
  gl.uniform2f(finish.u('uRes'), SIZE, SIZE); gl.uniform1f(finish.u('uN'), spp); gl.uniform1f(finish.u('uExposure'), EXPOSURE)
  gl.uniform1f(finish.u('uGrain'), 0.016); gl.uniform1ui(finish.u('uFrame'), i); gl.uniform3fv(finish.u('uGround'), GROUND)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
  gl.finish()
}

window.film = { frames: Math.round(hand.duration * FPS), fps: FPS, duration: hand.duration, named: hand.named, written: hand.written, rise: hand.rise, touch: hand.touch, events: hand.events }
window.renderFrame = async (i, spp = SPP) => { await draw(i, spp); return canvas.toDataURL('image/png') }
window.ready = true
