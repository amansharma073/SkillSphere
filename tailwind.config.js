/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    // Pin the entire font size scale so deployed env matches localhost exactly
    fontSize: {
      'xs':   ['0.75rem',  { lineHeight: '1rem' }],
      'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
      'base': ['1rem',     { lineHeight: '1.5rem' }],
      'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
      'xl':   ['1.25rem',  { lineHeight: '1.75rem' }],
      '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
      '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl':  ['2.25rem',  { lineHeight: '2.5rem' }],
      '5xl':  ['3rem',     { lineHeight: '1' }],
      '6xl':  ['3.75rem',  { lineHeight: '1' }],
      '7xl':  ['4.5rem',   { lineHeight: '1' }],
      '8xl':  ['6rem',     { lineHeight: '1' }],
      '9xl':  ['8rem',     { lineHeight: '1' }],
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradientX 4s ease infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139,92,246,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(139,92,246,0.7), 0 0 80px rgba(99,102,241,0.3)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
}
