// sea · the music (D137, D142, D143): an original lo-fi track composed live in the browser with WebAudio
// (no files, no samples, nobody else's song), the calm and much loved "lo-fi chill" style, and the field
// moves with it. On by default (Nati), but browsers allow sound only after the visitor's first tap, click
// or key: until then it is armed, and on that first gesture it fades in over a few seconds at a low
// level, so open speakers are never startled. The header pill's control turns it off for the rest of the
// visit (sessionStorage; WCAG 1.4.2: a control at the top of every page).
//   the beat    a soft swung boom-bap at 78 beats a minute: kick, snare, brushed hats
//   the keys    an electric piano on a four-bar loop (Dm9, G13, Cmaj9, Am9), strummed, with tremolo
//   the bass    a round bass on the roots, with a passing note
//   the tape    vinyl crackle, a little tape wow on the keys, everything under a warm lowpass (our
//               cassettes, heard), and a faint sea under it all
//   the deck    small tape-machine sounds for the site's moments (the services counter, the rewind, the
//               lead's chime, the WhatsApp key's pop, the form's keys)
// The field listens (field.ts): every kick and snare sends a soft ring through the dots from the shape on
// screen, and the music's level makes the dots breathe. The context is suspended while the tab is hidden.

type Listener = (on: boolean) => void
type NoteListener = (velocity: number) => void

let ctx: AudioContext | null = null
let master: GainNode | null = null
let keysBus: GainNode | null = null
let drums: GainNode | null = null
let warm: BiquadFilterNode | null = null
let wow: GainNode | null = null
let analyser: AnalyserNode | null = null
let seaGain: GainNode | null = null
let noise: AudioBuffer | null = null
/** the visitor's choice (armed by default); running = the context is actually playing */
let on = (() => { try { return sessionStorage.getItem('mw-sound') !== 'off' } catch { return true } })()
let running = false
/** the level the music settles at: low, under the page */
const LEVEL = 0.42
const BPM = 78
const SWING = 0.09
const listeners = new Set<Listener>()
const noteListeners = new Set<NoteListener>()
let lastY = 0
let speed = 0
let raf = 0
let lastTick = 0
let scheduler = 0
let nextStep = 0
let stepN = 0
let levelBuf: Uint8Array | null = null

const N = (m: number) => 440 * Math.pow(2, (m - 69) / 12)
/** the loop: ii, V, I, vi in C, voiced open and rootless (MIDI); one chord a bar */
const LOOP: { bass: number; keys: number[]; lead: number[] }[] = [
  { bass: 38, keys: [53, 57, 60, 64], lead: [69, 72, 74, 76] },  // Dm9: F A C E over D
  { bass: 43, keys: [53, 59, 64, 69], lead: [71, 74, 76, 79] },  // G13: F B E A over G
  { bass: 36, keys: [52, 55, 59, 62], lead: [67, 71, 72, 76] },  // Cmaj9: E G B D over C
  { bass: 45, keys: [48, 52, 55, 59], lead: [69, 72, 76, 79] },  // Am9: C E G B over A
]
/** each chapter tints the tape: a warmer or a slightly brighter lowpass */
const TINT: Record<string, number> = { horizon: 3200, laptop: 3800, landing: 4200, seo: 4200, chat: 4000, reels: 2800, memory: 3000, bubble: 3600, quiet: 3300 }
let currentScene = 'horizon'

export const isOn = () => on
export const isRunning = () => running
export function onChange(fn: Listener) { listeners.add(fn); return () => { listeners.delete(fn) } }
/** the field subscribes to the beat (each hit's strength, 0..1, at the moment it sounds) */
export function onNote(fn: NoteListener) { noteListeners.add(fn); return () => { noteListeners.delete(fn) } }
const emit = () => listeners.forEach((fn) => fn(on))

/** The music's level now (0..1), for the dots' breathing. */
export function level(): number {
  if (!running || !analyser || !levelBuf) return 0
  analyser.getByteTimeDomainData(levelBuf)
  let s = 0
  for (let i = 0; i < levelBuf.length; i++) { const v = (levelBuf[i] - 128) / 128; s += v * v }
  return Math.min(1, Math.sqrt(s / levelBuf.length) * 9)
}

function noiseBuffer(c: AudioContext, seconds: number, pink: boolean): AudioBuffer {
  const b = c.createBuffer(2, Math.floor(c.sampleRate * seconds), c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch)
    let b0 = 0, b1 = 0, b2 = 0
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1
      if (!pink) { d[i] = w; continue }
      // pinkish noise (Paul Kellet's economy filter): softer than white, like water
      b0 = 0.99765 * b0 + w * 0.099046
      b1 = 0.963 * b1 + w * 0.2965164
      b2 = 0.57 * b2 + w * 1.0526913
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.16
    }
  }
  return b
}

/** vinyl: sparse clicks and a low hiss, looped */
function crackleBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(c.sampleRate * seconds)
  const b = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.012
    for (let k = 0; k < seconds * 7; k++) {
      const at = Math.floor(Math.random() * (len - 40))
      const amp = 0.25 + Math.random() * 0.5
      for (let j = 0; j < 30; j++) d[at + j] += (Math.random() * 2 - 1) * amp * Math.exp(-j / 6)
    }
  }
  return b
}

function room(c: AudioContext, seconds = 2.2, decay = 3): AudioBuffer {
  const len = Math.floor(c.sampleRate * seconds)
  const b = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
  }
  return b
}

function lfo(c: AudioContext, hz: number, depth: number, target: AudioParam): GainNode {
  const o = c.createOscillator()
  o.frequency.value = hz
  const g = c.createGain()
  g.gain.value = depth
  o.connect(g).connect(target)
  o.start()
  return g
}

function build(c: AudioContext) {
  master = c.createGain()
  master.gain.value = 0
  const comp = c.createDynamicsCompressor()
  comp.threshold.value = -20
  comp.ratio.value = 3
  master.connect(comp).connect(c.destination)
  analyser = c.createAnalyser()
  analyser.fftSize = 512
  levelBuf = new Uint8Array(analyser.fftSize)
  master.connect(analyser)
  noise = noiseBuffer(c, 2, false)

  // the tape: everything musical goes through a warm lowpass, with a small room
  warm = c.createBiquadFilter()
  warm.type = 'lowpass'
  warm.frequency.value = TINT.horizon
  warm.Q.value = 0.4
  warm.connect(master)
  const verb = c.createConvolver()
  verb.buffer = room(c)
  const wet = c.createGain()
  wet.gain.value = 0.28
  verb.connect(wet).connect(master)

  // the keys' bus: tremolo, a send into the room, and a wow source for each voice's detune
  keysBus = c.createGain()
  keysBus.gain.value = 1
  const trem = c.createGain()
  trem.gain.value = 0.88
  lfo(c, 4.6, 0.1, trem.gain)
  keysBus.connect(trem).connect(warm)
  trem.connect(verb)
  const wowSrc = c.createOscillator()
  wowSrc.frequency.value = 0.42
  wow = c.createGain()
  wow.gain.value = 9
  wowSrc.connect(wow)
  wowSrc.start()

  // the drums: their own bus into the same tape
  drums = c.createGain()
  drums.gain.value = 0.7
  drums.connect(warm)

  // vinyl crackle
  const vinyl = c.createBufferSource()
  vinyl.buffer = crackleBuffer(c, 5)
  vinyl.loop = true
  const vf = c.createBiquadFilter()
  vf.type = 'highpass'
  vf.frequency.value = 900
  const vg = c.createGain()
  vg.gain.value = 0.05
  vinyl.connect(vf).connect(vg).connect(master)
  vinyl.start()

  // the sea: faint, under everything
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c, 6, true)
  src.loop = true
  const seaF = c.createBiquadFilter()
  seaF.type = 'lowpass'
  seaF.frequency.value = 420
  seaF.Q.value = 0.5
  seaGain = c.createGain()
  seaGain.gain.value = 0.035
  const swell = c.createGain()
  swell.gain.value = 0.7
  src.connect(seaF).connect(swell).connect(seaGain).connect(master)
  lfo(c, 1 / 11, 220, seaF.frequency)
  lfo(c, 1 / 11, 0.3, swell.gain)
  src.start()
}

/** the beat answers in the dots, when the hit sounds */
function answer(t: number, v: number) {
  if (!ctx) return
  window.setTimeout(() => { if (running) noteListeners.forEach((fn) => fn(v)) }, Math.max(0, (t - ctx.currentTime) * 1000))
}

function kick(t: number, v: number) {
  if (!ctx || !drums || !keysBus) return
  const o = ctx.createOscillator()
  o.frequency.setValueAtTime(130, t)
  o.frequency.exponentialRampToValueAtTime(48, t + 0.12)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.55 * v, t + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38)
  o.connect(g).connect(drums)
  o.start(t)
  o.stop(t + 0.42)
  // the keys breathe out of the kick's way
  keysBus.gain.setValueAtTime(0.62, t)
  keysBus.gain.setTargetAtTime(1, t + 0.02, 0.09)
  answer(t, 0.85 * v)
}

function noiseHit(t: number, type: BiquadFilterType, hz: number, q: number, gain: number, dur: number) {
  if (!ctx || !drums || !noise) return
  const s = ctx.createBufferSource()
  s.buffer = noise
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.value = hz
  f.Q.value = q
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.003)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  s.connect(f).connect(g).connect(drums)
  s.start(t, Math.random() * 1.5)
  s.stop(t + dur + 0.02)
}

function snare(t: number, v: number) {
  if (!ctx || !drums) return
  noiseHit(t, 'bandpass', 1900, 0.7, 0.32 * v, 0.2)
  const o = ctx.createOscillator()
  o.frequency.setValueAtTime(200, t)
  o.frequency.exponentialRampToValueAtTime(160, t + 0.08)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.12 * v, t + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
  o.connect(g).connect(drums)
  o.start(t)
  o.stop(t + 0.15)
  answer(t, 0.5 * v)
}

const hat = (t: number, v: number, open = false) => noiseHit(t, 'highpass', 7600, 0.6, 0.06 * v, open ? 0.22 : 0.045)

/** an electric piano voice: a sine and a soft bell partial, a quick attack, a long fall, a little wow */
function key(m: number, t: number, v: number, dur: number) {
  if (!ctx || !keysBus || !wow) return
  for (const [mul, g0] of [[1, 1], [2, 0.22], [3.98, 0.05]] as const) {
    const o = ctx.createOscillator()
    o.frequency.value = N(m) * mul
    wow.connect(o.detune)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.045 * v * g0, t + 0.006)
    g.gain.exponentialRampToValueAtTime(0.018 * v * g0, t + 0.35)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(keysBus)
    o.start(t)
    o.stop(t + dur + 0.05)
  }
}

function bass(m: number, t: number, dur: number) {
  if (!ctx || !warm) return
  const o = ctx.createOscillator()
  o.type = 'triangle'
  o.frequency.value = N(m)
  const f = ctx.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = 420
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.06, t + dur * 0.6)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(f).connect(g).connect(warm)
  o.start(t)
  o.stop(t + dur + 0.05)
}

/** one sixteenth of the loop at time t: the pattern of a bar, swung */
function play16(i: number, t: number) {
  const bar = Math.floor(i / 16) % LOOP.length
  const s = i % 16
  const chord = LOOP[bar]
  const beat = 60 / BPM
  // the beat
  if (s === 0 || s === 10) kick(t, s === 0 ? 1 : 0.8)
  if (s === 7 && Math.random() < 0.35) kick(t, 0.5)
  if (s === 4 || s === 12) snare(t, 1)
  if (s === 15 && Math.random() < 0.3) snare(t, 0.3)
  if (s % 2 === 0) hat(t, s % 4 === 0 ? 0.9 : 0.55, s === 14 && Math.random() < 0.3)
  // the keys: a strummed chord on the bar, a soft answer on its third beat
  if (s === 0) chord.keys.forEach((m, k) => key(m, t + k * 0.022, 0.9, beat * 3.6))
  if (s === 8 && Math.random() < 0.5) chord.keys.slice(1).forEach((m, k) => key(m, t + k * 0.03, 0.55, beat * 1.8))
  // a few notes of melody, high and sparse
  if ((s === 6 || s === 14) && Math.random() < 0.32) key(chord.lead[Math.floor(Math.random() * chord.lead.length)], t, 0.6, beat * 1.6)
  // the bass: the root on the bar, a passing note before the next
  if (s === 0) bass(chord.bass, t, beat * 1.7)
  if (s === 11) bass(chord.bass + (Math.random() < 0.5 ? 7 : 12), t, beat * 0.6)
}

function schedule() {
  if (!ctx || !running) return
  const sixteenth = 60 / BPM / 4
  while (nextStep < ctx.currentTime + 0.25) {
    // swing: every second eighth comes a little late
    const late = stepN % 4 === 2 ? SWING * (60 / BPM) : 0
    play16(stepN, nextStep + late)
    stepN++
    nextStep += sixteenth
  }
}

/** scroll speed raises the sea a little (eased), like the field's ripple */
function follow() {
  raf = 0
  if (!on || !ctx || !seaGain) return
  const y = window.scrollY
  speed = speed * 0.9 + Math.min(1, Math.abs(y - lastY) / 60) * 0.1
  lastY = y
  seaGain.gain.setTargetAtTime(0.035 + speed * 0.05, ctx.currentTime, 0.3)
  if (speed > 0.002) raf = requestAnimationFrame(follow)
}
const wakeFollow = () => { if (on && !raf) raf = requestAnimationFrame(follow) }

function tint(name: string) {
  if (!ctx || !warm) return
  warm.frequency.setTargetAtTime(TINT[name] ?? TINT.quiet, ctx.currentTime, 1.4)
}
const onScene = (e: Event) => { currentScene = (e as CustomEvent<string>).detail; tint(currentScene) }
const onHidden = () => { if (!ctx) return; if (document.hidden) void ctx.suspend(); else if (on && running) void ctx.resume() }

/** a short voice: a sine (or a glide) with an exponential tail */
function blip(f0: number, f1: number, dur: number, gain: number, type: OscillatorType = 'sine', at = 0) {
  if (!running || !ctx || !master) return
  const t = ctx.currentTime + at
  const o = ctx.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(f0, t)
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.6)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(master)
  o.start(t)
  o.stop(t + dur + 0.05)
}

/** the deck's counter: a dry little tick */
export function tick() {
  const now = performance.now()
  if (now - lastTick < 90) return
  lastTick = now
  blip(2200, 1800, 0.05, 0.03, 'square')
}
/** a key of the contact form: fainter than the counter */
export function typeKey() {
  const now = performance.now()
  if (now - lastTick < 60) return
  lastTick = now
  blip(3200 + Math.random() * 600, 2800, 0.025, 0.012, 'square')
}
/** the WhatsApp key's mark arrives */
export const pop = () => blip(520, 900, 0.16, 0.045)
/** the lead rises out of the laptop: two soft notes, a fifth apart */
export function chime() { blip(N(76), N(76), 0.9, 0.04, 'sine'); blip(N(83), N(83), 1.1, 0.03, 'sine', 0.14) }
/** the rewind: a tape whirring back, then the deck stopping */
export function rewind(seconds: number) {
  if (!running || !ctx || !master) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  o.type = 'sawtooth'
  o.frequency.setValueAtTime(90, t)
  o.frequency.exponentialRampToValueAtTime(380, t + seconds * 0.5)
  o.frequency.exponentialRampToValueAtTime(140, t + seconds)
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.value = 900
  f.Q.value = 2
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.022, t + 0.2)
  g.gain.setTargetAtTime(0.0001, t + seconds - 0.15, 0.08)
  o.connect(f).connect(g).connect(master)
  o.start(t)
  o.stop(t + seconds + 0.4)
  blip(110, 70, 0.12, 0.06, 'sine', seconds)
}

function ensure(): boolean {
  if (ctx) return true
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return false
  ctx = new AC()
  build(ctx)
  window.addEventListener('sea:scene', onScene)
  window.addEventListener('scroll', wakeFollow, { passive: true })
  document.addEventListener('visibilitychange', onHidden)
  return true
}

/** Start playing (inside a user gesture): a slow fade in, from silence to a low level. */
function play(fade = 1.4) {
  if (!ensure() || !ctx || !master) return
  void ctx.resume()
  const t = ctx.currentTime
  master.gain.cancelScheduledValues(t)
  master.gain.setValueAtTime(master.gain.value, t)
  master.gain.setTargetAtTime(LEVEL, t, fade)
  lastY = window.scrollY
  tint(currentScene)
  running = true
  nextStep = t + 0.4
  stepN = 0
  window.clearInterval(scheduler)
  scheduler = window.setInterval(schedule, 60)
  emit()
}

function quiet() {
  if (!ctx || !master) return
  const t = ctx.currentTime
  master.gain.cancelScheduledValues(t)
  master.gain.setTargetAtTime(0, t, 0.25)
  window.clearInterval(scheduler)
  window.setTimeout(() => { if (!on) void ctx?.suspend() }, 1200)
  running = false
}

/** The pill's control: off, or on again (a click is the gesture browsers require). */
export function toggle() {
  on = !on
  try { if (on) sessionStorage.removeItem('mw-sound'); else sessionStorage.setItem('mw-sound', 'off') } catch { /* private mode */ }
  if (on) play(0.8)
  else quiet()
  emit()
}

/** Armed: the first tap, click or key of the visit starts the music, slowly (about four seconds). */
export function arm() {
  const events = ['pointerdown', 'keydown', 'touchend'] as const
  const first = (e: Event) => {
    // the pill's own control handles its press itself
    if ((e.target as Element | null)?.closest?.('.mw-head__sound')) return
    events.forEach((n) => window.removeEventListener(n, first, true))
    if (on && !running) play(1.5)
  }
  events.forEach((n) => window.addEventListener(n, first, { capture: true, passive: true }))
  return () => events.forEach((n) => window.removeEventListener(n, first, true))
}

if (typeof window !== 'undefined') window.addEventListener('sea:scene', (e) => { currentScene = (e as CustomEvent<string>).detail })

/** The small hooks: the WhatsApp key's mark pops as it arrives, and the contact form's keys click
    faintly. Delegated on the document, so every page's keys and forms are covered. */
export function hooks() {
  const disarm = arm()
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  let timer = 0
  const over = (e: PointerEvent) => {
    if (!running || !fine) return
    const k = (e.target as Element | null)?.closest?.('a.key[href*="wa.me"]')
    if (!k || (e.relatedTarget instanceof Node && k.contains(e.relatedTarget))) return
    window.clearTimeout(timer)
    timer = window.setTimeout(pop, 300)
  }
  const typed = (e: Event) => { if (running && (e.target as Element | null)?.closest?.('#contact, .lm__card')) typeKey() }
  document.addEventListener('pointerover', over)
  document.addEventListener('input', typed)
  return () => { disarm(); window.clearTimeout(timer); document.removeEventListener('pointerover', over); document.removeEventListener('input', typed) }
}

// a probe for the cross-browser checks (state only, no control): is the context playing?
if (typeof window !== 'undefined') (window as unknown as { __seaSound?: unknown }).__seaSound = { isOn, isRunning, level, state: () => ctx?.state ?? 'none' }
