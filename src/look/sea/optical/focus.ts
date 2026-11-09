// sea · the focus pull (C1, ported from the cinematic lab's rack focus). The exit from the hero, shot through one lens:
// the hero holds on a sticky pin, night city lights in huge bokeh come up behind the headline, then the focus puller's
// hand moves, the words soften and leave and the lights resolve to points, and native scroll carries the frame away.
// The optics are the lab's: every light drawn at four sizes and read through a disc kernel with a dense rim, highlights
// that bloom as they tighten, the second aperture's cat-eye toward the corners, focus breathing and a colour fringe on
// each disc's edge. The real H1 is never touched before scrolling begins; its copy is painted word by word on the rects
// the browser measured for the real words, in the real face, with the real shadow, so the takeover cannot be seen.
// One canvas, DPR capped at 2, drawn only while the spring moves and only on screen.
import { clamp, easeIO, loopOf, loseContext, VS } from './engine'

/** the still's coordinates: everything optical is measured in them, so it scales with the picture */
const STILL_W = 960
const R0 = [1, 3, 8, 20]
/** where the lights are in the still, and how far a kernel can reach past the visible frame */
const BAND_TOP = 300
const BAND_BOTTOM = 540
const REACH = 72
/** the disc radius of the lights at the start of the pull, in still px */
const R_BACK = 52
/** the disc radius of the type at the end of the pull, as a fraction of the frame's width */
const F_FRONT = 0.052
const BREATH = 0.026
/** the most device pixels the shader is asked to fill */
const PIXELS = 3.1e6

type Light = readonly [number, number, number, number, number, number]

// measured from the still: position, colour, strength
const MEASURED: Light[] = [[29,387,1,.32,1,.71],[338,400,1,.29,.98,.75],[3,456,.95,1,.14,.34],[40,456,1,.66,0,.18],[78,457,1,.46,.01,.37],[105,457,1,.42,.02,.19],[153,465,.68,1,.28,.7],[180,465,.6,1,.33,.3],[236,464,1,.48,.03,.38],[268,464,1,.59,.06,.24],[305,460,1,.7,.16,.73],[332,459,1,.75,.25,.32],[398,458,1,.34,.01,.4],[423,458,1,.43,.02,.22],[447,458,.79,1,.26,.28],[466,459,.8,1,.38,.72],[488,458,.82,1,.37,.4],[511,455,1,.99,.98,.38],[532,456,1,1,.99,.64],[552,459,1,.97,.67,.4],[590,458,.99,1,.95,.68],[612,457,.74,1,.58,.35],[632,462,.6,1,.36,.46],[457,363,1,.76,0,.39],[394,363,1,.22,.01,.05],[428,401,1,.39,.01,.08],[466,407,1,.46,0,.07],[663,358,1,.62,0,.22],[632,397,1,.69,0,.16],[672,391,1,.58,0,.18],[714,389,1,.65,0,.16],[733,377,1,.67,0,.13],[935,385,1,.62,0,.1],[790,453,1,.35,.01,.28],[812,452,1,.4,.02,.4],[834,451,1,.38,.01,.4],[856,451,1,.35,.01,.38],[878,450,1,.34,.01,.37],[900,450,1,.36,.01,.39],[922,450,1,.37,.01,.4],[945,450,1,.35,.01,.38],[525,508,1,.22,0,.25],[238,498,1,.11,.01,.13],[590,500,.64,1,.07,.24]]

/** the dimmer windows and street lights a sharp lens would also find, placed once from a fixed seed */
function cityLights(): Light[] {
  let s = 917
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
  const tint = [[1, .62, .2], [1, .8, .5], [1, .45, .1], [.7, 1, .55], [1, .95, .82]]
  const out: Light[] = []
  const put = (x: number, y: number, a: number, b: number) => { const c = tint[rnd() * tint.length | 0]; out.push([x, y, c[0], c[1], c[2], a + rnd() * b]) }
  for (let i = 0; i < 34; i++) put(rnd() * 960, 438 + rnd() * rnd() * 70, .05, .13)
  for (let i = 0; i < 26; i++) put(rnd() * 960, 330 + rnd() * 86, .03, .09)
  for (let x = 8; x < 960; x += 8 + rnd() * 17) if (rnd() > .16) put(x, 474 + x * .01 + rnd() * 5.5, .08, .11)
  for (let x = 3; x < 960; x += 6 + rnd() * 15) if (rnd() > .2) put(x, 496 - x * .008 + rnd() * 7, .05, .08)
  for (let x = 12; x < 960; x += 14 + rnd() * 24) if (rnd() > .18) put(x, 441 + rnd() * 7, .06, .1)
  // towers: a few columns of windows each, most of them dark at this hour
  for (let c = 0; c < 22; c++) {
    const cx = 10 + rnd() * 930, top = 342 + rnd() * 46, cols = 2 + (rnd() * 3 | 0)
    for (let i = 0; i < cols; i++) for (let y = top + rnd() * 6; y < 424; y += 6.5 + rnd() * 3) if (rnd() > .6) put(cx + i * (5 + rnd() * 1.5), y, .04, .08)
  }
  return out
}
const LIGHTS = [...MEASURED, ...cityLights()]

interface Band { x0: number; y0: number; w: number; h: number; k: number }

/** one layer of the back plane: every light in the band at one size; the kernel's taps read the size that fits their spacing */
function paintLights(x: CanvasRenderingContext2D, w: number, h: number, r0: number, b: Band) {
  x.globalCompositeOperation = 'source-over'
  x.fillStyle = '#000'
  x.fillRect(0, 0, w, h)
  x.globalCompositeOperation = 'lighter'
  const dot = (lx: number, ly: number, rad: number) => { x.beginPath(); x.arc(lx, ly, rad, 0, 6.2832); x.fill() }
  const rgb = (r: number, g: number, b2: number, m: number) => `rgb(${Math.round(r * m * 255)},${Math.round(g * m * 255)},${Math.round(b2 * m * 255)})`
  for (const [sx, sy, r, g, bl, s] of LIGHTS) {
    const lx = (sx - b.x0) * b.k
    const ly = (sy - b.y0) * b.k
    if (lx < -40 * b.k || lx > w + 40 * b.k) continue
    if (r0 !== R0[0]) { x.fillStyle = rgb(r, g, bl, s); dot(lx, ly, r0 * b.k); continue }
    // the sharp layer: a hot core and the little halo every point of light has in a real lens
    const hot = Math.min(1, s * 2.4 + .16)
    const rc = (.7 + Math.sqrt(s) * 1.5) * b.k
    const halo = x.createRadialGradient(lx, ly, 0, lx, ly, rc * 3.4)
    halo.addColorStop(0, rgb(r, g, bl, hot * .5))
    halo.addColorStop(.35, rgb(r, g, bl, hot * .14))
    halo.addColorStop(1, 'rgb(0,0,0)')
    x.fillStyle = halo
    dot(lx, ly, rc * 3.4)
    x.fillStyle = rgb(r, g, bl, hot)
    dot(lx, ly, rc)
    if (s > .16) { const v = Math.round(190 * hot + 40); x.fillStyle = `rgb(${v},${v},${Math.round(v * .92)})`; dot(lx, ly, rc * .55) }
  }
}

/** golden-angle taps with a dense rim, so the disc has a defined edge */
function taps(interior: number, rim: number, rimWeight: number, spread: number) {
  const a = 2.399963
  const out: number[] = []
  for (let i = 0; i < interior; i++) {
    const r = Math.sqrt((i + .5) / interior) * spread
    out.push(r * Math.cos(i * a), r * Math.sin(i * a), 1)
  }
  for (let i = 0; i < rim; i++) out.push(Math.cos((interior + i) * a), Math.sin((interior + i) * a), rimWeight)
  return out
}

const FRAG = `#version 300 es
precision highp float;
precision highp sampler2DArray;
uniform vec2 uRes, uSize;
uniform float uDpr;
uniform sampler2D uStill, uType;
uniform sampler2DArray uLights;
uniform vec4 uMap, uBand, uTypeBox;
uniform float uRb, uL, uExp, uHaze, uCoarseB, uSoftK, uRf, uFLod, uCoarseF, uJitF, uFade, uWords, uFlagLod;
uniform int uBs, uBn, uFs, uFn;
uniform vec3 uTapB[52];
uniform vec3 uTapF[40];
const float R[4] = float[4](1., 3., 8., 20.);
const float SOFT[4] = float[4](0., .85, 2.26, 3.58);
const vec2 ST = vec2(1. / 960., 1. / 540.);
const vec3 GROUND = vec3(.0588, .0627, .0667);
const vec3 W = vec3(.3, .55, .15);
out vec4 frag;

float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(.06711056, .00583715)))); }
mat2 spin(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
vec3 fringe(float r, float side) { float f = .26 * side * smoothstep(.55, 1., r); return vec3(1. + f, 1., 1. - f); }
vec3 hdr(vec3 c) { c *= c; float l = dot(c, W); return c * (1. + 5. * l * l); }
vec2 lu(vec2 st) { return (st - uBand.xy) * uBand.zw; }

vec3 backPlane(vec2 st, vec2 field) {
  if (uRb < .8) return hdr(textureLod(uLights, vec3(lu(st), 0.), 0.).rgb);
  vec3 near = textureLod(uLights, vec3(lu(st), 3.), uCoarseB).rgb;
  if (max(near.r, max(near.g, near.b)) < .0015) return vec3(0.);
  vec3 accI = vec3(0.), accR = vec3(0.), mean = vec3(0.);
  float tot = 0., wI = 0.;
  vec2 cat = field * .3 * smoothstep(.55, 1.15, length(field));
  float cat2 = dot(cat, cat);
  float lo = floor(uL), f = uL - lo;
  for (int i = uBs; i < uBs + uBn; i++) {
    vec3 t = uTapB[i];
    float r = length(t.xy);
    bool rim = r > .995;
    // the second aperture of the barrel cuts the disc; the taps slide onto its edge, so the cut is as sharp as the rim
    vec2 dir = t.xy / max(r, 1e-4);
    float along = dot(dir, cat);
    vec2 u = t.xy * min(1., along + sqrt(max(along * along - cat2 + 1., 0.)));
    float l = lo + (fract(float(i) * .61803) < f ? 1. : 0.);
    int li = int(l);
    float r0 = R[li];
    float rk = max(uRb - r0, 0.);
    float g = max(rk / r0, 1.);
    vec3 c = hdr(textureLod(uLights, vec3(lu(st + u * rk), l), max((rim ? .6 : SOFT[li]) + uSoftK, 0.)).rgb) * g * g;
    tot += t.z;
    if (rim) {
      if (wI > 0.) { mean = accI / wI; wI = 0.; }
      // a rim tap draws the edge only where the fill has not arrived yet; everywhere else it joins the fill
      float inside = smoothstep(.2, .7, dot(mean, W) / max(max(dot(c, W), dot(mean, W)), 1e-5));
      accR += mix(c, mean, inside) * t.z * fringe(r, 1.);
    } else {
      accI += c * t.z * fringe(r, 1.);
      wI += t.z;
    }
  }
  float lumI = dot(accI, W), lumR = dot(accR, W);
  return (accI + accR * (1. + 1.3 * exp(-5. * lumI / (lumR + 1e-5)))) / tot;
}

vec4 frontPlane(vec2 uv, vec2 fp) {
  if (uWords < .002) return vec4(0.);
  if (uRf < .4) return textureLod(uType, uv, 0.);
  if (textureLod(uType, uv, uCoarseF).a < .001) return vec4(0.);
  vec4 acc = vec4(0.);
  vec3 tot = vec3(0.);
  float totA = 0.;
  mat2 turn = spin((ign(fp + 11.3) - .5) * 2. * uJitF);
  for (int i = uFs; i < uFs + uFn; i++) {
    vec3 t = uTapF[i];
    vec3 tint = fringe(length(t.xy), -1.);
    vec4 s = textureLod(uType, uv + turn * t.xy * uRf * uTypeBox.zw, uFLod);
    acc += vec4(s.rgb * tint, s.a) * t.z;
    tot += t.z * tint;
    totA += t.z;
  }
  return vec4(acc.rgb / tot, acc.a / totA);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 hs = uSize * .5;
  vec2 q = (p - hs) / uMap.w;
  vec2 st = uMap.yz + q * uMap.x;
  vec2 field = (p - hs) / length(hs);

  vec2 uv = (hs + q - uTypeBox.xy) * uTypeBox.zw;
  vec3 c = vec3(0.);
  if (uFade > .001) {
    c = backPlane(st, field) * uExp;
    vec3 haze = textureLod(uStill, st * ST, 5.5).rgb;
    // the still ends under the city: below it the glow dies away, so the canvas's bottom edge is plain ground
    c += haze * haze * uHaze * (1. - smoothstep(500., 590., st.y));
    c = 1. - exp(-c);
    c = sqrt(c) * (1. - .16 * smoothstep(.55, 1.2, length(field)));
    // a flag on the lamp: the lights give way softly around the letters, so the headline keeps its contrast on the brightest disc
    if (uWords > .002) c *= 1. - .55 * uWords * smoothstep(.02, .3, textureLod(uType, uv, uFlagLod).a);
    c = 1. - (1. - c) * (1. - GROUND);
    c += (hash(p + 3.1) + hash(p.yx + 7.7) - 1.) / 255.;
  }
  // premultiplied: the words stand over whatever is behind the canvas until the lights have come up
  vec4 front = frontPlane(uv, gl_FragCoord.xy) * uWords;
  frag = vec4(c * uFade * (1. - front.a) + front.rgb, uFade * (1. - front.a) + front.a);
}`

function queueProgram(gl: WebGL2RenderingContext) {
  const p = gl.createProgram()
  if (!p) return null
  const stages: [number, string][] = [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FRAG]]
  for (const [type, src] of stages) {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    gl.attachShader(p, s)
  }
  gl.linkProgram(p)
  return p
}

/** asks for the link status only once the driver is done with it: on a weak GPU the question itself stalls the page */
function linked(gl: WebGL2RenderingContext, p: WebGLProgram) {
  const ext = gl.getExtension('KHR_parallel_shader_compile') as { COMPLETION_STATUS_KHR: number } | null
  const t0 = performance.now()
  let wait = 60
  return new Promise<boolean>((done) => {
    const poll = () => {
      if (ext && !gl.getProgramParameter(p, ext.COMPLETION_STATUS_KHR)) {
        // past the limit the shot is given up, not forced: LINK_STATUS on an unfinished program freezes the page until the driver is done
        if (performance.now() - t0 > 45000) { done(false); return }
        wait = Math.min(400, wait * 1.5)
        window.setTimeout(poll, wait)
        return
      }
      done(Boolean(gl.getProgramParameter(p, gl.LINK_STATUS)))
    }
    poll()
  })
}

interface Word { text: string; x: number; top: number; h: number }
interface Type { words: Word[]; font: string; color: string; shadow: string; box: { x: number; y: number; w: number; h: number } }
interface Spring { x: number; v: number; target: number }

/** the real headline, read from the browser: every word's own rect, relative to the canvas, and its computed look */
function readType(h1: HTMLElement, lens: HTMLElement, W: number, dpr: number): Type | null {
  const cs = getComputedStyle(h1)
  const at = lens.getBoundingClientRect()
  const range = document.createRange()
  const words: Word[] = []
  h1.querySelectorAll('.sea-h1__ln').forEach((ln) => {
    const node = ln.firstChild
    if (!node || node.nodeType !== Node.TEXT_NODE) return
    for (const m of (node.nodeValue ?? '').matchAll(/\S+/g)) {
      range.setStart(node, m.index)
      range.setEnd(node, m.index + m[0].length)
      const r = range.getBoundingClientRect()
      words.push({ text: m[0], x: r.left - at.left, top: r.top - at.top, h: r.height })
    }
  })
  if (!words.length) return null
  const rect = h1.getBoundingClientRect()
  // room for the shadow and for the widest disc the words will reach, snapped to the canvas's own pixels
  const pad = Math.ceil(W * F_FRONT * 1.3 + 24)
  const x = Math.floor((Math.max(0, rect.left - at.left - pad)) * dpr) / dpr
  const y = Math.floor((Math.max(0, rect.top - at.top - pad)) * dpr) / dpr
  const box = { x, y, w: Math.ceil((rect.width + pad * 2) * dpr) / dpr, h: Math.ceil((rect.height + pad * 2) * dpr) / dpr }
  return { words, box, font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, color: cs.color, shadow: cs.textShadow }
}

/** computed text-shadow to [colour, x, y, blur], outermost first as CSS paints them */
function shadowsOf(v: string) {
  if (!v || v === 'none') return []
  return v.split(/,(?![^(]*\))/).map((one) => {
    const colour = one.match(/rgba?\([^)]*\)|#[0-9a-f]+/i)?.[0] ?? 'transparent'
    const [x = 0, y = 0, blur = 0] = (one.replace(colour, '').match(/-?[\d.]+px/g) ?? []).map(parseFloat)
    return { colour, x, y, blur }
  }).reverse()
}

function paintType(t: Type, dpr: number) {
  const c = document.createElement('canvas')
  c.width = Math.round(t.box.w * dpr)
  c.height = Math.round(t.box.h * dpr)
  const x = c.getContext('2d')
  if (!x) return null
  x.setTransform(dpr, 0, 0, dpr, -t.box.x * dpr, -t.box.y * dpr)
  x.font = t.font
  x.fontKerning = 'normal'
  x.textRendering = 'optimizeLegibility'
  x.direction = 'rtl'
  x.textAlign = 'left'
  x.textBaseline = 'alphabetic'
  x.fillStyle = t.color
  const write = () => {
    for (const w of t.words) {
      const m = x.measureText(w.text)
      const asc = m.fontBoundingBoxAscent
      const des = m.fontBoundingBoxDescent
      // the browser lays the baseline on a whole device pixel: the copy lands on the same one
      x.fillText(w.text, w.x, Math.round((w.top + (asc + des > 0 ? w.h * asc / (asc + des) : w.h * .8)) * dpr) / dpr)
    }
  }
  for (const s of shadowsOf(t.shadow)) {
    x.save()
    x.shadowColor = s.colour
    x.shadowOffsetX = s.x * dpr
    x.shadowOffsetY = s.y * dpr
    x.shadowBlur = s.blur * dpr
    write()
    x.restore()
  }
  x.shadowColor = 'transparent'
  write()
  return c
}

const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t) }
const slice = () => new Promise<void>((r) => { if (window.requestIdleCallback) window.requestIdleCallback(() => r(), { timeout: 160 }); else window.setTimeout(r, 24) })

export interface FocusHooks {
  /** calm: the end of the shot, drawn once */
  reduce: boolean
  /** the context is gone or the widget's stop came on: the page goes back to the plain hero */
  onEnd: () => void
}

export function mountFocus(lens: HTMLElement, wrap: HTMLElement, hero: HTMLElement, hooks: FocusHooks): (() => void) | null {
  const h1 = hero.querySelector<HTMLElement>('.sea-h1')
  const inner = hero.querySelector<HTMLElement>('.sea-in')
  if (!h1 || !inner) return null
  const canvas = document.createElement('canvas')
  const created = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'high-performance' })
  if (!created) return null
  const gl = created
  const prog = queueProgram(gl)
  if (!prog) return null
  canvas.setAttribute('aria-hidden', 'true')
  lens.appendChild(canvas)

  const html = document.documentElement.classList
  const opening = () => html.contains('sea-opening')
  const cache: Record<string, WebGLUniformLocation | null> = {}
  const u = new Proxy(cache, { get: (t, n: string) => (n in t ? t[n] : (t[n] = gl.getUniformLocation(prog, n))) })
  const focus: Spring = { x: 0, v: 0, target: 0 }
  let alive = true
  let ready = false
  let seen = false
  let lit = false
  let out = 0
  let W = 0
  let H = 0
  let dpr = 1
  let pin = 0
  let run = 1
  let wrapTop = 0
  let view = { s: 1, cx: 400, cy: 430, k: 1 }
  let lightsTex: WebGLTexture | null = null
  let typeTex: WebGLTexture | null = null
  let builds = 0
  let timer = 0
  let flagLod = 4

  function measureCanvas() {
    const w = lens.clientWidth
    const h = lens.clientHeight
    if (!w || !h) return false
    const d = Math.min(2, window.devicePixelRatio || 1, Math.sqrt(PIXELS / (w * h)))
    if (w === W && h === H && d === dpr) return false
    W = w; H = h; dpr = d
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(u.uRes, canvas.width, canvas.height)
    gl.uniform1f(u.uDpr, dpr)
    gl.uniform2f(u.uSize, W, H)
    return true
  }

  function measurePin() {
    pin = parseFloat(getComputedStyle(hero).top) || 0
    run = Math.max(1, wrap.offsetHeight - hero.offsetHeight)
    wrapTop = wrap.getBoundingClientRect().top + window.scrollY
  }

  /** the frame: the city's brightest row just under the words, so only the tops of its discs reach behind them; black beyond the still is sky and ground */
  function frameView() {
    const r = h1!.getBoundingClientRect()
    const at = lens.getBoundingClientRect()
    const s = W / Math.min(960, Math.max(320, W * .82))
    const mid = hooks.reduce ? H * .55 : Math.max(r.bottom - at.top + 30 - 26 * s, H * .62)
    view = { s, cx: clamp(STILL_W * .45, W / s / 2, STILL_W - W / s / 2), cy: 432 - (mid - H / 2) / s, k: 1 }
  }

  /** the four sizes of the lights, only for the part of the still this frame can reach, at the screen's own resolution */
  async function buildLights() {
    const id = ++builds
    const vw = W / view.s
    const x0 = Math.floor(view.cx - vw / 2 - REACH)
    const bw = Math.ceil(vw + REACH * 2)
    const k = Math.min(view.s * dpr, 2048 / bw)
    const b: Band = { x0, y0: BAND_TOP, w: bw, h: BAND_BOTTOM - BAND_TOP, k }
    const tw = Math.round(b.w * k)
    const th = Math.round(b.h * k)
    const c = document.createElement('canvas')
    c.width = tw
    c.height = th
    const x = c.getContext('2d', { willReadFrequently: true })
    if (!x) return
    const tex = gl.createTexture()
    gl.activeTexture(gl.TEXTURE3)
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex)
    gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA8, tw, th, R0.length, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    for (let i = 0; i < R0.length; i++) {
      await slice()
      if (!alive || id !== builds) { gl.deleteTexture(tex); return }
      paintLights(x, tw, th, R0[i], b)
      gl.activeTexture(gl.TEXTURE3)
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex)
      gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, tw, th, 1, gl.RGBA, gl.UNSIGNED_BYTE, c)
    }
    await slice()
    if (!alive || id !== builds) { gl.deleteTexture(tex); return }
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex)
    gl.generateMipmap(gl.TEXTURE_2D_ARRAY)
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    if (lightsTex) gl.deleteTexture(lightsTex)
    lightsTex = tex
    view.k = k
    gl.uniform4f(u.uBand, b.x0, b.y0, 1 / b.w, 1 / b.h)
    gl.uniform1f(u.uSoftK, Math.log2(k / (4 / 3)))
  }

  function texture2D(unit: number, source: TexImageSource) {
    const t = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return t
  }

  function buildType() {
    if (hooks.reduce) return
    const t = readType(h1!, lens, W, dpr)
    const c = t && paintType(t, dpr)
    if (!t || !c) return
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    if (typeTex) gl.deleteTexture(typeTex)
    typeTex = texture2D(2, c)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    // the flag is as wide as half a letter: broad enough to read as light falling off, never as an outline
    flagLod = Math.log2(parseFloat(getComputedStyle(h1!).fontSize) * .55 * dpr)
    gl.uniform4f(u.uTypeBox, t.box.x, t.box.y, 1 / t.box.w, 1 / t.box.h)
  }

  function setLens(p: number, fade: number, words: number) {
    const k = view.k
    gl.uniform4f(u.uMap, 1 / view.s, view.cx, view.cy, 1 + BREATH * p)
    const rb = R_BACK * (1 - p)
    gl.uniform1f(u.uRb, rb)
    gl.uniform1f(u.uL, rb < 2.5 ? 0 : clamp(Math.log(rb / 2.5) / Math.log(2.6), 0, 3))
    gl.uniform1f(u.uExp, .85 + (1.55 - .85) * Math.pow(p, 3))
    gl.uniform1f(u.uHaze, .5 * (1 - p) * (1 - p) + .012)
    // at most 48 reads on the worst pixel: the plane with the bigger circle gets the taps
    const backFirst = p < .5
    gl.uniform1i(u.uBs, backFirst ? 0 : 32)
    gl.uniform1i(u.uBn, backFirst ? 32 : 20)
    gl.uniform1i(u.uFs, backFirst ? 0 : 12)
    gl.uniform1i(u.uFn, backFirst ? 12 : 28)
    gl.uniform1f(u.uJitF, Math.PI / (backFirst ? 8 : 13))
    gl.uniform1f(u.uCoarseB, clamp(Math.log2(Math.max(rb * k, 1)) - .4, 0, 8))
    const rf = W * F_FRONT * p
    gl.uniform1f(u.uRf, rf)
    gl.uniform1f(u.uFLod, clamp(Math.log2(Math.max(rf * dpr * (backFirst ? .51 : .335) * .9, 1)), 0, 6))
    gl.uniform1f(u.uCoarseF, clamp(Math.log2(Math.max(rf * dpr, 1)) + 1, 0, 8))
    gl.uniform1f(u.uFade, fade)
    gl.uniform1f(u.uWords, words)
    gl.uniform1f(u.uFlagLod, flagLod)
  }

  /** the only place the shot's beats live; the rest of the page reads them from here */
  function draw() {
    const x = focus.x
    const p = easeIO(clamp((x - .32) / .56))
    setLens(p, smooth(.012, .36, x), 1 - smooth(.5, .96, p))
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    // the copy is in this very frame: the real words step aside in the same paint
    const on = x > 5e-4 || focus.target > 0
    if (on !== lit) { lit = on; wrap.classList.toggle('is-lit', on) }
    const o = smooth(.01, .15, x)
    if (o !== out) {
      out = o
      inner!.style.opacity = o > 0 ? String(1 - o) : ''
      wrap.classList.toggle('is-out', o > .7)
      // the hero's keys are gone from here on: the dock (ShotDock) reads this and takes their place
      html.toggle('sea-focus-out', o > .7)
    }
  }

  const stepSpring = (dt: number) => {
    const c = 2 * Math.sqrt(70)
    const h = dt / 3
    for (let i = 0; i < 3; i++) { focus.v += (-70 * (focus.x - focus.target) - c * focus.v) * h; focus.x += focus.v * h }
    if (Math.abs(focus.x - focus.target) > 5e-4 || Math.abs(focus.v) > 2e-3) return true
    focus.x = focus.target
    focus.v = 0
    return false
  }

  const loop = loopOf((dt) => {
    if (!ready) return false
    const more = stepSpring(dt)
    draw()
    return more
  })

  const readT = () => clamp((pin - wrapTop + window.scrollY) / run)
  const onScroll = () => {
    if (!ready || hooks.reduce) return
    const t = readT()
    if (Math.abs(t - focus.target) > 1e-4) { focus.target = t; loop.wake() }
  }

  // back from the browser's page cache the canvas may have lost its picture while the words are still stepped aside
  const onPageShow = () => { if (ready && !hooks.reduce && lit) { focus.x = focus.target = readT(); focus.v = 0; draw() } }

  const io = new IntersectionObserver((es) => {
    const v = es[es.length - 1].isIntersecting
    // back from below: the frame is already where the scroll is, nothing plays catch-up on arrival
    if (v && !seen && ready && !hooks.reduce && focus.x !== focus.target) { focus.x = focus.target = readT(); focus.v = 0; draw() }
    seen = v
    loop.show(v)
  }, { rootMargin: '40px' })

  async function prepare() {
    frameView()
    await buildLights()
    if (!alive) return
    buildType()
  }

  const ro = new ResizeObserver(() => {
    if (!ready || !measureCanvas()) return
    measurePin()
    window.clearTimeout(timer)
    timer = window.setTimeout(() => { void prepare().then(() => { if (alive && seen) { if (hooks.reduce) drawEnd(); else draw() } }) }, 180)
    loop.wake()
  })

  function drawEnd() {
    setLens(1, 1, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  const onClass = () => {
    if (html.contains('disable-animations')) { dispose(); hooks.onEnd() }
  }
  const mo = new MutationObserver(onClass)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  const lost = (e: Event) => { e.preventDefault(); dispose(); hooks.onEnd() }
  canvas.addEventListener('webglcontextlost', lost)

  function dispose() {
    if (!alive) return
    alive = false
    ready = false
    window.clearTimeout(timer)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pageshow', onPageShow)
    canvas.removeEventListener('webglcontextlost', lost)
    loop.show(false)
    io.disconnect()
    ro.disconnect()
    mo.disconnect()
    wrap.classList.remove('is-lit', 'is-out')
    html.remove('sea-focus-out')
    inner!.style.opacity = ''
    loseContext(gl)
    canvas.remove()
  }

  /** waits out the opening: the headline's lines are still rising under it, and the driver gets the moment to itself */
  const openingOver = () => new Promise<void>((done) => {
    if (!opening()) { done(); return }
    const watch = new MutationObserver(() => { if (!opening()) { watch.disconnect(); done() } })
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  })

  async function boot() {
    await openingOver()
    if (!alive) return
    if (!await linked(gl, prog!)) { dispose(); hooks.onEnd(); return }
    if (!alive) return
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const a = gl.getAttribLocation(prog!, 'a')
    gl.enableVertexAttribArray(a)
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0)
    gl.clearColor(0, 0, 0, 0)
    gl.uniform1i(u.uStill, 0)
    gl.uniform1i(u.uLights, 1)
    gl.uniform1i(u.uType, 2)
    gl.uniform3fv(u.uTapB, [...taps(11, 21, 1.3, .9), ...taps(7, 13, 1.3, .9)])
    gl.uniform3fv(u.uTapF, [...taps(4, 8, 1.1, .86), ...taps(15, 13, 1.1, .86)])
    const none = new ImageData(new Uint8ClampedArray(4), 1, 1)
    typeTex = texture2D(2, none)

    const still = new Image()
    still.decoding = 'async'
    still.src = '/media/focus-lights.webp'
    // the still is only the glow: without it the shot goes on with the lights alone
    const decoded = await still.decode().then(() => true, () => false)
    if (!alive) return
    texture2D(0, decoded ? still : none)
    await document.fonts.ready
    if (!alive) return
    measureCanvas()
    measurePin()
    await prepare()
    if (!alive) return
    // a driver may finish the shader on its first real draw: that draw happens here, in the hidden canvas, not on the first scroll
    await slice()
    if (!alive) return
    setLens(.4, 1, 1)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    ready = true
    if (hooks.reduce) { drawEnd(); return }
    onScroll()
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pageshow', onPageShow)
  io.observe(lens)
  ro.observe(lens)
  boot().catch(() => { dispose(); hooks.onEnd() })

  if (import.meta.env.DEV) (window as unknown as { __focus?: unknown }).__focus = { spring: focus, get ready() { return ready }, redraw: () => draw() }
  return dispose
}
