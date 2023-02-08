/** @type {import('tailwindcss').Config} */
const prettier = require("prettier-plugin-tailwindcss");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [prettier],
};
