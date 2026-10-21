// The sound switch everyone shares (D190): the shell's button, Clay's "play the tape" pill and the room's
// spinning reels. The engine itself (music/) is loaded only when the visitor first turns the sound on.
type Listener = (on: boolean) => void

let on = false
let world = ''
const listeners = new Set<Listener>()
let engine: Promise<typeof import('./music/engine')> | null = null
const load = () => (engine ??= import('./music/engine'))

export const isSoundOn = () => on
export function onSoundChange(f: Listener): () => void { listeners.add(f); return () => { listeners.delete(f) } }

/** turn the music on or off (only ever from a visitor's gesture) */
export async function setSoundOn(v: boolean) {
  on = v
  listeners.forEach((f) => f(v))
  const m = await load()
  m.setSound(v, world)
}

/** the world on screen: its music plays if the sound is on, crossfading from the last one */
export function setWorld(id: string) {
  world = id
  if (engine) void engine.then((m) => m.playWorld(id))
}

export async function soundLevel(): Promise<() => number> {
  const m = await load()
  return m.level
}
