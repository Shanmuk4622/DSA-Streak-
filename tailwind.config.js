/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryGradient: ["#FF7E5F", "#FD3A69"],
        light: { background: "#FFFFFF", text: "#1F2937" },
        dark: { background: "#1F2937", text: "#F9FAFB" },
      },
      fontSize: {
        "2xl": "1.5rem",
        base: "1rem",
      },
      fontWeight: {
        bold: "700",
        medium: "500",
      },
      borderRadius: {
        lg: "0.5rem",
      },
      boxShadow: {
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};