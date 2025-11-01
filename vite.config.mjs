import { defineConfig } from 'vite'

export default defineConfig({
  base: '/portafolio/',
  root: '.',
  publicDir: 'public',
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      input: {
        portfolio: 'portfolio.html',
        delaunay: 'delaunay-research-final-with-pdf.html',
        rain: 'rain-prediction-demo.html'
      }
    },
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
})
