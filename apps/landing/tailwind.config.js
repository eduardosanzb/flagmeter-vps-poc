/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
  ],
  theme: {
    extend: {
      colors: {
        // Subtle modern palette
        brand: {
          dark: '#0f172a',      // slate-900 - deepest text
          primary: '#1e293b',   // slate-800 - dark backgrounds
          secondary: '#475569', // slate-600 - muted text
          accent: '#3b82f6',    // blue-500 - CTAs
          light: '#f8fafc',     // slate-50 - light backgrounds
          border: '#e2e8f0',    // slate-200 - subtle borders
        }
      },
      fontFamily: {
        sans: [
          'Helvetica Neue',
          'Helvetica',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
