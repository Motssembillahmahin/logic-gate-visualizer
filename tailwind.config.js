/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Signal palette — shared visual language across all pages.
        signal: {
          on: '#22d3ee',   // a live 1 / energized wire
          off: '#475569',  // a 0 / idle wire
          carry: '#f59e0b', // carry signals (visually distinct per CLAUDE.md)
        },
      },
    },
  },
  plugins: [],
}
