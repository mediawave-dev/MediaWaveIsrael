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
        manualChunks: {
          // Split heavy animation libs from main bundle for parallel loading
          'framer-motion': ['framer-motion'],
          'lottie': ['lottie-react'],
          // Split React core
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          // Sanity client libs (small, used on public pages)
          'sanity-client': ['@sanity/client', '@sanity/image-url', '@portabletext/react'],
          // Sanity Studio (large, lazy-loaded only on /studio route)
          'sanity-studio': ['sanity'],
        },
      },
    },
  },
})
