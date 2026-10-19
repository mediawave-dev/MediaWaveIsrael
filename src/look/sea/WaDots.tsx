// sea · the WhatsApp mark drawn in the field's dots (D138), for every WhatsApp control: the corner card,
// the WhatsApp keys and the phone dock. On hover its dots burst a little apart and snap back into the
// mark (sea-site.css), and at rest a slow ripple runs through them every few seconds, as through the field.
import { WA_DOTS } from './wa-dots-data'

export default function WaDots({ className = '' }: { className?: string }) {
  return (
    <svg className={`wa-dots ${className}`.trim()} viewBox="0 0 15 15" aria-hidden="true" focusable="false">
      {WA_DOTS.map(([x, y, r, d], i) => (
        <circle key={i} cx={x} cy={y} r={r} style={{ ['--d' as string]: d, ['--dx' as string]: ((x - 7.5) / 7.5).toFixed(2), ['--dy' as string]: ((y - 7.5) / 7.5).toFixed(2) }} />
      ))}
    </svg>
  )
}
