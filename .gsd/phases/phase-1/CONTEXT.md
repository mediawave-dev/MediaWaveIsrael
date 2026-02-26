# Phase 1 Context — Infrastructure Setup

## Decisions
- **Docker**: Directus v11 official image with SQLite (zero-config DB, no Postgres needed)
- **Volumes**: database/ and uploads/ mounted as local dirs (gitignored), extensions/ tracked
- **CORS**: Allow http://localhost:5173 (Vite dev server)
- **Admin auth**: Static admin token via env var (for seed script), email/password for UI
- **npm scripts**: directus:up (docker compose up -d), directus:down (docker compose down), directus:seed (tsx scripts/seed-directus.ts)
- **Dependencies**: @directus/sdk, dompurify, @types/dompurify (devDep)
- **Package manager**: npm (existing project uses npm)

## Out of Scope
- Production deployment (V2 — will use static export or free tier hosting)
- Directus extensions development
- Admin panel Hebrew locale configuration (done manually in UI)

## Edge Cases
- Docker Desktop must be running on Windows before `directus:up`
- SQLite file locked when Directus container running — don't access directly
- Port 8055 must be available (check for conflicts)
- First startup takes longer (creates DB schema)
