/**
 * Generate SEO files (sitemap.xml + feed.xml) from blog-posts.ts
 *
 * Run: node scripts/generate-seo.mjs
 * Automatically runs before build via: npm run build
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SITE_URL = 'https://mediawaveisrael.com'

// Parse blog posts from TypeScript source
function parseBlogPosts() {
  const source = readFileSync(resolve(ROOT, 'src/data/blog-posts.ts'), 'utf-8')

  const posts = []
  // Match each object in the array between { ... }
  const objectRegex = /\{\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)',\s*excerpt:\s*(?:'([^']*(?:\\.[^']*)*)'|`([^`]*)`),?\s*date:\s*'([^']+)',\s*author:\s*'([^']+)',/g

  let match
  while ((match = objectRegex.exec(source)) !== null) {
    posts.push({
      slug: match[1],
      title: match[2],
      excerpt: (match[3] || match[4] || '').replace(/\\'/g, "'"),
      date: match[5],
      author: match[6],
    })
  }

  // Also extract tags for each post
  const tagBlockRegex = /slug:\s*'([^']+)'[\s\S]*?tags:\s*\[([^\]]*)\]/g
  const tagsMap = new Map()
  let tagMatch
  while ((tagMatch = tagBlockRegex.exec(source)) !== null) {
    const slug = tagMatch[1]
    const tagsStr = tagMatch[2]
    const tags = [...tagsStr.matchAll(/'([^']+)'/g)].map((m) => m[1])
    tagsMap.set(slug, tags)
  }

  // Check published status
  const publishedRegex = /slug:\s*'([^']+)'[\s\S]*?published:\s*(true|false)/g
  const publishedMap = new Map()
  let pubMatch
  while ((pubMatch = publishedRegex.exec(source)) !== null) {
    publishedMap.set(pubMatch[1], pubMatch[2] === 'true')
  }

  return posts
    .filter((p) => publishedMap.get(p.slug) !== false)
    .map((p) => ({ ...p, tags: tagsMap.get(p.slug) || [] }))
}

// Generate sitemap.xml
function generateSitemap(posts) {
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    { loc: '/', lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: '/blog', lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { loc: '/services', lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: '/services/landing-pages', lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: '/services/business-websites', lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: '/about', lastmod: today, changefreq: 'monthly', priority: '0.6' },
    { loc: '/terms', lastmod: '2026-01-01', changefreq: 'yearly', priority: '0.3' },
    { loc: '/privacy', lastmod: '2026-01-01', changefreq: 'yearly', priority: '0.3' },
  ]

  const postPages = posts.map((p) => ({
    loc: `/blog/${p.slug}`,
    lastmod: p.date,
    changefreq: 'monthly',
    priority: '0.7',
  }))

  const allPages = [...staticPages, ...postPages]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

  return xml
}

// Generate feed.xml (RSS)
function generateRSS(posts) {
  const now = new Date().toUTCString()

  const items = posts.map((p) => {
    const pubDate = new Date(p.date).toUTCString()
    const categories = p.tags.map((t) => `      <category>${t}</category>`).join('\n')

    return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
      <author>mediawaveisrael@gmail.com (${p.author})</author>
${categories}
    </item>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MediaWave Israel — בלוג</title>
    <link>${SITE_URL}/blog</link>
    <description>טיפים, מדריכים ותובנות מעולם הפיתוח והעיצוב הדיגיטלי</description>
    <language>he</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>

${items.join('\n\n')}
  </channel>
</rss>
`
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Main
const posts = parseBlogPosts()
console.log(`Found ${posts.length} published blog posts`)

const sitemap = generateSitemap(posts)
writeFileSync(resolve(ROOT, 'public/sitemap.xml'), sitemap)
console.log('Generated public/sitemap.xml')

const rss = generateRSS(posts)
writeFileSync(resolve(ROOT, 'public/feed.xml'), rss)
console.log('Generated public/feed.xml')
