# Directus SDK Architecture Reference

Complete code patterns for the 8-file SDK integration layer.
All examples are production-tested and TypeScript-safe.

---

## File 1: `src/directus/client.ts`

The SDK client initialization. Uses `createDirectus` with REST transport.

```typescript
import { createDirectus, rest } from '@directus/sdk'
import type { DirectusSchema } from './types'

const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055'

export const directus = createDirectus<DirectusSchema>(directusUrl).with(rest())
```

### Key Points
- `DirectusSchema` generic provides autocomplete but NOT strict validation (see SDK workaround below)
- `import.meta.env.VITE_DIRECTUS_URL` for Vite projects
- For Next.js: use `process.env.NEXT_PUBLIC_DIRECTUS_URL`
- For Astro: use `import.meta.env.PUBLIC_DIRECTUS_URL`

---

## File 2: `src/directus/types.ts`

TypeScript interfaces for all collections. **ALL field names are snake_case** (Directus convention).

### Generation Rules

1. Every collection gets a `Directus` prefix: `DirectusService`, `DirectusPackage`
2. Primary key is always `id: number` (auto-increment integer)
3. Optional fields use `?` with `| null`
4. JSON array fields (tags, features) use `string[] | null`
5. File/image fields use `string | null` (stores UUID)
6. Boolean fields default to `false`
7. The schema interface maps collection names to their types

### Template

```typescript
// Individual collection interfaces
export interface Directus{CollectionName} {
  id: number
  // required fields
  title: string
  description: string
  // optional fields with null
  image?: string | null
  tags?: string[] | null
  sort?: number | null
}

// Schema interface (maps collection names to types)
export interface DirectusSchema {
  services: DirectusService[]        // list collection -> array
  site_settings: DirectusSiteSettings  // singleton -> single object
}
```

### Common Field Patterns

| Field Purpose | Type | Example |
|--------------|------|---------|
| Text (short) | `string` | `title: string` |
| Text (long) | `string` | `description: string` |
| Rich text (HTML) | `string \| null` | `content?: string \| null` |
| Image/File | `string \| null` | `image?: string \| null` |
| JSON array | `string[] \| null` | `tags?: string[] \| null` |
| Boolean | `boolean` | `popular?: boolean` |
| Integer | `number` | `rating?: number \| null` |
| Date | `string \| null` | `published_at?: string \| null` |
| Sort order | `number \| null` | `sort?: number \| null` |
| URL | `string \| null` | `url?: string \| null` |
| Slug | `string` | `slug: string` |
| Status/Enum | `string` | `status?: string` |

---

## File 3: `src/directus/hooks.ts`

The universal React hook for Directus queries.

```typescript
import { useEffect, useState, useRef } from 'react'
import { directus } from './client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDirectusQuery<T>(queryFn: () => any, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const queryFnRef = useRef(queryFn)
  queryFnRef.current = queryFn

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    directus
      .request(queryFnRef.current())
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result as T)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!controller.signal.aborted) {
          setError(err)
          setLoading(false)
        }
      })

    return () => controller.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
```

### Key Design Decisions
- `useRef(queryFn)` prevents infinite re-renders when queryFn is an inline closure
- `AbortController` for proper cleanup on unmount
- `deps` array for re-fetching when parameters change (e.g., slug)
- Generic `<T>` allows typed results at call site
- Returns `{ data, loading, error }` matching common React patterns

### Usage Patterns

```typescript
// Simple list query (no deps)
const { data, loading } = useDirectusQuery<DirectusService[]>(getServices)

// Query with parameters (deps = [slug])
const { data, loading } = useDirectusQuery<DirectusBlogPost[]>(
  () => getBlogPostBySlug(slug!),
  [slug]
)
```

---

## File 4: `src/directus/queries.ts`

Query functions using `readItems` and `readSingleton`.

### CRITICAL: SDK v21 Workaround

```typescript
import { readItems, readSingleton } from '@directus/sdk'

// Cast SDK functions to bypass strict schema generics.
// Type safety is enforced at the hooks+mappers layer instead.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const items = readItems as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const singleton = readSingleton as any
```

**Why?** The `@directus/sdk` v21+ has strict TypeScript generics that require the schema to perfectly match its internal types. Casting to `any` here and enforcing types at the hook/mapper layer is the pragmatic solution.

### Query Patterns

```typescript
// List with sort
export const getServices = () => items('services', {
  sort: ['sort'],
  fields: ['id', 'title', 'description', 'icon', 'tags'],
})

// List with filter + sort
export const getBlogPosts = () => items('blog_posts', {
  sort: ['-published_at'],  // prefix '-' = descending
  filter: { status: { _eq: 'published' } },
  fields: ['id', 'title', 'slug', 'excerpt', 'featured_image', 'author', 'tags', 'published_at'],
})

// Single item by field
export const getBlogPostBySlug = (slug: string) => items('blog_posts', {
  filter: { slug: { _eq: slug } },
  fields: ['id', 'title', 'slug', 'content', 'featured_image', 'author', 'tags', 'published_at'],
  limit: 1,
})

// Singleton (site_settings, etc.)
export const getSiteSettings = () => singleton('site_settings', {
  fields: ['site_name', 'phone', 'email', 'logo'],
})
```

### Available Filter Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `_eq` | Equals | `{ status: { _eq: 'published' } }` |
| `_neq` | Not equals | `{ status: { _neq: 'draft' } }` |
| `_contains` | Contains (string) | `{ title: { _contains: 'web' } }` |
| `_in` | In array | `{ type: { _in: ['blog', 'news'] } }` |
| `_gt` / `_gte` | Greater than | `{ rating: { _gte: 4 } }` |
| `_lt` / `_lte` | Less than | `{ price: { _lt: 100 } }` |
| `_null` | Is null | `{ image: { _null: true } }` |
| `_nnull` | Not null | `{ image: { _nnull: true } }` |

---

## File 5: `src/directus/mappers.ts`

Maps Directus snake_case to frontend camelCase.

### Why Mappers?
1. Decouple frontend from CMS field naming
2. Provide default values for nullable fields
3. Convert `id` (number) to `_id` (string) for React keys
4. Handle null → undefined conversion for optional props

### Template

```typescript
import type { DirectusService } from './types'

export function mapService(d: DirectusService) {
  return {
    _id: String(d.id),
    title: d.title,
    description: d.description,
    lottieAnimation: d.lottie_animation ?? undefined,
    lottieSize: d.lottie_size ?? 128,
    tags: d.tags ?? [],
  }
}
```

### Common Mapping Patterns

```typescript
// Required field -> pass through
title: d.title

// Optional string -> default empty string
description: d.description ?? ''

// Optional string -> undefined (for optional React props)
lottieAnimation: d.lottie_animation ?? undefined

// Boolean with default
popular: d.popular ?? false

// Number with default
rating: d.rating ?? 5

// JSON array with default
tags: d.tags ?? []
features: d.features ?? []

// ID conversion (Directus integer -> React string key)
_id: String(d.id)

// Image field (stays string|null for assetUrl)
image: d.image
featuredImage: d.featured_image
```

---

## File 6: `src/directus/imageUrl.ts`

Builds Directus asset URLs with optional transforms.

```typescript
interface ImageTransformOptions {
  width?: number
  height?: number
  format?: 'webp' | 'jpg' | 'png' | 'avif'
  fit?: 'cover' | 'contain' | 'inside' | 'outside'
  quality?: number
}

const baseUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055'

export function assetUrl(
  fileId: string | null | undefined,
  options?: ImageTransformOptions
): string {
  if (!fileId) return ''
  const params = new URLSearchParams()
  if (options?.width) params.set('width', String(options.width))
  if (options?.height) params.set('height', String(options.height))
  if (options?.format) params.set('format', options.format)
  if (options?.fit) params.set('fit', options.fit)
  if (options?.quality) params.set('quality', String(options.quality))
  const qs = params.toString()
  return `${baseUrl}/assets/${fileId}${qs ? '?' + qs : ''}`
}
```

### Usage in Components

```tsx
// Basic usage
<img src={assetUrl(post.featuredImage)} alt={post.title} />

// With transforms (CDN-like resizing)
<img src={assetUrl(project.image, { width: 800, format: 'webp', quality: 80 })} />

// Responsive srcset
srcSet={`
  ${assetUrl(img, { width: 400, format: 'webp' })} 400w,
  ${assetUrl(img, { width: 800, format: 'webp' })} 800w,
  ${assetUrl(img, { width: 1200, format: 'webp' })} 1200w
`}
```

---

## File 7: `src/directus/HtmlContent.tsx`

DOMPurify-based HTML renderer. Replaces Sanity PortableText or any rich text renderer.

```tsx
import DOMPurify from 'dompurify'

interface HtmlContentProps {
  html: string | null | undefined
  className?: string
}

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li',
  'h2', 'h3', 'h4', 'blockquote', 'img', 'figure', 'figcaption',
  'span', 'div', 'code', 'pre',
]

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
  'class', 'style', 'dir',
]

export function HtmlContent({ html, className }: HtmlContentProps) {
  if (!html) return null
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ['target'],
  })
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
  )
}
```

### Companion CSS for Hebrew Rich Text

Create `src/styles/prose-hebrew.css`:

```css
.prose-hebrew {
  direction: rtl;
  text-align: right;
  line-height: 1.8;
}

.prose-hebrew p {
  margin-bottom: 1em;
}

.prose-hebrew a {
  text-decoration: underline;
}

.prose-hebrew ul, .prose-hebrew ol {
  padding-inline-start: 1.5em;
  margin-bottom: 1em;
}

.prose-hebrew blockquote {
  border-inline-start: 4px solid currentColor;
  padding-inline-start: 1em;
  opacity: 0.85;
}
```

---

## File 8: `src/directus/index.ts`

Barrel exports for clean imports.

```typescript
export { directus } from './client'
export { useDirectusQuery } from './hooks'
export { assetUrl } from './imageUrl'
export { HtmlContent } from './HtmlContent'
export * from './queries'
export * from './mappers'
export type * from './types'
```

### Usage in Components

```typescript
// Single import line for everything needed
import { useDirectusQuery, getServices, mapService, assetUrl } from '../../directus'
import type { DirectusService } from '../../directus'
```

---

## Component Integration Pattern

### Before (any other CMS)

```typescript
import { useSomeCmsQuery } from '../../old-cms/hooks'
import { SERVICES_QUERY } from '../../old-cms/queries'

const { data, loading } = useSomeCmsQuery(SERVICES_QUERY)
```

### After (Directus)

```typescript
import { useDirectusQuery, getServices, mapService } from '../../directus'
import type { DirectusService } from '../../directus'

const { data: raw, loading } = useDirectusQuery<DirectusService[]>(getServices)
const services = raw?.map(mapService) ?? null
```

### Full Component Example

```tsx
import { useDirectusQuery, getServices, mapService } from '../../directus'
import type { DirectusService } from '../../directus'

export default function Services() {
  const { data: raw, loading } = useDirectusQuery<DirectusService[]>(getServices)
  const services = raw?.map(mapService) ?? null

  // Fallback to hardcoded data when Directus is offline
  const items = services ?? FALLBACK_SERVICES

  if (loading) return <div>Loading...</div>

  return (
    <section>
      {items.map((svc) => (
        <ServiceCard key={svc._id} {...svc} />
      ))}
    </section>
  )
}

// Hardcoded fallback for graceful degradation
const FALLBACK_SERVICES = [
  { _id: '1', title: '...', description: '...', tags: [] },
]
```

---

## Seed Script Architecture

### Helper Functions

```typescript
function stringField(field: string, meta?: Record<string, unknown>) {
  return { field, type: 'string', meta: { interface: 'input', ...meta }, schema: {} }
}
function textField(field: string, meta?: Record<string, unknown>) {
  return { field, type: 'text', meta: { interface: 'input-multiline', ...meta }, schema: {} }
}
function richTextField(field: string) {
  return { field, type: 'text', meta: { interface: 'input-rich-text-html' }, schema: {} }
}
function intField(field: string, meta?: Record<string, unknown>) {
  return { field, type: 'integer', meta: { interface: 'input', ...meta }, schema: {} }
}
function boolField(field: string) {
  return { field, type: 'boolean', meta: { interface: 'boolean' }, schema: { default_value: false } }
}
function jsonField(field: string) {
  return { field, type: 'json', meta: { interface: 'input-code', options: { language: 'json' } }, schema: {} }
}
function fileField(field: string) {
  return { field, type: 'uuid', meta: { interface: 'file-image', special: ['file'] }, schema: {} }
}
function datetimeField(field: string) {
  return { field, type: 'timestamp', meta: { interface: 'datetime' }, schema: {} }
}
function sortField() {
  return { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true }, schema: {} }
}
function selectField(field: string, choices: Array<{ text: string; value: string }>) {
  return { field, type: 'string', meta: { interface: 'select-dropdown', options: { choices } }, schema: {} }
}
```

### Collection Creation Pattern

```typescript
// CRITICAL: Always include schema: {} to create the actual DB table!
async function createCollection(
  name: string,
  meta: Record<string, unknown>,
  fields: Array<Record<string, unknown>>
) {
  if (await collectionExists(name)) {
    console.log(`  [skip] ${name} already exists`)
    return
  }
  await api('POST', '/collections', {
    collection: name,
    schema: {},   // <-- THIS IS MANDATORY
    meta: { ...meta, icon: 'box' },
    fields: [
      {
        field: 'id', type: 'integer',
        meta: { hidden: true, interface: 'input', readonly: true },
        schema: { is_primary_key: true, has_auto_increment: true },
      },
      ...fields,
    ],
  })
}
```

### Singleton vs List Collection

```typescript
// List collection (has sort)
await createCollection('services', { sort_field: 'sort' }, [
  stringField('title'), textField('description'), sortField(),
])

// Singleton (no sort, no multiple items)
await createCollection('site_settings', { singleton: true }, [
  stringField('site_name'), stringField('phone'),
])

// Seeding list items
async function seedItems(collection: string, items: Array<Record<string, unknown>>) {
  // Check if items exist first (idempotent)
  const existing = await api('GET', `/items/${collection}`)
  if (existing.data?.length > 0) return
  for (const item of items) {
    await api('POST', `/items/${collection}`, item)
  }
}

// Seeding singleton
async function seedSingleton(collection: string, data: Record<string, unknown>) {
  await api('PATCH', `/items/${collection}`, data)
}
```

---

## Vite Configuration

Add directus-sdk as a manual chunk to keep the bundle separate:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'directus-sdk': ['@directus/sdk'],
        }
      }
    }
  }
})
```

This produces a separate `directus-sdk-*.js` chunk (~5 kB) instead of bundling it with the main app code.
