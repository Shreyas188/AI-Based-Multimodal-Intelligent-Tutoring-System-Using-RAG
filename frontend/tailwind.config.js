/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7fe',
          100: '#e8effd',
          200: '#d0defe',
          300: '#a8c2fc',
          400: '#7aa0fa',
          500: '#4f75f7',
          600: '#3b55ed',
          700: '#2c3dd7',
          800: '#2733b0',
          900: '#232e8c',
          950: '#151a54',
        },
        physics: {
          formula: '#f97316', // Warm orange for formula highlights
          concept: '#6366f1',  // Indigo for headers
          success: '#10b981',  // Green for passed quizzes
          warning: '#f59e0b',  // Yellow for tips/alerts
          error: '#ef4444',    // Red for failed attempts
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
