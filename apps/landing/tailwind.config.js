/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
  ],
  theme: {
    extend: {
      colors: {
        // Option 1: Electric Emerald - Vibrant green/black
        brand: {
          dark: '#0a0a0a',      // pure black - text
          primary: '#0f1419',   // rich black - dark sections
          secondary: '#6b7280', // neutral gray - descriptions
          accent: '#10b981',    // emerald-500 - PRIMARY CTAs
          accentDark: '#059669', // emerald-600 - hover states
          light: '#ecfdf5',     // emerald-50 - light sections (subtle green tint)
          border: '#d1fae5',    // emerald-200 - borders with green hint
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
        'subtle': '0 1px 3px 0 rgba(16, 185, 129, 0.1), 0 1px 2px -1px rgba(16, 185, 129, 0.1)',
        'card': '0 4px 6px -1px rgba(16, 185, 129, 0.08), 0 2px 4px -2px rgba(16, 185, 129, 0.08)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
