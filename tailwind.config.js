/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A5D4E',
        secondary: '#8B9574',
        accent: '#D4A574',
        surface: {
          50: '#FAF8F5',
          100: '#F5F2ED',
          200: '#EDE7DD',
          300: '#E0D7C8',
          400: '#CCC0AB',
          500: '#B5A68D',
          600: '#9D8C6F',
          700: '#857458',
          800: '#6B5E46',
          900: '#554A38'
        },
        background: '#FAF8F5',
        success: '#7A9A65',
        warning: '#D4A574',
        error: '#B87E7E',
        info: '#6B8CAE'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['DM Serif Display', 'serif'],
        heading: ['DM Serif Display', 'serif']
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.25rem',
        xl: '1.563rem',
        '2xl': '1.953rem',
        '3xl': '2.441rem',
        '4xl': '3.052rem'
      },
      borderRadius: {
        'DEFAULT': '8px',
        'lg': '16px'
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms'
      },
      boxShadow: {
        'zen': '0 2px 8px rgba(74, 93, 78, 0.1)',
        'zen-lg': '0 4px 16px rgba(74, 93, 78, 0.15)'
      }
    },
  },
  plugins: [],
}