// shot · S9, the miniature: the whole site this visitor just scrolled, condensed into the phone's
// screen (SPEC S9). Static art, all aria-hidden: no text (the URL bar above it is the phone's),
// no Lottie, no Rive, no video. Every chapter comes back as its shape, in page order: the hero
// sheet with the lens (the film's poster in a circle), the three screens, the tools on the table,
// the laptop that built the site, the ink line and its four steps, the pad, the word in ink, the
// card and, last, the letter with the small laptop at its head (.shot-mini__letter, the match
// target pullBackMatched measures). Sized in cqw of the column, so it scales with the phone.
import { Laptop } from '../parts/Laptop'

// The built site's still in the shot palette, once the generator has written it (SPEC section 3).
// Until then the miniature screen draws the same page in CSS bars, never the KM navy file.
const BUILT = Object.values(
  import.meta.glob<string>('../parts/hero-built-shot.svg', { eager: true, query: '?url', import: 'default' }),
)[0]

const POSTER = '/images/lens-m-poster.webp'

/** The laptop's screen in the build: the page this laptop built. */
function Built() {
  if (BUILT) return <img className="shot-mini__built" src={BUILT} alt="" loading="lazy" decoding="async" />
  return (
    <span className="shot-mini__built shot-mini__built--css">
      <i className="shot-mini__built-chrome" />
      <i className="shot-mini__built-dot" />
      <i className="shot-mini__built-bar" />
      <i className="shot-mini__built-bar shot-mini__built-bar--b" />
      <i className="shot-mini__built-btn" />
    </span>
  )
}

export default function Mini() {
  return (
    <div className="shot-mini" aria-hidden="true">
      {/* hero: the lens on the sheet's top edge, the two H1 lines, the CTA */}
      <div className="shot-mini__sheet shot-mini__hero">
        <img className="shot-mini__lens" src={POSTER} alt="" loading="lazy" decoding="async" />
        <i className="shot-mini__bar shot-mini__bar--h1" />
        <i className="shot-mini__bar shot-mini__bar--h1b" />
        <i className="shot-mini__bar shot-mini__bar--cta" />
      </div>

      {/* meet: three screens on one sheet */}
      <div className="shot-mini__sheet shot-mini__meet">
        <i /><i /><i />
      </div>

      {/* choose: the tools lying on the table */}
      <div className="shot-mini__tools">
        <i className="shot-mini__tool shot-mini__tool--phone" />
        <i className="shot-mini__tool shot-mini__tool--loupe" />
        <i className="shot-mini__tool shot-mini__tool--bubble" />
        <i className="shot-mini__tool shot-mini__tool--cassette" />
        <i className="shot-mini__tool shot-mini__tool--frame" />
      </div>

      {/* build: the laptop, open, with the site it built */}
      <div className="shot-mini__build">
        <Laptop className="shot-lap shot-mini__lap"><Built /></Laptop>
      </div>

      {/* process: the ink line and its four sheets */}
      <div className="shot-mini__steps">
        <i className="shot-mini__line" />
        <i className="shot-mini__step" /><i className="shot-mini__step" /><i className="shot-mini__step" /><i className="shot-mini__step" />
      </div>

      {/* start: the pad with its binding, the word in ink, the card */}
      <div className="shot-mini__sheet shot-mini__pad">
        <i /><i /><i />
      </div>
      <i className="shot-mini__word" />
      <div className="shot-mini__sheet shot-mini__card">
        <i className="shot-mini__card-face" />
        <i className="shot-mini__card-row" /><i className="shot-mini__card-row" />
      </div>

      {/* the letter, the laptop that wrote it standing at its head */}
      <div className="shot-mini__sheet shot-mini__letter">
        <span className="shot-mini__pal">
          <Laptop className="shot-lap shot-mini__lap">
            <span className="shot-mini__writing"><i /><i /><i /></span>
          </Laptop>
        </span>
        <i className="shot-mini__field" />
        <i className="shot-mini__field" />
        <i className="shot-mini__field shot-mini__field--area" />
        <i className="shot-mini__send" />
      </div>
    </div>
  )
}
