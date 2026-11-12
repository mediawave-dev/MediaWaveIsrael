// sun · the shape of one version of the home page's words (the night of 12.11.2026).
// A version rewrites the seven blocks Home.tsx reads from content.ts and nothing else. NAV, ALSO, WA, PROJECTS,
// the sticker, the button labels, the form's status lines and the closing line of "נעים מאוד" (Nati's own
// wording, D246) stay in content.ts, the same in every version.
export type Section = 'hero' | 'about' | 'offer' | 'process' | 'launch' | 'faq' | 'contact'

type Kind = { tone: 'sun' | 'blue' | 'coral'; name: string; line: string }
type Step = { title: string; line: string }

export interface CopyVersion {
  /** the approach in one line, as Nati reads it on the board (design/copy/sun-versions.rtl.md) */
  approach: string
  /** the heading's two sentences (heavy, then light) and the line under them ('' for no line) */
  HERO: { h1: [string, string]; lede: string }
  /** "light |heavy" in every h2; one to four paragraphs */
  ABOUT: { h2: string; lines: string[] }
  OFFER: { h2: string; kinds: [Kind, Kind, Kind] }
  PROCESS: { h2: string; steps: [Step, Step, Step, Step] }
  /** `start` runs into a date and a question mark, `end` into a date and a full stop (Home.tsx, LaunchDate) */
  LAUNCH: { start: string; end: string; note: string }
  /** ids from src/data/faqs.ts, in the order shown; the answers are never rewritten here */
  FAQ: { h2: string; ids: string[] }
  CONTACT: { h2: string; lede: string }
}
