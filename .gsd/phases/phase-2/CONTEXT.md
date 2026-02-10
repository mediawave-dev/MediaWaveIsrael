# Phase 2 Context: Hero Video & WhyUs Enhancement

## Decisions

- **Hero video**: Keep current video, only optimize the poster image (1.86 MB → ~100 KB WebP)
- **New video location**: WhyUs section background — adds motion to differentiators
- **Video theme**: Business/Success — handshakes, meetings, modern office, professional atmosphere
- **Video style**: Subtle background (30-50% opacity), muted, slow loop, doesn't compete with content
- **Video source**: Pexels — free commercial use, professional quality
- **Mobile strategy**: Poster image fallback (same pattern as Hero)

## Out of Scope
- Replacing current hero video
- Interactive video features (play/pause buttons)
- Multiple video sections
- User-uploaded videos

## Edge Cases
- **prefers-reduced-motion** → Show static poster, disable video
- **Slow connection** → Poster loads first, video lazy-loads
- **Mobile** → Only poster, no video (bandwidth/battery)
- **Video fails to load** → Graceful fallback to poster

## Technical Requirements

### Hero Optimization
- Convert `hero-poster.jpg` (1.86 MB) → WebP (~100 KB)
- Keep video as-is (2.9 MB is acceptable)

### WhyUs Video
- **Duration**: 10-15 seconds seamless loop
- **Resolution**: 720p or 1080p
- **File size**: < 3 MB
- **Format**: MP4 (H.264)
- **Poster**: WebP, ~100 KB, first frame or key moment
- **Overlay**: Dark gradient 50-60% for text contrast
- **Opacity**: 30-50% base opacity on video

### Pexels Search Terms
- "business meeting"
- "professional handshake"
- "modern office"
- "team collaboration"
- "success celebration"

## Implementation Notes
- Use same video pattern from Hero.tsx
- Desktop: `<video>` with autoplay, muted, loop, playsInline
- Mobile: CSS background-image with poster
- Add `useReducedMotion` hook for accessibility
