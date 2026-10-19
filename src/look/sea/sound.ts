// sea · the music (D137, D142): a calm piece composed live in the browser with WebAudio (no files, no
// stock loops), and the field moves with it. On by default (Nati), but browsers allow sound only after
// the visitor's first tap, click or key: until then it is armed, and on that first gesture it fades in
// over a few seconds at a low level, so open speakers are never startled. The header pill's control turns
// it off for the rest of the visit (sessionStorage; WCAG 1.4.2: a control at the top of every page).
//   the bells   soft bell notes at 64 beats a minute, a slow random walk on a pentatonic scale built on
//               the current chapter's chord, through a long synthetic room
//   the pad     a quiet open chord that glides to a new chord in each chapter (the field's shapes)
//   the bass    one low note every four bars, on the chord's root
//   the sea     faint filtered noise that swells like a wave and rises a little with the scroll speed
//   the deck    small tape-machine sounds for the site's moments (the services counter, the rewind, the
//               lead's chime, the WhatsApp key's pop, the form's keys)
// The field listens (field.ts): every bell sends a soft ring through the dots from the current shape,
// and the music's level makes the dots breathe. The context is suspended while the tab is hidden.

type Listener = (on: boolean) => void
type NoteListener = (velocity: number) => void

let ctx: AudioContext | null = null
let master: GainNode | null = null
let music: GainNode | null = null
let analyser: AnalyserNode | null = null
let seaGain: GainNode | null = null
let padOsc: OscillatorNode[] = []
/** the visitor's choice (armed by default); running = the context is actually playing */
let on = (() => { try { return sessionStorage.getItem('mw-sound') !== 'off' } catch { return true } })()
let running = false
/** the level the music settles at: low, under the page */
const LEVEL = 0.4
const BPM = 64
const listeners = new Set<Listener>()
const noteListeners = new Set<NoteListener>()
let lastY = 0
let speed = 0
let raf = 0
let lastTick = 0
let scheduler = 0
let nextBeat = 0
let beat = 0
let step = 2
let levelBuf: Uint8Array | null = null

const N = (m: number) => 440 * Math.pow(2, (m - 69) / 12)
/** chords per scene (MIDI), open add9 voicings: nothing that pulls */
const CHORDS: Record<string, number[]> = {
  horizon: [50, 57, 64, 66],  // D3 A3 E4 F#4
  laptop: [47, 54, 61, 62],   // B2 F#3 C#4 D4
  landing: [55, 62, 69, 71],  // G3 D4 A4 B4
  seo: [52, 59, 66, 68],      // E3 B3 F#4 G#4
  chat: [57, 64, 71, 73],     // A3 E4 B4 C#5
  reels: [43, 50, 57, 59],    // G2 D3 A3 B3
  memory: [45, 52, 59, 61],   // A2 E3 B3 C#4
  bubble: [50, 57, 64, 69],   // D3 A3 E4 A4
  quiet: [50, 57, 62, 64],    // D3 A3 D4 E4
}
/** the pentatonic steps over the chord's root (major pentatonic: calm, no half steps) */
const PENTA = [0, 2, 4, 7, 9]
let currentScene = 'horizon'

export const isOn = () => on
export const isRunning = () => running
export function onChange(fn: Listener) { listeners.add(fn); return () => { listeners.delete(fn) } }
/** the field subscribes to the bells (each note's velocity, 0..1, at the moment it sounds) */
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

function noiseBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const b = c.createBuffer(2, Math.floor(c.sampleRate * seconds), c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch)
    // pinkish noise (Paul Kellet's economy filter): softer than white, like water
    let b0 = 0, b1 = 0, b2 = 0
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99765 * b0 + w * 0.099046
      b1 = 0.963 * b1 + w * 0.2965164
      b2 = 0.57 * b2 + w * 1.0526913
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.16
    }
  }
  return b
}

/** a room: stereo noise that dies away, for a convolver */
function room(c: AudioContext, seconds = 3.4, decay = 2.8): AudioBuffer {
  const len = Math.floor(c.sampleRate * seconds)
  const b = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
  }
  return b
}

function lfo(c: AudioContext, hz: number, depth: number, target: AudioParam) {
  const o = c.createOscillator()
  o.frequency.value = hz
  const g = c.createGain()
  g.gain.value = depth
  o.connect(g).connect(target)
  o.start()
}

function build(c: AudioContext) {
  master = c.createGain()
  master.gain.value = 0
  const comp = c.createDynamicsCompressor()
  comp.threshold.value = -22
  comp.ratio.value = 3
  master.connect(comp).connect(c.destination)
  analyser = c.createAnalyser()
  analyser.fftSize = 512
  levelBuf = new Uint8Array(analyser.fftSize)
  master.connect(analyser)

  // the music's bus: dry, and a send into the room
  music = c.createGain()
  music.gain.value = 1
  music.connect(master)
  const verb = c.createConvolver()
  verb.buffer = room(c)
  const send = c.createGain()
  send.gain.value = 0.62
  const wet = c.createGain()
  wet.gain.value = 0.7
  music.connect(send).connect(verb).connect(wet).connect(master)

  // the sea: faint, under everything
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c, 6)
  src.loop = true
  const seaF = c.createBiquadFilter()
  seaF.type = 'lowpass'
  seaF.frequency.value = 420
  seaF.Q.value = 0.5
  seaGain = c.createGain()
  seaGain.gain.value = 0.06
  const swell = c.createGain()
  swell.gain.value = 0.7
  src.connect(seaF).connect(swell).connect(seaGain).connect(master)
  lfo(c, 1 / 11, 220, seaF.frequency)
  lfo(c, 1 / 11, 0.3, swell.gain)
  src.start()

  // the pad: four sine voices, a slow vibrato, warm
  const padF = c.createBiquadFilter()
  padF.type = 'lowpass'
  padF.frequency.value = 900
  padF.Q.value = 0.3
  const pad = c.createGain()
  pad.gain.value = 0.03
  padF.connect(pad).connect(music)
  padOsc = CHORDS.horizon.map((m, i) => {
    const o = c.createOscillator()
    o.type = 'sine'
    o.frequency.value = N(m)
    o.detune.value = (i - 1.5) * 4
    lfo(c, 0.06 + i * 0.011, 3, o.detune)
    const g = c.createGain()
    g.gain.value = [0.55, 0.4, 0.26, 0.2][i]
    o.connect(g).connect(padF)
    o.start()
    return o
  })
}

/** one bell: a fundamental and two soft partials with a long tail */
function bell(freq: number, t: number, vel: number) {
  if (!ctx || !music) return
  const parts: [number, number, number][] = [[1, 1, 2.6], [2.0, 0.24, 1.4], [3.01, 0.07, 0.8]]
  for (const [mul, g0, dur] of parts) {
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = freq * mul
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.05 * vel * g0, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(music)
    o.start(t)
    o.stop(t + dur + 0.05)
  }
  // the dots answer when the note sounds
  window.setTimeout(() => { if (running) noteListeners.forEach((fn) => fn(vel)) }, Math.max(0, (t - ctx.currentTime) * 1000))
}

function bass(freq: number, t: number) {
  if (!ctx || !music) return
  const o = ctx.createOscillator()
  o.type = 'sine'
  o.frequency.value = freq
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.05, t + 0.05)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2)
  o.connect(g).connect(music)
  o.start(t)
  o.stop(t + 3.3)
}

/** a slow random walk on the pentatonic scale over the current chord's root, two octaves up */
function nextNote(): number {
  const root = (CHORDS[currentScene] ?? CHORDS.quiet)[0]
  step = Math.max(0, Math.min(9, step + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]))
  const octave = Math.floor(step / 5)
  return N(root + 24 + octave * 12 + PENTA[step % 5])
}

function schedule() {
  if (!ctx || !running) return
  const spb = 60 / BPM
  while (nextBeat < ctx.currentTime + 0.3) {
    const bar = beat % 4
    if (Math.random() < (bar === 0 ? 0.9 : bar === 2 ? 0.55 : 0.32)) bell(nextNote(), nextBeat, 0.55 + Math.random() * 0.45)
    if (beat % 16 === 0) bass(N((CHORDS[currentScene] ?? CHORDS.quiet)[0] - 12), nextBeat)
    beat++
    nextBeat += spb
  }
}

/** scroll speed raises the sea a little (eased), like the field's ripple */
function follow() {
  raf = 0
  if (!on || !ctx || !seaGain) return
  const y = window.scrollY
  speed = speed * 0.9 + Math.min(1, Math.abs(y - lastY) / 60) * 0.1
  lastY = y
  seaGain.gain.setTargetAtTime(0.06 + speed * 0.08, ctx.currentTime, 0.3)
  if (speed > 0.002) raf = requestAnimationFrame(follow)
}
const wakeFollow = () => { if (on && !raf) raf = requestAnimationFrame(follow) }

function chord(name: string) {
  if (!ctx || !padOsc.length) return
  const c = CHORDS[name] ?? CHORDS.quiet
  const t = ctx.currentTime
  padOsc.forEach((o, i) => o.frequency.setTargetAtTime(N(c[i]), t, 1.2))
}
const onScene = (e: Event) => { currentScene = (e as CustomEvent<string>).detail; chord(currentScene) }
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
  blip(2200, 1800, 0.05, 0.035, 'square')
}
/** a key of the contact form: fainter than the counter */
export function key() {
  const now = performance.now()
  if (now - lastTick < 60) return
  lastTick = now
  blip(3200 + Math.random() * 600, 2800, 0.025, 0.014, 'square')
}
/** the WhatsApp key's mark arrives */
export const pop = () => blip(520, 900, 0.16, 0.05)
/** the lead rises out of the laptop: two soft notes, a fifth apart */
export function chime() { blip(N(76), N(76), 0.9, 0.045, 'sine'); blip(N(83), N(83), 1.1, 0.035, 'sine', 0.14) }
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
  g.gain.exponentialRampToValueAtTime(0.025, t + 0.2)
  g.gain.setTargetAtTime(0.0001, t + seconds - 0.15, 0.08)
  o.connect(f).connect(g).connect(master)
  o.start(t)
  o.stop(t + seconds + 0.4)
  blip(110, 70, 0.12, 0.07, 'sine', seconds)
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
  chord(currentScene)
  running = true
  nextBeat = t + 0.6
  window.clearInterval(scheduler)
  scheduler = window.setInterval(schedule, 80)
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
  const typed = (e: Event) => { if (running && (e.target as Element | null)?.closest?.('#contact, .lm__card')) key() }
  document.addEventListener('pointerover', over)
  document.addEventListener('input', typed)
  return () => { disarm(); window.clearTimeout(timer); document.removeEventListener('pointerover', over); document.removeEventListener('input', typed) }
}

// a probe for the cross-browser checks (state only, no control): is the context playing?
if (typeof window !== 'undefined') (window as unknown as { __seaSound?: unknown }).__seaSound = { isOn, isRunning, level, state: () => ctx?.state ?? 'none' }
