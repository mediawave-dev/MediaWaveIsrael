# Phase 4 / Task 2 — Migrate Packages + Contact

## Goal
Switch Packages and Contact components from Sanity to Directus.

## Context
Project: `G:/Web-Dev/MediaWaveIsrael`. Task 1 migrated Services, WhyUs, HowWeWork. Contact uses a singleton query (site_settings).

## Important
- Contact uses singleton (readSingleton) — no `.map()` needed, returns single object
- Keep fallback data in both components

## Steps

### 1. Update `src/components/sections/Packages.tsx`
Read file first. Replace:
```diff
- import { useSanityQuery } from '../../sanity/hooks'
- import { PACKAGES_QUERY } from '../../sanity/queries'
+ import { useDirectusQuery } from '../../directus/hooks'
+ import { getPackages } from '../../directus/queries'
+ import { mapPackage } from '../../directus/mappers'
+ import type { DirectusPackage } from '../../directus/types'

- const { data, loading, error } = useSanityQuery<...>(PACKAGES_QUERY)
+ const { data: raw, loading, error } = useDirectusQuery<DirectusPackage[]>(getPackages)
+ const data = raw?.map(mapPackage) ?? null
```

### 2. Update `src/components/sections/Contact.tsx`
Read file first. Singleton pattern (no .map):
```diff
- import { useSanityQuery } from '../../sanity/hooks'
- import { SITE_SETTINGS_QUERY } from '../../sanity/queries'
+ import { useDirectusQuery } from '../../directus/hooks'
+ import { getSiteSettings } from '../../directus/queries'
+ import { mapSiteSettings } from '../../directus/mappers'
+ import type { DirectusSiteSettings } from '../../directus/types'

- const { data: settings } = useSanityQuery<SiteSettings>(SITE_SETTINGS_QUERY)
+ const { data: rawSettings } = useDirectusQuery<DirectusSiteSettings>(getSiteSettings)
+ const settings = rawSettings ? mapSiteSettings(rawSettings) : null
```

### 3. Verify build
```bash
npm run build
```

## Acceptance Criteria
- [ ] Packages.tsx uses useDirectusQuery + getPackages + mapPackage
- [ ] Contact.tsx uses useDirectusQuery + getSiteSettings + mapSiteSettings
- [ ] Contact form submission unchanged (VITE_CONTACT_ENDPOINT)
- [ ] Both keep fallback data
- [ ] No visual changes
- [ ] No Sanity imports in these 2 files
- [ ] `npm run build` succeeds
