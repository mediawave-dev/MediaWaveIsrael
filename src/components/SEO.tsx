import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://mediawaveisrael.com'
const SITE_NAME = 'MediaWave Israel'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

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
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined

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
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="he_IL" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

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
