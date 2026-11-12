// sun · three versions of the home page's words, for Nati to choose between block by block.
//   /?copy=a (or b, c)            a whole version
//   /?copy=a&process=c&contact=b  a block set on its own wins over ?copy, so the mix he picks reads as one page
//   /?copy=a&about=now            any other value is today's text for that block
// The blocks: hero, about, offer, process, launch, faq, contact. With no parameter the page reads today's text
// from content.ts, untouched. After his pick: move the chosen blocks into content.ts and delete this folder.
import a from './a'
import b from './b'
import c from './c'
import type { CopyVersion, Section } from './types'

/** No word alone on a last line: the last two words of a running line stay together, the way the hero ties
    "דפי נחיתה" by hand. Only where the stylesheet does not already do it: the line under the heading and the
    about paragraphs wrap with `text-wrap: pretty`, and a tie on top of that left a short first line.
    Headings are left alone (short, and balanced by the stylesheet). */
const tie = (s: string) => s.replace(/ (?=\S+$)/, '\u00A0')
const tieLines = <T extends { line: string }[]>(rows: T) => rows.map((r) => ({ ...r, line: tie(r.line) })) as T

const tied = (v: CopyVersion): CopyVersion => ({
  ...v,
  OFFER: { ...v.OFFER, kinds: tieLines(v.OFFER.kinds) },
  PROCESS: { ...v.PROCESS, steps: tieLines(v.PROCESS.steps) },
  LAUNCH: { ...v.LAUNCH, note: tie(v.LAUNCH.note) },
  CONTACT: { ...v.CONTACT, lede: tie(v.CONTACT.lede) },
})

export const VERSIONS = { a: tied(a), b: tied(b), c: tied(c) }

/** Home page only: the service pages share CONTACT's line under their own headings, and a version's line
    may answer the home page's heading (A's follows "מה קורה אחרי השליחה?"). */
export function versionFor(section: Section): CopyVersion | undefined {
  if (typeof location === 'undefined' || location.pathname !== '/') return undefined
  const q = new URLSearchParams(location.search)
  const k = q.get(section) ?? q.get('copy')
  return k === 'a' || k === 'b' || k === 'c' ? VERSIONS[k] : undefined
}
