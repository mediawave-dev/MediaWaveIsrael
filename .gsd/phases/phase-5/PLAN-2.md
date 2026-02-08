# Phase 5, Task 2: Chatbot Frontend — Floating Widget UI

## Goal
Build the floating chat widget UI component with RTL support and full interaction design.

## Context
- Must use frontend-design skill for all visual work
- Position: Bottom-left corner (RTL site)
- Closed state: Circle button with chat icon + tooltip
- Open state: Chat panel ~350px wide x ~500px tall (mobile: fullscreen)
- RTL throughout — bot messages right-aligned, user messages left-aligned

## Actions

### Step 1: Activate frontend-design Skill
- Use for all visual decisions
- Direction: Professional, matches site's warm aesthetic

### Step 2: Create ChatWidget Component
- Create `src/components/ui/ChatWidget.tsx`
- **Closed state**:
  - Circular button with chat icon (Lucide `MessageCircle`)
  - Primary color from design system
  - Tooltip: "שאלו אותי" on hover
  - Subtle pulse animation to draw attention
- **Open state**:
  - Slide-up animation (Framer Motion)
  - Header: Dark gradient, MediaWave logo small, close X button
  - Messages area: Scrollable, RTL direction
  - Bot messages: Light colored bubble, right-aligned
  - User messages: Darker bubble, left-aligned
  - "Typing" indicator: 3 animated dots
  - Input area: Text field + send button, placeholder "הקלידו הודעה..."
- **Auto welcome**: "שלום! אני הנציג הדיגיטלי של MediaWave. איך אפשר לעזור?"

### Step 3: Keyboard & Interaction
- Enter = send message
- Shift+Enter = new line
- Empty message = send button disabled
- Auto-scroll to latest message
- Focus trapped in widget when open (accessibility)

### Step 4: Mobile Responsiveness
- Mobile: Widget opens as near-fullscreen panel
- Proper viewport handling (keyboard doesn't overlap)
- Touch-friendly: 44px minimum tap targets

### Step 5: Integrate into Layout
- Add to `Layout.tsx` (always rendered)
- z-index above all other floating elements
- No overlap with WhatsApp button or scroll-to-top

### Step 6: Verify
- Desktop: Open/close smooth, messages render correctly
- Mobile: Fullscreen mode works, keyboard handling
- RTL: All text and bubbles aligned correctly
- Accessibility: Keyboard navigation, ARIA labels
- Build clean

## Acceptance Criteria
- [ ] Floating button visible on all pages
- [ ] Open/close animation smooth
- [ ] Message bubbles RTL-correct
- [ ] Typing indicator animates
- [ ] Keyboard shortcuts work (Enter/Shift+Enter)
- [ ] Mobile fullscreen mode
- [ ] Accessible (ARIA, focus trap, keyboard nav)
- [ ] Clean build

## Estimated Scope
~60 minutes, complex UI component
