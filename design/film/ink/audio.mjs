// The ink film · the sound. Nothing is recorded and nothing is sampled: the pen's voice is built from the same
// series the picture is drawn from (hand.js), so every scratch belongs to a stroke you can see.
//   the hush      the ball rolling over the sheet: one soft, steady colour of noise. The pen's speed and pressure
//                 make it louder and a touch brighter, never higher; the paper along the line is a slow flutter in
//                 its level (the same millimetre of paper always sounds the same)
//   the desk      the sheet and the table under it, a little warmth under every stroke
//   the touches   a soft, low pat when the ball lands; a lift makes no sound
//   the hand      skin sliding on paper between the strokes
//   the room      a floor of air, so silence is never digital
// The first version grated (Nati, 10.11: "unpleasant to the ear"). It read the paper as sound at the pen's speed, so
// a hiss swept up and down with every stroke, each proud fibre was a click, a lift was a 2.9 kHz tick and a touch
// a hard knock 22 dB over the rest. On a phone's speaker, which loses everything under 400 Hz, only those were
// left. Nothing here sweeps or clicks now: spectrum.py, beside this file, puts numbers on both.
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

// the paper along the line, as a slow rise and fall of the hush's level: one value every 0.9 mm and a finer one
// every 0.31 mm, eased between (at the pen's pace that is a flutter of 15 to 40 a second, under what the ear
// hears as roughness)
const GRAIN = Float32Array.from({ length: 1 << 12 }, white)
const ease = (t) => t * t * (3 - 2 * t)
const bump = (mm) => { const j = Math.floor(mm), n = GRAIN.length; return mix(GRAIN[j % n], GRAIN[(j + 1) % n], ease(mm - j)) }
const paper = (s) => 1 + 0.2 * bump(s / 0.9) + 0.09 * bump(s / 0.31 + 977)

/** Pink noise (Paul Kellet's three poles): equal energy in every octave, the colour of things that rub. */
function pink() {
  let b0 = 0, b1 = 0, b2 = 0
  return () => { const w = white(); b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913; return (b0 + b1 + b2 + w * 0.1848) * 0.22 }
}

// ── the hush ──
const body = [resonator(240, 1.1), resonator(560, 1.3)]
const source = pink(), side = pink()
const lows = [onePole(180), onePole(180)], soft = [onePole(1500), onePole(1500)], open = [onePole(3200), onePole(3200)]
const sideLow = onePole(300), sideSoft = onePole(1800)
let env = 0
const dry = new Float32Array(N), pan = new Float32Array(N), wide = new Float32Array(N)
for (let i = 0; i < N; i++) {
  const j = Math.min(hand.n - 1, Math.round(i * K))
  const on = hand.on[j]
  const v = read(hand.v, i), p = read(hand.p, i), s = read(hand.s, i)
  const want = on ? Math.pow(v / 16, 0.9) * (0.4 + 0.6 * p) : 0
  // it swells in over 7 ms and dies over 23: no stroke begins or ends on an edge
  env += (want - env) * (want > env ? 0.003 : 0.0009)
  let x = source()
  x -= lows[1](lows[0](x)) // the pen and the hand are too light to move the lows
  const dull = soft[1](soft[0](x)), clear = open[1](open[0](x))
  // a fast stroke lets a little more of the top through; the colour itself stays where it is
  const hush = (dull + (0.16 + 0.26 * clamp(v / 45, 0, 1)) * (clear - dull)) * env * paper(s) * (hand.shade[j] ? 0.85 : 1)
  dry[i] = hush * 2.4 + body[0](hush) * 0.75 + body[1](hush) * 0.5
  let y = side()
  y = sideSoft(y - sideLow(y))
  wide[i] = env * y * 0.16 // a little of the hush is different in each ear
  pan[i] = clamp(read(hand.x, i) / 30, -1, 1) * 0.5
}

// ── the touches: the ball lands with a low pat. Nothing bright, nothing sudden ──
const patSoft = onePole(900)
function pat(at, gain) {
  const i0 = Math.round(at * SR)
  for (let k = 0; k < SR * 0.14 && i0 + k < N; k++) {
    const t = k / SR
    const thump = Math.sin(2 * Math.PI * 150 * t) * Math.exp(-t / 0.03) + Math.sin(2 * Math.PI * 310 * t) * Math.exp(-t / 0.02) * 0.6
    const skin = patSoft(white()) * Math.exp(-t / 0.012) * 0.5
    dry[i0 + k] += (thump + skin) * gain * Math.min(1, k / 190) // 4 ms to arrive
  }
}
hand.events.forEach((e, n) => {
  if (e.type === 'touch') pat(e.t, n === 0 ? 0.11 : e.name === 'drop' ? 0.09 : e.kind === 'shade' ? 0.03 : 0.05 + 0.02 * rand())
})

// ── the hand on the paper, and the room ──
const rustleBand = resonator(520, 0.6), rustleSmooth = onePole(3)
const air = [onePole(260), onePole(260)]
let lx = hand.lag.x[0], lz = hand.lag.z[0]
for (let i = 0; i < N; i++) {
  const hx = read(hand.lag.x, i), hz = read(hand.lag.z, i)
  const moving = rustleSmooth(Math.hypot(hx - lx, hz - lz) * SR) // mm a second
  lx = hx; lz = hz
  const t = i / SR
  const here = t > hand.touch - 0.2 && t < hand.written + 0.3 ? 1 : 0
  const rustle = rustleBand(white()) * clamp(moving / 60, 0, 1) * 0.045 * here
  const fade = clamp(t / 0.25, 0, 1) * clamp((hand.duration - t) / 0.6, 0, 1)
  const a = (Math.PI / 4) * (1 + pan[i])
  const d = dry[i] + rustle
  L[i] = (d * Math.cos(a) * 1.3 + wide[i] + air[0](white()) * 0.006) * fade
  R[i] = (d * Math.sin(a) * 1.3 - wide[i] + air[1](white()) * 0.006) * fade
}

// ── a small room: three early reflections, darker and from the other side ──
const dark = [onePole(3200), onePole(3200)]
for (const [ms, gain] of [[11, 0.2], [23, 0.12], [37, 0.07]]) {
  const d = Math.round((ms / 1000) * SR)
  for (let i = N - 1; i >= d; i--) { const l = L[i - d], r = R[i - d]; L[i] += dark[0](r) * gain; R[i] += dark[1](l) * gain }
}

// ── level: set by the strokes, not by the loudest moment. The louder half of the film sits at -28 dBFS; whatever
// would pass -12 dBFS is rounded off, not cut ──
const frame = 2048
const levels = []
for (let i = 0; i + frame <= N; i += frame) { let e = 0; for (let k = 0; k < frame; k++) e += L[i + k] * L[i + k] + R[i + k] * R[i + k]; levels.push(e / (2 * frame)) }
levels.sort((a, b) => a - b)
const loud = levels.slice(Math.floor(levels.length / 2))
const gain = Math.pow(10, -28 / 20) / Math.sqrt(loud.reduce((a, b) => a + b, 0) / loud.length)
const TOP = Math.pow(10, -12 / 20)
const round = (v) => { const a = Math.abs(v); return a < TOP * 0.7 ? v : Math.sign(v) * TOP * (0.7 + 0.3 * Math.tanh((a - TOP * 0.7) / (TOP * 0.3))) }
let peak = 0
for (let i = 0; i < N; i++) { L[i] = round(L[i] * gain) / gain; R[i] = round(R[i] * gain) / gain; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])) }
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
