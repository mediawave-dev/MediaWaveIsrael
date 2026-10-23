// "עומק" · the point cloud (D215, after Lidar Drone Scanning by Riotters, SOTD 6.10.2026): one cloud of
// points in space that re-forms into the object of whatever the reader is on. The Horizon as a world with a
// sea, a laptop, a phone, a magnifier, a chat bubble, a film reel, a cassette, a photo from the memories
// film, and the sea itself; a scan plane sweeps every object as it arrives. The morph runs on the CPU (each
// point eases to its new place with its own delay), so any shape can follow any other; the GPU only draws.
// One small program (points only), compiled on its own: it never waits on the main site's sea shader.

export type ShapeId = 'horizon' | 'laptop' | 'phone' | 'search' | 'bubble' | 'reel' | 'cassette' | 'photo' | 'sea'

/** a point: position, colour (0..1), size factor */
type P = [number, number, number, number, number, number, number]

const CREAM: [number, number, number] = [0.86, 0.91, 1]
const BLUE: [number, number, number] = [0.47, 0.63, 0.77]

let seed = 11
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const col = (blue: boolean): [number, number, number] => (blue ? BLUE : CREAM)
const pick = (parts: [number, () => P][]) => { const r = rnd(); let acc = 0; for (const [w, f] of parts) { acc += w; if (r <= acc) return f() } return parts[parts.length - 1][1]() }
/** a filled rectangle in a plane tilted by rx around x */
const face = (w: number, h: number, cx: number, cy: number, cz: number, rx = 0, blue = false) => (): P => {
  const x = (rnd() - 0.5) * w, y = (rnd() - 0.5) * h, c = Math.cos(rx), s = Math.sin(rx)
  return [cx + x, cy + y * c, cz + y * s, ...col(blue), 1]
}
/** a rectangle's outline */
const edge = (w: number, h: number, cx: number, cy: number, cz: number, rx = 0) => (): P => {
  const t = rnd() * 2 * (w + h)
  let x: number, y: number
  if (t < w) { x = t - w / 2; y = -h / 2 } else if (t < w + h) { x = w / 2; y = t - w - h / 2 } else if (t < 2 * w + h) { x = t - w - h - w / 2; y = h / 2 } else { x = -w / 2; y = t - 2 * w - h - h / 2 }
  const c = Math.cos(rx), s = Math.sin(rx)
  return [cx + x, cy + y * c, cz + y * s, ...CREAM, 1.3]
}
const ring = (cx: number, cy: number, cz: number, r: number, w: number, blue = false) => (): P => {
  const a = rnd() * Math.PI * 2, rr = r + (rnd() - 0.5) * w
  return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, cz + (rnd() - 0.5) * 0.04, ...col(blue), 1.2]
}

function make(n: number, parts: [number, () => P][]) { return Array.from({ length: n }, () => pick(parts)) }

const SHAPES: Record<Exclude<ShapeId, 'photo' | 'sea'>, (n: number) => P[]> = {
  horizon: (n) => Array.from({ length: n }, (_, i) => {
    const y = 1 - ((i + 0.5) * 2) / n, r = Math.sqrt(1 - y * y), a = i * 2.39996323
    const x = Math.cos(a) * r, z = Math.sin(a) * r
    const sea = y < -0.05 + 0.07 * Math.sin(x * 5 + z * 3)
    return [x * 1.05, y * 1.05, z * 1.05, ...col(sea), 1] as P
  }),
  laptop: (n) => make(n, [
    [0.36, face(1.7, 1.06, 0, 0.45, -0.1, -0.32)], [0.1, edge(1.7, 1.06, 0, 0.45, -0.1, -0.32)],
    [0.06, face(0.9, 0.14, -0.1, 0.62, -0.02, -0.32, true)],
    [0.34, () => { const x = (rnd() - 0.5) * 1.8, z = (rnd() - 0.5) * 1.15; return [x, -0.12, z + 0.5, ...CREAM, 1] }],
    [0.14, () => { const x = (rnd() - 0.5) * 1.1, z = (rnd() - 0.5) * 0.5; return [x, -0.1, 0.42 + z, ...CREAM, 0.8] }],
  ]),
  phone: (n) => make(n, [
    [0.5, face(0.86, 1.72, 0, 0, 0.06)], [0.18, face(0.86, 1.72, 0, 0, -0.06)], [0.14, edge(0.86, 1.72, 0, 0, 0.07)],
    [0.1, face(0.6, 0.16, 0, -0.55, 0.08, 0, true)], [0.08, face(0.6, 0.5, 0, 0.35, 0.08)],
  ]),
  search: (n) => make(n, [
    [0.5, ring(-0.18, 0.22, 0, 0.62, 0.12)], [0.2, ring(-0.18, 0.22, 0, 0.42, 0.05, true)],
    [0.3, () => { const t = rnd(); const w = (rnd() - 0.5) * 0.16; return [0.26 + t * 0.62 + w, -0.22 - t * 0.62 + w, (rnd() - 0.5) * 0.1, ...CREAM, 1.2] }],
  ]),
  bubble: (n) => make(n, [
    [0.48, face(1.9, 1.15, 0, 0.05, 0.12)], [0.22, face(1.9, 1.15, 0, 0.05, -0.12)], [0.12, edge(1.9, 1.15, 0, 0.05, 0)],
    [0.08, () => { const t = rnd(), u = rnd() * (1 - t); return [0.3 + t * 0.35 - u * 0.2, -0.55 - t * 0.45, 0.1 * (rnd() > 0.5 ? 1 : -1), ...CREAM, 1] }],
    [0.1, () => { const k = Math.floor(rnd() * 3), a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 0.13; return [(k - 1) * 0.5 + Math.cos(a) * r, 0.05 + Math.sin(a) * r, 0.17, ...BLUE, 1.3] }],
  ]),
  reel: (n) => make(n, [
    [0.34, ring(0, 0.1, 0.05, 0.95, 0.08)], [0.16, ring(0, 0.1, 0.05, 0.22, 0.05, true)],
    [0.3, () => { const k = Math.floor(rnd() * 5), a = (k / 5) * Math.PI * 2 + 0.3, r = 0.38 + rnd() * 0.22, b = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * 0.15; return [Math.cos(a) * r + Math.cos(b) * rr, 0.1 + Math.sin(a) * r + Math.sin(b) * rr, -0.05, ...CREAM, 0.9] }],
    [0.2, () => { const x = (rnd() - 0.2) * 1.7; return [x * 0.5 + 0.9, -0.85 + (rnd() - 0.5) * 0.18, 0.05, ...CREAM, 1] }],
  ]),
  cassette: (n) => make(n, [
    [0.4, face(1.9, 1.2, 0, 0, 0.13)], [0.16, face(1.9, 1.2, 0, 0, -0.13)], [0.1, edge(1.9, 1.2, 0, 0, 0)],
    [0.13, ring(-0.48, 0.1, 0.15, 0.2, 0.05)], [0.13, ring(0.48, 0.1, 0.15, 0.2, 0.05)], [0.08, face(0.5, 0.16, 0, 0.1, 0.15, 0, true)],
  ]),
}

/** the sea: a plane of points, rolled by waves every frame */
function seaBase(n: number): P[] {
  const side = Math.ceil(Math.sqrt(n))
  return Array.from({ length: n }, (_, i) => { const x = ((i % side) / side - 0.5) * 3.2, z = (Math.floor(i / side) / side - 0.5) * 2.2; return [x, -0.2, z, ...BLUE, 0.9] as P })
}

/** a photo as a cloud: each point takes a pixel's colour, and its brightness lifts it toward the viewer */
async function photo(n: number, src: string): Promise<P[]> {
  const img = new Image()
  img.src = src
  await img.decode()
  const W = 120, H = Math.round((W * img.naturalHeight) / img.naturalWidth)
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const g = c.getContext('2d', { willReadFrequently: true })!
  g.drawImage(img, 0, 0, W, H)
  const d = g.getImageData(0, 0, W, H).data
  const asp = W / H
  return Array.from({ length: n }, () => {
    const u = rnd(), v = rnd(), px = Math.min(W - 1, Math.floor(u * W)), py = Math.min(H - 1, Math.floor(v * H)), k = (py * W + px) * 4
    const r = d[k] / 255, gg = d[k + 1] / 255, b = d[k + 2] / 255, lum = 0.3 * r + 0.59 * gg + 0.11 * b
    return [(u - 0.5) * 2.1 * Math.min(1, asp), (0.5 - v) * 2.1 / Math.max(1, asp), (lum - 0.5) * 0.35, r, gg, b, 0.85 + lum * 0.5] as P
  })
}

const VS = `
attribute vec3 aPos; attribute vec3 aCol; attribute float aSize;
uniform mat4 uP, uV; uniform float uScan, uSize, uT;
varying vec3 vC; varying float vA;
void main() {
  vec4 mv = uV * vec4(aPos, 1.0);
  gl_Position = uP * mv;
  float scan = exp(-pow((aPos.y - uScan) * 13.0, 2.0));
  vC = mix(aCol, vec3(1.0), scan * 0.8);
  vA = (0.62 + 0.38 * scan) * clamp(1.0 - (-mv.z - 3.4) * 0.45, 0.32, 1.0);
  gl_PointSize = uSize * aSize * (1.0 + scan * 1.3) / -mv.z;
}`
const FS = `precision mediump float; varying vec3 vC; varying float vA;
void main() { vec2 q = gl_PointCoord - 0.5; if (dot(q, q) > 0.25) discard; gl_FragColor = vec4(vC * vA, vA); }`

export interface Cloud {
  /** re-form into a shape (the scan sweeps it when it lands) */
  to: (id: ShapeId) => void
  /** where the pointer is, -0.5..0.5 on both axes */
  steer: (x: number, y: number) => void
  /** the page's scroll, in screens (turns the camera a little) */
  scroll: (screens: number) => void
  /** the live readout: points, the scan's height, the object's name */
  readout: () => { points: number; scan: number; shape: ShapeId }
  stop: () => void
}

export async function startCloud(host: HTMLElement, opts: { still: boolean; calm: boolean; photoSrc: string; onLost?: () => void; onRestored?: () => void }): Promise<Cloud | null> {
  // (review, D215) every start gets its own canvas, removed on stop: a context that was released can never be
  // handed back to the next start (a tier change re-runs the world's effect on the same element)
  const canvas = document.createElement('canvas')
  canvas.className = 'dp-cloud'
  canvas.setAttribute('aria-hidden', 'true')
  host.append(canvas)
  const ctx = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: true, alpha: true })
  if (!ctx || ctx.isContextLost()) { canvas.remove(); return null }
  const gl: WebGLRenderingContext = ctx
  const phone = window.matchMedia('(max-width: 1099px)').matches
  const N = phone ? 5200 : 8400
  const shapes: Partial<Record<ShapeId, P[]>> = {}
  for (const k of Object.keys(SHAPES) as (keyof typeof SHAPES)[]) shapes[k] = SHAPES[k](N)
  shapes.sea = seaBase(N)
  void photo(N, opts.photoSrc).then((p) => { shapes.photo = p }).catch(() => { shapes.photo = shapes.horizon })

  const sh = (t: number, src: string) => { const x = gl.createShader(t); if (!x) return null; gl.shaderSource(x, src); gl.compileShader(x); return x }
  const pr = gl.createProgram()
  const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS)
  if (!pr || !vs || !fs) { canvas.remove(); return null }
  gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr)
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { canvas.remove(); return null }
  gl.useProgram(pr)

  // the live arrays: where each point is now, where it goes, and when it may start
  const pos = new Float32Array(N * 3), colr = new Float32Array(N * 3), size = new Float32Array(N)
  const from = new Float32Array(N * 7), goal = new Float32Array(N * 7), delay = new Float32Array(N)
  for (let i = 0; i < N; i++) delay[i] = rnd() * 0.55
  const start = shapes.horizon!
  // the first frame: the points lie flat as a sea and rise into the world (unless still)
  const flat = shapes.sea!
  for (let i = 0; i < N; i++) for (let k = 0; k < 7; k++) { from[i * 7 + k] = (opts.still ? start : flat)[i][k]; goal[i * 7 + k] = start[i][k] }
  const dur = opts.calm ? 2.2 : 1.5
  let current: ShapeId = 'horizon', mt = opts.still ? 99 : 0, scanAt = 0, last = performance.now(), t = 0
  /** once a shape has landed its points stop moving (the sea excepted): one last upload, then none */
  let landed = false

  const buf = (name: string, data: Float32Array, n: number) => {
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
    const l = gl.getAttribLocation(pr, name); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, n, gl.FLOAT, false, 0, 0); return b
  }
  const bPos = buf('aPos', pos, 3), bCol = buf('aCol', colr, 3), bSize = buf('aSize', size, 1)
  const U = (n: string) => gl.getUniformLocation(pr, n)
  const uP = U('uP'), uV = U('uV'), uScan = U('uScan'), uSize = U('uSize')
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

  // the projection changes only with the canvas' size; the view matrix is one array, refilled each frame
  const proj = new Float32Array(16), viewM = new Float32Array(16)
  const persp = (fov: number, asp: number, n: number, f: number) => { const k = 1 / Math.tan(fov / 2); proj.set([k / asp, 0, 0, 0, 0, k, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, (2 * f * n) / (n - f), 0]) }
  const view = (ry: number, rx: number, d: number) => { const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx); viewM.set([cy, sx * sy, -cx * sy, 0, 0, cx, sx, 0, sy, -sx * cy, cx * cy, 0, 0, 0, -d, 1]) }

  let W = 0, H = 0, lost = false
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const fit = () => {
    W = canvas.clientWidth; H = canvas.clientHeight
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
    gl.viewport(0, 0, canvas.width, canvas.height)
    persp(0.72, W / Math.max(1, H), 0.1, 20); gl.uniformMatrix4fv(uP, false, proj)
    // a resize clears the drawing buffer: the still tier draws its one frame again
    if (opts.still && !lost) requestAnimationFrame(frame)
  }
  const ro = new ResizeObserver(fit)

  let px = 0, py = 0, tx = 0, ty = 0, screens = 0, scan = opts.still ? 2 : 1.2, raf = 0, visible = true, rxNow = 0.28
  const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x))

  function step() {
    const target = shapes[current] ?? shapes.horizon!
    const k = mt / dur
    const live = current === 'sea'
    for (let i = 0; i < N; i++) {
      const e = ease((k - delay[i]) / 0.45)
      const mid = e * (1 - e) * 4
      for (let c = 0; c < 3; c++) {
        let g = goal[i * 7 + c]
        if (live && c === 1) g = target[i][1] + Math.sin(target[i][0] * 2.2 + t * 0.9) * 0.08 + Math.cos(target[i][2] * 2.6 + t * 0.7) * 0.06
        const f = from[i * 7 + c]
        pos[i * 3 + c] = f + (g - f) * e + (c === 1 ? mid * 0.25 * (delay[i] - 0.27) : 0)
        colr[i * 3 + c] = from[i * 7 + 3 + c] + (goal[i * 7 + 3 + c] - from[i * 7 + 3 + c]) * e
      }
      size[i] = from[i * 7 + 6] + (goal[i * 7 + 6] - from[i * 7 + 6]) * e
    }
  }

  function frame(now: number) {
    if (lost) return
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    if (!opts.still) { t += dt; mt += dt }
    px += (tx - px) * 0.05; py += (ty - py) * 0.05
    const settled = mt >= dur
    // the points move while a shape lands, and the sea always rolls; after that only the camera and the scan move
    if (!settled || !landed || current === 'sea') {
      step()
      gl.bindBuffer(gl.ARRAY_BUFFER, bPos); gl.bufferSubData(gl.ARRAY_BUFFER, 0, pos)
      if (!settled || !landed) {
        gl.bindBuffer(gl.ARRAY_BUFFER, bCol); gl.bufferSubData(gl.ARRAY_BUFFER, 0, colr)
        gl.bindBuffer(gl.ARRAY_BUFFER, bSize); gl.bufferSubData(gl.ARRAY_BUFFER, 0, size)
      }
      if (settled) landed = true
    }
    // the scan sweeps down as a shape lands, then idles up and down from where it ended (no jump)
    const since = t - scanAt
    scan = opts.still ? 2 : since < 1.6 ? 1.3 - (since / 1.6) * 2.8 : -1.5 + (1 - Math.cos((since - 1.6) * 0.5)) * 1.35
    const ry = -0.32 + (opts.still ? 0 : 0.34 * Math.sin(t * (opts.calm ? 0.15 : 0.3))) + px * 0.8 + screens * 0.04
    // the camera tilts toward the sea and back over a second, never in one frame
    const rxGoal = current === 'sea' ? 0.55 : 0.28
    rxNow = opts.still ? rxGoal : rxNow + (rxGoal - rxNow) * Math.min(1, dt * 3)
    view(ry, rxNow + py * 0.4, phone ? 3.9 : 4.0)
    gl.uniformMatrix4fv(uV, false, viewM)
    gl.uniform1f(uScan, scan); gl.uniform1f(uSize, (phone ? 11 : 13) * dpr)
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.POINTS, 0, N)
    if (!opts.still && visible) raf = requestAnimationFrame(frame)
  }
  const vis = () => { visible = document.visibilityState === 'visible'; if (visible && !opts.still && !lost) { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame) } }
  // a lost context (a GPU reset, too many contexts): the loop stops and the canvas steps aside; the words stay
  // (recheck) the page is told, so it hides the scanner window and the readout; a restored context starts a new cloud
  const onLost = (e: Event) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf); canvas.style.visibility = 'hidden'; opts.onLost?.() }
  const onRestored = () => { opts.onRestored?.() }
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)
  document.addEventListener('visibilitychange', vis)
  ro.observe(canvas)
  fit()
  raf = requestAnimationFrame(frame)
  canvas.dataset.ready = ''

  return {
    to(id) {
      if (id === current || lost) return
      // the morph starts from wherever the points are now
      for (let i = 0; i < N; i++) { for (let c = 0; c < 3; c++) { from[i * 7 + c] = pos[i * 3 + c]; from[i * 7 + 3 + c] = colr[i * 3 + c] } from[i * 7 + 6] = size[i] }
      const target = shapes[id] ?? shapes.horizon!
      for (let i = 0; i < N; i++) for (let k = 0; k < 7; k++) goal[i * 7 + k] = target[i][k]
      current = id; mt = opts.still ? 99 : 0; scanAt = t; landed = false
      if (opts.still) requestAnimationFrame(frame)
    },
    steer(x, y) { tx = x; ty = y },
    scroll(s) { screens = s },
    readout: () => ({ points: N, scan, shape: current }),
    stop() {
      cancelAnimationFrame(raf); ro.disconnect(); lost = true
      document.removeEventListener('visibilitychange', vis); canvas.removeEventListener('webglcontextlost', onLost); canvas.removeEventListener('webglcontextrestored', onRestored)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    },
  }
}
