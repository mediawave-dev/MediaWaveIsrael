# Phase 6, Task 2: ChatWidget UI Polish + RTL Fix

## Goal
Update ChatWidget to match CONTEXT.md specs: RTL position, persona, welcome message.

## Context
- ChatWidget.tsx exists and works (UI complete)
- Currently positioned on LEFT (should be RIGHT for RTL)
- Welcome message doesn't match persona from discuss
- WhatsApp button positioning may conflict

## Actions

### Step 1: Fix Chat Bubble Position (RTL)

Current (wrong):
```tsx
className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40"
```

Change to (correct RTL):
```tsx
className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40"
```

### Step 2: Fix Chat Panel Position

Current (wrong):
```tsx
className="fixed z-50 bottom-0 left-0 sm:bottom-6 sm:left-6 ..."
```

Change to:
```tsx
className="fixed z-50 bottom-0 right-0 sm:bottom-6 sm:right-6 ..."
```

### Step 3: Update Welcome Message

In `src/hooks/useChat.ts`:

Current:
```ts
content: 'שלום! 👋 אני הנציג הדיגיטלי של MediaWave. איך אפשר לעזור?'
```

Change to (from CONTEXT.md):
```ts
content: 'אהלן! אני העוזר של MediaWave. איך אפשר לעזור?'
```

Note: Remove emoji for cleaner look (per persona: "בוט ברור שזה בוט").

### Step 4: Update Header Subtitle

In `ChatWidget.tsx`:

Current:
```tsx
<p className="text-white/50 text-xs">נציג דיגיטלי</p>
```

Change to:
```tsx
<p className="text-white/50 text-xs">עוזר אוטומטי</p>
```

### Step 5: Update Floating WhatsApp Position

In `src/components/layout/Layout.tsx`, adjust WhatsApp button position:

Current:
```tsx
className="fixed bottom-20 left-4 sm:bottom-24 sm:left-6 z-30 ..."
```

Change to (above chat bubble on right):
```tsx
className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-30 ..."
```

### Step 6: Adjust Scroll-to-Top Position

Move to left side so it doesn't conflict with chat:

Current:
```tsx
className="fixed bottom-6 right-6 z-40 ..."
```

Change to:
```tsx
className="fixed bottom-6 left-6 z-40 ..."
```

### Step 7: Update Tooltip Text

In `ChatWidget.tsx` tooltip:

Current:
```tsx
<span>שאלו אותי</span>
```

Change to:
```tsx
<span>יש לכם שאלות?</span>
```

### Step 8: Visual Verification

Run dev server and verify:
1. Chat bubble on bottom-right
2. WhatsApp button above chat bubble (right side)
3. Scroll-to-top on bottom-left
4. No button overlap
5. Mobile: chat opens to full height, all buttons visible
6. Chat panel opens to right side
7. Welcome message displays correctly

### Step 9: Build & Test

```bash
npm run build
npm run preview
```

Verify all positions correct in production build.

## Acceptance Criteria

- [ ] Chat bubble positioned bottom-right
- [ ] Chat panel opens from right side
- [ ] WhatsApp button above chat (right side)
- [ ] Scroll-to-top moved to left side
- [ ] Welcome message: "אהלן! אני העוזר של MediaWave. איך אפשר לעזור?"
- [ ] Header subtitle: "עוזר אוטומטי"
- [ ] No button overlap on mobile
- [ ] Clean build

## Files to Modify

1. `src/components/ui/ChatWidget.tsx` — Lines 160, 198 (position classes)
2. `src/hooks/useChat.ts` — Line 29 (welcome message)
3. `src/components/layout/Layout.tsx` — Lines 66, 91 (button positions)

## Design Verification

After changes, the bottom-right corner stack (from bottom):
1. Chat bubble (z-40) — bottom-4 right-4
2. WhatsApp button (z-30) — bottom-20 right-4
3. Accessibility widget — its own position

Bottom-left:
1. Scroll-to-top button (z-40) — bottom-6 left-6
