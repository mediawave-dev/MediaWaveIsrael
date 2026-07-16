import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: ['VITE_', 'SANITY_STUDIO_'],
  resolve: {
    dedupe: ['react', 'react-dom', 'styled-components'],
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
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
        },
      },
    },
  },
})
