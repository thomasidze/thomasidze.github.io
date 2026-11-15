import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' — сайт работает и в корне домена, и в подпапке (GitHub Pages: /<репозиторий>/)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
