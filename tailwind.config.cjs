/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        red: colors.red,
      },
      fontFamily: {
        fipps: ["fipps"],
      },
    },
  },
  plugins: [],
};
