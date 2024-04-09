/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "tvc-orange": "#ff9538",
        "tvc-green": "#0ab9aa",
      },
      fontSize: {
        large: ["2.25em", { lineHeight: "2.5em" }],
        larger: ["3.75em", { lineHeight: "1" }],
        largest: ["6em", { lineHeight: "1" }],
      },
    },
  },
  plugins: [],
};
