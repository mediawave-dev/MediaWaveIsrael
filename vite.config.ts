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
          'lottie': ['lottie-react'],
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
        },
      },
    },
  },
})
