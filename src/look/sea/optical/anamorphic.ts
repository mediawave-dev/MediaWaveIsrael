// sea · the anamorphic light's optics: the visitor's finger or pointer is a lamp inside a dark picture, seen through
// a cylinder lens, so it smears along x only into a thin blue streak, with a squashed oval bloom around it and faint
// ghosts on the line through the frame's centre. It is an additive premultiplied overlay (alpha 0, colour only), so
// the film or picture under it is never touched. Nothing is drawn until it is touched; after release it fades in
// 0.5 s and clears, and the loop stops. Every optical length is authored for a 358 px frame and scaled by uU.
import { LIGHT, OPTICS, VS, clamp, loopOf, loseContext, program, softwareGL, watch } from './engine'

const FS = `#version 300 es
precision highp float;
out vec4 frag;
uniform vec2 uRes, uSize, uAt, uFade;
uniform float uDpr, uU, uI, uLen, uFlash;
${OPTICS}
const vec3 BLUE = vec3(${LIGHT.map((v) => v.toFixed(3)).join(', ')});
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
// one lens ghost: a tall oval with its colours slightly apart, the way a real element splits them
vec3 ghost(vec2 p, vec2 at, float r, vec3 tint){
  vec2 d = (p - at) / vec2(.76, 1.24);
  float a = length(d) / r;
  vec3 e = vec3(a * 1.035, a, a * .965);
  return tint * smoothstep(vec3(1.), vec3(.84), e) * (.42 + .58 * smoothstep(.15, 1., a));
}
void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 d = p - uAt;
  float U = uU, I = uI, r = length(d) / U, sx = abs(d.x) / U, sy = abs(d.y) / U;

  // the streak: the cylinder element smears the source along x only
  float len = 1. + uLen;
  float along = .62 * exp(-sx / (28. * len)) + .36 * exp(-sx / (128. * len));
  float grain = .9 + .1 * vnoise(vec2((p.x - uAt.x) / U * .11, 3.7));
  float thin = 1. + sx / 175.;
  float across = exp(-sy * thin / .95) + .24 * exp(-sy * thin / (4.2 * (1. + .9 * uFlash)));
  float hot = exp(-sx / 12.) * exp(-sy / .7) * I;
  vec3 flare = mix(BLUE * BLUE * vec3(1.05, 1.02, 1.), BLUE, exp(-sx / 90.)) * along * across * grain * I * 2.5
             + vec3(.9, .94, 1.) * hot * 1.5;

  // the squashed bloom around the source, and the source itself
  float ov = length(d / vec2(92., 36.) / (U * (1. + 1.1 * uFlash)));
  flare += mix(BLUE, vec3(.82, .88, 1.), .55) * (.2 * exp(-ov * 3.3) + .06 * exp(-ov * 1.15)) * I;
  flare += vec3(1., .98, .94) * (1.7 * exp(-r / 2.1) + .22 * exp(-r / 9.)) * I;

  // ghosts on the line through the frame's centre, opposite the source
  vec2 c = uSize * .5, axis = c - uAt;
  vec3 g = ghost(p, c + axis * .62, 44. * U, vec3(.12, .3, .34))
         + ghost(p, c + axis * 1.16, 27. * U, vec3(.36, .22, .08))
         + ghost(p, c + axis * .26, 16. * U, vec3(.14, .15, .34));
  flare += g * .11 * (.55 + .45 * smoothstep(0., 200. * U, length(axis))) * I;

  // stray light only lifts the blacks, and only near the source; on a ground the light leaves with the picture
  vec3 lit = 1. - (1. - vec3(.5, .62, .95) * .075 * I * exp(-r / 118.)) * exp(-flare);
  float v = p.y / uSize.y;
  lit *= smoothstep(0., uFade.x, v) * smoothstep(0., uFade.y, 1. - v);
  lit += (hash(p + 3.1) + hash(p.yx + 7.7) - 1.) / 255. * step(.004, max(lit.r, max(lit.g, lit.b)));
  frag = vec4(clamp(lit, 0., 1.), 0.);
}`

const FADE_S = 0.5
const ATTACK_MOUSE = 0.08
/** a finger warms up a little slower, so a thumb that only starts a scroll leaves a gleam and no burst */
const ATTACK_TOUCH = 0.2
const TAP_PX = 10
const TAP_MS = 320
/** the frame's unit stops growing here: the streak stays a thin line on a wide screen */
const WIDEST = 920
/** one small canvas: on a wide, dense screen the light renders under this many pixels */
const MAX_PIXELS = 2.2e6
/** a ground has no frame: the light leaves with the picture where its top and bottom break into dots */
const GROUND_FADE: readonly [number, number] = [0.17, 0.3]

function spring(x: number, k: number, z: number) {
  const s = {
    x, v: 0, target: x,
    step(dt: number) {
      const c = 2 * Math.sqrt(k) * z
      const h = dt / 3
      for (let i = 0; i < 3; i++) { s.v += (-k * (s.x - s.target) - c * s.v) * h; s.x += s.v * h }
      return Math.abs(s.x - s.target) > 0.02 || Math.abs(s.v) > 0.2
    },
    snap(v: number) { s.x = v; s.target = v; s.v = 0 },
  }
  return s
}

export interface AnamorphicOptions {
  /** the calm tier: one still light, painted once, that does not react */
  still: boolean
  /** the GPU took the context back: the plain picture is all that remains */
  onLost: () => void
}

export function mountAnamorphic(host: HTMLElement, canvas: HTMLCanvasElement, opts: AnamorphicOptions) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true })
  if (!gl) return null
  if (softwareGL(gl)) { loseContext(gl); return null }
  let main: ReturnType<typeof program>
  try {
    main = program(gl, VS, FS)
  } catch (err) {
    loseContext(gl)
    throw err
  }
  const U = main.u
  gl.useProgram(main.p)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const a = gl.getAttribLocation(main.p, 'a')
  gl.enableVertexAttribArray(a)
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0)

  const ground = host.classList.contains('sea-clips__ground')
  const X = spring(0, 190, 0.88)
  const Y = spring(0, 190, 0.88)
  let W = 0
  let H = 0
  let I = 0
  let len = 0
  let flash = 0
  let on = false
  let attack = ATTACK_MOUSE
  let down: { x: number; y: number; t: number; id: number; far: number } | null = null

  function measure() {
    const box = host.getBoundingClientRect()
    if (box.width < 4 || box.height < 4) return false
    // a ground is painted across the whole screen, so its light reaches the screen's edge
    W = ground ? document.documentElement.clientWidth : host.clientWidth
    H = host.clientHeight
    if (ground) {
      canvas.style.left = `${-Math.round(box.left)}px`
      canvas.style.width = `${W}px`
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(MAX_PIXELS / (W * H)))
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    gl!.viewport(0, 0, canvas.width, canvas.height)
    gl!.uniform2f(U.uRes, canvas.width, canvas.height)
    gl!.uniform1f(U.uDpr, dpr)
    gl!.uniform2f(U.uSize, W, H)
    gl!.uniform1f(U.uU, Math.min(box.width, WIDEST) / 358)
    gl!.uniform2f(U.uFade, ground ? GROUND_FADE[0] : 1e-3, ground ? GROUND_FADE[1] : 1e-3)
    return true
  }

  function draw() {
    const c = gl!
    if (I + flash <= 0) {
      c.clearColor(0, 0, 0, 0)
      c.clear(c.COLOR_BUFFER_BIT)
      return
    }
    c.uniform2f(U.uAt, X.x, Y.x)
    c.uniform1f(U.uI, I + 1.05 * flash)
    c.uniform1f(U.uLen, len + 0.6 * flash)
    c.uniform1f(U.uFlash, flash)
    c.drawArrays(c.TRIANGLES, 0, 3)
  }

  function step(dt: number) {
    const a1 = X.step(dt)
    const a2 = Y.step(dt)
    const speed = Math.hypot(X.v, Y.v) / Math.max(W, 1)
    const want = clamp(speed / 3.2) * 0.38
    len += (want - len) * (1 - Math.exp(-dt / 0.09))
    I = on ? Math.min(1, I + dt / attack) : Math.max(0, I - dt / FADE_S)
    flash = flash > 0.002 ? flash * Math.exp(-dt / 0.17) : 0
    draw()
    return a1 || a2 || Math.abs(want - len) > 1e-3 || (on ? I < 1 : I > 0) || flash > 0
  }
  const loop = loopOf(step)

  // resizing clears a canvas: a light that is on is painted again at once
  const paint = () => { if (measure()) draw() }

  if (opts.still) {
    X.snap(0.586 * host.clientWidth)
    Y.snap(0.476 * host.clientHeight)
    I = 1
  }
  paint()
  const ro = new ResizeObserver(() => {
    paint()
    if (!opts.still) loop.wake()
  })
  ro.observe(host)

  const lost = (e: Event) => { e.preventDefault(); opts.onLost() }
  canvas.addEventListener('webglcontextlost', lost)
  // the widget's stop: the light goes out with the page's other motion
  const root = document.documentElement
  const stopped = new MutationObserver(() => {
    if (root.classList.contains('disable-animations') || root.classList.contains('motion-reduced')) opts.onLost()
  })
  stopped.observe(root, { attributes: true, attributeFilter: ['class'] })

  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    return [clamp(e.clientX - r.left, 0, W), clamp(e.clientY - r.top, 0, H)] as const
  }
  // a light that is out appears where it was touched; one still fading glides there
  const kindle = (e: PointerEvent, x: number, y: number) => {
    if (I < 0.02 && !on) { X.snap(x); Y.snap(y) } else { X.target = x; Y.target = y }
    on = true
    attack = e.pointerType === 'mouse' ? ATTACK_MOUSE : ATTACK_TOUCH
    loop.wake()
  }
  const press = (e: PointerEvent) => {
    if (e.button !== 0 || !e.isPrimary) return
    const [x, y] = local(e)
    try { host.setPointerCapture(e.pointerId) } catch { /* the pointer is already gone */ }
    down = { x, y, t: e.timeStamp, id: e.pointerId, far: 0 }
    kindle(e, x, y)
  }
  const move = (e: PointerEvent) => {
    const [x, y] = local(e)
    if (down && e.pointerId === down.id) {
      down.far = Math.max(down.far, Math.hypot(x - down.x, y - down.y))
      X.target = x
      Y.target = y
      loop.wake()
    } else if (e.pointerType === 'mouse' && !down) kindle(e, x, y)
  }
  // a tap fires the lamp once; timed by the events' own stamps, since a busy page can handle them late
  const release = (e: PointerEvent) => {
    if (!down || e.pointerId !== down.id) return
    if (e.type === 'pointerup' && down.far < TAP_PX && e.timeStamp - down.t < TAP_MS) {
      flash = 1
      I = 1
    }
    down = null
    // a mouse that let go is still over the picture
    on = e.pointerType === 'mouse' && e.type === 'pointerup'
    loop.wake()
  }
  const leave = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || down) return
    on = false
    loop.wake()
  }
  if (!opts.still) {
    host.addEventListener('pointerdown', press)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerup', release)
    host.addEventListener('pointercancel', release)
    host.addEventListener('pointerleave', leave)
  }
  // the still tier has no loop to pause: its one light stays painted
  const unwatch = opts.still ? () => {} : watch(host, loop)

  return () => {
    unwatch()
    ro.disconnect()
    stopped.disconnect()
    loop.show(false)
    host.removeEventListener('pointerdown', press)
    host.removeEventListener('pointermove', move)
    host.removeEventListener('pointerup', release)
    host.removeEventListener('pointercancel', release)
    host.removeEventListener('pointerleave', leave)
    canvas.removeEventListener('webglcontextlost', lost)
    loseContext(gl)
  }
}
