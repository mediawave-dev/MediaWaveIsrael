// The ink film · the sound. Nothing is recorded and nothing is sampled: the pen's voice is built from the same
// series the picture is drawn from (hand.js), so every scratch belongs to a stroke you can see.
//   the scratch   the ball dragging over the sheet: a hiss whose pitch climbs with the pen's speed, and a grain
//                 read off the paper along the line itself (the same millimetre of paper always sounds the same)
//   the desk      the sheet and the table under it ring a little with every stroke
//   the touches   a soft knock when the ball lands, a tick when it lifts
//   the hand      skin sliding on paper between the strokes
//   the room      a floor of air, so silence is never digital
// node audio.mjs G:/tmp/ink/ink.wav   (48 kHz, 16 bit, stereo)
import { writeFile } from 'node:fs/promises'
import { buildHand, DT } from './hand.js'

const out = process.argv[2] ?? 'ink.wav'
const SR = 48000
const hand = buildHand()
const N = Math.round(hand.duration * SR)
const L = new Float32Array(N), R = new Float32Array(N)

function mulberry(seed) {
  let a = seed >>> 0
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
const rand = mulberry(1110)
const white = () => rand() * 2 - 1
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const mix = (a, b, t) => a + (b - a) * t

/** The hand's series at an audio sample. */
const K = 1 / (DT * SR)
const read = (arr, i) => { const f = Math.min(hand.n - 1.001, i * K), j = Math.floor(f); return mix(arr[j], arr[j + 1], f - j) }

/** A two-pole resonator (RBJ band-pass, constant peak). */
function resonator(freq, q) {
  const w = (2 * Math.PI * freq) / SR, alpha = Math.sin(w) / (2 * q)
  const b0 = alpha, a0 = 1 + alpha, a1 = -2 * Math.cos(w), a2 = 1 - alpha
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0
  return (x) => { const y = (b0 * x - b0 * x2 - a1 * y1 - a2 * y2) / a0; x2 = x1; x1 = x; y2 = y1; y1 = y; return y }
}
function onePole(freq) { const k = 1 - Math.exp((-2 * Math.PI * freq) / SR); let y = 0; return (x) => (y += (x - y) * k) }

// the paper along the line: one value every 2.5 microns. Read at eight scales it is a rough surface (big bumps
// tall, small ones low), and the pen's speed turns its millimetres into pitch: a fast stroke is a bright one
const GRAIN = Float32Array.from({ length: 1 << 17 }, white)
const table = (pos) => { const f = pos % GRAIN.length, j = Math.floor(f); return mix(GRAIN[j], GRAIN[(j + 1) % GRAIN.length], f - j) }
const OCTAVES = Array.from({ length: 8 }, (_, o) => ({ step: 400 / 2 ** o, amp: Math.pow(2 ** o, 0.26), shift: o * 9973 }))
const NORM = 1 / Math.sqrt(OCTAVES.reduce((a, o) => a + o.amp * o.amp, 0))
// the proud fibres: every so often the ball climbs one and drops off it
const HOPS = (() => {
  const at = []
  for (let mm = 0.1; mm < 200; mm += 0.07 + rand() * 0.42) at.push(mm)
  return at
})()

// ── the scratch ──
const body = [resonator(190, 3.5), resonator(430, 4.5), resonator(940, 3)]
const lows = [onePole(240), onePole(240)], airy = [onePole(7200), onePole(7200)]
let low = 0, band = 0 // a thin band of hiss over the grain
let env = 0, hop = 0, pop = 0
const dry = new Float32Array(N), pan = new Float32Array(N), wide = new Float32Array(N)
for (let i = 0; i < N; i++) {
  const on = hand.on[Math.min(hand.n - 1, Math.round(i * K))]
  const v = read(hand.v, i), p = read(hand.p, i), s = read(hand.s, i)
  const shade = hand.shade[Math.min(hand.n - 1, Math.round(i * K))]
  const want = on ? Math.pow(v / 16, 1.05) * (0.34 + 0.66 * p) : 0
  env += (want - env) * (want > env ? 0.012 : 0.0018)
  let rough = 0
  for (const o of OCTAVES) rough += table(s * o.step + o.shift) * o.amp
  rough *= NORM
  // the pen and the hand are too light to move the lows: the grain loses everything under 240 Hz
  rough -= lows[1](lows[0](rough))
  const fc = clamp(2600 + 140 * v, 2000, 7200)
  const f = 2 * Math.sin((Math.PI * fc) / SR)
  low += f * band
  band += f * (white() - low - 1.25 * band)
  while (hop < HOPS.length && HOPS[hop] <= s) { if (on) pop += (0.25 + 0.75 * rand()) * (rand() < 0.5 ? 1 : -1) * Math.min(1.4, v / 12); hop++ }
  pop *= 0.72 // each hop is a click a few samples long
  const scratch = airy[1](airy[0](env * (1.5 * rough + 0.22 * band) + pop * 0.5 * (0.3 + 0.7 * p))) * (shade ? 0.85 : 1)
  const ring = body[0](scratch) * 0.5 + body[1](scratch) * 0.42 + body[2](scratch) * 0.3
  dry[i] = scratch + ring
  wide[i] = env * band * 0.05 // a little of the hiss is different in each ear
  pan[i] = clamp(read(hand.x, i) / 30, -1, 1) * 0.5
}

// ── the touches and the lifts ──
function knock(at, gain, bright) {
  const i0 = Math.round(at * SR)
  const parts = [[150, 0.034, 1], [330, 0.022, 0.55], [1900 * bright, 0.004, 0.32]]
  for (let k = 0; k < SR * 0.16 && i0 + k < N; k++) {
    const t = k / SR
    let y = 0
    for (const [fq, decay, amp] of parts) y += Math.sin(2 * Math.PI * fq * t) * Math.exp(-t / decay) * amp
    if (k < 110) y += white() * (1 - k / 110) * 0.5
    dry[i0 + k] += y * gain * Math.min(1, k / 12)
  }
}
function tick(at, gain) {
  const i0 = Math.round(at * SR)
  for (let k = 0; k < SR * 0.02 && i0 + k < N; k++) {
    const t = k / SR
    dry[i0 + k] += (Math.sin(2 * Math.PI * 2900 * t) * 0.5 + white() * 0.5) * Math.exp(-t / 0.0028) * gain
  }
}
hand.events.forEach((e, n) => {
  if (e.type === 'touch') knock(e.t, n === 0 ? 0.3 : e.name === 'drop' ? 0.24 : e.kind === 'shade' ? 0.1 : 0.16 + 0.05 * rand(), 0.85 + 0.3 * rand())
  else tick(e.t, 0.035 + 0.02 * rand())
})

// ── the hand on the paper, and the room ──
const rustleBand = resonator(620, 0.7), rustleSmooth = onePole(3)
const air = [onePole(260), onePole(260)]
let lx = hand.lag.x[0], lz = hand.lag.z[0]
for (let i = 0; i < N; i++) {
  const hx = read(hand.lag.x, i), hz = read(hand.lag.z, i)
  const moving = rustleSmooth(Math.hypot(hx - lx, hz - lz) * SR) // mm a second
  lx = hx; lz = hz
  const t = i / SR
  const here = t > hand.touch - 0.2 && t < hand.written + 0.3 ? 1 : 0
  const rustle = rustleBand(white()) * clamp(moving / 60, 0, 1) * 0.11 * here
  const fade = clamp(t / 0.25, 0, 1) * clamp((hand.duration - t) / 0.6, 0, 1)
  const a = (Math.PI / 4) * (1 + pan[i])
  const d = dry[i] + rustle
  L[i] = (d * Math.cos(a) * 1.3 + wide[i] + air[0](white()) * 0.012) * fade
  R[i] = (d * Math.sin(a) * 1.3 - wide[i] + air[1](white()) * 0.012) * fade
}

// ── a small room: three early reflections, darker and from the other side ──
const dark = [onePole(3200), onePole(3200)]
for (const [ms, gain] of [[11, 0.2], [23, 0.12], [37, 0.07]]) {
  const d = Math.round((ms / 1000) * SR)
  for (let i = N - 1; i >= d; i--) { const l = L[i - d], r = R[i - d]; L[i] += dark[0](r) * gain; R[i] += dark[1](l) * gain }
}

// ── level: the loudest scratch at -4 dBFS ──
let peak = 0
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
const gain = 0.63 / peak
const pcm = Buffer.alloc(44 + N * 4)
pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + N * 4, 4); pcm.write('WAVEfmt ', 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22)
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(N * 4, 40)
for (let i = 0; i < N; i++) {
  // a hair of dither, so the quiet tail does not step
  pcm.writeInt16LE(Math.round(clamp(L[i] * gain + (rand() - rand()) / 65536, -1, 1) * 32767), 44 + i * 4)
  pcm.writeInt16LE(Math.round(clamp(R[i] * gain + (rand() - rand()) / 65536, -1, 1) * 32767), 46 + i * 4)
}
await writeFile(out, pcm)
process.stdout.write(`${out} · ${hand.duration.toFixed(2)} s · peak ${(20 * Math.log10(peak * gain)).toFixed(1)} dBFS\n`)
