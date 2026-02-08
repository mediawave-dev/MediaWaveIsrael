# Phase 6, Task 1: Blog Infrastructure Setup

## Goal
Set up blog system with list page and single post page.

## Context
- React + Vite project (not Astro — no content collections)
- Need blog page at /blog route
- Single post page at /blog/:slug
- Must integrate with existing React Router setup in App.tsx
- Design must match existing site aesthetic

## Actions

### Step 1: Create Blog Data Structure
- Create `src/data/blog-posts.ts`
- Define TypeScript interface:
```typescript
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;        // Markdown or JSX
  date: string;           // ISO date
  author: string;
  image?: string;
  tags: string[];
  published: boolean;
}
```
- Empty array initially

### Step 2: Create Blog List Page
- Create `src/components/pages/Blog.tsx`
- Card layout: image, title, date, excerpt, "קראו עוד" link
- Empty state: "בקרוב — תכנים חדשים בדרך!" when no published posts
- RTL layout, matching site typography

### Step 3: Create Blog Post Page
- Create `src/components/pages/BlogPost.tsx`
- Reading-optimized layout (max-width ~700px)
- Hebrew typography (larger line-height)
- Back button to /blog
- Share buttons (optional)

### Step 4: Add Routes
- Update App.tsx with new routes: /blog, /blog/:slug
- Add "הבלוג" link in Header nav and Footer

### Step 5: Verify
- /blog page renders (empty state)
- Add test post → card appears
- Click card → single post page renders
- Back navigation works
- Mobile responsive
- Build clean

## Acceptance Criteria
- [ ] /blog route works with list page
- [ ] /blog/:slug route works with single post
- [ ] Empty state when no posts
- [ ] Navigation links in Header and Footer
- [ ] RTL and mobile responsive
- [ ] Clean build

## Estimated Scope
~45 minutes, new pages + routing
