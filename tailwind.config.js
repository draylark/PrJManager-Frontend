/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      height: {
        '6/7': '85.7142857%',  // 6/7 in percentage
        '9/10': '90%',
      },
      borderRadius: {
        'extra': '2rem', // O cualquier otro valor que desees
      }
    },
  },
  plugins: [],
}

