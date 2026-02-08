# Phase 3, Task 1: Create Pricing/Packages Section

## Goal
Add a 3-tier pricing section with cards for Landing Page, Branding Site, and Custom Project.

## Context
- No pricing section currently exists
- Placement: Between About section and FAQ
- Must match existing design (light background, subtle borders, warm palette)
- Prices are suggestions — Nati must approve before going live
- Must use frontend-design skill for visual design

## Actions

### Step 1: Create Pricing Data File
- Create `src/data/packages.ts`
- Define TypeScript interface:
```typescript
export interface Package {
  id: string;
  name: string;           // "דף נחיתה"
  price: string;          // "החל מ-₪1,500"
  description: string;    // What's included
  features: string[];     // Bullet list of features
  idealFor: string;       // "לעסקים שרוצים..."
  cta: string;            // Button text
  ctaLink: string;        // "#contact" or section id
  popular?: boolean;      // "הכי פופולרי" badge
}
```
- Populate with 3 packages from MEDIAWAVE_WORKPLAN.md section 3.2
- Add comment: "PRICES ARE SUGGESTIONS — Nati must approve before publishing"

### Step 2: Create Packages Section Component
- Create `src/components/sections/Packages.tsx`
- Use frontend-design skill for visual design
- Layout: 3 cards in a row (desktop), stacked (mobile)
- Middle card ("Branding Site") slightly elevated/highlighted as "הכי פופולרי"
- Each card shows: name, price, feature list with checkmarks, ideal-for text, CTA button
- CTA buttons scroll to contact section
- RTL direction throughout
- Entrance animations (staggered card reveal)

### Step 3: Integrate into App.tsx
- Import Packages component
- Place between About and FAQ sections
- Verify section flow and spacing

### Step 4: Verify
- Desktop: 3 cards side by side, middle highlighted
- Tablet: 3 cards or 2+1 layout
- Mobile: Stacked single column
- RTL: All text and alignment correct
- CTA buttons scroll to contact
- Build clean

## Acceptance Criteria
- [ ] `src/data/packages.ts` with typed data
- [ ] `src/components/sections/Packages.tsx` renders 3 cards
- [ ] Middle card highlighted as "הכי פופולרי"
- [ ] Responsive layout (3-col → stacked)
- [ ] CTA scrolls to contact section
- [ ] RTL-correct
- [ ] Entrance animations
- [ ] Clean build

## Note
Prices in data file are PLACEHOLDERS. Must get Nati's approval before deploying.

## Estimated Scope
~45 minutes, new section component
