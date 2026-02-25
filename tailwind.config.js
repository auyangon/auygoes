/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        seafoam: {
          dark: '#0B4F3A',
          medium: '#1E7B5C',
          light: '#2A9D7A',
          soft: '#D1F2E5',
          pale: '#E8F6F0',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}