// M · floating objects. Ships with build:m only (vite.config alias).
import { lazy } from 'react'
import HeroVoid from './scenes/HeroVoid'
import type { LookRegistry } from './registry.types'

const registry: LookRegistry = {
  look: 'm',
  Hero: HeroVoid,
  Services: lazy(() => import('./sections/ServicesFlight')),
  Process: lazy(() => import('./sections/ProcessLine')),
  ThemeLayers: null,
}
export default registry
