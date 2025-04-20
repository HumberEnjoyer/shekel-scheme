/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        nacelle: ["var(--font-nacelle)", "sans-serif"],
      },
      animation: {
        gradient: "gradient 6s linear infinite",
        shine: "shine 5s ease-in-out 500ms infinite",
      },
      backgroundImage: {
        "linear-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
        "linear-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
        "linear-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
        "linear-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
        "linear-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
