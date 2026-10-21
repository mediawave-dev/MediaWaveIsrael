// The instruments, all made in Web Audio (no samples, no licences): pads, bells, keys, a kalimba, a pluck,
// a bass, and a soft kit (kick, snare, hats, a rim click). Every voice is a few nodes that start at a
// scheduled time and stop themselves; a shared "wow" can wobble their pitch like tape.

export interface Bus {
  ctx: AudioContext
  out: AudioNode
  rev: AudioNode
  /** a slow pitch wobble (cents) every voice may follow, for the tape world */
  wow?: AudioNode
  noise: AudioBuffer
}

export const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

function env(g: GainNode, t: number, a: number, peak: number, decay: number, sustain = 0, release = 0.3, hold = 0) {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(peak, t + a)
  if (sustain > 0) {
    g.gain.setTargetAtTime(peak * sustain, t + a, decay / 3)
    g.gain.setTargetAtTime(0.0001, t + a + hold, release / 3)
  } else {
    g.gain.setTargetAtTime(0.0001, t + a, decay / 4)
  }
}

function osc(b: Bus, type: OscillatorType, f: number, t: number, stop: number, detune = 0): OscillatorNode {
  const o = b.ctx.createOscillator()
  o.type = type
  o.frequency.value = f
  o.detune.value = detune
  if (b.wow) b.wow.connect(o.detune)
  o.start(t)
  o.stop(stop)
  o.onended = () => { try { if (b.wow) b.wow.disconnect(o.detune) } catch { /* gone */ } o.disconnect() }
  return o
}

function send(b: Bus, node: AudioNode, wet: number) {
  node.connect(b.out)
  if (wet > 0) {
    const s = b.ctx.createGain()
    s.gain.value = wet
    node.connect(s)
    s.connect(b.rev)
  }
}

/** a soft chord that swells in and fades out (two detuned voices per note through a low-pass) */
export function pad(b: Bus, t: number, notes: number[], dur: number, vol = 0.05, cutoff = 1400, wet = 0.7) {
  const f = b.ctx.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = cutoff
  f.Q.value = 0.4
  const g = b.ctx.createGain()
  env(g, t, Math.min(2.2, dur * 0.35), vol, 1, 0.85, Math.min(3, dur * 0.4), dur * 0.7)
  f.connect(g)
  send(b, g, wet)
  for (const n of notes) {
    osc(b, 'sawtooth', hz(n), t, t + dur + 3, -7).connect(f)
    osc(b, 'triangle', hz(n), t, t + dur + 3, 6).connect(f)
  }
}

/** a glass bell (FM): bright at the strike, ringing down for seconds */
export function bell(b: Bus, t: number, n: number, vol = 0.05, wet = 0.6, ratio = 3.5) {
  const f = hz(n)
  const car = osc(b, 'sine', f, t, t + 3.5)
  const mod = osc(b, 'sine', f * ratio, t, t + 3.5)
  const mg = b.ctx.createGain()
  mg.gain.setValueAtTime(f * 2.2, t)
  mg.gain.exponentialRampToValueAtTime(f * 0.05, t + 1.4)
  mod.connect(mg)
  mg.connect(car.frequency)
  const g = b.ctx.createGain()
  env(g, t, 0.004, vol, 2.6)
  car.connect(g)
  send(b, g, wet)
}

/** electric-piano keys: a warm chord, a little bell on top, a soft decay */
export function keys(b: Bus, t: number, notes: number[], vol = 0.035, wet = 0.35) {
  const f = b.ctx.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = 2400
  const g = b.ctx.createGain()
  env(g, t, 0.006, vol, 1.8)
  f.connect(g)
  send(b, g, wet)
  for (const n of notes) {
    osc(b, 'triangle', hz(n), t, t + 2.4).connect(f)
    const top = osc(b, 'sine', hz(n) * 2, t, t + 0.8)
    const tg = b.ctx.createGain()
    tg.gain.setValueAtTime(0.35, t)
    tg.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
    top.connect(tg).connect(f)
  }
}

/** a kalimba: a round tone with a short metallic overtone */
export function kalimba(b: Bus, t: number, n: number, vol = 0.06, wet = 0.45) {
  const g = b.ctx.createGain()
  env(g, t, 0.003, vol, 1.5)
  send(b, g, wet)
  osc(b, 'sine', hz(n), t, t + 2).connect(g)
  const tine = osc(b, 'sine', hz(n) * 5.4, t, t + 0.25)
  const tg = b.ctx.createGain()
  tg.gain.setValueAtTime(0.18, t)
  tg.gain.exponentialRampToValueAtTime(0.001, t + 0.14)
  tine.connect(tg).connect(g)
}

/** a plucked synth through a filter you can sweep (the arpeggio of the blueprint world) */
export function pluck(b: Bus, t: number, n: number, vol = 0.04, cutoff = 1800, wet = 0.25) {
  const f = b.ctx.createBiquadFilter()
  f.type = 'lowpass'
  f.Q.value = 3
  f.frequency.setValueAtTime(cutoff, t)
  f.frequency.exponentialRampToValueAtTime(Math.max(200, cutoff * 0.25), t + 0.22)
  const g = b.ctx.createGain()
  env(g, t, 0.003, vol, 0.35)
  f.connect(g)
  send(b, g, wet)
  osc(b, 'sawtooth', hz(n), t, t + 0.6).connect(f)
  osc(b, 'square', hz(n) * 1.003, t, t + 0.6).connect(f)
}

/** a marimba hit: wood, quick and round */
export function marimba(b: Bus, t: number, n: number, vol = 0.05, wet = 0.3) {
  const g = b.ctx.createGain()
  env(g, t, 0.002, vol, 0.55)
  send(b, g, wet)
  osc(b, 'sine', hz(n), t, t + 0.8).connect(g)
  const o4 = osc(b, 'sine', hz(n) * 4, t, t + 0.12)
  const og = b.ctx.createGain()
  og.gain.setValueAtTime(0.25, t)
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
  o4.connect(og).connect(g)
}

export function bass(b: Bus, t: number, n: number, dur: number, vol = 0.09) {
  const f = b.ctx.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = 420
  const g = b.ctx.createGain()
  env(g, t, 0.01, vol, 0.6, 0.6, 0.25, dur)
  f.connect(g)
  send(b, g, 0)
  osc(b, 'triangle', hz(n), t, t + dur + 0.6).connect(f)
  osc(b, 'sine', hz(n) / 2, t, t + dur + 0.6).connect(f)
}

export function kick(b: Bus, t: number, vol = 0.32) {
  const o = osc(b, 'sine', 140, t, t + 0.45)
  o.frequency.setValueAtTime(140, t)
  o.frequency.exponentialRampToValueAtTime(44, t + 0.13)
  const g = b.ctx.createGain()
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.38)
  o.connect(g)
  send(b, g, 0)
}

function noiseHit(b: Bus, t: number, type: BiquadFilterType, freq: number, q: number, vol: number, dur: number, wet = 0) {
  const s = b.ctx.createBufferSource()
  s.buffer = b.noise
  const f = b.ctx.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  const g = b.ctx.createGain()
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + dur)
  s.connect(f).connect(g)
  send(b, g, wet)
  s.start(t, Math.random() * 1.5)
  s.stop(t + dur + 0.05)
  s.onended = () => { s.disconnect(); g.disconnect() }
}

export const snare = (b: Bus, t: number, vol = 0.09) => noiseHit(b, t, 'bandpass', 1900, 0.7, vol, 0.17, 0.15)
export const brush = (b: Bus, t: number, vol = 0.05) => noiseHit(b, t, 'bandpass', 3200, 0.5, vol, 0.24, 0.2)
export const hat = (b: Bus, t: number, vol = 0.03, open = false) => noiseHit(b, t, 'highpass', 8200, 0.6, vol, open ? 0.22 : 0.045)
export const rim = (b: Bus, t: number, vol = 0.05) => noiseHit(b, t, 'bandpass', 2600, 6, vol, 0.03)
/** one speck of vinyl dust */
export const crackle = (b: Bus, t: number, vol = 0.012) => noiseHit(b, t, 'highpass', 2600, 0.7, vol, 0.008)

/** a loop of quiet noise under everything (tape hiss, vinyl dust) */
export function bed(b: Bus, kind: 'hiss' | 'dust', vol: number): () => void {
  const s = b.ctx.createBufferSource()
  s.buffer = b.noise
  s.loop = true
  const f = b.ctx.createBiquadFilter()
  f.type = kind === 'hiss' ? 'highpass' : 'bandpass'
  f.frequency.value = kind === 'hiss' ? 3800 : 1200
  const g = b.ctx.createGain()
  g.gain.value = vol
  s.connect(f).connect(g).connect(b.out)
  s.start()
  return () => { try { s.stop() } catch { /* stopped */ } s.disconnect() }
}
