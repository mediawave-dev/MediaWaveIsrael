// The posts (D218): every src/content/blog/*.md file, parsed once when the blog's chunk loads. The
// blog is its own lazy chunk, so the home page never carries the posts. A draft (draft: true) is
// left out of the build's lists, the sitemap and the feed; ?draft=1 shows it for review.
import { parsePost, type Post } from './markdown'

const files = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

/** on the same day, the buying questions first, then the trades, then video */
const RANK: Record<Post['cluster'], number> = { decision: 0, trade: 1, video: 2 }

const all: Post[] = Object.entries(files)
  .map(([path, raw]) => parsePost(path.split('/').pop()!.replace(/\.md$/, ''), raw))
  .sort((a, b) => b.published.localeCompare(a.published) || RANK[a.cluster] - RANK[b.cluster] || a.title.localeCompare(b.title))

const review = () => typeof window !== 'undefined' && /[?&]draft=1(&|$)/.test(window.location.search)

export const posts = (): Post[] => all.filter((p) => !p.draft || review())

export const getPost = (slug: string): Post | undefined => posts().find((p) => p.slug === slug)

/** the related posts the file names, in its order, then the newest of the same cluster */
export function relatedTo(post: Post, n = 3): Post[] {
  const list = posts().filter((p) => p.slug !== post.slug)
  const named = post.related.map((s) => list.find((p) => p.slug === s)).filter((p): p is Post => !!p)
  const more = list.filter((p) => p.cluster === post.cluster && !named.includes(p))
  return [...named, ...more].slice(0, n)
}
