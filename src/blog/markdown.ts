// The blog's Markdown (D218): one file per post in src/content/blog, so the studio can edit a post
// without touching code. A small, strict subset, parsed into blocks that Prose.tsx renders as React
// elements (no HTML strings anywhere, so nothing in a post can inject markup):
//   ---            frontmatter: "key: value" lines (see PostMeta)
//   ## / ###       headings
//   - / 1.         lists
//   > text         a tip
//   :::faq         "? question" then its answer lines, until ":::" (also the FAQPage JSON-LD)
//   :::price       shown only once src/data/pricing.ts is approved ({site}, {landing} become the ranges);
//   :::else        shown until then
//   :::
// Inline: **bold** and [text](href).

export type Cluster = 'decision' | 'trade' | 'video'

export interface PostMeta {
  slug: string
  title: string
  /** the meta description and the index line */
  description: string
  /** the small English label over the title, e.g. PRICES */
  kicker: string
  cluster: Cluster
  /** ISO dates, real ones only */
  published: string
  updated: string
  /** the service page this post leads to (its slug) */
  service?: string
  /** a trade of "האתר שלכם ב-60 שניות": the post ends at /your-site/?field=<id> */
  field?: string
  /** slugs of two or three close posts */
  related: string[]
  /** the closing line over the actions */
  cta?: string
  /** the WhatsApp prefill */
  wa?: string
  draft: boolean
}

export type Block =
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'tip'; text: string }
  | { type: 'faq'; items: { q: string; a: string }[] }
  | { type: 'price'; approved: Block[]; pending: Block[] }

export interface Post extends PostMeta {
  blocks: Block[]
  /** minutes, at 200 words a minute, rounded up */
  minutes: number
}

const CLUSTERS: Cluster[] = ['decision', 'trade', 'video']

function frontmatter(raw: string): [Record<string, string>, string] {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!m) return [{}, raw]
  const data: Record<string, string> = {}
  for (const line of m[1].split(/\r?\n/)) {
    const at = line.indexOf(':')
    if (at > 0) data[line.slice(0, at).trim()] = line.slice(at + 1).trim()
  }
  return [data, raw.slice(m[0].length)]
}

/** blocks from body lines; `heads` numbers the h2 ids across nested blocks */
function blocks(lines: string[], heads = { n: 0 }): Block[] {
  const out: Block[] = []
  let i = 0
  const para: string[] = []
  const flush = () => {
    if (para.length) out.push({ type: 'p', text: para.join(' ') })
    para.length = 0
  }
  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line) { flush(); i++; continue }
    if (line === ':::faq' || line === ':::price') {
      flush()
      const kind = line.slice(3)
      const body: string[] = []
      const alt: string[] = []
      let into = body
      i++
      while (i < lines.length && lines[i].trim() !== ':::') {
        if (kind === 'price' && lines[i].trim() === ':::else') into = alt
        else into.push(lines[i])
        i++
      }
      i++
      if (kind === 'price') out.push({ type: 'price', approved: blocks(body, heads), pending: blocks(alt, heads) })
      else {
        const items: { q: string; a: string }[] = []
        for (const l of body.map((s) => s.trim()).filter(Boolean)) {
          if (l.startsWith('? ')) items.push({ q: l.slice(2).trim(), a: '' })
          else if (items.length) items[items.length - 1].a = `${items[items.length - 1].a} ${l}`.trim()
        }
        out.push({ type: 'faq', items })
      }
      continue
    }
    if (line.startsWith('## ')) { flush(); heads.n += 1; out.push({ type: 'h2', text: line.slice(3).trim(), id: `q${heads.n}` }); i++; continue }
    if (line.startsWith('### ')) { flush(); out.push({ type: 'h3', text: line.slice(4).trim() }); i++; continue }
    const ul = /^- /.test(line)
    const ol = /^\d+\. /.test(line)
    if (ul || ol) {
      flush()
      const items: string[] = []
      while (i < lines.length && (ul ? /^- /.test(lines[i].trim()) : /^\d+\. /.test(lines[i].trim()))) {
        items.push(lines[i].trim().replace(ul ? /^- / : /^\d+\. /, ''))
        i++
      }
      out.push(ul ? { type: 'ul', items } : { type: 'ol', items })
      continue
    }
    if (line.startsWith('> ')) {
      flush()
      const tip: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('> ')) { tip.push(lines[i].trim().slice(2)); i++ }
      out.push({ type: 'tip', text: tip.join(' ') })
      continue
    }
    para.push(line)
    i++
  }
  flush()
  return out
}

/** every word a reader reads, for the reading time */
function words(bs: Block[]): number {
  const count = (s: string) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').split(/\s+/).filter(Boolean).length
  return bs.reduce((n, b) => {
    if (b.type === 'ul' || b.type === 'ol') return n + b.items.reduce((m, s) => m + count(s), 0)
    if (b.type === 'faq') return n + b.items.reduce((m, q) => m + count(q.q) + count(q.a), 0)
    if (b.type === 'price') return n + words(b.pending)
    return n + count(b.text)
  }, 0)
}

export function parsePost(slug: string, raw: string): Post {
  const [d, body] = frontmatter(raw)
  const bs = blocks(body.split(/\r?\n/))
  const cluster = CLUSTERS.includes(d.cluster as Cluster) ? (d.cluster as Cluster) : 'decision'
  return {
    slug,
    title: d.title ?? slug,
    description: d.description ?? '',
    kicker: d.kicker ?? 'BLOG',
    cluster,
    published: d.published ?? '',
    updated: d.updated || d.published || '',
    service: d.service || undefined,
    field: d.field || undefined,
    related: (d.related ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    cta: d.cta || undefined,
    wa: d.wa || undefined,
    draft: d.draft === 'true',
    blocks: bs,
    minutes: Math.max(1, Math.ceil(words(bs) / 200)),
  }
}

/** inline runs: plain text, **bold**, [text](href) */
export type Run = { t: 'text'; v: string } | { t: 'b'; v: string } | { t: 'a'; v: string; href: string }

export function inline(s: string): Run[] {
  const out: Run[] = []
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g
  let at = 0
  for (let m = re.exec(s); m; m = re.exec(s)) {
    if (m.index > at) out.push({ t: 'text', v: s.slice(at, m.index) })
    if (m[1] !== undefined) out.push({ t: 'b', v: m[1] })
    else out.push({ t: 'a', v: m[2], href: m[3] })
    at = m.index + m[0].length
  }
  if (at < s.length) out.push({ t: 'text', v: s.slice(at) })
  return out
}

/** "25.10.2026" from "2026-10-25" (the site's date style) */
export const dateHe = (iso: string) => iso.split('-').reverse().map((p) => String(Number(p))).join('.')
