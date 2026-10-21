// The music engine (D190): one AudioContext, a soft compressor, a generated hall reverb, and a sixteenth-
// note scheduler (25 ms ticks, 120 ms lookahead) per track. Switching worlds crossfades the two tracks over
// two seconds. Nothing plays before the visitor turns the sound on (a tap or a click); the tab going away
// silences it. The state lives only for this visit (never stored).
import { TRACKS, type Track } from './tracks'
import { bed, type Bus } from './voices'

interface Playing { id: string; gain: GainNode; timer: number; stopBed: () => void; wow?: OscillatorNode }

let ctx: AudioContext | null = null
let master: GainNode
let rev: ConvolverNode
let noise: AudioBuffer
let analyser: AnalyserNode
let current: Playing | null = null
let on = false
const listeners = new Set<(on: boolean) => void>()

function hall(c: AudioContext): AudioBuffer {
  const len = Math.floor(c.sampleRate * 3.2)
  const buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6)
  }
  return buf
}

function boot(): AudioContext {
  if (ctx) return ctx
  const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  ctx = new C()
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
  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return
    master.gain.setTargetAtTime(document.hidden || !on ? 0 : 0.9, ctx.currentTime, 0.15)
  })
  return ctx
}

function start(id: string): Playing | null {
  const c = boot()
  const tr: Track | undefined = TRACKS[id]
  if (!tr) return null
  const gain = c.createGain()
  gain.gain.value = 0
  gain.connect(master)
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
  const bus: Bus = { ctx: c, out: gain, rev, noise, wow: wowAmt }
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
  gain.gain.setTargetAtTime(1, c.currentTime, 0.6)
  return { id, gain, timer, stopBed, wow }
}

function stop(p: Playing) {
  if (!ctx) return
  p.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.5)
  window.setTimeout(() => { clearInterval(p.timer); p.stopBed(); p.wow?.stop(); p.gain.disconnect() }, 2600)
}

/** play this world's music (crossfading from the one before); nothing happens until the sound is on */
export function playWorld(id: string) {
  if (!on) { pending = id; return }
  if (current?.id === id) return
  if (current) stop(current)
  current = start(id)
}
let pending = ''

export function setSound(v: boolean, id?: string) {
  if (id) pending = id
  on = v
  const c = boot()
  void c.resume()
  master.gain.cancelScheduledValues(c.currentTime)
  master.gain.setTargetAtTime(v ? 0.9 : 0, c.currentTime, v ? 0.35 : 0.2)
  if (v && pending && current?.id !== pending) { if (current) stop(current); current = start(pending) }
  if (!v && current) { const p = current; current = null; window.setTimeout(() => { if (!on) stop(p) }, 400) }
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
