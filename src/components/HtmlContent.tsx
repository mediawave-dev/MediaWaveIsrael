import DOMPurify from 'dompurify'

interface HtmlContentProps {
  html: string | null | undefined
  className?: string
}

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li',
  'h2', 'h3', 'h4', 'blockquote', 'img', 'figure', 'figcaption',
  'span', 'div', 'code', 'pre',
]

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
  'class', 'style', 'dir',
]

export function HtmlContent({ html, className }: HtmlContentProps) {
  if (!html) return null
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ['target'],
  })
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
  )
}
