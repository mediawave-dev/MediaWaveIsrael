# Phase 5 Context — Component Migration (Complex Sections)

## Decisions
- **Migration order**: Testimonials + FAQ (PLAN-1), then Blog + BlogPost (PLAN-2)
- **Image replacement**: urlFor(image).width(w).height(h).url() -> assetUrl(fileId, { width, height })
- **Rich text replacement**: PortableText -> HtmlContent with prose-hebrew CSS class
- **CSS for HTML content**: New prose-hebrew.css with styles matching PortableTextComponents.tsx
- **Fallback data**: Preserved in all components

## Out of Scope
- Sanity preview mode replacement (keep Sanity preview working independently)
- New blog features (pagination, search)
- Testimonials carousel redesign

## Edge Cases
- BlogPost slug: Sanity uses slug.current, Directus uses plain string — mapper handles
- Blog featured_image is file UUID — assetUrl builds full URL
- FAQ answer is now HTML string — HtmlContent sanitizes and renders
- BlogPost content is HTML — same HtmlContent approach
- Testimonials may have no image — assetUrl returns empty string for null fileId
