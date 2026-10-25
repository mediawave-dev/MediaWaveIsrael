/**
 * The blog's posts for the build scripts (D218): the frontmatter of every src/content/blog/*.md,
 * published posts only (draft: true stays out of the prerender, the sitemap and the feed).
 * The app parses the same files itself (src/blog/markdown.ts); this reads only what the scripts need.
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve } from 'path'

export function blogPosts(root) {
  const dir = resolve(root, 'src/content/blog')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(resolve(dir, f), 'utf-8')
      const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
      const data = {}
      for (const line of (fm ? fm[1] : '').split(/\r?\n/)) {
        const at = line.indexOf(':')
        if (at > 0) data[line.slice(0, at).trim()] = line.slice(at + 1).trim()
      }
      const slug = f.replace(/\.md$/, '')
      // (D218 review) a post that would publish broken metadata stops the build here, with its name
      const iso = /^\d{4}-\d{2}-\d{2}$/
      const bad = [
        !/^[a-z0-9-]{3,50}$/.test(slug) && 'the file name (a-z, 0-9, -, at most 50: the analytics tag is blog-<slug>)',
        !data.title && 'title', !data.description && 'description',
        !iso.test(data.published ?? '') && 'published (YYYY-MM-DD)',
        data.updated && !iso.test(data.updated) && 'updated (YYYY-MM-DD)',
      ].filter(Boolean)
      if (bad.length) throw new Error(`src/content/blog/${f}: fix ${bad.join(', ')}`)
      return {
        slug,
        title: data.title ?? '',
        description: data.description ?? '',
        published: data.published ?? '',
        updated: data.updated || data.published || '',
        draft: data.draft === 'true',
      }
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.published.localeCompare(a.published))
}
