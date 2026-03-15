import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Required for Capacitor: build to /dist folder
  build: {
    outDir: 'dist',
  },
  // Capacitor serves from the root
  base: './',
})
