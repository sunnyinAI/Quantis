/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF4E6',
          100: '#FFE4B5',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9933',
          600: '#E6871A',
          700: '#CC7600',
          800: '#994B00',
          900: '#662F00',
        },
        hundigreen: {
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
        cream: '#F5F5F0',
        surface: {
          light: '#FFFFFF',
          dark: '#1E1E1E',
        }
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
}
