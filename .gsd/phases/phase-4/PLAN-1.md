# Phase 4, Task 1: Browser Mockup Upgrade + 3D Tilt Effect

## Goal
Transform the browser mockup from flat to premium 3D with tilt-on-hover effect.

## Context
- Current: Flat browser frame with basic shadow
- Target: 3D perspective with tilt effect that responds to mouse position
- Use Framer Motion for smooth 60fps animations
- Must respect `prefers-reduced-motion`

## Actions

### Step 1: Activate frontend-design Skill
- Use for all visual decisions
- Direction: Premium, tactile, "this is what we build"

### Step 2: Create useTilt3D Hook
- Create `src/hooks/useTilt3D.ts`
- Track mouse position relative to element
- Calculate rotateX and rotateY based on cursor position
- Smooth spring physics (not linear)
- Return: `{ ref, style, onMouseMove, onMouseLeave }`
- Add reduced motion check — return static style if reduced motion

### Step 3: Upgrade Browser Mockup
In `FeaturedProject` component:
- Add perspective container (`perspective: 1000px`)
- Apply 3D tilt to browser frame on hover
- Max rotation: ±8 degrees (subtle, not nauseating)
- Add subtle reflection/shine effect that moves with tilt
- Enhance shadow to respond to tilt direction
- Browser dots: Add subtle glow animation on hover

### Step 4: Screenshot Enhancement
- Add inner parallax: screenshot moves slightly opposite to tilt
- This creates depth illusion
- Smooth transition when mouse leaves

### Step 5: Verify
- Desktop: Tilt responds smoothly to mouse
- Mobile: No tilt (no hover), still looks good static
- Reduced motion: Static, no tilt
- Build clean
- 60fps performance (check with DevTools)

## Acceptance Criteria
- [ ] useTilt3D hook created and exported
- [ ] Browser mockup tilts smoothly on hover
- [ ] Inner screenshot has subtle counter-parallax
- [ ] Reduced motion respected
- [ ] No jank, 60fps animation
- [ ] Mobile fallback (static)
- [ ] Clean build

## Technical Notes
```tsx
// Example tilt calculation
const rotateX = (mouseY - centerY) / height * 8  // Max ±8deg
const rotateY = (mouseX - centerX) / width * -8  // Inverted for natural feel
```

## Estimated Scope
~30 minutes
