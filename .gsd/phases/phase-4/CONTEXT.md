# Phase 4 Context — Component Migration (Simple Sections)

## Decisions
- **Migration order**: Services, WhyUs, HowWeWork (PLAN-1), then Packages, Contact (PLAN-2)
- **Pattern**: Replace imports only — useSanityQuery to useDirectusQuery + mapper
- **Fallback data**: Preserved in components — used when Directus returns error/null
- **Visual changes**: ZERO — component templates stay identical
- **Data flow**: useDirectusQuery(getX) -> raw data -> mapX() -> same interface as before

## Out of Scope
- Removing old Sanity imports (keep them commented out for reference)
- Changing component visual design or animations
- Adding new features to components

## Edge Cases
- Services has tags as JSON array — mapper must handle null/undefined
- Packages `features` is JSON array — same handling
- Contact uses singleton query (site_settings) — different query pattern
- WhyUs `color` is string dropdown — direct pass-through in mapper
- HowWeWork `animation_path` (snake) to `animationPath` (camel) mapping
