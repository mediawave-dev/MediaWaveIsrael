# Phase 5, Task 4: Rearrange Floating Buttons & Final Polish

## Goal
Organize all floating buttons (chatbot, WhatsApp, scroll-to-top) without overlap, and polish the chatbot experience.

## Context
- Chatbot widget is now functional (Tasks 1-3)
- WhatsApp button exists in Footer.tsx
- Scroll-to-top button exists in Layout.tsx
- Need to prevent overlap on all screen sizes

## Actions

### Step 1: Map Current Button Positions
- Find WhatsApp button in Footer.tsx — note current position/z-index
- Find scroll-to-top in Layout.tsx — note current position/z-index
- ChatWidget from Task 2 — note its position

### Step 2: Rearrange Button Stack
- **Bottom-left** (RTL primary corner):
  - Chatbot button (most prominent, lowest)
  - WhatsApp button (above chatbot, 16px gap)
- **Bottom-right**:
  - Scroll-to-top (stays in place)
- When chatbot is OPEN:
  - WhatsApp button slides up or fades out to avoid overlap with chat panel
  - Scroll-to-top remains visible

### Step 3: Mobile-Specific Layout
- Verify no button overlap on mobile
- When chatbot opens fullscreen on mobile:
  - WhatsApp and scroll-to-top hidden
  - Only chat widget visible
- When chatbot closed:
  - All buttons visible with proper spacing

### Step 4: Z-Index Management
- Chatbot panel: highest z-index
- Chatbot button: below panel
- WhatsApp: below chatbot button
- Scroll-to-top: lowest of floating elements
- All above page content

### Step 5: Verify
- Desktop: All 3 buttons visible, no overlap
- Mobile: No overlap, chatbot fullscreen hides others
- Scroll behavior: Buttons don't interfere with content
- All buttons clickable and functional
- Build clean

## Acceptance Criteria
- [ ] No floating button overlap on any screen size
- [ ] Chatbot button is most prominent (bottom-left)
- [ ] WhatsApp button positioned above chatbot
- [ ] Scroll-to-top stays bottom-right
- [ ] Mobile fullscreen chatbot hides other buttons
- [ ] All z-indexes correct
- [ ] Clean build

## Estimated Scope
~20 minutes, positioning and z-index work
