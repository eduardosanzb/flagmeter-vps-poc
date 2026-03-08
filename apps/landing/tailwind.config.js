/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
  ],
  safelist: ['md:hidden', 'md:flex', 'md:block'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a0a0a',
          primary: '#0f1419',
          secondary: '#6b7280',
          accent: '#10b981',
          accentDark: '#059669',
          light: '#ecfdf5',
          border: '#d1fae5',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Space Grotesk',
          'Inter',
          'system-ui',
          '-apple-system',
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
      },
      animation: {
        "marquee-fast": "marquee var(--marquee-speed, 10s) linear infinite forwards",
      },
      keyframes: {
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      keyframes: {
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      keyframes: {
        marquee: {
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
