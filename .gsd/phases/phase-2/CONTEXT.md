# Phase 2 Context — SDK Integration Layer

## Decisions
- **8 files** in src/directus/: client, types, hooks, queries, imageUrl, HtmlContent, mappers, index
- **Hook interface**: useDirectusQuery returns { data, loading, error } — identical to useSanityQuery
- **Typing**: Full TypeScript interfaces for all 10 collections in snake_case
- **Mappers**: Convert Directus snake_case responses to camelCase matching existing component interfaces
- **Image URLs**: assetUrl(fileId, { width, height, format, fit, quality }) builds transform URL
- **HTML sanitization**: DOMPurify with whitelisted tags (p, h2-h4, ul, ol, li, a, strong, em, blockquote, img)
- **REST only**: No GraphQL — REST is simpler and @directus/sdk has great REST support

## Out of Scope
- Real-time subscriptions (WebSocket) — not needed for this site
- Authentication flow (admin-only CMS, public read via REST)
- GraphQL integration

## Edge Cases
- Directus returns `null` for empty file fields (not undefined) — handle in assetUrl
- JSON fields (tags, features) might come as string from API — parse if needed
- Singleton collections (site_settings) use readSingleton, not readItems
- AbortController needed in hook to prevent state updates on unmounted components
