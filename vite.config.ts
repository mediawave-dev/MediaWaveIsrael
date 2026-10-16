import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

type Look = 'k' | 'm' | 'km' | 'shot'

/** First paint per look: the stage is black, the void is lavender (DECISIONS #50). */
const LOOK_GROUND: Record<Look, string> = { k: '#00113D', m: '#FAFAF7', km: '#00113D', shot: '#ECEEF1' }
/** The Horizon mark's two tones on that ground (DECISIONS #52): upper (Media), lower (Wave) */
const LOOK_LOGO: Record<Look, [string, string]> = { k: ['#FFFFFF', '#6E8CFF'], m: ['#0E1016', '#002FA7'], km: ['#FFFFFF', '#6E8CFF'], shot: ['#1B1D21', '#00248A'] }

/** The look is a build-time constant (.env.look-k|m|km|shot via --mode look-*; unset = shot).
    data-look goes into index.html, so the prerendered first paint is already the right
    look with no flash; the browser chrome and the dev loader take the look's ground. */
function lookHtml(look: Look): Plugin {
  return {
    name: 'mediawave-look-html',
    transformIndexHtml(html) {
      return html
        .replace('<html lang="he" dir="rtl">', `<html lang="he" dir="rtl" data-look="${look}">`)
        .replace(/<meta name="theme-color" content="[^"]*" \/>/, `<meta name="theme-color" content="${LOOK_GROUND[look]}" />`)
        .replace('id="page-loader" style="position:fixed;inset:0;background:#00113D;', `id="page-loader" style="position:fixed;inset:0;background:${LOOK_GROUND[look]};`)
        .replace('data-logo="a" fill="#FFFFFF"', `data-logo="a" fill="${LOOK_LOGO[look][0]}"`)
        .replace('data-logo="b" fill="#6E8CFF"', `data-logo="b" fill="${LOOK_LOGO[look][1]}"`)
        .replace(/<meta name="msapplication-TileColor" content="[^"]*" \/>/, `<meta name="msapplication-TileColor" content="${LOOK_GROUND[look]}" />`)
    },
    // public/site.webmanifest is copied as-is; its splash and theme colour follow the look's ground
    writeBundle(options) {
      const file = resolve(options.dir ?? 'dist', 'site.webmanifest')
      if (!existsSync(file)) return
      writeFileSync(file, readFileSync(file, 'utf8').replace(/#00113D/gi, LOOK_GROUND[look]))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const look: Look = env.VITE_LOOK === 'k' || env.VITE_LOOK === 'm' || env.VITE_LOOK === 'km' || env.VITE_LOOK === 'shot' ? env.VITE_LOOK : 'shot'
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
            // The contact companion's runtime (DECISIONS #56): only ever imported dynamically,
            // after load + idle, so it stays out of every page's first download
            'rive': ['@rive-app/canvas-lite'],
            'react-vendor': ['react', 'react-dom'],
            'router': ['react-router-dom'],
          },
        },
      },
    },
  }
})
