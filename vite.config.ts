import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from 'url'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true, 
      routeFileIgnorePattern: '.((test|spec|page).tsx|css)$',       // ← c'est ça qui fait le vrai lazy splitting
    }),
    react(), 
    tailwindcss()],
  resolve:{
    alias:[
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url)) },
      { find: '@schemas', replacement: fileURLToPath(new URL('./src/schemas', import.meta.url)) },
      { find: '@stores', replacement: fileURLToPath(new URL('./src/stores', import.meta.url)) }
    ]
  }
})
