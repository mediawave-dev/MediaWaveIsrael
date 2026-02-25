# Deployment Checklist — MediaWave Israel

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] Cloudflare Pages account
- [ ] Sanity.io account

## First-Time Setup

### 1. Sanity Project

- [ ] Create project at [manage.sanity.io](https://manage.sanity.io)
- [ ] Note the **Project ID**
- [ ] Create dataset named `production`
- [ ] Add CORS origins (Settings → API → CORS origins):
  - `https://mediawaveisrael.com` (with credentials)
  - `https://mediawaveisrael.pages.dev` (with credentials)
  - `http://localhost:5173` (for local dev, no credentials needed)

### 2. API Tokens

Create tokens at sanity.io/manage → API → Tokens:

- [ ] **Viewer token** — for preview mode (read-only)
- [ ] **Editor token** — for migration scripts (read/write, delete after use)

### 3. Environment Variables

Set in Cloudflare Pages → Settings → Environment Variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `SANITY_STUDIO_PROJECT_ID` | Your project ID | Required for Studio |
| `SANITY_STUDIO_DATASET` | `production` | Required for Studio |
| `VITE_SANITY_PROJECT_ID` | Same project ID | Required for site |
| `VITE_SANITY_DATASET` | `production` | Required for site |
| `VITE_CONTACT_ENDPOINT` | Worker URL | Contact form |
| `ANTHROPIC_API_KEY` | API key | Chatbot (if enabled) |

> Do NOT set `VITE_SANITY_PREVIEW_TOKEN` in production.

### 4. Data Migration

- [ ] Copy `.env.example` to `.env` and fill in values
- [ ] Set `SANITY_WRITE_TOKEN` in `.env`
- [ ] Run migration: `npx sanity dataset import` or custom migration script
- [ ] Open Studio at `/studio` and create the **siteSettings** document
- [ ] Delete the write token after migration

### 5. Deploy

- [ ] `npm run build` — verify clean build with no errors
- [ ] Connect repo to Cloudflare Pages
- [ ] Build command: `npm run build`
- [ ] Build output directory: `dist`
- [ ] Deploy

## Post-Deploy Verification

- [ ] Homepage loads correctly with all sections
- [ ] `/studio` loads Sanity Studio
- [ ] Studio login works
- [ ] Editing content in Studio updates the live site
- [ ] Images load via Sanity CDN
- [ ] Contact form submits successfully
- [ ] Mobile layout works correctly
- [ ] Preview mode works with `?preview=true`

## Client Handoff

- [ ] Create Sanity account for client
- [ ] Share Studio URL: `mediawaveisrael.com/studio`
- [ ] Share login credentials securely
- [ ] Send Hebrew guide: `docs/sanity-guide.rtl.md`
- [ ] Walk client through basic operations (add post, edit service)

## Ongoing Maintenance

- **Content changes**: Client handles via Studio (no deploy needed)
- **Code changes**: Developer pushes to `main` → auto-deploys via Cloudflare Pages
- **Sanity updates**: Run `npm update sanity` periodically
- **Monitor**: Check Cloudflare Analytics for traffic and errors
