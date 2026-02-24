---
name: directus-cms-setup
description: Set up a complete Directus CMS for any client website project. Use when user says "CMS", "directus", "content management", "set up CMS for client", "add CMS to project", "manage content", or needs a headless CMS with Hebrew RTL support. Handles Docker setup, SDK integration, data seeding, Hebrew translations, and deployment planning.
metadata:
  author: MediaWave Israel
  version: 1.0.0
  category: infrastructure
  tags: [cms, directus, hebrew, rtl, docker, react]
---

# Directus CMS Setup Skill

Build a complete, production-ready Directus CMS integration for any React/Vite website.
Includes full Hebrew RTL admin panel, typed SDK layer, and deployment cost analysis.

## Critical: Follow This Workflow

This skill uses an interactive discovery phase before generating any code.
NEVER skip the discovery phase. ALWAYS ask questions first.

---

## Phase 1: Discovery (AskUserQuestion)

Before writing ANY code, ask the user these questions using AskUserQuestion:

### Question Set 1: Project Basics

```
Question: "What type of website is this project?"
Options:
- "Landing page (single page, few sections)"
- "Business website (multi-page, services/portfolio/contact)"
- "Blog / content site (articles, categories, authors)"
- "E-commerce (products, cart, checkout)"
```

```
Question: "What content does the client need to manage?"
MultiSelect: true
Options:
- "Services / features list"
- "Pricing / packages"
- "Blog posts / articles"
- "Portfolio / projects gallery"
- "Testimonials / reviews"
- "FAQ section"
- "Team members"
- "Contact info / site settings"
- "Products / catalog"
- "Events / schedule"
```

### Question Set 2: Technical Context

```
Question: "What's the frontend framework?"
Options:
- "React + Vite (Recommended)"
- "Next.js"
- "Astro"
- "Vue + Vite"
```

```
Question: "Does the project need Hebrew/RTL support?"
Options:
- "Yes - full Hebrew admin + content (Recommended for Israeli clients)"
- "No - English only"
- "Bilingual (Hebrew + English)"
```

### Question Set 3: Deployment & Pricing

```
Question: "How should Directus be hosted for the client?"
Options:
- "Shared VPS - cheapest, I manage multiple clients (~$5/month shared)"
- "Dedicated VPS per client (~$6/month per client)"
- "Client manages their own (I just set it up)"
- "Local only for now (development)"
```

Present cost analysis based on answer (see Pricing Reference below).

---

## Phase 2: Schema Design

Based on the selected content types, design the Directus collections.

### Collection Design Rules

1. **All field names in snake_case** (Directus convention)
2. **Every list collection gets a `sort` field** (hidden integer, for drag-and-drop ordering)
3. **Rich text uses `input-rich-text-html` interface** (NOT markdown)
4. **Images use `file-image` interface** with `special: ['file']`
5. **JSON arrays** (tags, features) use `input-code` interface
6. **Singleton collections** (site_settings) have `singleton: true` in meta

### Standard Collection Templates

Use templates from `references/architecture.md` for each content type.
Map the user's selected content types to the appropriate collection schemas.

### Present Schema to User

Before generating code, show the user a table of planned collections:

```
| Collection | Fields | Type |
|-----------|--------|------|
| services | title, description, icon, tags, sort | List |
| site_settings | site_name, phone, email, logo | Singleton |
```

Ask: "Does this schema look right? Any fields to add or remove?"

---

## Phase 3: Generate Infrastructure

### Step 1: Docker Compose

Create `docker-compose.yml`:

```yaml
services:
  directus:
    image: directus/directus:11
    ports:
      - "8055:8055"
    volumes:
      - ./directus/database:/directus/database
      - ./directus/uploads:/directus/uploads
      - ./directus/extensions:/directus/extensions
    environment:
      SECRET: ${DIRECTUS_SECRET:-change-me-to-a-random-string}
      ADMIN_EMAIL: ${DIRECTUS_ADMIN_EMAIL:-admin@example.com}
      ADMIN_PASSWORD: ${DIRECTUS_ADMIN_PASSWORD:-admin123}
      ADMIN_TOKEN: ${DIRECTUS_ADMIN_TOKEN:-directus-admin-token}
      DB_CLIENT: sqlite3
      DB_FILENAME: /directus/database/data.db
      CORS_ENABLED: "true"
      CORS_ORIGIN: "http://localhost:5173,http://localhost:4173"
      PUBLIC_URL: ${DIRECTUS_PUBLIC_URL:-http://localhost:8055}
      DEFAULT_LANGUAGE: he-IL
```

**IMPORTANT**: Adjust ADMIN_EMAIL to match client domain. Adjust CORS_ORIGIN for the actual frontend URL.

### Step 2: Directory Structure

```bash
mkdir -p directus/database directus/uploads directus/extensions
```

### Step 3: Gitignore

Add to `.gitignore`:
```
directus/database/
directus/uploads/
```

### Step 4: Dependencies

```bash
npm install @directus/sdk dompurify
npm install -D @types/dompurify
```

### Step 5: NPM Scripts

Add to `package.json` scripts:
```json
{
  "directus:up": "docker compose up -d",
  "directus:down": "docker compose down",
  "directus:seed": "npx tsx scripts/seed-directus.ts",
  "directus:labels": "npx tsx scripts/set-hebrew-labels.ts"
}
```

### Step 6: Environment Variables

Add to `.env.example`:
```
VITE_DIRECTUS_URL=http://localhost:8055
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=admin123
DIRECTUS_ADMIN_TOKEN=directus-admin-token
DIRECTUS_SECRET=change-me-to-a-random-string
```

---

## Phase 4: Generate SDK Integration Layer

Create 8 files in `src/directus/`. See `references/architecture.md` for complete templates.

### File Generation Order (dependencies matter):

1. **types.ts** - TypeScript interfaces for all collections (snake_case)
2. **client.ts** - Directus SDK client initialization
3. **hooks.ts** - `useDirectusQuery<T>(queryFn, deps)` React hook
4. **queries.ts** - Query functions per collection (readItems/readSingleton)
5. **mappers.ts** - snake_case to camelCase mapper per collection
6. **imageUrl.ts** - `assetUrl(fileId, options)` URL builder
7. **HtmlContent.tsx** - DOMPurify-based HTML renderer
8. **index.ts** - Barrel exports

### Critical SDK Pattern

The @directus/sdk v21+ has strict TypeScript generics. Use this workaround:

```typescript
// queries.ts - Cast readItems/readSingleton to bypass strict generics
import { readItems, readSingleton } from '@directus/sdk'
const items = readItems as any
const singleton = readSingleton as any

export const getServices = () => items('services', {
  sort: ['sort'],
  fields: ['id', 'title', 'description', ...],
})
```

### Hook Pattern

```typescript
// hooks.ts
export function useDirectusQuery<T>(queryFn: () => any, deps: unknown[] = []) {
  // useState for data/loading/error
  // useRef for stable queryFn reference
  // useEffect with AbortController for cleanup
  // directus.request(queryFn()) to execute
  return { data, loading, error }
}
```

### Mapper Pattern

Every collection gets a mapper function:
```typescript
export function mapService(d: DirectusService) {
  return {
    _id: String(d.id),
    title: d.title,
    description: d.description,
    lottieAnimation: d.lottie_animation ?? undefined,
    // ... snake_case -> camelCase
  }
}
```

---

## Phase 5: Generate Seed Script

Create `scripts/seed-directus.ts`:

### Seed Script Pattern

```typescript
const BASE = 'http://localhost:8055'
const TOKEN = 'directus-admin-token'

// 1. Health check
// 2. Create collections (with schema: {} - CRITICAL!)
// 3. Create fields per collection
// 4. Seed initial data (idempotent - check before insert)
```

### CRITICAL: Collection Creation Must Include `schema: {}`

```typescript
// WRONG - creates metadata-only collection (no DB table!)
await fetch(`${BASE}/collections`, {
  body: JSON.stringify({ collection: 'services', meta: { ... } })
})

// CORRECT - creates actual database table
await fetch(`${BASE}/collections`, {
  body: JSON.stringify({ collection: 'services', schema: {}, meta: { ... } })
})
```

This is the #1 gotcha. Without `schema: {}`, Directus creates collection metadata but NO database table, and all item operations return 403.

### Field Type Helpers

Use these helper functions in the seed script:

```typescript
const stringField = (field, meta = {}) => ({
  field, type: 'string',
  meta: { interface: 'input', ...meta }
})

const textField = (field, meta = {}) => ({
  field, type: 'text',
  meta: { interface: 'input-multiline', ...meta }
})

const richTextField = (field) => ({
  field, type: 'text',
  meta: { interface: 'input-rich-text-html' }
})

const jsonField = (field) => ({
  field, type: 'json',
  meta: { interface: 'input-code', options: { language: 'json' } }
})

const fileField = (field) => ({
  field, type: 'uuid',
  meta: { interface: 'file-image', special: ['file'] }
})

const boolField = (field) => ({
  field, type: 'boolean',
  meta: { interface: 'boolean' },
  schema: { default_value: false }
})

const sortField = () => ({
  field: 'sort', type: 'integer',
  meta: { interface: 'input', hidden: true }
})
```

### Ask User for Seed Data

After schema generation, ask:

```
Question: "Do you have initial content to seed, or should I create placeholder data?"
Options:
- "I have content ready (I'll provide it)"
- "Create Hebrew placeholder data"
- "Create English placeholder data"
- "Skip seeding for now"
```

---

## Phase 6: Hebrew Localization

If Hebrew is selected, create `scripts/set-hebrew-labels.ts`:

### Translation Script Pattern

```typescript
const BASE = 'http://localhost:8055'
const TOKEN = 'directus-admin-token'

// MUST use Node.js (not PowerShell) for proper UTF-8 encoding!

// 1. Set admin user language
await patch(`${BASE}/users/me`, { language: 'he-IL' })

// 2. Translate collection names
await patch(`${BASE}/collections/${name}`, {
  meta: {
    translations: [{
      language: 'he-IL',
      translation: hebrewName,
      singular: hebrewName,
      plural: hebrewName,
    }]
  }
})

// 3. Translate field names
await patch(`${BASE}/fields/${col}/${field}`, {
  meta: {
    translations: [{ language: 'he-IL', translation: hebrewLabel }]
  }
})
```

### CRITICAL: UTF-8 Encoding

ALWAYS use Node.js/tsx for Hebrew label scripts. PowerShell on Windows mangles Hebrew characters (shows as ?????). This is a known encoding issue.

See `references/hebrew-labels.md` for the complete Hebrew translation catalog.

---

## Phase 7: Component Migration (if replacing existing CMS)

If migrating from another CMS (Sanity, Strapi, WordPress, etc.):

### Migration Pattern per Component

```typescript
// BEFORE (e.g., Sanity)
import { useSanityQuery } from '../../sanity/hooks'
import { SERVICES_QUERY } from '../../sanity/queries'
const { data, loading } = useSanityQuery(SERVICES_QUERY)

// AFTER (Directus)
import { useDirectusQuery } from '../../directus/hooks'
import { getServices } from '../../directus/queries'
import { mapService } from '../../directus/mappers'
import type { DirectusService } from '../../directus/types'
const { data: raw, loading } = useDirectusQuery<DirectusService[]>(getServices)
const data = raw?.map(mapService) ?? null
```

### Key Replacements

| Old CMS | Directus Replacement |
|---------|---------------------|
| GROQ queries | readItems/readSingleton SDK functions |
| urlFor(image) | assetUrl(fileId, options) |
| PortableText | HtmlContent (DOMPurify) |
| slug.current | slug (plain string) |

---

## Phase 8: Build Config & Verification

### Vite Manual Chunk

Add to `vite.config.ts` manualChunks:
```typescript
'directus-sdk': ['@directus/sdk'],
```

### Verification Checklist

Run and confirm each:

1. `npm run build` - zero TypeScript errors
2. `npm run directus:up` - Directus accessible at localhost:8055
3. `npm run directus:seed` - all collections created, data populated
4. `npm run directus:labels` - Hebrew translations applied (if applicable)
5. `npm run dev` - site loads, sections show CMS data
6. Stop Directus - fallback data appears (graceful degradation)
7. Build output has separate `directus-sdk-*.js` chunk

---

## Pricing Reference

Present this to the user when discussing deployment:

### Hosting Options & Costs

| Option | Monthly Cost | Best For |
|--------|-------------|----------|
| Shared VPS (Hetzner) | ~$5 total (split across clients) | Agency managing 5+ clients |
| Dedicated VPS (DigitalOcean) | ~$6/client | Client wants independence |
| Railway / Fly.io | ~$5/client | Easy Docker deploy |
| Directus Cloud | $99+/month | Enterprise (overkill for small biz) |

### Suggested Client Pricing

| Service | Price |
|---------|-------|
| CMS setup (one-time) | $150-300 |
| Monthly CMS hosting + maintenance | $15-30/month |
| Content management training | $50-100 |

### Business Model: Shared VPS

```
Your cost: ~$5/month (one VPS)
5 clients x $20/month = $100/month revenue
Profit margin: 95%
```

Directus is free under BSL 1.1 license (companies under $5M annual revenue).

---

## Troubleshooting

### 403 on Items After Collection Creation
**Cause**: Collection created without `schema: {}` property.
**Fix**: Delete collection, recreate with `schema: {}` in payload.

### Hebrew Shows as ????? in Admin Panel
**Cause**: PowerShell encoding issue on Windows.
**Fix**: Use Node.js/tsx script for Hebrew translations, never PowerShell.

### SDK TypeScript Errors (never/any)
**Cause**: @directus/sdk v21 strict generics.
**Fix**: Cast readItems/readSingleton as `any`:
```typescript
const items = readItems as any
```

### Docker Not Found
**Cause**: Docker Desktop not installed or not in PATH.
**Fix**: Install Docker Desktop, restart terminal, or refresh PATH from registry.

### Directus Takes Long to Start (first time)
**Cause**: First boot pulls Docker image + runs migrations.
**Fix**: Wait 30-60 seconds. Use health check polling:
```bash
curl http://localhost:8055/server/health
```
