# Phase 1, Task 1: Remove Testimonials from Render Flow

## Goal
Remove the fabricated testimonials section from the live site without deleting the component code.

## Context
- `src/components/sections/Testimonials.tsx` contains a carousel with 4 fake testimonials (Ron M., Dani L., Yael K., Michal A.)
- These have colored initial avatars instead of real photos — obviously fabricated
- Component is rendered in `src/App.tsx` in the section flow
- Also exported from `src/components/sections/index.ts`

## Actions

### Step 1: Comment out Testimonials in App.tsx
- Open `src/App.tsx`
- Find the `<Testimonials />` import and component usage
- Comment out both (add note: "Commented out until real testimonials available")
- Do NOT delete — just comment

### Step 2: Update CONTENT.md
- Find testimonials section in CONTENT.md
- Update to reflect current state: section exists but is disabled
- Add note: "Component ready at Testimonials.tsx — enable when real testimonials collected"

### Step 3: Verify
- Run `npm run dev` — site loads without testimonials section
- Run `npm run build` — no TypeScript errors
- Visually confirm the section gap is clean (About → FAQ transition)

## Acceptance Criteria
- [ ] Testimonials section does not render on the live site
- [ ] Testimonials.tsx file still exists (commented out, not deleted)
- [ ] No TypeScript/build errors
- [ ] Smooth visual transition between About and FAQ sections
- [ ] CONTENT.md updated

## Estimated Scope
~15 minutes, single file changes + verification
