# Phase 5 / Task 2 — Migrate Blog + BlogPost

## Goal
Switch Blog listing and BlogPost detail page from Sanity to Directus. Most complex — both use urlFor() AND PortableText.

## Context
Project: `G:/Web-Dev/MediaWaveIsrael`. Testimonials and FAQ migrated (Task 1). prose-hebrew.css created. Blog/BlogPost are the final components.

## Important
- Blog: Replace urlFor() for featured images
- BlogPost: Replace BOTH urlFor() AND PortableText
- BlogPost slug: Sanity slug.current -> Directus plain string
- getBlogPostBySlug returns array with limit:1 — take first item
- Pass [slug] as deps to useDirectusQuery for re-fetching

## Steps

### 1. Update `src/components/pages/Blog.tsx`
Read file first. Replace:
```diff
- import { useSanityQuery } from '../../sanity/hooks'
- import { BLOG_POSTS_QUERY } from '../../sanity/queries'
- import { urlFor } from '../../sanity/imageUrl'
+ import { useDirectusQuery } from '../../directus/hooks'
+ import { getBlogPosts } from '../../directus/queries'
+ import { mapBlogPost } from '../../directus/mappers'
+ import { assetUrl } from '../../directus/imageUrl'
+ import type { DirectusBlogPost } from '../../directus/types'
```

Query:
```diff
- const { data: posts } = useSanityQuery<...>(BLOG_POSTS_QUERY)
+ const { data: raw } = useDirectusQuery<DirectusBlogPost[]>(getBlogPosts)
+ const posts = raw?.map(mapBlogPost) ?? null
```

Images:
```diff
- src={urlFor(post.featuredImage).width(600).height(400).url()}
+ src={assetUrl(post.featuredImage, { width: 600, height: 400, format: 'webp' })}
```

Slug links:
```diff
- to={`/blog/${post.slug.current}`}
+ to={`/blog/${post.slug}`}
```

### 2. Update `src/components/pages/BlogPost.tsx`
Read file first. Most complex migration:
```diff
- import { useSanityQuery } from '../../sanity/hooks'
- import { BLOG_POST_BY_SLUG_QUERY } from '../../sanity/queries'
- import { urlFor } from '../../sanity/imageUrl'
- import { PortableText } from '@portabletext/react'
- import { portableTextComponents } from '../../sanity/PortableTextComponents'
+ import { useDirectusQuery } from '../../directus/hooks'
+ import { getBlogPostBySlug } from '../../directus/queries'
+ import { mapBlogPost } from '../../directus/mappers'
+ import { assetUrl } from '../../directus/imageUrl'
+ import { HtmlContent } from '../../directus/HtmlContent'
+ import type { DirectusBlogPost } from '../../directus/types'
```

Query with slug (pass [slug] as deps for re-fetching):
```diff
- const { data: post } = useSanityQuery<BlogPost>(BLOG_POST_BY_SLUG_QUERY, { slug })
+ const { data: rawPosts } = useDirectusQuery<DirectusBlogPost[]>(
+   () => getBlogPostBySlug(slug!), [slug]
+ )
+ const post = rawPosts?.[0] ? mapBlogPost(rawPosts[0]) : null
```

Content rendering:
```diff
- <PortableText value={post.content} components={portableTextComponents} />
+ <HtmlContent html={post.content} className="prose-hebrew" />
```

Featured image:
```diff
- src={urlFor(post.featuredImage).width(1200).height(600).url()}
+ src={assetUrl(post.featuredImage, { width: 1200, height: 600, format: 'webp' })}
```

### 3. Verify build
```bash
npm run build
```

## Acceptance Criteria
- [ ] Blog.tsx uses useDirectusQuery + assetUrl (no urlFor, no GROQ)
- [ ] BlogPost.tsx uses useDirectusQuery + HtmlContent + assetUrl
- [ ] BlogPost re-fetches when slug param changes (deps: [slug])
- [ ] Slugs work without `.current`
- [ ] Featured images via assetUrl
- [ ] Content via HtmlContent with prose-hebrew class
- [ ] Both handle empty/error states
- [ ] No Sanity imports in these 2 files
- [ ] `npm run build` succeeds
