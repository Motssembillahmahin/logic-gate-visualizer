import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// jsdom environment lets us test React components; pure logic tests run fine
// under it too. setupFiles wires in jest-dom matchers (toBeInTheDocument, etc).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
