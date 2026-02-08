# Phase 7, Task 2: Performance Optimization & Lighthouse Audit

## Goal
Achieve Lighthouse 90+ in all categories (Performance, Accessibility, Best Practices, SEO).

## Context
- Site uses multiple custom fonts (potential render-blocking)
- Rich animations (potential performance impact)
- Images need WebP/lazy loading verification
- Multiple floating elements may cause CLS

## Actions

### Step 1: Run Lighthouse Baseline
- Build production version: `npm run build`
- Serve locally: `npm run preview`
- Run Lighthouse audit (all categories)
- Document current scores

### Step 2: Fix Performance Issues
- Verify font-display: swap on all @font-face
- Verify image lazy loading (except header logo)
- Check for CLS (Cumulative Layout Shift) — especially floating buttons
- Optimize any large bundles (check Vite build output)
- Verify no render-blocking resources

### Step 3: Fix Accessibility Issues
- Verify all ARIA labels on interactive elements
- Check color contrast ratios
- Verify heading hierarchy (h1 → h2 → h3)
- Check focus-visible outlines
- Verify 44px touch targets

### Step 4: Sitemap & Robots
- Verify sitemap generation (may need vite-plugin-sitemap)
- Verify robots.txt exists and allows crawling
- Create Google Search Console submission instructions for Nati

### Step 5: Re-run Lighthouse
- Fix any remaining issues
- Target: 90+ in all 4 categories
- Document final scores

## Acceptance Criteria
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 90+
- [ ] Lighthouse Best Practices: 90+
- [ ] Lighthouse SEO: 90+
- [ ] Font loading doesn't block render
- [ ] Images lazy loaded (except logo)
- [ ] No CLS issues
- [ ] Sitemap and robots.txt present
- [ ] Clean build

## Estimated Scope
~45 minutes, audit + fixes
