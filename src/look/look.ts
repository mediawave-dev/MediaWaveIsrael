// The site's "look": one codebase, three switchable worlds (DECISIONS #50).
//   k   the launch: a keynote stage (black, thin type, one laptop)
//   m   floating objects: a lavender void with MediaWave's tools hanging in it
//   km  launch night: the page alternates between the stage and the void
//   shot  one shot (DECISIONS #83): one camera move over Nati's desk; white paper on a grey
//         table, built for the phone first (#84). The default build from this redesign on.
//
// Production: a build-time constant from the Vite mode (npm run build:k|m|km, .env.look-*).
// Vite replaces import.meta.env.* with literals, so every `LOOK === 'x'` folds and the
// per-look registry (vite.config alias @look/registry) ships only that look's scenes.
// Dev only: ?look=k|m|km|shot overrides it at boot. Read once, never persisted.

export type Look = 'k' | 'm' | 'km' | 'shot'

const isLook = (v: unknown): v is Look => v === 'k' || v === 'm' || v === 'km' || v === 'shot'

const BUILD_LOOK: Look = isLook(import.meta.env.VITE_LOOK) ? import.meta.env.VITE_LOOK : 'shot'

function devOverride(): Look {
  const q = new URLSearchParams(window.location.search).get('look')
  return isLook(q) ? q : BUILD_LOOK
}

export const LOOK: Look = import.meta.env.DEV && typeof window !== 'undefined' ? devOverride() : BUILD_LOOK

/** Stamp the look on <html> (dev override; production HTML already carries it). */
export function stampLook() {
  if (document.documentElement.dataset.look !== LOOK) document.documentElement.dataset.look = LOOK
}
