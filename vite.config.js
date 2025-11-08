import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Configure base so the app can be served from /dotan/ subdirectory
export default defineConfig({
  base: '/dotan/',
  plugins: [react()],
})
