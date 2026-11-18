// sun · the opener's sea, heard (D297, Nati 18.11.2026: "תוכל להוסיף סאונד מתאים של גלים? כשהיוזר ילחץ אז זה פשוט
// יתנגן"). No file and no sample: the sea is made here, in WebAudio, and it is played by the same numbers that draw
// the wave (opener.ts hands them over every frame), so what is heard is what is seen, also when the visitor sends
// the last wave early.
//   the body   pink noise under a fixed low-pass: the roar of water running up the sand; its level follows the run
//   the hiss   the same noise through a fixed high band: foam. It is loudest while the water goes back, and it
//              flutters there, which is what fizzing foam does
//   the plips  a soft round note when a bubble is set down on the shore, and when a hand touches the water
// Lessons from the pen film's sound (D232, which was first called grating): one colour of noise whose LEVEL moves,
// never a filter that sweeps (a sweeping pitch is what a synthesiser sounds like); nothing that matters under
// 400 Hz, where a phone's speaker is silent; no level jump faster than a few milliseconds (a click).
// A browser lets a page make sound only after a tap, a click or a key. So the context is built ahead, silent, and a
// tap only resumes it: making the first AudioContext of a browser's session holds the main thread for 100 to 370 ms
// (measured; the browser starts its audio service and waits for it), which under the visitor's finger would be the
// wave freezing. Two things keep that cost small and out of sight. The audio service is woken first by a call that
// does its waiting off the main thread (enumerateDevices: nothing is read from its answer), after which the context
// costs less. The context asks for 'balanced' latency, not 'interactive': measured cold, 100 to 150 ms against 150 to
// 480 (a sea does not need a drum's latency). And the context is made only once the sea is up, before the first wave, which waits for the
// frames to run on time again.

export type Voice = {
  /** the graph's output level node (the offline render reads the mix through it) */
  out: GainNode
  /** what the sea is doing at `at` (context time): 0..1 run, 0..1 backwash, the water's height up the screen, a slow breath */
  set: (surge: number, back: number, level: number, breath: number, at: number) => void
  plip: (i: number, at: number, vol?: number) => void
}

/** Six seconds of stereo pink noise, the ends folded into each other so the loop has no seam. */
export function pinkNoise(rate = 44100): AudioBuffer {
  const fold = Math.round(rate * 0.3)
  const len = rate * 6
  const buf = new AudioBuffer({ length: len, numberOfChannels: 2, sampleRate: rate })
  for (let c = 0; c < 2; c++) {
    const raw = new Float32Array(len + fold)
    let b0 = 0, b1 = 0, b2 = 0
    for (let i = 0; i < raw.length; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913
      raw[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2
    }
    const d = buf.getChannelData(c)
    for (let i = 0; i < len; i++) d[i] = i < fold ? raw[i] * Math.sqrt(i / fold) + raw[len + i] * Math.sqrt(1 - i / fold) : raw[i]
  }
  return buf
}

/** The plips' notes: one five-note scale, so any two that land together agree. All sit where a phone can play them. */
const NOTES = [523.25, 587.33, 659.25, 783.99, 880, 440]

/** The sea as a graph on any context (the page's, or an offline one that renders it to a file for judging). */
export function buildSea(ctx: BaseAudioContext, noise: AudioBuffer): Voice {
  const src = ctx.createBufferSource()
  src.buffer = noise; src.loop = true
  const out = ctx.createGain(); out.gain.value = 0
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.012; comp.release.value = 0.3
  const filter = (type: BiquadFilterType, f: number, q = 0.7) => { const n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = f; n.Q.value = q; return n }
  const body = ctx.createGain(); body.gain.value = 0
  const hiss = ctx.createGain(); hiss.gain.value = 0
  src.connect(filter('highpass', 300)).connect(filter('lowpass', 1800, 0.5)).connect(body).connect(comp)
  src.connect(filter('highpass', 1900)).connect(filter('lowpass', 7000, 0.5)).connect(hiss).connect(comp)
  comp.connect(out).connect(ctx.destination)
  src.start()

  let lastBody = 0, lastHiss = 0
  return {
    out,
    set(surge, back, level, breath, at) {
      // the further up the beach the water is, the more of it there is to hear
      const big = 0.55 + 0.6 * Math.min(1.15, Math.max(0, level))
      // the run is the loud part; the water going back is a long quiet hiss, so the sea breathes between waves
      const b = (0.035 + 0.03 * breath + 0.55 * Math.pow(surge, 0.8) + 0.06 * back) * big
      const h = (0.010 + 0.006 * (1 - breath) + 0.20 * surge + 0.15 * Math.pow(back, 1.3) * (1 - 0.3 * Math.random())) * big
      // up quickly, down slowly: water arrives faster than it leaves
      body.gain.setTargetAtTime(b, at, b > lastBody ? 0.06 : 0.3)
      hiss.gain.setTargetAtTime(h, at, h > lastHiss ? 0.05 : 0.35)
      lastBody = b; lastHiss = h
    },
    plip(i, at, vol = 0.18) {
      const f = NOTES[((i % NOTES.length) + NOTES.length) % NOTES.length]
      const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain()
      o.frequency.setValueAtTime(f * 1.05, at); o.frequency.exponentialRampToValueAtTime(f, at + 0.06)
      o2.frequency.value = f * 2
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + 0.022); g.gain.setTargetAtTime(0, at + 0.022, 0.075)
      g2.gain.setValueAtTime(0, at); g2.gain.linearRampToValueAtTime(vol * 0.22, at + 0.022); g2.gain.setTargetAtTime(0, at + 0.022, 0.03)
      o.connect(g).connect(out); o2.connect(g2).connect(out)
      o.start(at); o2.start(at); o.stop(at + 0.6); o2.stop(at + 0.3)
    },
  }
}

/** How loud the whole sea sits once it is on. */
export const LEVEL = 0.8

export type Sea = {
  /** 'none': this browser has no WebAudio. 'armed': waiting for a tap. 'on' / 'off': the visitor's choice. */
  state: () => 'none' | 'armed' | 'on' | 'off'
  cost: () => string
  /** The sea is up: build the context now (silent), before the first wave. */
  prepare: () => void
  /** Call inside a tap, a click or a key: starts the sound if the visitor has not turned it off. */
  wake: () => void
  toggle: () => void
  drive: (surge: number, back: number, level: number, breath: number) => void
  plip: (i: number, vol?: number) => void
  /** the tab was hidden (true) or is looked at again (false) */
  hush: (hidden: boolean) => void
  /** the last wave is going out: the sea fades with it */
  fade: () => void
  close: () => void
}

export function makeSea(onChange: () => void): Sea {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  let state: 'none' | 'armed' | 'on' | 'off' = AC ? 'armed' : 'none'
  let ctx: AudioContext | null = null
  let voice: Voice | null = null
  let faded = false
  /** for the checks: ms until the audio service answered / until the context was made / what making it held the main thread */
  let cost = ''
  // three short jobs instead of one long one: wake the audio service (off the main thread), bake the noise, and,
  // when the opener says the sea is up, make the context
  let noise: AudioBuffer | null = null
  let timer = 0
  let woke = !AC
  let wanted = false
  const t0 = performance.now()
  let wokeMs = -1
  const build = () => {
    if (!AC || ctx || !noise || !woke || !wanted) return
    const a = performance.now()
    try { ctx = new AC({ latencyHint: 'balanced' }); voice = buildSea(ctx, noise) } catch { state = 'none'; onChange() }
    cost = `${wokeMs}/${Math.round(a - t0)}/${Math.round(performance.now() - a)}`
    onChange()
  }
  if (AC) {
    const done = () => { if (wokeMs < 0) wokeMs = Math.round(performance.now() - t0); woke = true; build() }
    try { void navigator.mediaDevices.enumerateDevices().then(done, done) } catch { woke = true }
    window.setTimeout(done, 1200) // a browser that never answers does not keep the sea silent
    timer = window.setTimeout(() => { try { noise = pinkNoise() } catch { state = 'none'; onChange(); return } build() }, 30)
  }

  const level = (v: number, tau: number) => { if (ctx && voice) voice.out.gain.setTargetAtTime(v, ctx.currentTime, tau) }
  const start = () => {
    if (!ctx || !voice || faded) return
    // resume() is the one call that needs the visitor's gesture; the level comes up only once the context really runs
    void ctx.resume().then(() => { if (ctx && ctx.state === 'running' && state !== 'off') { state = 'on'; level(LEVEL, 0.12); onChange() } }).catch(() => { /* still armed: the next tap tries again */ })
  }
  return {
    state: () => state,
    cost: () => cost,
    prepare() { wanted = true; build() },
    wake() { wanted = true; woke = true; build(); if (state === 'armed') start() },
    toggle() {
      if (state === 'on') { state = 'off'; level(0, 0.06); onChange() }
      else if (state === 'off' || state === 'armed') { if (state === 'off') state = 'armed'; start() }
    },
    drive(surge, back, lv, breath) { if (state === 'on' && ctx && voice) voice.set(surge, back, lv, breath, ctx.currentTime) },
    plip(i, vol) { if (state === 'on' && ctx && voice && !faded) voice.plip(i, ctx.currentTime + 0.005, vol) },
    hush(hidden) {
      if (!ctx || state !== 'on') return
      if (hidden) void ctx.suspend().catch(() => { /* closing */ }); else void ctx.resume().catch(() => { /* closing */ })
    },
    fade() { if (!faded) { faded = true; level(0, 0.5) } },
    close() {
      clearTimeout(timer)
      const c = ctx; ctx = null; voice = null
      if (c) { try { void c.close() } catch { /* already closed */ } }
    },
  }
}
