# GSD State — Sanity CMS Integration

## Current Position
- **Phase**: Phase 1 COMPLETE — moving to Phase 2
- **Status**: EXECUTING
- **Last Action**: Phase 1 completed (2026-02-22)

## Key Decisions
- **CMS**: Sanity v3 (headless CMS)
- **Studio**: Embedded in same project at `/studio` route (lazy-loaded)
- **Data Fetching**: Client-side runtime via GROQ + @sanity/client (CDN cached)
- **Preview**: Draft preview via `?preview=true` with previewDrafts perspective
- **Content Scope**: ALL 10 content types managed through Sanity
- **Language**: Hebrew-first with RTL support
- **Migration**: Node.js scripts with @sanity/client transactions
- **Deploy**: Cloudflare Pages (existing) with `_redirects` for SPA routing

## Phase Plan Summary
| Phase | Tasks | Status |
|-------|-------|--------|
| 1. Setup | PLAN-1, PLAN-2 | ✅ COMPLETE |
| 2. Schemas | PLAN-1, PLAN-2 | ⬜ Ready |
| 3. Studio | PLAN-1 | ⬜ Ready |
| 4. Migration | PLAN-1, PLAN-2 | ⬜ Ready |
| 5. Frontend | PLAN-1, PLAN-2, PLAN-3 | ⬜ Ready |
| 6. Preview | PLAN-1 | ⬜ Ready |
| 7. Polish | PLAN-1, PLAN-2 | ⬜ Ready |

## Blockers
- **Phase 4 requires**: Sanity project created on sanity.io + write token (manual step by user)

## Next Action
Execute Phase 2: Create Sanity schemas for all content types
