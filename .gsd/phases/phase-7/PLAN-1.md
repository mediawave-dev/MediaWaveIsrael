# Phase 7, Task 1: Meta Tags, OG Tags & Structured Data

## Goal
Add comprehensive SEO metadata to all pages.

## Context
- index.html may already have some meta tags (needs audit)
- Need: title, meta description, og:title, og:description, og:image per page
- Need JSON-LD structured data: LocalBusiness, WebSite, FAQPage
- React SPA — may need react-helmet or manual head management

## Actions

### Step 1: Audit Current Meta Tags
- Read index.html for existing meta/OG tags
- Check if react-helmet or similar is installed
- Identify gaps

### Step 2: Add/Update Meta Tags
- Homepage: "MediaWave — פיתוח אתרים מותאם אישית | בנו את הנוכחות הדיגיטלית שלכם"
- Blog pages (if exist): Dynamic meta per post
- About, Terms, Privacy pages: Appropriate titles

### Step 3: Create OG Image
- Design 1200x630 OG image with MediaWave logo on site gradient
- Save to public/ directory
- Reference in og:image tags

### Step 4: Add JSON-LD Structured Data
- `LocalBusiness`: name, phone (052-8731808), email, service type
- `WebSite`: name, URL
- `FAQPage`: Convert existing FAQ data to structured format
- Add as script tags in index.html or via component

### Step 5: Verify
- Google Rich Results Test with page URL
- Facebook Sharing Debugger for OG tags
- Build clean
- No duplicate or conflicting meta tags

## Acceptance Criteria
- [ ] All pages have title + meta description
- [ ] OG tags (title, description, image) present
- [ ] JSON-LD for LocalBusiness, WebSite, FAQPage
- [ ] OG image created and referenced
- [ ] No conflicting/duplicate meta tags
- [ ] Clean build

## Estimated Scope
~30 minutes, meta tag additions
