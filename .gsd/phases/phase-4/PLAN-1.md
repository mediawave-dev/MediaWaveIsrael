# Phase 4 / Task 1 — Migrate Services + WhyUs + HowWeWork

## Goal
Switch 3 simple section components from Sanity to Directus data source.

## Context
Project: `G:/Web-Dev/MediaWaveIsrael`. SDK layer in `src/directus/` (Phase 2). Components currently import from `../../sanity/hooks` and `../../sanity/queries`.

## Important
- DO NOT change visual design, animations, or layout
- Keep fallback data arrays in components
- Only change data-fetching imports and hook calls

## Steps

### 1. Update `src/components/sections/Services.tsx`
Read file first. Replace:
```diff
- import { useSanityQuery } from '../../sanity/hooks'
- import { SERVICES_QUERY } from '../../sanity/queries'
+ import { useDirectusQuery } from '../../directus/hooks'
+ import { getServices } from '../../directus/queries'
+ import { mapService } from '../../directus/mappers'
+ import type { DirectusService } from '../../directus/types'

- const { data, loading, error } = useSanityQuery<SanityService[]>(SERVICES_QUERY)
+ const { data: raw, loading, error } = useDirectusQuery<DirectusService[]>(getServices)
+ const data = raw?.map(mapService) ?? null
```
Keep: `const displayData = data ?? fallbackServices`

### 2. Update `src/components/sections/WhyUs.tsx`
Read file first. Same pattern:
```diff
- import { useSanityQuery } from '../../sanity/hooks'
- import { WHY_US_QUERY } from '../../sanity/queries'
+ import { useDirectusQuery } from '../../directus/hooks'
+ import { getWhyUs } from '../../directus/queries'
+ import { mapWhyUs } from '../../directus/mappers'
+ import type { DirectusWhyUs } from '../../directus/types'
```

### 3. Update `src/components/sections/HowWeWork.tsx`
Read file first. Same pattern:
```diff
- import { useSanityQuery } from '../../sanity/hooks'
- import { HOW_WE_WORK_QUERY } from '../../sanity/queries'
+ import { useDirectusQuery } from '../../directus/hooks'
+ import { getHowWeWork } from '../../directus/queries'
+ import { mapHowWeWork } from '../../directus/mappers'
+ import type { DirectusHowWeWork } from '../../directus/types'
```

### 4. Verify build
```bash
npm run build
```

## Acceptance Criteria
- [ ] Services.tsx uses useDirectusQuery + getServices + mapService
- [ ] WhyUs.tsx uses useDirectusQuery + getWhyUs + mapWhyUs
- [ ] HowWeWork.tsx uses useDirectusQuery + getHowWeWork + mapHowWeWork
- [ ] All 3 keep fallback data arrays
- [ ] No visual changes
- [ ] No Sanity imports remain in these 3 files
- [ ] `npm run build` succeeds
