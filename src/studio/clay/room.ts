// "חימר" (after Léo Parpeix): a sunlit clay room. Their room holds a giant clay daisy with a face; ours
// holds a clay cassette on a plinth whose two reels are its eyes. The sun comes through three arched
// windows and lays their shapes on the floor; the camera slides in (5 units, 2 s, expo.out), turns a
// little after the mouse (0.2 deg up, 0.75 deg sideways), and sinks and moves in as the hero scrolls
// (2.4 down, 4 in). The eyes follow the pointer and blink; the reels turn while the tape plays.
import {
  ACESFilmicToneMapping, BoxGeometry, Color, CylinderGeometry, DirectionalLight, ExtrudeGeometry, Group, HemisphereLight,
  Mesh, MeshStandardMaterial, PCFShadowMap, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Shape, Path,
  SphereGeometry, SRGBColorSpace, TorusGeometry, Vector2, WebGLRenderer, CircleGeometry, MathUtils,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { damp, loop, type Tier } from '../motion'

const clay = (hex: string, rough = 0.92) => new MeshStandardMaterial({ color: new Color(hex), roughness: rough, metalness: 0 })

const SKY_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) { vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p) { float s = 0.0; float a = 0.5; for (int i = 0; i < 5; i++) { s += a * n(p); p *= 2.03; a *= 0.5; } return s; }
void main() {
  vec3 top = vec3(0.56, 0.72, 0.90);
  vec3 low = vec3(0.90, 0.94, 0.98);
  vec3 col = mix(low, top, smoothstep(0.05, 0.95, vUv.y));
  vec2 q = vUv * vec2(3.0, 1.6) + vec2(uTime * 0.008, 0.0);
  float c = smoothstep(0.48, 0.78, fbm(q * 1.4) * 0.8 + fbm(q * 3.1 + 7.0) * 0.35);
  col = mix(col, vec3(1.0, 0.995, 0.985), c * 0.92);
  gl_FragColor = vec4(col, 1.0);
}
`
const SKY_VERT = /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`

/** The back wall with three arched windows (an extruded shape, deep enough to catch the sun on its reveals). */
function wall(): Mesh {
  const s = new Shape()
  s.moveTo(-8, 0); s.lineTo(8, 0); s.lineTo(8, 7.5); s.lineTo(-8, 7.5); s.lineTo(-8, 0)
  for (const cx of [-3.4, 0, 3.4]) {
    const w = 0.95
    const p = new Path()
    p.moveTo(cx - w, 0.75); p.lineTo(cx + w, 0.75); p.lineTo(cx + w, 3.6)
    p.absarc(cx, 3.6, w, 0, Math.PI, false)
    p.lineTo(cx - w, 0.75)
    s.holes.push(p)
  }
  const g = new ExtrudeGeometry(s, { depth: 0.4, bevelEnabled: false, curveSegments: 40 })
  const m = new Mesh(g, clay('#efe5d6'))
  m.position.z = -4.4
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** Window bars: one upright and one cross bar in each arch. */
function bars(): Group {
  const g = new Group()
  const mat = clay('#e8dccb')
  for (const cx of [-3.4, 0, 3.4]) {
    const v = new Mesh(new BoxGeometry(0.06, 3.8, 0.06), mat)
    v.position.set(cx, 2.65, -4.2)
    const hb = new Mesh(new BoxGeometry(1.9, 0.06, 0.06), mat)
    hb.position.set(cx, 2.9, -4.2)
    for (const b of [v, hb]) { b.castShadow = true; g.add(b) }
  }
  return g
}

interface Face { left: Group; right: Group; spinL: Group; spinR: Group; pupilL: Mesh; pupilR: Mesh; body: Group }

/** The clay cassette: a soft body, a yellow label, a dark window with two reels for eyes, a small smile. */
function cassette(): Face {
  const body = new Group()
  const shell = new Mesh(new RoundedBoxGeometry(2.1, 1.36, 0.46, 6, 0.16), clay('#f3ebdf', 0.88))
  shell.castShadow = true
  shell.receiveShadow = true
  body.add(shell)
  const label = new Mesh(new RoundedBoxGeometry(1.72, 0.46, 0.08, 4, 0.06), clay('#f2d649', 0.8))
  label.position.set(0, 0.3, 0.22)
  body.add(label)
  const stripe = new Mesh(new BoxGeometry(1.4, 0.05, 0.02), clay('#e7b83a'))
  stripe.position.set(0, 0.2, 0.27)
  body.add(stripe)
  const window = new Mesh(new RoundedBoxGeometry(1.24, 0.42, 0.06, 4, 0.18), clay('#4a3528', 0.7))
  window.position.set(0, -0.22, 0.21)
  body.add(window)
  const reel = (x: number) => {
    const eye = new Group()
    const g = new Group()
    eye.add(g)
    const disc = new Mesh(new CylinderGeometry(0.17, 0.17, 0.06, 40), clay('#fbf6ee', 0.85))
    disc.rotation.x = Math.PI / 2
    g.add(disc)
    for (let i = 0; i < 6; i++) {
      const t = new Mesh(new BoxGeometry(0.03, 0.07, 0.02), clay('#d8ccbb'))
      const a = (i / 6) * Math.PI * 2
      t.position.set(Math.cos(a) * 0.09, Math.sin(a) * 0.09, 0.035)
      t.rotation.z = a + Math.PI / 2
      g.add(t)
    }
    eye.position.set(x, -0.22, 0.25)
    body.add(eye)
    return { eye, spin: g }
  }
  const { eye: left, spin: spinL } = reel(-0.32)
  const { eye: right, spin: spinR } = reel(0.32)
  const pupil = (g: Group) => {
    const p = new Mesh(new CircleGeometry(0.055, 24), clay('#2a1d16', 0.6))
    p.position.z = 0.068
    g.add(p)
    return p
  }
  const pupilL = pupil(left)
  const pupilR = pupil(right)
  const smile = new Mesh(new TorusGeometry(0.12, 0.018, 8, 32, Math.PI), clay('#b78f72'))
  smile.rotation.z = Math.PI
  smile.position.set(0, -0.5, 0.24)
  body.add(smile)
  for (const x of [-0.62, 0.62]) {
    const blush = new Mesh(new CircleGeometry(0.1, 24), new MeshStandardMaterial({ color: '#f2b7a3', roughness: 1, transparent: true, opacity: 0.55 }))
    blush.position.set(x, -0.46, 0.235)
    body.add(blush)
  }
  for (const [x, y] of [[-0.92, 0.55], [0.92, 0.55], [-0.92, -0.55], [0.92, -0.55]]) {
    const sc = new Mesh(new SphereGeometry(0.035, 12, 8), clay('#d9cdbd'))
    sc.position.set(x, y, 0.23)
    body.add(sc)
  }
  return { left, right, spinL, spinR, pupilL, pupilR, body }
}

function props(): Group {
  const g = new Group()
  const plaster = clay('#f4eee5')
  const plinth = new Mesh(new RoundedBoxGeometry(1.5, 1.2, 1.3, 4, 0.05), plaster)
  plinth.position.set(0.7, 0.6, -0.4)
  const plinth2 = new Mesh(new RoundedBoxGeometry(0.9, 1.7, 0.9, 4, 0.05), plaster)
  plinth2.position.set(-3.6, 0.85, -2.6)
  const bubble = new Mesh(new RoundedBoxGeometry(0.8, 0.5, 0.26, 5, 0.2), clay('#cfe0ea', 0.85))
  bubble.position.set(-3.6, 2.0, -2.6)
  bubble.rotation.y = 0.35
  const ball = new Mesh(new SphereGeometry(0.26, 32, 24), clay('#eed6c8'))
  ball.position.set(3.7, 0.26, -1.4)
  const wood = clay('#c9a37c', 0.75)
  const stool = new Group()
  const seat = new Mesh(new CylinderGeometry(0.42, 0.42, 0.08, 40), wood)
  seat.position.y = 1.0
  stool.add(seat)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2
    const leg = new Mesh(new CylinderGeometry(0.035, 0.04, 1.0, 10), wood)
    leg.position.set(Math.cos(a) * 0.28, 0.5, Math.sin(a) * 0.28)
    leg.rotation.set(Math.sin(a) * 0.08, 0, -Math.cos(a) * 0.08)
    stool.add(leg)
  }
  stool.position.set(-2.4, 0, 0.6)
  for (const m of [plinth, plinth2, bubble, ball, seat]) { m.castShadow = true; m.receiveShadow = true }
  stool.children.forEach((c) => { c.castShadow = true })
  g.add(plinth, plinth2, bubble, ball, stool)
  return g
}

export interface Room { stop: () => void; setPlaying: (on: boolean) => void }

export function startRoom(canvas: HTMLCanvasElement, hero: HTMLElement, tier: Tier): Room {
  const mobile = window.matchMedia('(max-width: 760px)').matches
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap

  const scene = new Scene()
  scene.background = new Color('#efe6d8')
  const camera = new PerspectiveCamera(22.9, 1, 0.1, 100)

  const skyMat = new ShaderMaterial({ vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, uniforms: { uTime: { value: 0 } } })
  const sky = new Mesh(new PlaneGeometry(40, 18), skyMat)
  sky.position.set(0, 5, -10)
  scene.add(sky)

  const floor = new Mesh(new PlaneGeometry(30, 20), clay('#e9ddca', 0.95))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)
  const sideL = new Mesh(new PlaneGeometry(14, 8), clay('#e6dac8'))
  sideL.position.set(-8, 4, 2)
  sideL.rotation.y = Math.PI / 2
  sideL.receiveShadow = true
  const sideR = sideL.clone()
  sideR.position.x = 8
  sideR.rotation.y = -Math.PI / 2
  scene.add(sideL, sideR, wall(), bars(), props())

  const face = cassette()
  face.body.position.set(0.7, 1.2 + 0.68, -0.4)
  face.body.rotation.y = -0.16
  scene.add(face.body)

  const hemi = new HemisphereLight('#fff7ec', '#cdb99f', 1.55)
  scene.add(hemi)
  const sun = new DirectionalLight('#fff0d8', 3.3)
  sun.position.set(-4, 8.5, -13)
  sun.target.position.set(1.2, 0, 1.5)
  sun.castShadow = true
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048)
  const sc = sun.shadow.camera
  sc.left = -9; sc.right = 9; sc.top = 9; sc.bottom = -9; sc.near = 1; sc.far = 40
  sun.shadow.bias = -0.0006
  sun.shadow.normalBias = 0.02
  sun.shadow.radius = 4
  scene.add(sun, sun.target)
  const fill = new DirectionalLight('#ffe9d2', 0.55)
  fill.position.set(4, 4, 8)
  scene.add(fill)

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  const ptr = new Vector2()
  const look = new Vector2()
  const onMove = (e: PointerEvent) => { ptr.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1) }
  window.addEventListener('pointermove', onMove, { passive: true })

  let playing = false
  let slide = tier === 'full' ? 5 : 0
  let blinkAt = 3
  let blink = 0
  const portrait = () => camera.aspect < 0.85
  const frame = (dt: number, t: number) => {
    slide = damp(slide, 0, 0.03, dt)
    const r = hero.getBoundingClientRect()
    const k = MathUtils.clamp(-r.top / Math.max(1, r.height), 0, 1)
    look.x = damp(look.x, tier === 'full' ? ptr.x : 0, 0.13, dt)
    look.y = damp(look.y, tier === 'full' ? ptr.y : 0, 0.13, dt)
    const z = (portrait() ? 15.5 : 10.2) - 4 * k
    camera.position.set(0.3 + slide + look.x * 0.13, (portrait() ? 2.6 : 2.25) - 2.4 * k * 0.6 - look.y * 0.04, z)
    camera.lookAt(0.55 + slide * 0.35, (portrait() ? 2.1 : 1.75) - 0.9 * k, -0.6)

    // the face: the eyes follow the pointer, a blink every few seconds, a soft breath
    face.pupilL.position.x = face.pupilR.position.x = look.x * 0.07
    face.pupilL.position.y = face.pupilR.position.y = -look.y * 0.06
    if (t > blinkAt) { blink = 1; blinkAt = t + 2.8 + Math.random() * 3.6 }
    blink = Math.max(0, blink - dt * 7)
    const lid = 1 - Math.sin(blink * Math.PI) * 0.92
    face.left.scale.y = face.right.scale.y = lid
    face.body.scale.y = 1 + Math.sin(t * 1.6) * 0.008
    face.body.rotation.y = -0.16 + look.x * 0.08
    if (playing) { face.spinL.rotation.z -= dt * 3.2; face.spinR.rotation.z -= dt * 3.2 }
    skyMat.uniforms.uTime.value = t
    renderer.render(scene, camera)
  }
  let stopLoop = () => {}
  if (tier === 'still') frame(0, 0)
  else stopLoop = loop(frame)
  canvas.dataset.ready = '1'
  return {
    stop: () => { stopLoop(); ro.disconnect(); window.removeEventListener('pointermove', onMove); renderer.dispose() },
    setPlaying: (on) => { playing = on },
  }
}
