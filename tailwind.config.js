/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
    fontFamily: {
      primary: ['Inter', ...fontFamily.sans],
    },
    colors: {
      primary: {
        // Customize it on globals.css :root
        50: 'rgb(var(--tw-color-primary-50) / <alpha-value>)',
        100: 'rgb(var(--tw-color-primary-100) / <alpha-value>)',
        200: 'rgb(var(--tw-color-primary-200) / <alpha-value>)',
        300: 'rgb(var(--tw-color-primary-300) / <alpha-value>)',
        400: 'rgb(var(--tw-color-primary-400) / <alpha-value>)',
        500: 'rgb(var(--tw-color-primary-500) / <alpha-value>)',
        600: 'rgb(var(--tw-color-primary-600) / <alpha-value>)',
        700: 'rgb(var(--tw-color-primary-700) / <alpha-value>)',
        800: 'rgb(var(--tw-color-primary-800) / <alpha-value>)',
        900: 'rgb(var(--tw-color-primary-900) / <alpha-value>)',
      },
      dark: '#2B2B2B',
      light: '#fEFEFE',
    },
    boxShadow:{
      'theme': '10px 10px rgba(34,34,34,1)',
    },
  },
  },
  plugins: [],
}