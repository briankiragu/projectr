/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "slide-in": "slide-in 0.5s ease forwards",
        "slide-out": "slide-out 0.5s ease forwards",
      },
      colors: {
        "tvc-orange": "#ff9538",
        "tvc-green": "#0ab9aa",
      },
      fontFamily: {
        serif: ["NYT Imperial", "Georgia", "ui-serif"],
      },
      fontSize: {
        large: ["2.25em", { lineHeight: "2.5em" }],
        larger: ["3.75em", { lineHeight: "1" }],
        largest: ["6em", { lineHeight: "1" }],
      },
      keyframes: {
        "slide-in": {
          "0%": { opacity: 0, transform: "translateX(100%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "slide-out": {
          "0%": { opacity: 1, transform: "translateX(0)" },
          "100%": { opacity: 0, transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};
