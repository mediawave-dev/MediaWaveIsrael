import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://mediawave.co.il'
const SITE_NAME = 'MediaWave Israel'
// versioned: the share card changed (18.10.2026) and social networks cache previews by URL
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png?v=20261018`

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogType?: 'website' | 'article'
  ogImage?: string
  article?: {
    publishedTime: string
    author: string
    tags: string[]
  }
  noindex?: boolean
}

export default function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  article,
  noindex = false,
}: SEOProps) {
  // Idempotent: several metaTitle values in src/data already end with the site
  // name, and blindly appending produced "… | MediaWave Israel | MediaWave
  // Israel" on 7 pages (up to 82 chars, so Google truncated the tail). Append
  // only when the brand is not already the title's suffix.
  const fullTitle = title.trimEnd().endsWith(SITE_NAME) ? title.trimEnd() : `${title} | ${SITE_NAME}`
  // the slash form is the one Cloudflare Pages serves (/services/x answers with a 308 to /services/x/)
  const canonicalUrl = canonical ? `${SITE_URL}${canonical === '/' || canonical.endsWith('/') ? canonical : `${canonical}/`}` : undefined

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {ogImage === DEFAULT_IMAGE && <meta property="og:image:width" content="1200" />}
      {ogImage === DEFAULT_IMAGE && <meta property="og:image:height" content="630" />}
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="he_IL" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Article-specific */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:author" content={article.author} />
          {article.tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
    </Helmet>
  )
}
