# Directus CMS Migration — MediaWaveIsrael

## Vision
Replace Sanity CMS with self-hosted Directus CMS. Zero SaaS cost. Build reusable infrastructure for future client projects.

## Core Problem
Sanity CMS works but has vendor lock-in, proprietary GROQ queries, and ongoing SaaS dependency. Directus offers self-hosted freedom with SQL database, REST/GraphQL APIs, and RTL/Hebrew support (since v11.10).

## Target User
MediaWave developers (us) + future clients who need a free, self-managed CMS.

## Tech Stack

### Existing (keep all)
- **Framework**: React 18.3.1 + Vite 6.0.5 + TypeScript 5.6.2
- **Styling**: Tailwind CSS v4.1.18
- **Animations**: Framer Motion 12.26.2 + Lottie
- **Routing**: React Router DOM v7
- **CMS (current)**: Sanity v3 at /studio (keep intact, independent)

### Adding
- **CMS (new)**: Directus v11 (self-hosted, Docker + SQLite)
- **SDK**: @directus/sdk (REST, typed, tree-shakeable)
- **Sanitization**: dompurify (for WYSIWYG HTML rendering)
- **Infrastructure**: Docker Compose for local development

## Key Constraints
1. Sanity code stays intact — both systems coexist independently
2. Completely free (local Docker + SQLite, no hosting costs)
3. All 9 consumer components switch from Sanity to Directus
4. Fallback data preserved in components for resilience
5. WYSIWYG HTML replaces Sanity PortableText for rich content

## Success Criteria
1. All 10 content types managed through Directus admin (localhost:8055)
2. All 9 components fetch from Directus instead of Sanity
3. Fallback data works when Directus is offline
4. Sanity Studio at /studio still works independently
5. `npm run build` passes with no TS errors
6. Hebrew RTL content renders correctly from Directus
