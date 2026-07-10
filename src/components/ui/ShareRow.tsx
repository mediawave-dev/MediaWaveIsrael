import { useState } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'
import { SITE_URL } from '../../data/site'

interface ShareRowProps {
  title: string
  /** Canonical path, e.g. /blog/my-post */
  path: string
}

/**
 * Article share actions — WhatsApp first (how Israelis actually share),
 * copy-link with inline confirmation, and the native share sheet where the
 * browser offers one.
 */
export function ShareRow({ title, path }: ShareRowProps) {
  const [copied, setCopied] = useState(false)
  const url = `${SITE_URL}${path}`

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked — the WhatsApp/native buttons still work
    }
  }

  const handleNativeShare = () => {
    navigator.share({ title, url }).catch(() => {
      // User closed the share sheet — nothing to do
    })
  }

  const buttonClass =
    'inline-flex items-center gap-2 min-h-11 px-4 py-2 rounded-full border-2 border-cream-darker bg-white text-sm font-semibold text-brown transition-colors duration-200 hover:border-orange-dark hover:text-sky-ink active:scale-[0.98]'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-brown-muted">שתפו את המאמר:</span>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label={`שיתוף המאמר "${title}" בוואטסאפ`}
      >
        <WhatsAppIcon />
        וואטסאפ
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className={buttonClass}
        aria-label="העתקת קישור למאמר"
      >
        {copied ? (
          <>
            <Check size={16} className="text-sky-ink" aria-hidden="true" />
            <span className="text-sky-ink">הקישור הועתק</span>
          </>
        ) : (
          <>
            <Link2 size={16} aria-hidden="true" />
            העתקת קישור
          </>
        )}
      </button>

      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className={buttonClass}
          aria-label="שיתוף המאמר"
        >
          <Share2 size={16} aria-hidden="true" />
          שיתוף
        </button>
      )}
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-shrink-0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
