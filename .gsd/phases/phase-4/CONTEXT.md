# Phase 4 Context: Portfolio Visual Upgrade

## Decisions

### What This Phase IS
- **Visual Enhancement Only**: No new data, no case studies, no metrics
- **Animation Upgrade**: More impressive, memorable animations
- **Layout Refresh**: Better composition and visual hierarchy
- **Micro-Interactions**: Tilt 3D, parallax, button effects, hover states

### What This Phase IS NOT
- ~~Case Study format~~ — No story to tell, project was new build
- ~~Before/After Slider~~ — No "before" exists (new site, not redesign)
- ~~Performance Metrics~~ — No access to real data, won't use [PLACEHOLDER]
- ~~5C Framework~~ — Dropped, no narrative content needed

### Technical Approach
- Keep existing `Portfolio.tsx` component structure
- Keep existing `projects.ts` data (yaelevy only)
- Use frontend-design skill for all visual decisions
- Leverage Framer Motion for advanced animations
- Focus on "wow factor" — this section demonstrates MediaWave's capabilities

## Visual Direction

### Animation Ideas (to explore during planning)
- **Card entrance**: More dramatic than current fade-in
- **Hover effects**: 3D tilt, glow, scale
- **Browser mockup**: More realistic, maybe subtle reflection
- **Tags**: Staggered reveal with spring physics
- **Screenshot**: Parallax within card, or zoom on hover
- **Decorative elements**: Floating shapes, connecting lines

### Layout Considerations
- Current: Asymmetric grid (screenshot left, info right on desktop)
- Keep single-project focused design (only 1 project)
- Consider fullwidth or more dramatic composition
- Mobile: Stack vertically, maintain impact

### Performance Constraints
- Animations must be 60fps
- Respect `prefers-reduced-motion`
- No heavy assets — use CSS/SVG animations

## Out of Scope
- Adding new projects
- Changing project data structure
- Backend/API work
- PageSpeed testing integration

## Open Questions for Planning
- Should browser mockup be more realistic (3D perspective)?
- How prominent should tech tags be?
- Is the CTA button effective or needs redesign?
- Should there be a "more projects coming soon" indicator?

## Success Criteria
- [ ] Portfolio section feels premium and memorable
- [ ] Animations are smooth (60fps)
- [ ] Demonstrates "this is what we can build for you"
- [ ] Mobile experience is just as impressive
- [ ] Build passes, no TypeScript errors
