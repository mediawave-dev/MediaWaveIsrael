# GSD State — Directus CMS Migration

## Current Position
- **Phase**: 1 - Infrastructure Setup
- **Status**: PLANNED — Ready for execution
- **Last Action**: All 6 phases planned with 9 atomic tasks (2026-02-23)

## Key Decisions
- **CMS**: Directus v11 (self-hosted, Docker + SQLite)
- **Hosting**: Local only (completely free)
- **Rich Text**: WYSIWYG HTML (replaces Sanity PortableText)
- **Coexistence**: Sanity stays at /studio, independent
- **Data**: Seed from existing fallbacks + keep fallbacks in components
- **Naming**: snake_case in Directus, mappers convert to camelCase for components

## Blockers
None.

## Next Action
`.\gsd-chain-directus.ps1` — Run overnight chain execution (all 6 phases).
Or `gsd execute 1` — Start phase 1 interactively.
