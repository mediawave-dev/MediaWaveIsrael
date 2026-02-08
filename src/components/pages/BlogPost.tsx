import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, User } from 'lucide-react'
import { blogPosts } from '../../data/blog-posts'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  const post = blogPosts.find((p) => p.slug === slug && p.published)

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20">
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
          {post.tags.length > 0 && (
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

          {/* Meta */}
          <div className="flex items-center gap-5 text-sm text-brown-muted border-b border-cream-darker pb-6">
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <motion.div
          className="prose-hebrew"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

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
