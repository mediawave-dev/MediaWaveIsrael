// The tape's sound, made in the browser (no file, no licence): a warm four-chord pad that wobbles like a
// cassette (a slow wow on every voice), with a little tape hiss. Léo's ambient sits at 0.375 under a 0.7
// master; ours peaks near 0.26. It starts only after the visitor's click, ramps over 0.5 s (their
// power4.out tween), and falls silent when the tab is hidden.

const CHORDS = [[48, 55, 64, 71], [45, 52, 60, 67], [41, 48, 57, 64], [43, 50, 59, 62]]
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

export interface Tape { setOn: (on: boolean) => void; level: () => number; dispose: () => void }

export function createTape(): Tape {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new Ctx()
  const master = ctx.createGain()
  master.gain.value = 0
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2200
  lp.Q.value = 0.4
  lp.connect(master)
  const an = ctx.createAnalyser()
  an.fftSize = 256
  master.connect(an)
  master.connect(ctx.destination)

  // wow and flutter: one slow wobble on every voice's pitch
  const wow = ctx.createOscillator()
  wow.frequency.value = 0.55
  const wowAmt = ctx.createGain()
  wowAmt.gain.value = 7
  wow.connect(wowAmt)
  wow.start()

  // hiss: looping noise, band-limited, very low
  const len = ctx.sampleRate * 2
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  const hiss = ctx.createBufferSource()
  hiss.buffer = buf
  hiss.loop = true
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 3200
  const hg = ctx.createGain()
  hg.gain.value = 0.018
  hiss.connect(hp).connect(hg).connect(master)
  hiss.start()

  let step = 0
  const chord = () => {
    const now = ctx.currentTime
    for (const m of CHORDS[step % CHORDS.length]) {
      for (const [type, det, vol] of [['sine', 0, 0.06], ['triangle', 6, 0.022]] as const) {
        const o = ctx.createOscillator()
        o.type = type
        o.frequency.value = hz(m)
        o.detune.value = det
        wowAmt.connect(o.detune)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(vol, now + 2.2)
        g.gain.setTargetAtTime(0, now + 5.2, 1.4)
        o.connect(g).connect(lp)
        o.start(now)
        o.stop(now + 11)
        o.onended = () => { try { wowAmt.disconnect(o.detune) } catch { /* already gone */ } o.disconnect(); g.disconnect() }
      }
    }
    step += 1
  }
  let timer = 0
  let on = false
  const setOn = (v: boolean) => {
    on = v
    void ctx.resume()
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.setTargetAtTime(v ? 0.26 : 0, now, 0.12)
    if (v && !timer) { chord(); timer = window.setInterval(chord, 6000) }
  }
  const vis = () => { master.gain.setTargetAtTime(document.hidden || !on ? 0 : 0.26, ctx.currentTime, 0.1) }
  document.addEventListener('visibilitychange', vis)
  const data = new Uint8Array(an.frequencyBinCount)
  return {
    setOn,
    level: () => { an.getByteFrequencyData(data); let s = 0; for (let i = 2; i < 40; i++) s += data[i]; return Math.min(1, s / (38 * 140)) },
    dispose: () => { clearInterval(timer); document.removeEventListener('visibilitychange', vis); void ctx.close() },
  }
}
