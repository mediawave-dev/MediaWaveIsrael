// sea · the optical objects' small engine (D219, site-director's optical tier). Each object is one small WebGL2
// canvas that renders only while something moves and only while it is on screen: at rest the page pays nothing.
export type Loop = { wake: () => void; show: (v: boolean) => void }
export type Uniforms = Record<string, WebGLUniformLocation | null>

export const VS = `#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`

/** the rounded box's distance and outward normal, and a hash for the grain */
export const OPTICS = `
vec3 box(vec2 p, vec2 h, float r){
  vec2 s = sign(p), w = abs(p) - h + r, q = max(w, 0.);
  float g = max(w.x, w.y), l = length(q);
  vec2 n = g > 0. ? q / max(l, 1e-4) : (w.x > w.y ? vec2(1., 0.) : vec2(0., 1.));
  return vec3((g > 0. ? l : g) - r, s * n);
}
float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }`

/** the one accent of the objects: the blue of a message that was read */
export const LIGHT: readonly [number, number, number] = [0.36, 0.53, 1]

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const rnd = (a: number, b: number) => a + Math.random() * (b - a)

export function program(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const make = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) throw new Error('optical: could not create a shader')
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const p = gl.createProgram()
  if (!p) throw new Error('optical: could not create a program')
  const v = make(gl.VERTEX_SHADER, vs)
  const f = make(gl.FRAGMENT_SHADER, fs)
  gl.attachShader(p, v)
  gl.attachShader(p, f)
  gl.linkProgram(p)
  // the link status alone: querying each shader first can stall the page
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`optical: ${gl.getProgramInfoLog(p) ?? gl.getShaderInfoLog(f)}`)
  const cache: Uniforms = {}
  const u = new Proxy(cache, { get: (t, n: string) => (n in t ? t[n] : (t[n] = gl.getUniformLocation(p, n))) })
  return { p, u }
}

export function loopOf(step: (dt: number, now: number) => boolean): Loop {
  let raf = 0
  let last = 0
  let seen = false
  const tick = (now: number) => {
    raf = 0
    // iOS Low Power runs this at 30: every spring takes the real dt
    const dt = Math.max(0, Math.min(1 / 30, (now - last) / 1000)) || 1 / 60
    last = now
    if (step(dt, now) && seen) raf = requestAnimationFrame(tick)
  }
  return {
    wake() { if (seen && !raf) { last = performance.now() - 16; raf = requestAnimationFrame(tick) } },
    show(v) { seen = v; if (v) this.wake(); else if (raf) { cancelAnimationFrame(raf); raf = 0 } },
  }
}

/** on-screen pause, and a call on the first arrival */
export function watch(el: Element, loop: Loop, onFirst?: () => void) {
  let first = true
  const io = new IntersectionObserver((es) => {
    const v = es[es.length - 1].isIntersecting
    loop.show(v)
    if (v && first) { first = false; onFirst?.() }
  }, { rootMargin: '40px' })
  io.observe(el)
  return () => io.disconnect()
}

/** a rasteriser in software (a VM, a blocked GPU, a headless browser): these objects are for a GPU, the plain element stays */
export function softwareGL(gl: WebGL2RenderingContext) {
  const info = gl.getExtension('WEBGL_debug_renderer_info')
  return /swiftshader|llvmpipe|softpipe|basic render|software/i.test(info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? '') : '')
}

export function loseContext(gl: WebGL2RenderingContext) {
  try { gl.getExtension('WEBGL_lose_context')?.loseContext() } catch { /* already gone */ }
}
