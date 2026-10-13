// Dev: all three registries load and ?look= picks one at boot (look.ts). Builds alias
// @look/registry to registry.<look>.ts, so production ships one look's scenes.
import { LOOK } from './look'
import k from './registry.k'
import m from './registry.m'
import km from './registry.km'

export default LOOK === 'k' ? k : LOOK === 'm' ? m : km
