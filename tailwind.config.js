/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
// import colors from 'tailwindcss/colors';
import { default as flattenColorPalette }from 'tailwindcss/lib/util/flattenColorPalette'

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
const addVariablesForColors = plugin(function({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
});

export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      width: {
        '1/7': '14.2857143%',  // 100 ÷ 7
      },
      height: {
        '6/7': '85.7142857%',  // 6/7 en porcentaje
        '9/10': '90%',
        '1/5': '20%'
      },
      borderRadius: {
        'extra': '2rem',
      },
      screens: {
        'sn': '450px'
      },
      backdropBlur: {
        xl: '80px',
      },
      colors: {
        'glass-blue': 'rgba(41, 155, 255, 0.1)',
      },
      borderColor: {
        'glass-white': 'rgba(255, 255, 255, 0.2)',
      },
      boxShadow: {
        'glass-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
      },       
          
      "animation": {
        shimmer: "shimmer 2s linear infinite"
      },
      "keyframes": {
        shimmer: {
          from: {
            "backgroundPosition": "0 0"
          },
          to: {
            "backgroundPosition": "-200% 0"
          }
        }
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
    addVariablesForColors,
  ],
  
};