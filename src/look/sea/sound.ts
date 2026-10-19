// sea · the sound (D137): a soundscape made of the site's own world, synthesized live with WebAudio (no
// files, no stock loops). On by default (Nati, D137), but browsers allow sound only after the visitor's
// first tap, click or key: until then it is armed, and on that first gesture it fades in over a few
// seconds at a low level, so open speakers are never startled. The header pill's control turns it off
// for the rest of the visit (sessionStorage; WCAG 1.4.2: a control at the top of every page).
//   the sea     filtered noise that swells like a wave every few seconds and rises a little with the
//               reader's scroll speed (the field's ripple, heard)
//   the pad     a quiet, open chord that moves to a new chord in each chapter (the field's shapes)
//   the deck    small tape-machine sounds for the site's moments: a counter tick when the services
//               stage turns to the next service, a whirr on the rewind, a soft two-note chime when
//               the lead rises out of the laptop, a bubble's pop on the WhatsApp key's surprise, and
//               the faintest key clicks while someone types in the contact form
// The context is suspended while the tab is hidden. Every level is low: it sits under the page.

type Listener = (on: boolean) => void

let ctx: AudioContext | null = null
let master: GainNode | null = null
let seaGain: GainNode | null = null
let seaFilter: BiquadFilterNode | null = null
let padOsc: OscillatorNode[] = []
/** the visitor's choice (armed by default); running = the context is actually playing */
let on = (() => { try { return sessionStorage.getItem('mw-sound') !== 'off' } catch { return true } })()
let running = false
/** the level the sound settles at: low, under the page */
const LEVEL = 0.34
const listeners = new Set<Listener>()
let lastY = 0
let speed = 0
let raf = 0
let lastTick = 0

/** chords per scene (Hz), all open and unresolved: add9 voicings, nothing that pulls */
const N = (m: number) => 440 * Math.pow(2, (m - 69) / 12)
const CHORDS: Record<string, number[]> = {
  horizon: [N(50), N(57), N(64), N(66)],  // D3 A3 E4 F#4
  laptop: [N(47), N(54), N(61), N(62)],   // B2 F#3 C#4 D4
  landing: [N(55), N(62), N(69), N(71)],  // G3 D4 A4 B4
  seo: [N(52), N(59), N(66), N(68)],      // E3 B3 F#4 G#4
  chat: [N(57), N(64), N(71), N(73)],     // A3 E4 B4 C#5
  reels: [N(43), N(50), N(57), N(59)],    // G2 D3 A3 B3
  memory: [N(45), N(52), N(59), N(61)],   // A2 E3 B3 C#4
  bubble: [N(50), N(57), N(64), N(69)],   // D3 A3 E4 A4
  quiet: [N(50), N(57), N(62), N(64)],    // D3 A3 D4 E4
}

export const isOn = () => on
export const isRunning = () => running
export function onChange(fn: Listener) { listeners.add(fn); return () => { listeners.delete(fn) } }
const emit = () => listeners.forEach((fn) => fn(on))

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

function lfo(c: AudioContext, hz: number, depth: number, target: AudioParam, type: OscillatorType = 'sine') {
  const o = c.createOscillator()
  o.type = type
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
  comp.threshold.value = -24
  comp.ratio.value = 3
  master.connect(comp).connect(c.destination)

  // the sea: noise through a lowpass that opens and closes like a wave
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c, 6)
  src.loop = true
  seaFilter = c.createBiquadFilter()
  seaFilter.type = 'lowpass'
  seaFilter.frequency.value = 520
  seaFilter.Q.value = 0.6
  seaGain = c.createGain()
  seaGain.gain.value = 0.16
  const swell = c.createGain()
  swell.gain.value = 0.7
  src.connect(seaFilter).connect(swell).connect(seaGain).connect(master)
  lfo(c, 1 / 9, 300, seaFilter.frequency)
  lfo(c, 1 / 9, 0.32, swell.gain)
  // foam: a thin, higher band that only breathes at the crest
  const foamF = c.createBiquadFilter()
  foamF.type = 'bandpass'
  foamF.frequency.value = 3200
  foamF.Q.value = 0.8
  const foam = c.createGain()
  foam.gain.value = 0.012
  src.connect(foamF).connect(foam).connect(master)
  lfo(c, 1 / 9, 0.012, foam.gain)
  src.start()

  // the pad: four soft voices, a slow vibrato, a gentle lowpass
  const padF = c.createBiquadFilter()
  padF.type = 'lowpass'
  padF.frequency.value = 1400
  padF.Q.value = 0.3
  const pad = c.createGain()
  pad.gain.value = 0.05
  padF.connect(pad).connect(master)
  padOsc = CHORDS.horizon.map((f, i) => {
    const o = c.createOscillator()
    o.type = i === 0 ? 'triangle' : 'sine'
    o.frequency.value = f
    o.detune.value = (i - 1.5) * 4
    lfo(c, 0.07 + i * 0.013, 3, o.detune)
    const g = c.createGain()
    g.gain.value = [0.5, 0.36, 0.22, 0.16][i]
    o.connect(g).connect(padF)
    o.start()
    return o
  })
}

/** scroll speed raises the sea a little (eased), like the field's ripple */
function follow() {
  raf = 0
  if (!on || !ctx || !seaGain || !seaFilter) return
  const y = window.scrollY
  speed = speed * 0.9 + Math.min(1, Math.abs(y - lastY) / 60) * 0.1
  lastY = y
  const t = ctx.currentTime
  seaGain.gain.setTargetAtTime(0.16 + speed * 0.12, t, 0.3)
  if (speed > 0.002) raf = requestAnimationFrame(follow)
}
const wakeFollow = () => { if (on && !raf) raf = requestAnimationFrame(follow) }

function chord(name: string) {
  if (!ctx || !padOsc.length) return
  const c = CHORDS[name] ?? CHORDS.quiet
  const t = ctx.currentTime
  padOsc.forEach((o, i) => o.frequency.setTargetAtTime(c[i], t, 0.9))
}
const onScene = (e: Event) => chord((e as CustomEvent<string>).detail)
const onHidden = () => { if (!ctx) return; if (document.hidden) void ctx.suspend(); else if (on) void ctx.resume() }

/** a short voice: a sine (or a glide) with an exponential tail */
function blip(f0: number, f1: number, dur: number, gain: number, type: OscillatorType = 'sine', at = 0) {
  if (!on || !ctx || !master) return
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
  blip(2200, 1800, 0.05, 0.05, 'square')
}
/** a key of the contact form: fainter than the counter */
export function key() {
  const now = performance.now()
  if (now - lastTick < 60) return
  lastTick = now
  blip(3200 + Math.random() * 600, 2800, 0.025, 0.018, 'square')
}
/** the WhatsApp key's bubble arrives */
export const pop = () => blip(520, 900, 0.16, 0.06)
/** the lead rises out of the laptop: two soft notes, a fifth apart */
export function chime() { blip(N(76), N(76), 0.9, 0.05, 'sine'); blip(N(83), N(83), 1.1, 0.04, 'sine', 0.14) }
/** the rewind: a tape whirring back, then the deck stopping */
export function rewind(seconds: number) {
  if (!on || !ctx || !master) return
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
  g.gain.exponentialRampToValueAtTime(0.03, t + 0.2)
  g.gain.setTargetAtTime(0.0001, t + seconds - 0.15, 0.08)
  o.connect(f).connect(g).connect(master)
  o.start(t)
  o.stop(t + seconds + 0.4)
  blip(110, 70, 0.12, 0.08, 'sine', seconds)
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
  emit()
}

function quiet() {
  if (!ctx || !master) return
  const t = ctx.currentTime
  master.gain.cancelScheduledValues(t)
  master.gain.setTargetAtTime(0, t, 0.25)
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

/** Armed: the first tap, click or key of the visit starts the sound, slowly (about four seconds). */
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

/** the field tells the sound where the reader is (field.ts dispatches sea:scene) */
let currentScene = 'horizon'
if (typeof window !== 'undefined') window.addEventListener('sea:scene', (e) => { currentScene = (e as CustomEvent<string>).detail })

/** The small hooks: the WhatsApp key's surprise pops as its bubble arrives, and the contact form's
    keys click faintly. Delegated on the document, so every page's keys and forms are covered. */
export function hooks() {
  const disarm = arm()
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  let timer = 0
  const over = (e: PointerEvent) => {
    if (!on || !fine) return
    const k = (e.target as Element | null)?.closest?.('a.key[href*="wa.me"]')
    if (!k || (e.relatedTarget instanceof Node && k.contains(e.relatedTarget))) return
    window.clearTimeout(timer)
    timer = window.setTimeout(pop, 300)
  }
  const typed = (e: Event) => { if (on && (e.target as Element | null)?.closest?.('#contact, .lm__card')) key() }
  document.addEventListener('pointerover', over)
  document.addEventListener('input', typed)
  return () => { disarm(); window.clearTimeout(timer); document.removeEventListener('pointerover', over); document.removeEventListener('input', typed) }
}

// a probe for the cross-browser checks (state only, no control): is the context playing?
if (typeof window !== 'undefined') (window as unknown as { __seaSound?: unknown }).__seaSound = { isOn, isRunning, state: () => ctx?.state ?? 'none' }
