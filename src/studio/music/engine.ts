// The music engine (D190, D199): one AudioContext (borrowed from the site's own music when it already
// runs, so a visitor who listens keeps listening across the trip), a soft compressor, a generated hall
// reverb, and a sixteenth-note scheduler (25 ms ticks, 120 ms lookahead) per track.
// Switching worlds is a DJ's crossfade, not a cut (D199, Nati: "like the transition between songs on
// Spotify"): while the wave covers the screen the playing track dips and its filter starts to close; once
// the new world is under the wave, the old track falls away over three seconds (equal power, the filter
// closing to a murmur) while the new one rises from a muffled start into the open over the same time. Each
// track's reverb send rides its own fader, so the tail leaves with its track. Nothing plays before the
// visitor turns the sound on (a tap or a click); the tab going away silences it. The state lives only for
// this visit (never stored).
import { TRACKS, type Track } from './tracks'
import { bed, type Bus } from './voices'
import { adoptContext, lendContext } from '../../look/sea/sound'

interface Playing { id: string; gain: GainNode; wet: GainNode; filt: BiquadFilterNode; timer: number; stopBed: () => void; wow?: OscillatorNode }

const RISE = 2.8
const FALL = 3.2
const OPEN = 18000

let ctx: AudioContext | null = null
let master: GainNode
let rev: ConvolverNode
let noise: AudioBuffer
let analyser: AnalyserNode
let current: Playing | null = null
let on = false
const listeners = new Set<(on: boolean) => void>()

// (D199) the hall and the noise are baked ahead (preload: one channel per idle slice), never inside the tap
// that starts the music: made there they stalled the page for a moment (a 3.2 s stereo impulse in Math.pow)
const GUESS_SR = 48000
let hallBuf: { buf: AudioBuffer; done: number } | null = null
let noiseBuf: AudioBuffer | null = null
const hallFill = (d: Float32Array) => { const len = d.length; for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6) }
const makeBuf = (c: AudioContext | null, ch: number, secs: number) => {
  const sr = c?.sampleRate ?? GUESS_SR
  const len = Math.floor(sr * secs)
  return c ? c.createBuffer(ch, len, sr) : new AudioBuffer({ numberOfChannels: ch, length: len, sampleRate: sr })
}
function hall(c: AudioContext): AudioBuffer {
  // a convolver takes only its context's own rate
  if (!hallBuf || hallBuf.buf.sampleRate !== c.sampleRate) hallBuf = { buf: makeBuf(c, 2, 3.2), done: 0 }
  while (hallBuf.done < 2) { hallFill(hallBuf.buf.getChannelData(hallBuf.done)); hallBuf.done += 1 }
  return hallBuf.buf
}
function noiseOf(c: AudioContext): AudioBuffer {
  if (noiseBuf) return noiseBuf
  noiseBuf = makeBuf(c, 1, 2)
  const d = noiseBuf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return noiseBuf
}

/** bake the hall and the noise at idle, before the tap that will need them */
export function bake() {
  if (ctx || typeof AudioBuffer === 'undefined') return
  // short slices on a timer (a busy page may never be idle)
  const later = (f: () => void) => window.setTimeout(f, 60)
  const next = () => {
    if (ctx) return
    try {
      if (!hallBuf) hallBuf = { buf: makeBuf(null, 2, 3.2), done: 0 }
      if (hallBuf.done < 2) { hallFill(hallBuf.buf.getChannelData(hallBuf.done)); hallBuf.done += 1; later(next); return }
      if (!noiseBuf) { noiseBuf = makeBuf(null, 1, 2); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1 }
    } catch { /* made at the tap instead */ }
  }
  later(next)
}

function boot(): AudioContext {
  if (ctx) return ctx
  const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const lent = lendContext()
  ctx = lent ?? new C()
  // one context for the whole visit: the site's music can play through this one later, without a tap
  if (!lent) adoptContext(ctx)
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -20
  comp.ratio.value = 3
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(comp)
  analyser = ctx.createAnalyser()
  analyser.fftSize = 256
  comp.connect(analyser)
  comp.connect(ctx.destination)
  rev = ctx.createConvolver()
  rev.buffer = hall(ctx)
  const revOut = ctx.createGain()
  revOut.gain.value = 0.55
  rev.connect(revOut).connect(master)
  noise = noiseOf(ctx)
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return
    master.gain.setTargetAtTime(document.hidden || !on ? 0 : 0.9, ctx.currentTime, 0.15)
  })
  return ctx
}

/** an equal-power curve from `a` to `b` (a quarter sine), for a fader */
function curve(a: number, b: number, rising: boolean): Float32Array {
  const n = 64
  const out = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const k = i / (n - 1)
    const w = rising ? Math.sin((k * Math.PI) / 2) : Math.cos((k * Math.PI) / 2)
    out[i] = rising ? a + (b - a) * w : b + (a - b) * w
  }
  return out
}

/** stop whatever the param is doing and hold where it is (a quick second switch must not throw) */
function hold(p: AudioParam, t: number): number {
  const v = p.value
  const q = p as AudioParam & { cancelAndHoldAtTime?: (t: number) => AudioParam }
  if (q.cancelAndHoldAtTime) q.cancelAndHoldAtTime(t)
  else p.cancelScheduledValues(0)
  try { p.setValueAtTime(v, t) } catch { /* held */ }
  return v
}

function fade(p: AudioParam, to: number, secs: number, rising: boolean) {
  const t = ctx!.currentTime
  const from = hold(p, t)
  try { p.setValueCurveAtTime(curve(from, to, rising), t + 0.02, secs) } catch { try { p.setTargetAtTime(to, t + 0.02, secs / 3) } catch { /* no fade */ } }
}

function sweep(f: BiquadFilterNode, to: number, secs: number) {
  const t = ctx!.currentTime
  hold(f.frequency, t)
  try { f.frequency.exponentialRampToValueAtTime(to, t + secs) } catch { /* no sweep */ }
}

function start(id: string, rise = RISE): Playing | null {
  const c = boot()
  const tr: Track | undefined = TRACKS[id]
  if (!tr) return null
  const gain = c.createGain()
  gain.gain.value = 0.0001
  // the track's own filter: it opens as the track rises in, and closes as it leaves
  const filt = c.createBiquadFilter()
  filt.type = 'lowpass'
  filt.Q.value = 0.6
  filt.frequency.value = 520
  gain.connect(filt).connect(master)
  // the track's own reverb send, so its tail leaves with it
  const wet = c.createGain()
  wet.gain.value = 0.0001
  wet.connect(rev)
  let wow: OscillatorNode | undefined
  let wowAmt: GainNode | undefined
  if (tr.wow) {
    wow = c.createOscillator()
    wow.frequency.value = 0.5
    wowAmt = c.createGain()
    wowAmt.gain.value = tr.wow
    wow.connect(wowAmt)
    wow.start()
  }
  const bus: Bus = { ctx: c, out: gain, rev: wet, noise, wow: wowAmt }
  const stopBed = tr.bed ? bed(bus, tr.bed.kind, tr.bed.vol) : () => {}
  const spb = 60 / tr.bpm / 4
  let step = 0
  let next = c.currentTime + 0.08
  const tick = () => {
    while (next < c.currentTime + 0.12) {
      const sw = tr.swing && step % 2 === 1 ? spb * tr.swing : 0
      try { tr.step(bus, step, next + sw, spb) } catch { /* a dropped note never stops the music */ }
      next += spb
      step += 1
    }
  }
  tick()
  const timer = window.setInterval(tick, 25)
  fade(gain.gain, 1, rise, true)
  fade(wet.gain, 1, rise, true)
  sweep(filt, OPEN, rise * 0.9)
  return { id, gain, wet, filt, timer, stopBed, wow }
}

function stop(p: Playing, fall = FALL) {
  if (!ctx) return
  fade(p.gain.gain, 0.0001, fall, false)
  fade(p.wet.gain, 0.0001, fall * 0.8, false)
  sweep(p.filt, 260, fall)
  window.setTimeout(() => { clearInterval(p.timer); p.stopBed(); p.wow?.stop(); p.gain.disconnect(); p.wet.disconnect() }, (fall + 1.2) * 1000)
}

/** the wave starts to cover the screen: the playing track dips and its filter starts to close */
export function dim(ms: number) {
  if (!ctx || !current) return
  const s = ms / 1000
  fade(current.gain.gain, 0.55, s, false)
  sweep(current.filt, 2400, s)
}

/** play this world's music, crossfading from the one before; nothing happens until the sound is on */
export function playWorld(id: string) {
  if (!on) { pending = id; return }
  if (current?.id === id) { fade(current.gain.gain, 1, 1, true); sweep(current.filt, OPEN, 0.8); return }
  if (current) stop(current)
  current = start(id)
}
let pending = ''

/** leaving the worlds (back to the site): the track falls away, the visitor's choice stays */
export function leave() {
  if (current) { stop(current, 2.2); current = null }
}

export function setSound(v: boolean, id?: string) {
  if (id) pending = id
  on = v
  const c = boot()
  void c.resume()
  master.gain.cancelScheduledValues(c.currentTime)
  master.gain.setTargetAtTime(v ? 0.9 : 0, c.currentTime, v ? 0.35 : 0.2)
  if (v && pending && current?.id !== pending) { if (current) stop(current); current = start(pending) }
  if (!v && current) { const p = current; current = null; window.setTimeout(() => { if (!on) stop(p, 0.6) }, 400) }
  listeners.forEach((f) => f(v))
}

export const soundOn = () => on
export function onSound(f: (on: boolean) => void): () => void { listeners.add(f); return () => listeners.delete(f) }

const data = new Uint8Array(128)
/** a 0..1 loudness for the equaliser bars */
export function level(): number {
  if (!ctx || !on) return 0
  analyser.getByteFrequencyData(data)
  let s = 0
  for (let i = 2; i < 48; i++) s += data[i]
  return Math.min(1, s / (46 * 150))
}
