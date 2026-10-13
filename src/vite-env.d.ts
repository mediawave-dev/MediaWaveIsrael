/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** The site's look, set by the Vite mode (.env.look-k|m|km). Unset = 'km'. */
  readonly VITE_LOOK?: string
}
