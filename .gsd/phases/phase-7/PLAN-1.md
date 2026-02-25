# Phase 7 / Task 1 — Performance Check & Bundle Optimization

## Goal
Ensure Sanity integration doesn't degrade performance. Optimize bundle splitting.

## Steps

### 1. Analyze build output
Run `npm run build` and check:
- Main chunk size (should stay under 50KB gzipped)
- Sanity Studio chunk (separate, loaded only on /studio route)
- Total bundle size comparison with pre-Sanity build

### 2. Optimize chunk splitting
Update `vite.config.ts` manualChunks:
```typescript
manualChunks: {
  'framer-motion': ['framer-motion'],
  'lottie': ['lottie-react'],
  'react-vendor': ['react', 'react-dom'],
  'router': ['react-router-dom'],
  'sanity-client': ['@sanity/client', '@sanity/image-url', '@portabletext/react'],
  'sanity-studio': ['sanity'],
}
```

Ensure `sanity-studio` chunk only loads on `/studio` route (lazy import).

### 3. Check lazy loading
Verify Studio page uses `React.lazy()`:
- Network tab should NOT load sanity-studio chunk on homepage
- Only load on `/studio` navigation

### 4. Add SPA redirect for Cloudflare Pages
Create `public/_redirects`:
```
/*  /index.html  200
```

This ensures `/studio/*` routes work correctly on Cloudflare Pages.

### 5. Lighthouse check
If possible, run build + preview and check:
- Performance score
- LCP (should not be affected — Hero is still immediate)
- TBT (Sanity queries are async, shouldn't block)
- CLS (loading states should prevent layout shift)

## Acceptance Criteria
- [ ] Main bundle under 50KB gzipped (excluding Sanity Studio)
- [ ] Sanity Studio in separate chunk, lazy-loaded
- [ ] `_redirects` file in public/ for Cloudflare Pages SPA
- [ ] `npm run build` succeeds with clean output
- [ ] No increase in LCP or TBT from Sanity integration
