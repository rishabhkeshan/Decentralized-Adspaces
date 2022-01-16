module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        themecyan: "#00FFFB",
        solidnavy: "#141D5B",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
