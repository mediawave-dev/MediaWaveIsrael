import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { Calendar, ArrowLeft, BookOpen } from 'lucide-react'
import { blogPosts as staticBlogPosts } from '../../data/blog-posts'
import SEO from '../SEO'
import { useAmbientMotion } from '../../hooks/useReducedMotion'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
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

const posts: BlogPost[] = staticBlogPosts
  .filter((p) => p.published)
  .map((p) => ({
    _id: p.slug,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    featuredImage: p.image || null,
    author: p.author,
    tags: p.tags,
    publishedAt: p.date,
  }))

export default function Blog() {
  return (
    <div className="min-h-screen bg-cream pt-32 pb-20">
      <SEO
        title="בלוג | טיפים ומדריכים לעסקים"
        description="טיפים, מדריכים ותובנות מעולם הפיתוח והעיצוב הדיגיטלי. איך לבנות נוכחות דיגיטלית חזקה לעסק שלכם."
        canonical="/blog"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ראשי', item: 'https://mediawave.co.il/' },
          { '@type': 'ListItem', position: 2, name: 'בלוג', item: 'https://mediawave.co.il/blog' },
        ],
      }) }} />
      <div className="container max-w-4xl">
        {/* Header */}
        <m.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-terracotta/10 text-sky-ink text-sm font-semibold px-5 py-2.5 rounded-full mb-6">
            <BookOpen size={16} />
            הבלוג שלנו
          </span>

          <h1 className="text-4xl md:text-5xl font-headline text-brown-dark mb-4">
            תכנים ומדריכים
          </h1>
          <p className="text-lg text-brown-light max-w-xl mx-auto leading-relaxed">
            טיפים, מדריכים ותובנות מעולם הפיתוח והעיצוב הדיגיטלי
          </p>
        </m.div>

        {/* Posts grid or empty state */}
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-8">
            {posts.map((post, index) => (
              <m.article
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  viewTransition
                  to={`/blog/${post.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-cream-darker/30 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Featured image */}
                  {post.featuredImage && (
                    <div className="aspect-[2/1] overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6 md:p-8">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-cream-dark text-brown-muted text-xs px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-headline text-brown-dark mb-3 group-hover:text-sky-ink transition-colors duration-200">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-brown-light leading-relaxed mb-5 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-brown-muted">
                        <Calendar size={14} />
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-sky-ink font-semibold text-sm group-hover:gap-2.5 transition-all duration-200">
                        קראו עוד
                        <ArrowLeft size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </m.article>
            ))}
          </div>
        )}

        {/* Back to home */}
        <m.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brown-light hover:text-sky-ink transition-colors"
          >
            <ArrowLeft size={18} className="rotate-180" />
            חזרה לדף הבית
          </Link>
        </m.div>
      </div>
    </div>
  )
}

function EmptyState() {
  // Ambient float stops only via the a11y widget
  const ambient = useAmbientMotion()
  return (
    <m.div
      className="text-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Decorative illustration */}
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-orange/10 blur-2xl" />
        <m.div
          className="relative w-full h-full rounded-full bg-cream-dark flex items-center justify-center"
          animate={ambient ? { y: [0, -8, 0] } : undefined}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BookOpen size={48} className="text-orange/60" />
        </m.div>
      </div>

      <h2 className="text-3xl font-headline text-brown-dark mb-3">
        בקרוב תכנים חדשים בדרך!
      </h2>
      <p className="text-lg text-brown-light max-w-md mx-auto leading-relaxed">
        אנחנו עובדים על תכנים מקצועיים שיעזרו לכם להבין טוב יותר את עולם הדיגיטל.
        חזרו בקרוב!
      </p>
    </m.div>
  )
}
