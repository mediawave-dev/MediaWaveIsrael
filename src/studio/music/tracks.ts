// One piece of music for each world (D190), in the genres people like to have on while they browse:
// flight - cinematic ambient (slow pads in D major, glass bells over them, a deep root);
// buzz - sunny lo-fi (a swung beat at 86 BPM, electric-piano chords on the genre's falling IV-iii-ii-V, a bass,
//        a marimba line, a little vinyl dust);
// blueprint - minimal electronica (a sixteenth-note arpeggio through a breathing filter at 108 BPM, a soft
//        kick, rim ticks like a clock, a sub bass);
// clay - a warm morning tape (kalimba arpeggios, a low pad, brushes, tape hiss and a slow wobble).
// Steps are sixteenths; a track gets the step number (from 0, forever) and the time to play it at.
import { bass, bell, brush, crackle, hat, kalimba, keys, kick, marimba, pad, pluck, rim, snare, type Bus } from './voices'

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

/** A minor: Am9, Fmaj7, Cmaj7, G6 (two bars each), arpeggiated */
const BP_CH = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 67], [48, 55, 59, 64, 67], [55, 59, 62, 64, 69]]
const blueprint: Track = {
  bpm: 108,
  step: (b, i, t, spb) => {
    const bar = Math.floor(i / 16)
    const s = i % 16
    const ch = BP_CH[Math.floor(bar / 2) % 4]
    const order = [0, 2, 1, 3, 2, 4, 3, 1]
    const sweep = 900 + 1500 * (0.5 + 0.5 * Math.sin(i / 48))
    pluck(b, t, ch[order[s % 8]] + (s >= 8 ? 12 : 0), 0.026, sweep)
    if (s === 0 || s === 8) kick(b, t, 0.2)
    if (s === 4 || s === 12) rim(b, t, 0.05)
    if (s % 2 === 1 && rnd(i) > 0.55) rim(b, t, 0.018)
    if (s === 0 && bar % 2 === 0) { bass(b, t, ch[0] - 12, spb * 30, 0.07); pad(b, t, ch.slice(0, 3), spb * 32, 0.012, 900, 0.5) }
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

export const TRACKS: Record<string, Track> = { flight, buzz, blueprint, clay }
