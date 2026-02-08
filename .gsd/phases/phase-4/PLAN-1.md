# Phase 4, Task 1: Rewrite Main Tagline & Hero Copy

## Goal
Replace generic hero tagline with compelling, specific copy.

## Context
- Current tagline likely generic ("We build digital experiences" equivalent)
- Need 2-3 alternatives for Nati to choose from
- Must NOT change without Nati's approval
- Hero section at `src/components/sections/Hero.tsx`

## Actions

### Step 1: Read Current Hero Content
- Read Hero.tsx to identify current tagline and subtitle
- Cross-reference with CONTENT.md hero section

### Step 2: Propose Alternatives
- Present 2-3 tagline options using AskUserQuestion:
  1. "נוכחות דיגיטלית שעובדת בשבילכם"
  2. "האתר שלכם, בדיוק כמו שדמיינתם — רק טוב יותר"
  3. [Third option based on current site tone]
- Corresponding subtitles for each option
- Wait for Nati's selection

### Step 3: Implement Selected Option
- Update Hero.tsx with chosen tagline
- Update CONTENT.md to match
- Verify visual fit (font size, line breaks, mobile layout)

### Step 4: Verify
- Hero renders with new copy
- Text doesn't overflow on mobile
- RTL correct
- Build clean

## Acceptance Criteria
- [ ] User selected preferred tagline
- [ ] Hero.tsx updated with approved copy
- [ ] CONTENT.md updated
- [ ] No visual overflow issues
- [ ] Clean build

## Note
DO NOT implement without user approval. This task requires the AskUserQuestion interaction.

## Estimated Scope
~15 minutes (after approval received)
