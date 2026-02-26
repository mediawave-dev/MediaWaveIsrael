# Phase 3 / Task 1 — Seed Script for All Collections

## Goal
Create a seed script that populates Directus with all content data from existing fallback data.

## Context
Project: `G:/Web-Dev/MediaWaveIsrael`. Docker Compose created (Phase 1), but Directus not yet started — **must start in Step 0 below**. SDK layer in `src/directus/` (Phase 2). Seed data in `scripts/migrate-to-sanity.ts` and component fallback arrays.

## Steps

### 0. Start Directus (prerequisite)
Directus must be running before seeding. Start it and wait for it to be ready:
```bash
docker compose up -d
```
Then verify it's reachable (retry up to 30 seconds):
```bash
# Wait for Directus to be ready (may take 10-20 seconds on first boot)
# Try: curl http://localhost:8055/server/health or just retry the seed script
```
If `curl` is not available on Windows, use PowerShell:
```powershell
# Quick health check
Invoke-WebRequest -Uri http://localhost:8055/server/health -UseBasicParsing
```
**First boot takes longer** — Directus creates the SQLite database and admin user.

### 1. Create `scripts/seed-directus.ts`
Use `@directus/sdk` with `staticToken` + `rest` for admin operations.

```typescript
import { createDirectus, rest, staticToken } from '@directus/sdk'

const DIRECTUS_URL = process.env.VITE_DIRECTUS_URL || 'http://localhost:8055'
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || 'directus-admin-token'

const admin = createDirectus(DIRECTUS_URL)
  .with(staticToken(ADMIN_TOKEN))
  .with(rest())
```

### 2. Create collections programmatically
For each of 10 collections, create via admin API (try/catch — skip if exists):

| Collection | Fields (type) |
|-----------|------|
| services | title(string), description(text), lottie_animation(string), lottie_size(integer), tags(json), sort(integer) |
| packages | name(string), price(string), description(text), features(json), ideal_for(string), cta(string), cta_link(string), popular(boolean), sort(integer) |
| why_us | title(string), description(text), lottie_animation(string), color(string), sort(integer) |
| how_we_work | step_number(string), title(string), description(text), animation_path(string), sort(integer) |
| faqs | question(string), answer(text — WYSIWYG), sort(integer) |
| blog_posts | title(string), slug(string), excerpt(text), content(text — WYSIWYG), featured_image(file), author(string), tags(json), published_at(datetime), status(string) |
| projects | title(string), type(string), description(text), url(string), image(file), image_mobile(file), tags(json), features(json), featured(boolean), self_link(boolean), sort(integer) |
| testimonials | name(string), business(string), quote(text), image(file), rating(integer), url(string), sort(integer) |
| site_settings | **singleton**, site_name(string), site_description(text), logo(file), phone(string), email(string), whatsapp_number(string), instagram_url(string), facebook_url(string), address(text), response_time(string) |

### 3. Insert seed data (all from migrate-to-sanity.ts + HANDOFF.md)

**Services** (4): "בניית אתרים", "דפי נחיתה", "קידום אורגני", "צ׳אטבוטים חכמים"
**Packages** (3): "דף נחיתה" ₪1,500, "אתר תדמית" ₪3,500 (popular), "פרויקט מותאם"
**WhyUs** (3): "טכנולוגיה מתקדמת" (orange), "מותאם לבינה מלאכותית" (terracotta), "ליווי אישי" (sage)
**HowWeWork** (4): Steps 01-04
**FAQ** (11): Questions with HTML `<p>` answers — read full content from `.context/HANDOFF.md` FAQ section
**SiteSettings** (1): siteName="MediaWave", phone="052-8731808", email="mediawaveisrael@gmail.com"

### 4. Make idempotent
Check existing items before insert:
```typescript
const existing = await admin.request(readItems('services'))
if (existing.length === 0) { /* insert */ }
else { console.log('services already seeded, skipping') }
```

### 5. Test
```bash
npm run directus:seed
```

## Acceptance Criteria
- [ ] Directus is running (`docker compose up -d` executed, health check passes)
- [ ] Script creates all 10 collections with correct fields
- [ ] Services (4), Packages (3), WhyUs (3), HowWeWork (4), FAQ (11), SiteSettings (1) inserted
- [ ] FAQ answers stored as HTML `<p>` strings
- [ ] site_settings is singleton (meta.singleton = true)
- [ ] Script is idempotent (re-runnable without duplicates)
- [ ] Collections have sort field for ordering
- [ ] Data visible in Directus admin at localhost:8055
