import type { ComponentType } from 'react'
import type { Look } from './look'

/** What a look supplies to the page. Each build aliases @look/registry to one of these. */
export interface LookRegistry {
  look: Look
  /** above the fold, never lazy (the H1 is the LCP) */
  Hero: ComponentType
  Services: ComponentType
  /** how we work: KM's launch hold, K and M's line through four screens */
  Process: ComponentType
  /** KM's fixed theme layers; null in single-ground looks */
  ThemeLayers: ComponentType | null
  /** A look that composes the whole home page itself (shot): App renders it in place of the
      shared Hero / WhyUs / Services / Process / Faq / Contact order. Never lazy: it holds the H1. */
  Home?: ComponentType
  /** A look's own inner pages (shot, D90): App renders each one in place of the shared legacy page,
      and Layout drops the legacy palette remap for them. Lazy components; absent = the legacy page. */
  pages?: Partial<Record<InnerPage, ComponentType>>
}

export type InnerPage = 'Service' | 'Portfolio' | 'Terms' | 'Privacy' | 'Accessibility' | 'NotFound'
