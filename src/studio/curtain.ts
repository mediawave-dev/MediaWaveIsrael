// The wave between styles (D188). One full-screen fragment shader, raw WebGL (no three on the shell):
// a wave in the new style's colours rises from the chip the visitor touched and floods the screen, its
// crest the Horizon wave line, a spray of squares (the site's material, D162) breaking ahead of it; while
// the screen is full the page changes underneath and the style's name is shown; then a second wave climbs
// and breaks into squares, and the new style is there. The old page never needs to be captured.

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uA;
uniform float uB;
uniform float uT;
uniform float uCell;
uniform vec2 uO;
uniform vec3 uTo;
uniform vec3 uInk;
uniform vec3 uFrom;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float front(float x, float p, float s) {
  float base = mix(-0.3, 1.32, p);
  float near = exp(-pow((x - uO.x) * 1.5, 2.0));
  return base + 0.16 * near * sin(p * 3.14159) + 0.05 * sin(x * 8.0 * s + uT * 2.2 + p * 7.0) + 0.022 * sin(x * 21.0 - uT * 3.1 + s);
}
void main() {
  vec2 c = floor(gl_FragCoord.xy / uCell);
  vec2 q = (c + 0.5) * uCell / uRes;
  vec2 uv = gl_FragCoord.xy / uRes;
  float h = hash(c);
  float band = 0.13;
  float da = front(uv.x, uA, 1.0) - uv.y;
  float dqa = front(q.x, uA, 1.0) - q.y;
  bool covered = da > 0.0 || (dqa > -band && h > -dqa / band + 0.12);
  float db = front(uv.x, uB, 1.37) - uv.y;
  float dqb = front(q.x, uB, 1.37) - q.y;
  bool open = uB > 0.0 && (db > 0.0 || (dqb > -band && h > -dqb / band + 0.12));
  if (!covered || open) { gl_FragColor = vec4(0.0); return; }
  vec3 col = uTo;
  // the sea inside: a slow field of dots in the ink, breathing
  vec2 g = mod(gl_FragCoord.xy, uCell) - uCell * 0.5;
  float wave = 0.5 + 0.5 * sin(q.x * 9.0 + q.y * 5.0 - uT * 1.6) * sin(q.y * 7.0 + uT * 0.9);
  float dd = smoothstep(uCell * 0.22 * wave + 0.6, uCell * 0.22 * wave - 0.6, length(g));
  col = mix(col, uInk, dd * 0.16);
  // the crest: the Horizon line, a pixel or two of ink right at the front
  float crest = smoothstep(2.6 / uRes.y, 0.0, abs(da)) * step(0.0, da);
  col = mix(col, uInk, crest);
  // the spray ahead of the crest: squares in the ink, the new ground and the old one
  if (da <= 0.0) col = h > 0.66 ? uInk : (h > 0.33 ? uTo : mix(uFrom, uTo, 0.5));
  // the breaking edge of the second wave: squares in the ink
  if (uB > 0.0 && db <= 0.0 && dqb > -band) col = mix(col, uInk, step(0.82, h));
  gl_FragColor = vec4(col, 1.0);
}
`

export interface CurtainColours { from: string; to: string; ink: string }

const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export interface Curtain {
  /** cover the screen; resolves when it is full */
  cover: (o: { x: number; y: number }, c: CurtainColours, ms: number) => Promise<void>
  /** open it again; resolves when it is gone */
  reveal: (ms: number) => Promise<void>
}

let shared: Curtain | null | undefined

/** One canvas for the page, built on first use (or at idle, so the first switch never waits on a compile). */
export function getCurtain(): Curtain | null {
  if (shared !== undefined) return shared
  const cv = document.createElement('canvas')
  cv.className = 'st-curtain'
  cv.setAttribute('aria-hidden', 'true')
  const gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
  if (!gl) { shared = null; return null }
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s }
  const pr = gl.createProgram()!
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT))
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(pr)
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { shared = null; return null }
  gl.useProgram(pr)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(pr, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const u = (n: string) => gl.getUniformLocation(pr, n)
  const U = { res: u('uRes'), a: u('uA'), b: u('uB'), t: u('uT'), cell: u('uCell'), o: u('uO'), to: u('uTo'), ink: u('uInk'), from: u('uFrom') }
  document.body.appendChild(cv)

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let A = 0
  let B = 0
  const t0 = performance.now()
  const size = () => {
    cv.width = Math.round(window.innerWidth * dpr)
    cv.height = Math.round(window.innerHeight * dpr)
    gl.viewport(0, 0, cv.width, cv.height)
  }
  const draw = () => {
    gl.uniform2f(U.res, cv.width, cv.height)
    gl.uniform1f(U.a, A)
    gl.uniform1f(U.b, B)
    gl.uniform1f(U.t, (performance.now() - t0) / 1000)
    gl.uniform1f(U.cell, 10 * dpr)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  const run = (ms: number, set: (k: number) => void) => new Promise<void>((done) => {
    const s = performance.now()
    const tick = (now: number) => {
      const k = Math.min(1, (now - s) / ms)
      set(ease(k))
      draw()
      if (k < 1) requestAnimationFrame(tick)
      else done()
    }
    requestAnimationFrame(tick)
  })
  // between the waves the sea inside keeps breathing until the reveal starts
  let holding = false
  const hold = () => { if (!holding) return; draw(); requestAnimationFrame(hold) }
  shared = {
    cover: (o, c, ms) => {
      size()
      gl.uniform2f(U.o, o.x / window.innerWidth, 1 - o.y / window.innerHeight)
      gl.uniform3f(U.to, ...rgb(c.to))
      gl.uniform3f(U.ink, ...rgb(c.ink))
      gl.uniform3f(U.from, ...rgb(c.from))
      A = 0
      B = 0
      cv.dataset.on = '1'
      return run(ms, (k) => { A = k }).then(() => { holding = true; requestAnimationFrame(hold) })
    },
    reveal: async (ms) => {
      holding = false
      await run(ms, (k) => { B = k })
      delete cv.dataset.on
      gl.clear(gl.COLOR_BUFFER_BIT)
    },
  }
  return shared
}
