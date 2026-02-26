# Phase 3 Context — Seed Script

## Decisions
- **Script location**: scripts/seed-directus.ts (run with tsx)
- **Data sources**: Existing fallback data in components + scripts/migrate-to-sanity.ts
- **Schema creation**: Use Directus SDK admin API to create collections and fields programmatically
- **FAQ answers**: Convert Sanity PortableText text blocks to HTML `<p>` tags
- **Idempotent**: Check if collection exists before creating, use upsert for items
- **Admin token**: Use static token from DIRECTUS_ADMIN_TOKEN env var
- **Images**: No image upload in seed — use placeholder file IDs or skip image fields

## Out of Scope
- Image migration from Sanity CDN to Directus (manually upload later via admin)
- Blog post content migration (create sample posts in admin later)

## Edge Cases
- Directus must be running (`npm run directus:up`) before seed
- Collection creation order matters: create collections first, then insert items
- sort field: Directus has built-in sort — set sort_field in collection meta
- JSON fields need proper type: 'json' in schema, arrays stored as JSON
