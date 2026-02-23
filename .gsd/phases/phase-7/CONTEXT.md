# Phase 7 Context — Polish, Test & Deploy

## Decisions
- **Performance check**: Run `npm run build` and check bundle sizes, ensure Sanity doesn't bloat main chunk
- **PageSpeed**: Target 85+ mobile (current optimization already achieved this)
- **Client guide**: Hebrew markdown document explaining Sanity Studio usage
- **Deployment**: Same Cloudflare Pages, add CORS origins in Sanity dashboard
- **Environment**: Document all required env vars

## Out of Scope
- Automated E2E tests (manual testing sufficient for V1)
- CI/CD pipeline changes

## Edge Cases
- Studio bundle is large (~2MB+) — must be in separate chunk, lazy-loaded
- CORS must include both production domain and any preview/staging domains
- Cloudflare Pages needs SPA fallback for /studio/* routes
