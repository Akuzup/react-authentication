import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@inspireui/reactore-auth': resolve(__dirname, '../dist/index.esm.js')
    }
  },
  server: {
    port: 3000,
    host: '127.0.0.1',
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
