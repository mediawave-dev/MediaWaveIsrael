// Proof: what a visitor can check, and what clients said (13.11.2026). The guide is docs/PROOF.rtl.md.
// Everything here ships empty. A place on the site with nothing real in it does not appear at all
// (src/sun/Proof.tsx). Nothing is ever invented: no sentence, no name, no rating, no count.

/** Where a client's sentence stands. Each place shows one sentence at most.
    hero   under the two buttons of the home page's opening
    steps  after the steps of the home page, under the date slip
    price  under the quote slip of a service page
    form   above the contact circle, on every page that has the form */
export type ProofPlace = 'hero' | 'steps' | 'price' | 'form'

export interface ClientVoice {
  /** any short name of your own, one per sentence */
  id: string
  place: ProofPlace
  /** A service page's slug ("landing-pages"): the sentence then shows only on that service's page.
      Without it, a "price" or "form" sentence shows on every page that has the place. */
  service?: string
  /** the client's sentence, word for word. Shortening is fine; changing words is not. */
  quote: string
  /** the part of `quote` to set heavy: the result, the change, the strongest phrase. Copied exactly from `quote`. */
  strong: string
  /** first name and what they do, as the visitor may know them. The shape is "נועה, מאמנת כושר"
      (a made-up name, to show the shape only). */
  who: string
  /** where it was said: "הודעת וואטסאפ", "ביקורת בגוגל", "שיחת טלפון" */
  where: string
  /** month and year, as "2026-10" (the site writes "אוקטובר 2026") */
  when: string
  /** The real screenshot, a file in public/proof/. Width and height are the file's own, in pixels.
      `alt` says in one sentence what the picture shows, for a visitor who cannot see it. */
  shot?: { src: string; width: number; height: number; alt: string }
  /** the public source, when there is one (the Google review's own link) */
  source?: string
  /** true only after the client agreed to this sentence, with this name, on the site */
  approved: boolean
}

export const VOICES: ClientVoice[] = []

/** The studio's Google profile. The line beside the form appears only when all three are real. */
export interface GoogleProfile {
  /** the link that opens the profile's reviews */
  url: string
  /** as Google shows it, for example 4.9 */
  rating: number
  /** how many reviews Google shows */
  count: number
}

export const GOOGLE: GoogleProfile | null = null

/** One line under the "נעים מאוד" block about the people behind the studio (who answers the WhatsApp,
    who builds the page). No faces. Empty means no line. */
// Nati's wording (13.11.2026); the link is the site's own WhatsApp, which Moriah answers
export const SIGNATURE = 'לפרטים נוספים, תמיד אפשר לפנות למוריה.'
