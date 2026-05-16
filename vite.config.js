import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change this to your GitHub username/repo, e.g., '/ev-journey-analyzer/'
const base = '/ev-journey-analyzer/'

export default defineConfig({
  plugins: [react()],
  base: base,
})
