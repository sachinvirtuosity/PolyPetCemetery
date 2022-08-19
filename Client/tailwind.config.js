/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      spacing: {
        '1/10': '10%',
        '2/5': '40%',
        '1/20': '5%',
        '26': '100px'
      },
      visibility: ['group-hover'],
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
      }
    },
  },
  plugins: [],
}
