import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/SoloVentas/', // 👈 esto define la ruta base para GitHub Pages
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'], // 👈 esto va dentro de babel
      },
    }),
  ],
})