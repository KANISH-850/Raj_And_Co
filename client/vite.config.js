import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Ensures direct navigation to /projects, /login etc. works in local dev
    historyApiFallback: true,
  },
})

