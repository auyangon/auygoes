// tailwind.config.js
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
          DEFAULT: '#34d399',
          light: '#6ee7b7',
          dark: '#059669',
        },
        secondary: {
          DEFAULT: '#60a5fa',
          light: '#93c5fd',
          dark: '#2563eb',
        },
        dark: {
          DEFAULT: '#0a0f1e',
          lighter: '#1e293b',
          darker: '#020617',
        },
        glass: {
          bg: 'rgba(17, 25, 40, 0.75)',
          border: 'rgba(255, 255, 255, 0.125)',
          highlight: 'rgba(255, 255, 255, 0.05)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #34d399 0%, #60a5fa 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0f1e 0%, #1e293b 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float-slow 12s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}