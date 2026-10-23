// One piece of music for each world (D190), in the genres people like to have on while they browse:
// flight - cinematic ambient (slow pads in D major, glass bells over them, a deep root);
// buzz - sunny lo-fi (a swung beat at 86 BPM, electric-piano chords on the genre's falling IV-iii-ii-V, a bass,
//        a marimba line, a little vinyl dust);
// blueprint - felt piano minimalism, the Kiasmos and Olafur Arnalds kind (D199, Nati: the old arpeggio
//        "is not beautiful enough"): a rolling left hand in eighths over Am-F-C-G at 92 BPM, a warm sub,
//        a soft kick and brushes that come and go, and a right-hand melody in the second half; a 32-bar
//        song (intro, pulse, melody, breakdown, full), so it never sounds like a loop;
// clay - a warm morning tape (kalimba arpeggios, a low pad, brushes, tape hiss and a slow wobble);
// depth - deep ambient with a sonar ping (D215).
// Steps are sixteenths; a track gets the step number (from 0, forever) and the time to play it at.
import { bass, bell, brush, crackle, hat, kalimba, keys, kick, marimba, pad, piano, snare, type Bus } from './voices'

export interface Track { bpm: number; swing?: number; wow?: number; bed?: { kind: 'hiss' | 'dust'; vol: number }; step: (b: Bus, i: number, t: number, spb: number) => void }

const rnd = (i: number, k = 0) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x) }

/** D major: Dmaj9, Bm9, Gmaj9, A6sus (two bars each) */
const FL_CH = [[50, 54, 57, 61, 64], [47, 50, 54, 57, 61], [43, 47, 50, 54, 57], [45, 50, 52, 54, 59]]
const FL_SCALE = [74, 76, 78, 81, 83, 86, 88, 90]
const flight: Track = {
  bpm: 66,
  step: (b, i, t, spb) => {
    const bar = Math.floor(i / 16)
    const s = i % 16
    const ch = FL_CH[Math.floor(bar / 2) % 4]
    if (s === 0 && bar % 2 === 0) {
      pad(b, t, ch.map((n) => n + 12), spb * 32, 0.022, 1500, 0.8)
      bass(b, t, ch[0] - 12, spb * 30, 0.05)
    }
    // the bells: a few notes of the pentatonic, more in the second bar of each chord
    if (s % 2 === 0 && rnd(i) > (bar % 2 ? 0.62 : 0.8)) bell(b, t, FL_SCALE[Math.floor(rnd(i, 1) * FL_SCALE.length)], 0.028, 0.75)
    if (s === 8 && bar % 4 === 3) bell(b, t, 98, 0.012, 0.9, 2.01)
  },
}

/** C major lo-fi: Fmaj7, Em7, Dm7, G7sus, the genre's favourite fall */
const BZ_CH = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [55, 60, 62, 65]]
const BZ_MEL = [72, 74, 76, 79, 81]
const buzz: Track = {
  bpm: 86,
  swing: 0.16,
  step: (b, i, t, spb) => {
    const bar = Math.floor(i / 16)
    const s = i % 16
    const ch = BZ_CH[bar % 4]
    if (s === 0 || s === 7 || s === 10) kick(b, t, s === 0 ? 0.3 : 0.2)
    if (s === 4 || s === 12) snare(b, t, 0.075)
    if (s % 2 === 0) hat(b, t, s % 4 === 2 ? 0.024 : 0.014)
    if (s === 14 && bar % 2) hat(b, t, 0.02, true)
    if (s === 0 || s === 6) keys(b, t, ch.map((n) => n + 12), s === 0 ? 0.03 : 0.02)
    if (s === 0) bass(b, t, ch[0] - 12, spb * 6, 0.075)
    if (s === 8) bass(b, t, ch[0] - 12 + (bar % 2 ? 7 : 0), spb * 4, 0.06)
    if (bar % 4 >= 2 && s % 4 === 2 && rnd(i) > 0.45) marimba(b, t, BZ_MEL[Math.floor(rnd(i, 2) * BZ_MEL.length)], 0.04)
    // vinyl dust: a few specks a bar, never a hiss
    if (rnd(i, 5) > 0.72) crackle(b, t + rnd(i, 6) * spb, 0.006 + rnd(i, 7) * 0.01)
  },
}

/** C major, felt piano: Am(add9), Fmaj7, C(add9), G, two bars each (the much-loved vi-IV-I-V) */
const BP_CH = [
  { root: 45, v: [57, 64, 71, 72] },
  { root: 41, v: [53, 60, 64, 69] },
  { root: 48, v: [48, 55, 62, 64] },
  { root: 43, v: [55, 62, 67, 71] },
]
/** the left hand rolls through the voicing in eighths */
const BP_ROLL = [0, 1, 2, 3, 2, 1, 2, 3]
/** the right hand: one phrase per chord, [step within its two bars, note] */
const BP_MEL: [number, number][][] = [
  [[0, 76], [6, 74], [12, 72], [20, 71], [24, 72]],
  [[0, 69], [6, 72], [12, 76], [22, 74], [28, 72]],
  [[0, 67], [8, 76], [14, 74], [20, 72], [26, 74]],
  [[0, 71], [6, 74], [12, 79], [20, 76], [28, 74]],
]
const blueprint: Track = {
  bpm: 92,
  step: (b, i, t, spb) => {
    const bar = Math.floor(i / 16)
    const s = i % 16
    const pair = Math.floor(bar / 2) % 4
    const ch = BP_CH[pair]
    const at = bar % 32
    const pulse = (at >= 8 && at < 24) || at >= 28
    const melody = at >= 16
    const breakdown = at >= 24 && at < 28
    // the left hand: eighths, the first of the bar a little stronger, never two the same
    if (s % 2 === 0) {
      const human = (rnd(i, 3) - 0.5) * 0.008
      const vel = (s === 0 ? 0.034 : 0.025) * (0.9 + rnd(i, 4) * 0.2) * (breakdown ? 0.8 : 1)
      piano(b, t + human, ch.v[BP_ROLL[(s / 2) % 8]], vel, 0.4)
    }
    if (s === 0 && bar % 2 === 0) {
      pad(b, t, ch.v.slice(0, 3).map((n) => n - 12), spb * 32, breakdown ? 0.012 : 0.008, 760, 0.6)
      if (pulse || breakdown) bass(b, t, ch.root, spb * 30, 0.05)
    }
    // the pulse: a soft kick on one and three, brushes on the off-beats, a brushed snare on two and four
    if (pulse) {
      if (s === 0 || s === 8) kick(b, t, 0.13)
      if (at >= 16 && s === 14 && rnd(i, 5) > 0.6) kick(b, t, 0.06)
      if (s % 4 === 2) brush(b, t, 0.014)
      if (at >= 16 && (s === 4 || s === 12)) brush(b, t, 0.03)
      if (at >= 16 && s % 2 === 1 && rnd(i, 6) > 0.7) hat(b, t, 0.006)
    }
    // the right hand, from the middle of the song; in the breakdown an octave up and softer
    if (melody) {
      const k = (bar % 2) * 16 + s
      for (const [st, n] of BP_MEL[pair]) if (st === k) piano(b, t, breakdown ? n + 12 : n, breakdown ? 0.03 : 0.042, 0.55)
    }
  },
}

/** C major, morning: Cmaj7, Am7, Fmaj7, G6sus, kalimba patterns over a pad */
const CL_CH = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 60, 62, 64]]
const clay: Track = {
  bpm: 74,
  swing: 0.08,
  wow: 7,
  bed: { kind: 'hiss', vol: 0.0035 },
  step: (b, i, t, spb) => {
    const bar = Math.floor(i / 16)
    const s = i % 16
    const ch = CL_CH[bar % 4]
    if (s === 0) { pad(b, t, ch.map((n) => n - 12), spb * 16, 0.02, 1100, 0.6); bass(b, t, ch[0] - 24, spb * 14, 0.05) }
    const pat = [0, 2, 1, 3, 2, 1, 3, 2]
    if (s % 2 === 0) kalimba(b, t, ch[pat[(s / 2) % 8]] + 12 + (s === 12 && bar % 2 ? 7 : 0), s % 4 === 0 ? 0.05 : 0.035)
    if (s === 4 || s === 12) brush(b, t, 0.04)
    if (s === 0 && bar % 2 === 0) kick(b, t, 0.12)
  },
}

/** depth (D215) - deep ambient with a sonar: E minor (Em9, Cmaj9, Am9, Bsus), two bars each at 60 BPM, a long pad,
 *  a sub that breathes, a high ping every second bar that answers itself an octave down (the scan), and a few
 *  low bells between, like points lighting up. */
const DP_CH = [[40, 47, 50, 54, 55], [36, 43, 47, 50, 55], [45, 52, 55, 59, 60], [47, 52, 54, 57, 59]]
const DP_DOTS = [64, 66, 67, 71, 74, 76]
const depth: Track = {
  bpm: 60,
  step: (b, i, t, spb) => {
    const bar = Math.floor(i / 16)
    const s = i % 16
    const ch = DP_CH[Math.floor(bar / 2) % 4]
    if (s === 0 && bar % 2 === 0) { pad(b, t, ch.map((n) => n + 12), spb * 32, 0.02, 900, 0.9); bass(b, t, ch[0] - 12, spb * 30, 0.055) }
    if (s === 0 && bar % 2 === 1) { bell(b, t, 88, 0.014, 0.95, 2.01); bell(b, t + spb * 3, 76, 0.009, 0.9, 2.01) }
    if (s % 4 === 2 && rnd(i) > 0.78) bell(b, t, DP_DOTS[Math.floor(rnd(i, 3) * DP_DOTS.length)], 0.016, 0.7)
  },
}

export const TRACKS: Record<string, Track> = { flight, buzz, blueprint, clay, depth }
