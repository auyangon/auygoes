/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: '#a7c7e7',
          pink: '#f9c9d3',
          green: '#c1e1c1',
          yellow: '#f9e4b7',
          purple: '#d5b8ff',
          peach: '#ffd8b1',
          mint: '#b8e2d6',
          lavender: '#e2d1ff',
          rose: '#fadadd',
          sky: '#b2d8fa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
