// client/tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nacelle: ['"Inter"', 'sans-serif'], // 👈 this defines font-nacelle
      },
    },
  },
  plugins: [],
};
