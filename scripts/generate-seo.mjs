/**
 * Generate sitemap.xml from the route data files, and the blog's RSS feed (D218).
 *
 * Run: node scripts/generate-seo.mjs
 * Automatically runs before build via: npm run build
 *
 * The blog came back for search (D218, Nati 25.10): its index and every published
 * post go into the sitemap, and public/feed.xml lists the posts.
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { blogPosts } from './blog-posts.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SITE_URL = 'https://mediawave.co.il'

/** Parse slug values from a simple data file (services / portfolio examples) */
function parseSlugs(relPath) {
  const source = readFileSync(resolve(ROOT, relPath), 'utf-8')
  return [...source.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
}

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    { loc: '/', lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: '/terms', lastmod: '2026-01-01', changefreq: 'yearly', priority: '0.3' },
    { loc: '/privacy', lastmod: '2026-01-01', changefreq: 'yearly', priority: '0.3' },
    { loc: '/accessibility', lastmod: '2026-07-02', changefreq: 'yearly', priority: '0.3' },
    // (D217) the visitor's own site in 60 seconds: a page ads can link to
    { loc: '/your-site', lastmod: today, changefreq: 'monthly', priority: '0.7' },
    // (D218) the style studio: the same site in five styles (no trailing slash: added below)
    { loc: '/styles', lastmod: today, changefreq: 'monthly', priority: '0.6' },
  ]

  const servicePages = parseSlugs('src/data/services.ts').map((slug) => ({
    loc: `/services/${slug}`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.8',
  }))

  const portfolioPages = parseSlugs('src/data/portfolio-examples.ts').map((slug) => ({
    loc: `/portfolio/${slug}`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.6',
  }))

  const posts = blogPosts(ROOT)
  const blogPages = posts.length
    ? [
        { loc: '/blog', lastmod: posts[0].updated, changefreq: 'weekly', priority: '0.6' },
        ...posts.map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.updated, changefreq: 'monthly', priority: '0.7' })),
      ]
    : []

  const allPages = [...staticPages, ...servicePages, ...portfolioPages, ...blogPages]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => `  <url>
    <loc>${SITE_URL}${page.loc === '/' ? '/' : `${page.loc}/`}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
`
}

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** RSS 2.0: the published posts, newest first (dates at noon Israel time, so the day never shifts) */
function generateFeed() {
  const posts = blogPosts(ROOT)
  const day = (iso) => new Date(`${iso}T12:00:00+03:00`).toUTCString()
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>הבלוג של MediaWave</title>
    <link>${SITE_URL}/blog/</link>
    <description>תשובות ישרות לשאלות של בעלי עסקים על אתרים, דפי נחיתה ווידאו.</description>
    <language>he-IL</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${posts.map((p) => `    <item>
      <title>${xml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}/</guid>
      <description>${xml(p.description)}</description>
      <pubDate>${day(p.published)}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>
`
}

const sitemap = generateSitemap()
writeFileSync(resolve(ROOT, 'public/sitemap.xml'), sitemap)
console.log(`Generated public/sitemap.xml (${sitemap.match(/<url>/g).length} URLs)`)
const feed = generateFeed()
writeFileSync(resolve(ROOT, 'public/feed.xml'), feed)
console.log(`Generated public/feed.xml (${(feed.match(/<item>/g) || []).length} posts)`)
