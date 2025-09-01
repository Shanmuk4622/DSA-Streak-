/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <-- add this line
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};