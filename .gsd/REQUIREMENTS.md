# Requirements — Directus CMS Migration

## V1 — Core Migration (Must Have)

### Infrastructure (R1-R3)
- **R1**: Docker Compose with Directus v11 + SQLite (zero external dependencies)
- **R2**: Directory structure: directus/database/ (gitignored), directus/uploads/ (gitignored), directus/extensions/
- **R3**: npm scripts: directus:up, directus:down, directus:seed

### Collections — Data Model (R4-R6)
- **R4**: 10 Directus collections matching Sanity schema types (snake_case naming)
- **R5**: Field types: string, text, json (arrays), integer (sort), boolean, datetime, file (images), HTML (WYSIWYG)
- **R6**: Seed script populates all collections from existing fallback data

### SDK Integration (R7-R14)
- **R7**: `client.ts` — createDirectus with REST transport, typed schema
- **R8**: `types.ts` — TypeScript interfaces for all 10 collections (snake_case)
- **R9**: `hooks.ts` — `useDirectusQuery` hook returning `{ data, loading, error }`
- **R10**: `queries.ts` — readItems/readSingleton for each collection
- **R11**: `imageUrl.ts` — `assetUrl(fileId, options)` helper for image transforms
- **R12**: `HtmlContent.tsx` — DOMPurify-sanitized HTML renderer (replaces PortableText)
- **R13**: `mappers.ts` — Directus snake_case to component camelCase adapters
- **R14**: `index.ts` — barrel exports

### Data Seeding (R15-R16)
- **R15**: Seed script creates all collections via Directus SDK (admin token)
- **R16**: Seed data sourced from existing fallback data in components + migrate-to-sanity.ts

### Component Migration — Simple (R17)
- **R17**: Services, WhyUs, HowWeWork, Packages, Contact switch from useSanityQuery to useDirectusQuery with mappers

### Component Migration — Complex (R18-R20)
- **R18**: Testimonials — replace urlFor() with assetUrl()
- **R19**: FAQ — replace PortableText with HtmlContent
- **R20**: Blog + BlogPost — replace both urlFor() and PortableText with assetUrl() and HtmlContent

### Build & Environment (R21-R22)
- **R21**: vite.config.ts updated with directus-sdk manual chunk
- **R22**: .env.example updated with Directus env vars

### Coexistence (R23-R24)
- **R23**: Sanity Studio at /studio works independently (untouched)
- **R24**: Both CMS systems coexist — no shared code, no interference

### Quality (R25-R27)
- **R25**: `npm run build` passes with zero TS errors
- **R26**: Fallback data works when Directus is offline
- **R27**: Hebrew RTL content renders correctly from Directus

## V2 — Nice to Have (Future)
- Static data export (prebuild fetch to JSON, build with zero runtime CMS dependency)
- Remove Sanity completely after Directus proven stable
- Multi-language support
- Content scheduling
- Create reusable SKILL from this setup for future clients
