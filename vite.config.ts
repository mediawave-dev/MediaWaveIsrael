import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
        },
      },
    },
  },
})
