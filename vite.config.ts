import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

type Look = 'k' | 'm' | 'km'

/** First paint per look: the stage is black, the void is lavender (DECISIONS #50). */
const LOOK_GROUND: Record<Look, string> = { k: '#000000', m: '#E6E1F2', km: '#000000' }
/** The Horizon mark's two tones on that ground (DECISIONS #52): upper (Media), lower (Wave) */
const LOOK_LOGO: Record<Look, [string, string]> = { k: ['#F5F5F7', '#A1A1A6'], m: ['#221E2E', '#5B4D94'], km: ['#F5F5F7', '#A1A1A6'] }

/** The look is a build-time constant (.env.look-k|m|km via --mode look-*; unset = km).
    data-look goes into index.html, so the prerendered first paint is already the right
    look with no flash; the browser chrome and the dev loader take the look's ground. */
function lookHtml(look: Look): Plugin {
  return {
    name: 'mediawave-look-html',
    transformIndexHtml(html) {
      return html
        .replace('<html lang="he" dir="rtl">', `<html lang="he" dir="rtl" data-look="${look}">`)
        .replace(/<meta name="theme-color" content="[^"]*" \/>/, `<meta name="theme-color" content="${LOOK_GROUND[look]}" />`)
        .replace('id="page-loader" style="position:fixed;inset:0;background:#000000;', `id="page-loader" style="position:fixed;inset:0;background:${LOOK_GROUND[look]};`)
        .replace('data-logo="a" fill="#F5F5F7"', `data-logo="a" fill="${LOOK_LOGO[look][0]}"`)
        .replace('data-logo="b" fill="#A1A1A6"', `data-logo="b" fill="${LOOK_LOGO[look][1]}"`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const look: Look = env.VITE_LOOK === 'k' || env.VITE_LOOK === 'm' || env.VITE_LOOK === 'km' ? env.VITE_LOOK : 'km'
  // Dev serves every look (?look= switches at boot); a build ships only its own look's scenes
  const pick = (name: string) => fileURLToPath(new URL(`./src/look/${name}.${command === 'serve' ? 'dev' : look}.ts`, import.meta.url))

  return {
    plugins: [react(), tailwindcss(), lookHtml(look)],
    envPrefix: ['VITE_', 'SANITY_STUDIO_'],
    resolve: {
      dedupe: ['react', 'react-dom', 'styled-components'],
      alias: {
        '@look/registry': pick('registry'),
        '@look/button': pick('button'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // NOTE: object-form manualChunks for 'sanity' forced the 4MB Studio
          // chunk into the ENTRY's static imports (downloaded on every page).
          // Sanity packages are now left to Rollup — they naturally live only
          // behind the lazy /studio route. Only truly-eager libs are pinned.
          manualChunks: {
            'framer-motion': ['framer-motion'],
            // BOTH lottie packages must be pinned together: LottieIcon imports
            // lottie-web directly (canvas renderer), and with only lottie-react
            // pinned, Rollup hoisted the lottie-web module into the 5MB Sanity
            // StudioPage chunk — making the chat widget pull Sanity Studio onto
            // every page (measured: a 10s compile task on /terms).
            'lottie': ['lottie-react', 'lottie-web'],
            // The scroll engine: gsap core + its React hook + Lenis, one cacheable chunk
            'motion-engine': ['gsap', '@gsap/react', 'lenis'],
            'react-vendor': ['react', 'react-dom'],
            'router': ['react-router-dom'],
          },
        },
      },
    },
  }
})
