# Directus CMS Migration + Reusable Skill - COMPLETED

## Goal
Migrate MediaWave Israel website from Sanity CMS to Directus CMS (self-hosted, free).
Build reusable infrastructure for future clients. Keep Sanity intact in parallel.
Build a production-ready Claude skill for replicating this setup on any client project.

## Status: ALL PHASES COMPLETE + SKILL BUILT

---

## Completed
- [x] Phase 1: Docker Compose + Dependencies + npm scripts
- [x] Phase 2: SDK Integration Layer (8 files in src/directus/)
- [x] Phase 3: Seed Script + Start Directus (9 collections, all data seeded)
- [x] Phase 4: Migrate simple components (Services, WhyUs, HowWeWork, Packages, Contact)
- [x] Phase 5: Migrate complex components (Testimonials, FAQ, Blog, BlogPost) + prose-hebrew.css
- [x] Phase 6: Vite config (directus-sdk chunk) + Final verification
- [x] Hebrew Labels: Node.js script for UTF-8 safe Hebrew translations (65+ fields)
- [x] Reusable Skill: `directus-cms-setup` skill with 8-phase workflow

## Key Decisions
- **@directus/sdk v21 workaround**: Cast readItems/readSingleton as `any` to bypass strict schema generics
- **Collection creation**: Must include `schema: {}` in POST payload to create actual DB tables
- **Sanity coexistence**: Sanity Studio at /studio remains fully functional alongside Directus
- **Fallback data**: All components keep hardcoded fallbacks when Directus is offline
- **Hebrew labels via Node.js only**: PowerShell mangles UTF-8 Hebrew (shows ?????)

## Architecture
```
src/directus/
  client.ts       - createDirectus<DirectusSchema> with REST transport
  types.ts        - 10 TypeScript interfaces (snake_case)
  hooks.ts        - useDirectusQuery<T>(queryFn, deps) -> { data, loading, error }
  queries.ts      - 10 query functions using readItems/readSingleton
  imageUrl.ts     - assetUrl(fileId, options) -> URL string
  HtmlContent.tsx - DOMPurify sanitized HTML renderer
  mappers.ts      - 9 snake_case -> camelCase mapper functions
  index.ts        - barrel exports
```

## Reusable Skill: `directus-cms-setup`
```
.claude/skills/directus-cms-setup/
  SKILL.md                          - 8-phase workflow with AskUserQuestion discovery
  references/
    architecture.md                 - Complete SDK layer code patterns
    hebrew-labels.md                - Hebrew translation catalog (100+ labels)
  templates/
    docker-compose.yml              - Docker template
    env.example                     - Environment variables template
    seed-directus.ts                - Seed script template with field helpers
    set-hebrew-labels.ts            - Hebrew labels script template
    prose-hebrew.css                - RTL rich text CSS
    sdk-layer/
      client.ts, hooks.ts, imageUrl.ts, HtmlContent.tsx, index.ts
```

## Important Files
- `docker-compose.yml` - Directus v11 + SQLite, port 8055
- `scripts/seed-directus.ts` - Creates collections + seeds all data
- `scripts/set-hebrew-labels.ts` - Hebrew translations (65+ fields, 9 collections)
- `src/directus/` - SDK integration layer (8 files)
- `src/styles/prose-hebrew.css` - Rich text styles (replaces PortableText)
- `vite.config.ts` - Has directus-sdk manual chunk

## Environment
- Directus admin: http://localhost:8055 (admin@mediawave.co.il / admin123)
- Admin token: directus-admin-token
- npm scripts: directus:up, directus:down, directus:seed, directus:labels

## Verification Results
1. Build: `npm run build` - PASS (zero TS errors)
2. Directus: Running on localhost:8055 with seeded data
3. Bundle: directus-sdk-*.js chunk (5.16 kB) separate from main
4. Sanity: Studio chunks still present (coexistence)
5. Components: All 9 migrated, zero Sanity imports remaining
6. Fallback: Components work with hardcoded data when Directus is offline
7. Hebrew: All collection and field labels translated via Node.js script

## Next Steps (Future Work)
1. Add public read policy in Directus so components don't need admin token
2. Seed testimonials and projects data
3. Consider removing Sanity dependencies once fully confident in Directus
4. Production deployment: export static data or use hosted Directus
