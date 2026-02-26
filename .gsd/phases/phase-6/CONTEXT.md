# Phase 6 Context — Build Config & Verification

## Decisions
- **Vite config**: Add directus-sdk to manualChunks (separate from sanity chunks)
- **Env vars**: VITE_DIRECTUS_URL (public), DIRECTUS_ADMIN_TOKEN/KEY/SECRET (server-side only)
- **Gitignore**: directus/database/, directus/uploads/
- **CSS**: prose-hebrew.css with styles matching PortableTextComponents.tsx
- **Verification**: Full checklist — build, dev server, Directus fetch, fallback, Sanity coexistence

## Out of Scope
- Production deployment
- CI/CD pipeline changes
- Performance benchmarking

## Edge Cases
- VITE_DIRECTUS_URL defaults to localhost:8055 — production would need different value
- DIRECTUS_ADMIN_TOKEN should NOT have VITE_ prefix (would be exposed in client bundle)
- Sanity chunks must still exist in build output (both CMS chunks coexist)
