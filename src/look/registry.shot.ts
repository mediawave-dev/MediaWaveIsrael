// shot · one shot (DECISIONS #83). Ships with build:shot and the plain build. The look composes the
// whole home page itself (Home), so the shared hero and holds are not used; ThemeLayers is null
// because the page keeps one ground from top to bottom (#81).
import ShotHome from './shot/ShotHome'
import type { LookRegistry } from './registry.types'

const Unused = () => null

const registry: LookRegistry = {
  look: 'shot',
  Home: ShotHome,
  Hero: Unused,
  Services: Unused,
  Process: Unused,
  ThemeLayers: null,
}
export default registry
