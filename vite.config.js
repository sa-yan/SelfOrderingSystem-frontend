import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // 👈 This allows access from other devices on the network
    proxy: {
      '/api': 'http://localhost:8080',
    }
  },
  plugins: [react()],
})
