# Phase 3, Task 2: Update FAQ to Reference Packages

## Goal
Update FAQ section answers to reference the new packages section instead of repeating pricing info.

## Context
- FAQ exists at `src/components/sections/FAQ.tsx` with 13 Q&A items
- Some FAQ answers discuss pricing/packages vaguely
- Now that a packages section exists, FAQs should point there
- Must not change FAQ structure or design — only content adjustments

## Actions

### Step 1: Audit Current FAQ Content
- Read FAQ.tsx and identify all pricing-related Q&As
- Specifically look for: "מה כולל חבילת הפיתוח?" and "יש תשלומים חודשיים?"
- Note which answers need updating

### Step 2: Update FAQ Answers
- For pricing-related questions, update answers to reference packages section:
  - Example: "ראו את החבילות שלנו למעלה" or "לפירוט מלא ראו את סעיף החבילות"
- Don't remove the FAQ items — just update answers to avoid duplication
- Keep same tone and length
- Verify RTL accordion display is correct

### Step 3: Verify
- FAQ renders correctly
- Updated answers reference packages section
- Accordion open/close works
- RTL alignment correct
- Build clean

## Acceptance Criteria
- [ ] Pricing-related FAQ answers updated to reference packages section
- [ ] No duplicate pricing information between sections
- [ ] FAQ structure and design unchanged
- [ ] RTL accordion works correctly
- [ ] Clean build

## Estimated Scope
~15 minutes, content updates only
