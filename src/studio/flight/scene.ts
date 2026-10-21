// Flight's WebGL scene (three.js, this chunk only): the sky, the glass bird (two wings of feathers whose
// leading edge is the Horizon wave, and the drop of the logo's i for a body) and a little dust in the
// light. The page's scroll seeks the keyed timeline (keys.ts); time beats the wings.
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Group, Mesh, NormalBlending, PerspectiveCamera,
  Points, Scene, ShaderMaterial, SphereGeometry, Vector2, Vector3, Vector4, WebGLRenderer, Color,
} from 'three'
import { SKY_FRAG, SKY_VERT, WING_FRAG, WING_VERT, DUST_FRAG, DUST_VERT } from './shaders'
import { sample, skyMix } from './keys'
import { damp, loop, type Tier } from '../motion'

interface FeatherRow { n: number; layer: number; len: (u: number) => number; wid: (u: number) => number }

const sm = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

const ROWS: FeatherRow[] = [
  { n: 30, layer: 0, len: (u) => 1.35 + 1.55 * sm(0.12, 0.85, u) - 0.35 * sm(0.93, 1, u), wid: (u) => 0.2 + 0.08 * u },
  { n: 22, layer: 1, len: (u) => 0.75 + 0.55 * u, wid: () => 0.17 },
  { n: 14, layer: 2, len: (u) => 0.42 + 0.28 * u, wid: () => 0.14 },
]

/** One wing: every feather a strip of 12 x 2 quads; the shader places and bends it. */
function wingGeometry(): BufferGeometry {
  const NT = 12
  const S = [-1, 0, 1]
  const attrs: Record<string, number[]> = { aU: [], aT: [], aS: [], aF: [], aL: [], aW: [], aLayer: [] }
  const index: number[] = []
  let base = 0
  let seed = 7
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  for (const row of ROWS) {
    for (let i = 0; i < row.n; i++) {
      const u = (i + 0.5) / row.n
      const f = rnd()
      for (let ti = 0; ti <= NT; ti++) {
        for (const s of S) {
          attrs.aU.push(u); attrs.aT.push(ti / NT); attrs.aS.push(s); attrs.aF.push(f)
          attrs.aL.push(row.len(u) * (0.94 + 0.12 * f)); attrs.aW.push(row.wid(u)); attrs.aLayer.push(row.layer)
        }
      }
      for (let ti = 0; ti < NT; ti++) {
        for (let si = 0; si < 2; si++) {
          const a = base + ti * 3 + si
          const b = a + 1
          const c = a + 3
          const d = c + 1
          index.push(a, c, b, b, c, d)
        }
      }
      base += (NT + 1) * 3
    }
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(base * 3), 3))
  for (const [k, v] of Object.entries(attrs)) g.setAttribute(k, new BufferAttribute(new Float32Array(v), 1))
  g.setIndex(index)
  return g
}

/** The drop of the logo's i: a sphere drawn to a point at the top. */
function dropGeometry(): BufferGeometry {
  const g = new SphereGeometry(0.11, 32, 24)
  const pos = g.attributes.position as BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    const k = y > 0 ? 1 - Math.pow(y / 0.11, 1.6) * 0.92 : 1
    pos.setXYZ(i, pos.getX(i) * k, y * 1.55 - 0.05, pos.getZ(i) * k)
  }
  g.computeVertexNormals()
  return g
}

const DROP_VERT = /* glsl */ `
varying vec3 vN;
varying vec3 vW;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`
const DROP_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uTint;
uniform float uGlow;
varying vec3 vN;
varying vec3 vW;
void main() {
  vec3 V = normalize(cameraPosition - vW);
  float f = pow(1.0 - abs(dot(normalize(vN), V)), 2.4);
  vec3 col = mix(uTint, vec3(1.0), f * 0.8) + uTint * uGlow;
  float a = clamp(0.08 + f * 0.85 + uGlow * 0.3, 0.0, 1.0);
  gl_FragColor = vec4(col * a, a);
}
`

const C = (hex: string) => new Color(hex)
// wing colours per ground: day, dusk, night, dawn (root, tip), sampled from their frames
const ROOT = [C('#3f52ff'), C('#7d5cff'), C('#2f43ff'), C('#ff5a12')]
const TIP = [C('#ff8fc4'), C('#ffa060'), C('#9cc0ff'), C('#ffd06a')]

export interface FlightScene { stop: () => void }

export function startFlight(canvas: HTMLCanvasElement, root: HTMLElement, tier: Tier): FlightScene {
  const mobile = window.matchMedia('(max-width: 760px)').matches
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance', premultipliedAlpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75))
  const scene = new Scene()
  const camera = new PerspectiveCamera(25, 1, 0.1, 200)

  const skyU = { uRes: { value: new Vector2(1, 1) }, uTime: { value: 0 }, uSun: { value: new Vector2(0.5, 0.78) }, uMix: { value: new Vector4(1, 0, 0, 0) }, uHalo: { value: 1 } }
  const sky = new Mesh(new BufferGeometry().setAttribute('position', new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3)),
    new ShaderMaterial({ vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, uniforms: skyU, depthWrite: false, depthTest: false }))
  sky.frustumCulled = false
  sky.renderOrder = -10
  scene.add(sky)

  const wingU = {
    uFlap: { value: 0 }, uAmp: { value: 0.3 }, uBias: { value: 0.1 }, uFold: { value: 0 }, uSpread: { value: 1 },
    uRoot: { value: ROOT[0].clone() }, uTip: { value: TIP[0].clone() }, uGlow: { value: 0 }, uHue: { value: 0 }, uOpacity: { value: 1 },
  }
  const wingMat = new ShaderMaterial({ vertexShader: WING_VERT, fragmentShader: WING_FRAG, uniforms: wingU, transparent: true, depthWrite: false, side: 2, blending: NormalBlending, premultipliedAlpha: true })
  const geo = wingGeometry()
  const bird = new Group()
  const right = new Mesh(geo, wingMat)
  const left = new Mesh(geo, wingMat)
  left.scale.x = -1
  right.frustumCulled = false
  left.frustumCulled = false
  const dropU = { uTint: { value: C('#9aa6ff') }, uGlow: { value: 0 } }
  const drop = new Mesh(dropGeometry(), new ShaderMaterial({ vertexShader: DROP_VERT, fragmentShader: DROP_FRAG, uniforms: dropU, transparent: true, depthWrite: false, premultipliedAlpha: true }))
  drop.rotation.x = -0.35
  bird.add(right, left, drop)
  scene.add(bird)

  const N = mobile ? 160 : 320
  const dpos = new Float32Array(N * 3)
  const dseed = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    dpos[i * 3] = (Math.random() - 0.5) * 18; dpos[i * 3 + 1] = (Math.random() - 0.5) * 8; dpos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2
    dseed[i] = Math.random()
  }
  const dustG = new BufferGeometry()
  dustG.setAttribute('position', new BufferAttribute(dpos, 3))
  dustG.setAttribute('aSeed', new BufferAttribute(dseed, 1))
  const dustU = { uTime: { value: 0 }, uSize: { value: 90 * renderer.getPixelRatio() }, uCol: { value: C('#ffffff') }, uOpacity: { value: 0.6 } }
  const dust = new Points(dustG, new ShaderMaterial({ vertexShader: DUST_VERT, fragmentShader: DUST_FRAG, uniforms: dustU, transparent: true, depthWrite: false, blending: AdditiveBlending, premultipliedAlpha: true }))
  dust.frustumCulled = false
  scene.add(dust)

  // ---- the page: where each chapter starts and how tall it is (document px)
  let marks: { top: number; h: number }[] = []
  const measure = () => {
    const y = window.scrollY
    marks = [...root.querySelectorAll<HTMLElement>('[data-ch]')].map((el) => {
      const r = el.getBoundingClientRect()
      return { top: r.top + y, h: Math.max(1, r.height) }
    })
  }
  const progress = () => {
    const mid = window.scrollY + window.innerHeight * 0.5
    for (let i = marks.length - 1; i >= 0; i--) {
      if (mid >= marks[i].top) return Math.min(marks.length, i + Math.min(1, (mid - marks[i].top) / marks[i].h))
    }
    return 0
  }
  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const pr = renderer.getPixelRatio()
    skyU.uRes.value.set(w * pr, h * pr)
    measure()
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(root)
  window.addEventListener('resize', resize)

  // ---- the pointer: a spring that turns the camera a little around its target (fine pointers)
  const ptr = new Vector2()
  const spr = new Vector2()
  const onMove = (e: PointerEvent) => { if (e.pointerType === 'mouse') ptr.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1) }
  window.addEventListener('pointermove', onMove, { passive: true })

  const k: number[] = []
  const tgt = new Vector3()
  const off = new Vector3()
  const forced = new URLSearchParams(window.location.search).get('fl')
  const pin = forced !== null && forced !== '' ? Number(forced) : null
  let p = pin ?? progress()
  let vel = 0
  let lastY = window.scrollY
  let phase = 0
  const calm = tier === 'calm'
  const portrait = () => camera.aspect < 0.85

  const frame = (dt: number, t: number) => {
    const y = window.scrollY
    const v = dt > 0 ? (y - lastY) / dt / window.innerHeight : 0
    lastY = y
    vel = damp(vel, v, 0.02, dt)
    p = pin ?? damp(p, progress(), 0.03, dt)
    sample(p, k)
    const mix = skyMix(p)

    spr.x = damp(spr.x, calm ? 0 : ptr.x, 0.05, dt)
    spr.y = damp(spr.y, calm ? 0 : ptr.y, 0.05, dt)
    tgt.set(k[4], k[5], k[6])
    off.set(k[1] - k[4], k[2] - k[5], k[3] - k[6]).multiplyScalar(portrait() ? 1.08 + 0.12 * (1 - Math.min(1, p / 0.6)) : 1)
    off.applyAxisAngle(new Vector3(0, 1, 0), -spr.x * 0.1)
    off.y += spr.y * 0.6
    camera.position.copy(tgt).add(off)
    camera.lookAt(tgt)
    // phones: the bird rides in the upper half, the words sit below it (their mobile framing)
    if (portrait()) {
      const lift = off.length() * Math.tan((camera.fov * Math.PI) / 360) * 2 * (0.17 - 0.12 * (1 - Math.min(1, p / 0.6)))
      camera.translateY(-lift)
    }
    camera.fov = 25 + (calm ? 0 : Math.min(Math.abs(vel) * 4, 10))
    camera.updateProjectionMatrix()

    bird.position.set(k[7], k[8] + Math.sin(t * 0.9) * 0.08, k[9])
    bird.rotation.set(k[11], k[10], k[12], 'YXZ')
    const beat = (calm ? 0.55 : 0.85) + Math.min(Math.abs(vel), 3) * 0.18
    phase += dt * Math.PI * 2 * beat
    wingU.uFlap.value = phase
    wingU.uAmp.value = k[13] * (calm ? 0.6 : 1)
    wingU.uBias.value = k[14]
    wingU.uFold.value = Math.max(0, Math.min(1, k[15]))
    wingU.uSpread.value = k[16]
    wingU.uHue.value = t * 0.03
    const r = wingU.uRoot.value.setRGB(0, 0, 0)
    const tp = wingU.uTip.value.setRGB(0, 0, 0)
    for (let i = 0; i < 4; i++) { r.r += ROOT[i].r * mix[i]; r.g += ROOT[i].g * mix[i]; r.b += ROOT[i].b * mix[i]; tp.r += TIP[i].r * mix[i]; tp.g += TIP[i].g * mix[i]; tp.b += TIP[i].b * mix[i] }
    wingU.uGlow.value = mix[2] * 0.9 + mix[3] * 0.5
    dropU.uTint.value.copy(r).lerp(tp, 0.3)
    dropU.uGlow.value = mix[2] * 0.8 + mix[3] * 0.6

    skyU.uTime.value = t
    skyU.uMix.value.set(mix[0], mix[1], mix[2], mix[3])
    const sunY = 0.8 * (mix[0] + mix[1]) + 0.22 * mix[3] + 0.6 * mix[2]
    skyU.uSun.value.set(0.5, sunY)
    skyU.uHalo.value = 1 - mix[3] * 0.5
    dustU.uTime.value = t
    dustU.uCol.value.setRGB(1, 1, 1).lerp(new Color(mix[3] > 0.5 ? '#ffb15a' : '#c9d6ff'), mix[2] + mix[3])
    dustU.uOpacity.value = 0.35 + mix[2] * 0.5 + mix[3] * 0.4

    renderer.render(scene, camera)
  }

  let stopLoop = () => {}
  if (tier === 'still') frame(0, 0)
  else stopLoop = loop(frame)
  canvas.dataset.ready = '1'

  return {
    stop: () => {
      stopLoop()
      ro.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      geo.dispose(); dustG.dispose(); wingMat.dispose()
      renderer.dispose()
    },
  }
}
