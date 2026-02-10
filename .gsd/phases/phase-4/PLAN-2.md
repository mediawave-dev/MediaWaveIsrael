# Phase 4, Task 2: Info Card + Section Polish + Mobile

## Goal
Upgrade the info card with micro-interactions, enhance section decorations, and ensure mobile experience is impressive.

## Context
- Info card currently: Static glassmorphism box
- Tags: Basic staggered fade-in
- Features: Simple list with bullets
- CTA: Spring hover (already good)
- Section header: Good but could be more dramatic

## Actions

### Step 1: Info Card Enhancements
In `FeaturedProject` component, upgrade the info card:

**Entrance Animation:**
- Current: Slide in from left with fade
- New: Slide + slight rotation + scale (feels more dynamic)

**Tags Upgrade:**
- Add hover effect: Slight scale + glow + bounce
- Consider "pill" style with gradient border on hover
- Stagger should feel like typewriter reveal

**Features List:**
- Animated checkmark icons instead of static bullets
- Each feature slides in with spring physics
- Checkmark draws itself (SVG path animation)

**Badge (אתר תדמית):**
- Add subtle shimmer animation (like "new" badges)
- Gradient border that animates

### Step 2: Section Header Upgrade
- Make the underline decoration more prominent
- Consider animated gradient or glow effect
- Add floating decorative element near title

### Step 3: Background Decorations
Current: 2 parallax blur blobs

Upgrade options (choose 1-2):
- Add connecting curved line between browser and info card
- Floating dots that drift slowly
- Subtle grain texture overlay
- Geometric shapes at section edges

### Step 4: Mobile Experience
- Verify all animations work on touch devices
- Card should still feel premium without hover
- Consider tap-to-reveal effects for features
- Ensure text is readable, spacing is comfortable
- Test on 375px width (iPhone SE)

### Step 5: Bottom CTA Enhancement
- Current: Good spring hover
- Add: Animated arrow or icon
- Consider: Pulse effect to draw attention

### Step 6: Verify
- Desktop: All micro-interactions smooth
- Mobile: Premium feel maintained
- Tablet: Layout transitions well
- Reduced motion: Graceful fallback
- Build clean

## Acceptance Criteria
- [ ] Info card entrance more dynamic
- [ ] Tags have engaging hover effect
- [ ] Features have animated checkmarks
- [ ] Badge has shimmer effect
- [ ] Section header more prominent
- [ ] At least 1 new decorative element added
- [ ] Mobile experience verified
- [ ] Reduced motion fallbacks
- [ ] Clean build

## Technical Notes
```tsx
// Checkmark draw animation
<motion.path
  d="M5 13l4 4L19 7"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 0.4, delay: 0.2 }}
/>

// Shimmer effect (CSS)
background: linear-gradient(
  90deg,
  transparent,
  rgba(255,255,255,0.3),
  transparent
);
animation: shimmer 2s infinite;
```

## Estimated Scope
~45 minutes
