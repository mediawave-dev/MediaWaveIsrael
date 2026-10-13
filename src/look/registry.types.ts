import type { ComponentType } from 'react'
import type { Look } from './look'

/** What a look supplies to the page. Each build aliases @look/registry to one of these. */
export interface LookRegistry {
  look: Look
  /** above the fold, never lazy (the H1 is the LCP) */
  Hero: ComponentType
  Services: ComponentType
  /** null: the page keeps its legacy HowWeWork for now */
  Process: ComponentType | null
  /** KM's fixed theme layers; null in single-ground looks */
  ThemeLayers: ComponentType | null
}
