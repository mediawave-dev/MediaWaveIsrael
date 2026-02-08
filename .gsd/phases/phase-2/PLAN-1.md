# Phase 2, Task 1: Create Data-Driven Portfolio Infrastructure

## Goal
Create a project data file and refactor Portfolio.tsx to read from it, enabling easy addition of future projects.

## Context
- Portfolio.tsx already exists with a basic implementation showing yaelevy.co.il
- Need to extract hardcoded data into a structured data file
- The workplan defines a specific project card structure
- Must support responsive grid: 1 project=centered, 2+=2-col, 4+=3-col

## Actions

### Step 1: Create Portfolio Data File
- Create `src/data/projects.ts`
- Define TypeScript interface:
```typescript
export interface Project {
  id: string;
  title: string;           // "יעל לוי — טיפול רגשי ואישי"
  type: string;             // "אתר תדמית"
  description: string;      // 2-3 line description
  url: string;              // "https://www.yaelevy.co.il"
  image: string;            // Desktop screenshot path
  imageMobile?: string;     // Mobile screenshot path (optional)
  tags: string[];           // ["WordPress", "עיצוב מותאם", "רספונסיבי", "SEO"]
  featured: boolean;        // Show prominently
  selfLink?: boolean;       // If true, button scrolls to top instead of external link
}
```
- Populate with yaelevy.co.il data from MEDIAWAVE_WORKPLAN.md
- Use existing `yaelevy-screenshot.png` asset

### Step 2: Refactor Portfolio.tsx to Use Data
- Import projects from `src/data/projects.ts`
- Replace hardcoded content with data-driven rendering
- Keep existing animations and visual style
- Add responsive grid logic:
  - 1 project → single centered card (max-width constraint)
  - 2-3 projects → 2-column grid on desktop, 1-column mobile
  - 4+ projects → 3-column grid on desktop
- Each project card shows: image (browser mockup), title, type badge, description, tech tags, CTA button

### Step 3: Verify
- Run `npm run dev` — portfolio renders with yaelevy.co.il data
- Check desktop layout (centered single card)
- Check mobile layout (full-width card)
- Run `npm run build` — clean build
- Temporarily add a second project to data → verify 2-column grid works
- Revert to single project

## Acceptance Criteria
- [ ] `src/data/projects.ts` exists with typed interface
- [ ] Portfolio.tsx reads from data file
- [ ] yaelevy.co.il renders with all fields (image, title, type, description, tags, button)
- [ ] External link opens in new tab
- [ ] Responsive grid logic works (1→centered, 2→2-col, 4→3-col)
- [ ] Existing animations preserved
- [ ] Clean build, no TypeScript errors

## Estimated Scope
~45 minutes, moderate refactor with data extraction
