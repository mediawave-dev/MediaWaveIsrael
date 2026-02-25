import type { PortableTextComponents } from '@portabletext/react'
import { urlFor } from './imageUrl'

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-headline text-brown-dark mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-headline text-brown-dark mt-6 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg md:text-xl font-headline text-brown-dark mt-5 mb-2">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-r-4 border-orange pr-4 my-6 text-brown-light italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-brown-light leading-relaxed mb-4">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-brown-light mr-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-brown-light mr-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-brown-dark">{children}</strong>,
    em: ({ children }) => <span className="text-orange">{children}</span>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    code: ({ children }) => (
      <code className="bg-cream-dark px-1.5 py-0.5 rounded text-sm font-english" dir="ltr">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = value?.href ?? '#'
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          className="text-orange hover:text-orange-dark underline underline-offset-2 transition-colors"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-6">
          <img
            src={urlFor(value).width(800).auto('format').url()}
            alt={value.alt ?? ''}
            loading="lazy"
            className="rounded-lg w-full"
          />
          {value.alt && (
            <figcaption className="text-sm text-brown-muted mt-2 text-center">
              {value.alt}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}
