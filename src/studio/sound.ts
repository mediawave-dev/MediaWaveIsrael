// The sound switch everyone shares (D190): the shell's button, the invitation (D199), Clay's "play the
// tape" pill and the room's spinning reels. The engine itself (music/) is loaded when the invitation
// shows or the visitor first turns the sound on; once loaded, turning it on runs inside the tap itself
// (a phone starts audio only from the gesture, not from a promise after it).
type Listener = (on: boolean) => void

let on = false
let world = ''
const listeners = new Set<Listener>()
type Engine = typeof import('./music/engine')
let engine: Promise<Engine> | null = null
let mod: Engine | null = null
const load = () => (engine ??= import('./music/engine').then((m) => (mod = m)))

export const isSoundOn = () => on
export function onSoundChange(f: Listener): () => void { listeners.add(f); return () => { listeners.delete(f) } }

/** fetch the engine ahead of the tap that will need it */
export function preloadSound() { void load().then((m) => m.bake()).catch(() => {}) }

/** turn the music on or off (only ever from a visitor's gesture, or to carry on music already playing) */
export function setSoundOn(v: boolean) {
  on = v
  listeners.forEach((f) => f(v))
  if (mod) mod.setSound(v, world)
  else void load().then((m) => m.setSound(on, world)).catch(() => {})
}

/** the world on screen: its music plays if the sound is on, crossfading from the last one */
export function setWorld(id: string) {
  world = id
  mod?.playWorld(id)
}

/** the wave starts to cover the screen: the playing track dips toward the next one */
export function dimWorld(ms: number) { mod?.dim(ms) }

/** leaving the worlds: their track falls away (the visitor's choice is kept for the next visit to them) */
export function leaveWorlds() { mod?.leave() }

export async function soundLevel(): Promise<() => number> {
  const m = await load()
  return m.level
}
