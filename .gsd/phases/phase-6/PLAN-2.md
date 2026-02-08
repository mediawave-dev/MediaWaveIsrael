# Phase 6, Task 2: Write 2 Initial Blog Post Drafts

## Goal
Create 2 draft blog posts for Nati to review and approve.

## Context
- Blog infrastructure exists (from Task 1)
- Posts should be written in natural Hebrew, not marketing-speak
- Tone: Like a tech-savvy friend explaining
- Both posts end with CTA linking to contact section

## Actions

### Step 1: Write Post 1
- Title: "למה לעסק שלכם חייב להיות אתר ב-2026"
- Target: Small business owners without a site
- ~600 words in Hebrew
- Points: Digital presence importance, credibility, Google search behavior, WhatsApp isn't enough
- CTA: Link to contact section

### Step 2: Write Post 2
- Title: "מה זה PageSpeed ולמה זה קריטי לאתר שלכם"
- Target: Existing site owners
- ~600 words in Hebrew
- Points: What scores mean, SEO impact, what MediaWave does differently
- CTA: "רוצים לבדוק את הציון של האתר שלכם? דברו איתנו"

### Step 3: Add to Blog Data
- Add both posts to `src/data/blog-posts.ts`
- Set `published: false` (drafts for review)
- Present content to user for review via AskUserQuestion

### Step 4: Verify
- Set published: true temporarily → posts render correctly
- Hebrew text reads naturally
- Typography comfortable for reading
- CTAs link correctly
- Reset to published: false
- Build clean

## Acceptance Criteria
- [ ] 2 blog posts written in natural Hebrew
- [ ] ~600 words each
- [ ] Each has CTA at end
- [ ] Set as unpublished drafts
- [ ] Content presented to user for review
- [ ] Clean build

## Note
Posts are DRAFTS. Must get Nati's approval and edits before publishing.

## Estimated Scope
~30 minutes, content writing
