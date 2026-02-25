import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, User } from 'lucide-react'
import SectionSkeleton from '../ui/SectionSkeleton'
import { useDirectusQuery } from '../../directus/hooks'
import { getBlogPostBySlug } from '../../directus/queries'
import { mapBlogPost } from '../../directus/mappers'
import { assetUrl } from '../../directus/imageUrl'
import { HtmlContent } from '../../directus/HtmlContent'
import type { DirectusBlogPost } from '../../directus/types'
import SEO from '../SEO'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string | null
  author: string
  tags: string[]
  publishedAt: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { data: rawPosts, loading, error } = useDirectusQuery<DirectusBlogPost[]>(
    () => getBlogPostBySlug(slug!), [slug]
  )
  const post: BlogPost | null = rawPosts?.[0] ? mapBlogPost(rawPosts[0]) : null

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-32 pb-20">
        <div className="container max-w-[700px]">
          <SectionSkeleton lines={1} />
        </div>
      </div>
    )
  }

  if (!post || error) {
    return <Navigate to="/blog" replace />
  }

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20">
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        article={{
          publishedTime: post.publishedAt,
          author: post.author,
          tags: post.tags,
        }}
      />
      {/* BlogPosting structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
          '@type': 'Organization',
          name: post.author,
          url: 'https://mediawaveisrael.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'MediaWave Israel',
          url: 'https://mediawaveisrael.com',
          logo: { '@type': 'ImageObject', url: 'https://mediawaveisrael.com/images/logo.webp' },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://mediawaveisrael.com/blog/${post.slug}`,
        },
        inLanguage: 'he',
        keywords: post.tags.join(', '),
      }) }} />
      <article className="container max-w-[700px]">
        {/* Back link */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-brown-light hover:text-orange transition-colors text-sm"
          >
            <ArrowRight size={16} />
            חזרה לבלוג
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-terracotta/10 text-terracotta text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-headline text-brown-dark leading-tight mb-6">
            {post.title}
          </h1>

          {/* Featured image */}
          {post.featuredImage && (
            <div className="rounded-xl overflow-hidden mb-6">
              <img
                src={assetUrl(post.featuredImage, { width: 700, format: 'webp' })}
                alt={post.title}
                loading="lazy"
                className="w-full"
              />
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-5 text-sm text-brown-muted border-b border-cream-darker pb-6">
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <HtmlContent html={post.content} className="prose-hebrew" />
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          className="mt-16 pt-10 border-t border-cream-darker text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-brown-light text-lg mb-5">
            רוצים לדעת עוד? נשמח לשמוע מכם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-orange font-semibold hover:text-orange-dark transition-colors"
            >
              <ArrowRight size={18} />
              עוד מהבלוג
            </Link>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 bg-orange font-semibold px-6 py-3 rounded-full shadow-sm hover:shadow-glow hover:bg-orange-dark transition-all duration-300"
              style={{ color: '#FFFFFF' }}
            >
              צרו קשר
            </a>
          </div>
        </motion.div>
      </article>
    </div>
  )
}
