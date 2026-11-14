// What a style says, and for whom (D271). By default the studio's own copy (content.ts) and the opening's words
// (preview.ts, the visitor's inside /your-site/). A concept site (src/concept) wraps a style in its own copy: a
// fictional business shown in the work wheel, whose key and form go nowhere but the page's own contact chapter.
import { createContext, useContext } from 'react'
import { C as STUDIO, CLIPS as STUDIO_CLIPS } from './content'
import { useHero, type Hero } from './preview'

export interface Copy {
  /** img (D271): a concept site's photograph for the service (Flight shows it under the word) */
  services: { title: string; items: { id: string; title: string; line: string; href: string; img?: string; alt?: string }[] }
  work: {
    title: string; name: string; line: string; href: string; linkLabel: string
    /** Flight's film: stills that come to life one after another (path without extension: .webp poster, .mp4) */
    clips: string[]
    /** Buzz's device film */
    film?: string; filmPoster?: string
  }
  process: { title: string; steps: { id: string; title: string; line: string }[] }
  faq: { title: string; items: { id: string; q: string; a: string }[] }
  contact: {
    title: string; lead: string; phone: string; email: string; response: string
    /** the form's last field and its button, when they are not the studio's */
    ask?: string; send?: string
  }
}

export interface Site {
  /** a fictional business (D271): the key and the form lead to the page's own contact chapter, nothing is sent */
  concept?: boolean
  C: Copy
  hero: Hero
  /** a film per service id (path without extension); a service without one shows no picture */
  clips: Record<string, string>
  /** Buzz: what flies (our winged chat bubbles, or bees), the word under the end swarm, the typed lines */
  buzz?: { swarm: 'bubble' | 'bee'; endWord: string; lines: string[] }
}

const SiteContext = createContext<Site | null>(null)
export const SiteProvider = SiteContext.Provider

export function useSite(): Site {
  const site = useContext(SiteContext)
  const hero = useHero()
  return site ?? { C: STUDIO, hero, clips: STUDIO_CLIPS }
}
