import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50:  '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#0E7490',  /* primary — teal-blue like Facebook's weight */
          600: '#0C6275',
          700: '#0A5060',
          800: '#073D4A',
          900: '#042A35',
          950: '#021820',
        },
        kgreen: {
          50: '#E8F5E6',
          100: '#C8E6C4',
          200: '#A5D6A0',
          300: '#81C784',
          400: '#66BB6A',
          500: '#138808',
          600: '#0F6E06',
          700: '#0A5304',
          800: '#063902',
          900: '#031E01',
        },
        cream: '#F0F8FA',
        surface: {
          light: '#FFFFFF',
          dark: '#1E1E1E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '375px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
