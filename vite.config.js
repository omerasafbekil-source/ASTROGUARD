
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/nasa-api': {
        target: 'https://visualization.osdr.nasa.gov',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/nasa-api/, '')
      },
      '/nasa-public': {
        target: 'https://osdr.nasa.gov',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/nasa-public/, '')
      }
    }
  }
})
