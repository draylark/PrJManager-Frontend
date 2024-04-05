/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      width: {
        '1/7': '14.2857143%',  // 100 ÷ 7
      },
      height: {
        '6/7': '85.7142857%',  // 6/7 in percentage
        '9/10': '90%',
        '1/5': '20%'
      },
      borderRadius: {
        'extra': '2rem', // O cualquier otro valor que desees
      },
      screens: {
        'sn': '450px'
      }
    },

  },
  plugins: [],
}

