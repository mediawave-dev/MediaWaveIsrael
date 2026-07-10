import type { BlogPost } from '../data/blog-posts'

/** Average Hebrew reading speed for non-technical readers */
const WORDS_PER_MINUTE = 200

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ')
}

export function countWords(html: string): number {
  return stripHtml(html).trim().split(/\s+/).filter(Boolean).length
}

export function estimateReadingMinutes(html: string): number {
  return Math.max(1, Math.round(countWords(html) / WORDS_PER_MINUTE))
}

/** Hebrew-correct label: "דקת קריאה" for one minute, "X דקות קריאה" otherwise */
export function formatReadingTime(minutes: number): string {
  return minutes === 1 ? 'דקת קריאה' : `${minutes} דקות קריאה`
}

/**
 * Related posts by shared tags — most overlapping tags first, newest breaks
 * ties. Posts with zero shared tags still qualify as fallback, so the section
 * never renders empty while there are other published posts.
 */
export function getRelatedPosts(
  currentSlug: string,
  all: BlogPost[],
  max = 2
): BlogPost[] {
  const current = all.find((p) => p.slug === currentSlug)
  if (!current) return []

  return all
    .filter((p) => p.published && p.slug !== currentSlug)
    .map((post) => ({
      post,
      shared: post.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    )
    .slice(0, max)
    .map(({ post }) => post)
}
