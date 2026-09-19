/** @type {import('tailwindcss').Config} */

/*
 * TourEase AI colour system — "Sunny Coast" palette
 *   Light Blue    #8ECAE6   accents, links, highlights on dark
 *   Sunny Yellow  #FFB703   primary actions, active states, ratings, focus
 *   Sky Blue      #2571BC   primary blue (surfaces, chat bubbles, icon tiles)
 *   Ocean Blue    #003060   page background / deepest surface
 *
 * Existing utility names (indigo / purple / cyan / pink / amber / slate / dark)
 * are re-mapped onto this palette so every page picks it up automatically.
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        display: ['Clash Display', 'Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Brand tokens (use these for new code)
        brand: {
          light: '#8ECAE6',
          sun: '#FFB703',
          sky: '#2571BC',
          ocean: '#003060',
        },

        primary: {
          50: '#eef7fc',
          100: '#d9edf8',
          500: '#2571BC',
          600: '#1f62a3',
          700: '#194f87',
          900: '#003060',
        },

        // "indigo" was the old primary → now the Sky Blue / Light Blue family
        indigo: {
          50: '#eef7fc',
          100: '#d9edf8',
          200: '#bfe1f3',
          300: '#a9d8ef',
          400: '#8ECAE6',
          500: '#2571BC',
          600: '#1f62a3',
          700: '#194f87',
          800: '#123c6a',
          900: '#0a2d59',
        },
        // "purple" was the old gradient partner → deeper azure
        purple: {
          200: '#c4e2f4',
          300: '#a3d3ec',
          400: '#62aadb',
          500: '#2f7fce',
          600: '#164e91',
          700: '#123f75',
          900: '#0a2d59',
        },
        cyan: {
          300: '#b5dcf0',
          400: '#8ECAE6',
          500: '#3d9cd0',
          600: '#2f8bc0',
        },
        blue: {
          300: '#a9d8ef',
          400: '#62aadb',
          500: '#2571BC',
          600: '#1f62a3',
        },
        // warm accent → Sunny Yellow (also used for stars / warnings)
        amber: {
          200: '#ffe08a',
          300: '#ffd25e',
          400: '#FFB703',
          500: '#f2a900',
          600: '#d99700',
        },
        pink: {
          400: '#ffc233',
          500: '#FFB703',
          600: '#e39f00',
        },
        // neutral text greys → blue-tinted so they sit naturally on Ocean Blue
        slate: {
          50: '#f4f9fd',
          100: '#eef6fb',
          200: '#dbeaf5',
          300: '#c1d8e9',
          400: '#a9c7dd',
          500: '#88a8c4',
          600: '#7396b4',
          700: '#3b5f82',
          800: '#1c4670',
          900: '#0a2d59',
        },
        accent: {
          cyan: '#8ECAE6',
          purple: '#2f7fce',
          pink: '#FFB703',
          amber: '#FFB703',
          emerald: '#10b981',
        },
        // surfaces: 900 = Ocean Blue page bg, lighter as they rise
        dark: {
          900: '#003060',
          800: '#00274f',
          700: '#0a3f7a',
          600: '#114a8a',
          500: '#1a5a9f',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, #2571BC 0%, #8ECAE6 100%)',
        'hero-pattern': 'linear-gradient(135deg, #003060 0%, #0a4a8a 50%, #00274f 100%)',
        'sun-gradient': 'linear-gradient(135deg, #FFB703 0%, #ffc72c 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'slide-up': 'slideUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
