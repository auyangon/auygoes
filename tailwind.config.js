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
          deep: '#0B4F3A',
          dark: '#1E7B5C',
          medium: '#2A9D7A',
          light: '#6BC9A8',
          soft: '#B8E2D6',
          pale: '#E8F6F0',
          mist: '#F0FAF5',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -15px rgba(11, 79, 58, 0.15), 0 4px 12px -8px rgba(0, 0, 0, 0.1)',
        'medium': '0 20px 50px -20px rgba(11, 79, 58, 0.25), 0 8px 20px -10px rgba(0, 0, 0, 0.15)',
        'strong': '0 30px 60px -25px rgba(11, 79, 58, 0.35), 0 12px 30px -12px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
