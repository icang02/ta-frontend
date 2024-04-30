/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: "Montserrat",
        roboto: "Roboto",
      },
      colors: {
        main: "#333333",
      },
    },
  },
  plugins: [],
};
