# Phase 1, Task 2: Create Data-Driven Testimonials Infrastructure

## Goal
Rebuild the testimonials component to be data-driven — renders only when real testimonial data exists.

## Context
- Old Testimonials.tsx has hardcoded fake data
- Need a new approach: component reads from a data file
- When data file is empty → component renders nothing
- This sets up for easy addition of real testimonials later

## Actions

### Step 1: Create Testimonials Data File
- Create `src/data/testimonials.ts`
- Define TypeScript interface:
```typescript
export interface Testimonial {
  id: string;
  name: string;          // Full name (not initials)
  business: string;      // Business name
  url?: string;          // Link to their site (if we built it)
  quote: string;         // Their testimonial text
  image?: string;        // Real photo path
  rating?: number;       // 1-5 stars
}

// Empty for now — add real testimonials here
export const testimonials: Testimonial[] = [];
```

### Step 2: Refactor Testimonials.tsx
- Keep the existing component file but refactor it to:
  - Import data from `src/data/testimonials.ts`
  - Early return `null` if `testimonials.length === 0`
  - Remove all hardcoded testimonial data
  - Keep the visual design/animation code (carousel, cards) for when data exists
  - Require real `image` field — no more colored initial circles

### Step 3: Uncomment in App.tsx
- Uncomment the Testimonials import and usage from Task 1
- Now it renders but shows nothing (empty data → null return)
- This is cleaner than commenting it out

### Step 4: Verify
- Run `npm run dev` — no testimonials visible (data is empty)
- Run `npm run build` — clean build
- Add a test testimonial to data file → verify it renders
- Remove test testimonial → verify it disappears
- Revert data file to empty array

## Acceptance Criteria
- [ ] `src/data/testimonials.ts` exists with typed interface and empty array
- [ ] Testimonials.tsx reads from data file, not hardcoded
- [ ] Empty data → component returns null (renders nothing)
- [ ] Adding data → component renders correctly
- [ ] Clean build, no TypeScript errors
- [ ] Component back in App.tsx render flow (but invisible due to empty data)

## Estimated Scope
~30 minutes, moderate refactor
