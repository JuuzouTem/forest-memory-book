/** @type {import('tailwindcss').Config} */
export default {
  content:[
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: '#9CAF88',
        dustyRose: '#D2A6A2',
        cream: '#F9F6F0',
        olive: '#3B4333'
      },
      fontFamily: {
        sans:['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins:[],
}