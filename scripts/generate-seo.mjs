/**
 * Generate sitemap.xml from the route data files.
 *
 * Run: node scripts/generate-seo.mjs
 * Automatically runs before build via: npm run build
 *
 * The RSS feed lived here too until the blog was removed; with no feed there is
 * nothing to syndicate, so public/feed.xml and its <link rel="alternate"> are
 * gone as well.
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

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

  const allPages = [...staticPages, ...servicePages, ...portfolioPages]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
`
}

const sitemap = generateSitemap()
writeFileSync(resolve(ROOT, 'public/sitemap.xml'), sitemap)
console.log(`Generated public/sitemap.xml (${sitemap.match(/<url>/g).length} URLs)`)
