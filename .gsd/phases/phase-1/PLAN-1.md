# Phase 1 / Task 1 — Docker Compose + Dependencies + npm Scripts

## Goal
Set up local Directus infrastructure: Docker Compose, directory structure, gitignore, npm deps, and scripts.

## Context
Project: `G:/Web-Dev/MediaWaveIsrael`. React 18 + Vite 6 + TypeScript. Currently uses Sanity CMS (keep intact).

## Steps

### 1. Create `docker-compose.yml` in project root
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
      ADMIN_EMAIL: ${DIRECTUS_ADMIN_EMAIL:-admin@mediawave.co.il}
      ADMIN_PASSWORD: ${DIRECTUS_ADMIN_PASSWORD:-admin123}
      ADMIN_TOKEN: ${DIRECTUS_ADMIN_TOKEN:-directus-admin-token}
      DB_CLIENT: sqlite3
      DB_FILENAME: /directus/database/data.db
      CORS_ENABLED: "true"
      CORS_ORIGIN: "http://localhost:5173,http://localhost:4173"
      PUBLIC_URL: ${DIRECTUS_PUBLIC_URL:-http://localhost:8055}
```

### 2. Create directory structure
```
directus/
  database/      # SQLite DB file (gitignored)
  uploads/       # Media files (gitignored)
  extensions/    # Custom extensions (tracked)
    .gitkeep
```
Create dirs and .gitkeep:
```bash
cmd /c mkdir directus\database directus\uploads directus\extensions
# Create .gitkeep in extensions
```

### 3. Update `.gitignore`
Read `.gitignore` first. Add:
```
# Directus
directus/database/
directus/uploads/
```

### 4. Install npm dependencies
```bash
npm install @directus/sdk dompurify
npm install -D @types/dompurify
```

### 5. Add npm scripts to `package.json`
Read `package.json` first. Add to `scripts`:
```json
"directus:up": "docker compose up -d",
"directus:down": "docker compose down",
"directus:seed": "tsx scripts/seed-directus.ts"
```
Note: `tsx` is already installed as devDependency.

### 6. Update `.env.example`
Read `.env.example` first. Add Directus env vars:
```
# Directus CMS (local)
VITE_DIRECTUS_URL=http://localhost:8055
DIRECTUS_ADMIN_EMAIL=admin@mediawave.co.il
DIRECTUS_ADMIN_PASSWORD=admin123
DIRECTUS_ADMIN_TOKEN=directus-admin-token
DIRECTUS_SECRET=change-me-to-a-random-string
```

### 7. Verify Docker Compose syntax
```bash
docker compose config
```

## Acceptance Criteria
- [ ] `docker-compose.yml` exists in project root with Directus v11 + SQLite config
- [ ] `directus/extensions/.gitkeep` exists (tracked)
- [ ] `directus/database/` and `directus/uploads/` are in .gitignore
- [ ] `@directus/sdk` and `dompurify` installed in package.json
- [ ] `@types/dompurify` in devDependencies
- [ ] npm scripts `directus:up`, `directus:down`, `directus:seed` exist
- [ ] `.env.example` has Directus env vars
- [ ] `docker compose config` validates successfully
- [ ] `npm run build` still succeeds (no breaking changes)
