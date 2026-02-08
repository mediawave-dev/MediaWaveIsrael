# Phase 8, Task 2: Final Lighthouse Check & Deploy

## Goal
Final quality gate and production deployment.

## Actions

### Step 1: Final Lighthouse Audit
- Run Lighthouse on production build
- Verify 90+ in all categories
- Fix any regressions from recent changes

### Step 2: Pre-Deploy Checklist
- [ ] All phases complete and verified
- [ ] No console.log statements in production
- [ ] No hardcoded secrets
- [ ] .env properly configured for production
- [ ] Git clean — all changes committed
- [ ] CONTENT.md up to date with actual site content

### Step 3: Deploy
- Merge to main branch
- Verify Cloudflare Pages build succeeds
- If chatbot exists: Verify Cloudflare Worker is active
- Check live site at mediawaveisrael.pages.dev

### Step 4: Post-Deploy Verification
- Browse live site end-to-end
- Test contact form
- Test chatbot (if deployed)
- Test WhatsApp link
- Verify OG tags with Facebook Sharing Debugger

## Acceptance Criteria
- [ ] Lighthouse 90+ all categories
- [ ] No console.log or debug code
- [ ] Cloudflare Pages build succeeds
- [ ] Live site functional
- [ ] Chatbot responsive (if deployed)
- [ ] All links work on live site

## Estimated Scope
~20 minutes, deploy + verification
