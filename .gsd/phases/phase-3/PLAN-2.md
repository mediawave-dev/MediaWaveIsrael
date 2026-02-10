# PLAN-2: Integrate ROICalculator & Reorder Sections

## Task Overview
<task_spec>
<goal>שילוב ROICalculator בדף הבית ושינוי סדר הסקשנים לפי ההחלטות</goal>
<context>
- ROICalculator component created in PLAN-1
- Current order: Hero → Services → WhyUs → Portfolio → Packages → Testimonials → FAQ → Contact
- New order: Hero → WhyUs → ROICalculator → Services → Portfolio → Packages → Testimonials → FAQ → Contact
</context>
<dependencies>PLAN-1 completed (ROICalculator.tsx exists)</dependencies>
</task_spec>

## Implementation Details

### New Section Order in App.tsx
```typescript
// Before (current):
<Hero />
<Services />
<WhyUs />
<Portfolio />
<Packages />
<Testimonials />
<FAQ />
<Contact />

// After (new):
<Hero />
<WhyUs />
<ROICalculator />  // ← NEW
<Services />
<Portfolio />
<Packages />
<Testimonials />
<FAQ />
<Contact />
```

### Rationale for Order
1. **Hero** — First impression
2. **WhyUs** — Why choose MediaWave (differentiators)
3. **ROICalculator** — Now they see WHY, show them what they're LOSING
4. **Services** — What we offer to fix it
5. **Portfolio** — Proof we can do it
6. **Packages** — Pricing
7. **Testimonials** — Social proof (when available)
8. **FAQ** — Answer remaining questions
9. **Contact** — Final CTA

### Files to Modify

#### 1. src/components/sections/index.ts
Add export for ROICalculator:
```typescript
export { default as ROICalculator } from './ROICalculator'
```

#### 2. src/App.tsx
- Import ROICalculator from sections
- Reorder sections as specified above

### Navigation Update (if needed)
Check if ROI Calculator needs a nav link. Decision: **No nav link** — it's a tool between sections, not a standalone destination.

### Visual Flow Verification
After integration, verify:
- Smooth scroll between sections
- No jarring visual transitions
- ROICalculator background complements WhyUs above and Services below
- Mobile scroll feels natural

## Acceptance Criteria
- [ ] ROICalculator exported from sections/index.ts
- [ ] App.tsx imports ROICalculator
- [ ] Sections in correct order: Hero → WhyUs → ROICalculator → Services → ...
- [ ] Page loads without errors
- [ ] Scroll flow is smooth between sections
- [ ] Mobile layout works correctly
- [ ] Build passes: `npm run build`

## Verification Commands
```bash
npm run build
npm run dev
# Then visit http://localhost:5173 and test:
# 1. Section order is correct
# 2. ROICalculator appears after WhyUs
# 3. Calculator functionality works
# 4. WhatsApp button works
# 5. Mobile responsive
```

## Estimated Scope
~10 minutes, simple integration
