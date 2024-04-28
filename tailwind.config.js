/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

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
      },
      backdropBlur: {
        xl: '80px', // Desenfoque de 20px
      },
      colors: {
        'glass-blue': 'rgba(41, 155, 255, 0.1)', // Color azul claro con transparencia
      },
      borderColor: {
        'glass-white': 'rgba(255, 255, 255, 0.2)', // Borde blanco con transparencia
      },
      boxShadow: {
        'glass-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)', // Sombra ligera
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      const newComponents = {
        '.glassi': {
          '@apply backdrop-blur-xl bg-glass-blue border border-glass-white shadow-glass-shadow': {},
        },
        '.glassi-hover': {
          '@apply backdrop-blur-xl bg-glass-blue/30 border border-glass-white shadow-glass-shadow': {},
        },
      };
      addComponents(newComponents);
    }),
  ],
}