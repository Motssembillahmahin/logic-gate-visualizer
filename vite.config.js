import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages repo name for asset paths to resolve.
// Repo: https://github.com/asmmahin/logic-gate-visualizer
export default defineConfig({
  base: '/logic-gate-visualizer/',
  plugins: [react()],
})
