# Phase 6 / Task 1 — Vite Config + Env + Final Verification

## Goal
Update build configuration and verify the entire Directus integration works end-to-end.

## Context
Project: `G:/Web-Dev/MediaWaveIsrael`. All 9 components migrated (Phases 4-5). Need to finalize build config and run verification checklist.

## Steps

### 1. Update `vite.config.ts`
Read file first. Add directus-sdk to manualChunks:
```typescript
// In build.rollupOptions.output.manualChunks, add:
'directus-sdk': ['@directus/sdk'],
```
Keep existing sanity chunks — both coexist.

### 2. Update `.env.example` if not already done
Verify these vars exist (should be from Phase 1):
```
VITE_DIRECTUS_URL=http://localhost:8055
DIRECTUS_ADMIN_EMAIL=admin@mediawave.co.il
DIRECTUS_ADMIN_PASSWORD=admin123
DIRECTUS_ADMIN_TOKEN=directus-admin-token
DIRECTUS_SECRET=change-me-to-a-random-string
```

### 3. Verify .gitignore
Ensure these are present:
```
directus/database/
directus/uploads/
```

### 4. Run full build
```bash
npm run build
```
Must pass with zero TS errors.

### 5. Check bundle output
After build, verify `dist/assets/` contains:
- `directus-sdk-*.js` chunk (separate from main)
- Sanity chunks still present (coexistence)

### 6. Verification checklist (document results)
Run each check and note pass/fail:

1. **Build**: `npm run build` — no errors
2. **Dev server**: `npm run dev` — site loads at localhost:5173
3. **Directus admin**: `npm run directus:up` then visit localhost:8055
4. **Seed data**: `npm run directus:seed` — data populated
5. **Section data**: Each section loads data from Directus (check Network tab for /items/ requests)
6. **Fallback**: Stop Directus (`npm run directus:down`) — site still works with fallback data
7. **Sanity Studio**: Visit /studio — still works independently
8. **Hebrew content**: Text displays correctly RTL from Directus

### 7. Create phase verification summary
Document all check results. If any fail, fix before marking complete.

## Acceptance Criteria
- [ ] `vite.config.ts` has `directus-sdk` manual chunk
- [ ] Build output has separate directus-sdk chunk
- [ ] Sanity chunks still exist in build (coexistence)
- [ ] `npm run build` passes with zero TS errors
- [ ] All 8 verification checks pass
- [ ] Fallback data works when Directus is offline
- [ ] Sanity Studio at /studio works independently
