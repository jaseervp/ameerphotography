/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        dark: "var(--color-dark)",
        light: "var(--color-light)",
        base: "var(--color-bg-base)",
        "theme-bg": "var(--color-bg-base)",
        white: "#FFFFFF",
        black: "#000000",
        "on-primary": "var(--color-on-primary)",
        "on-light": "var(--color-on-light)",
        border: {
          light: "var(--color-border-light)",
          dark: "var(--color-border-dark)"
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
        crake: ['Cinzel', 'serif'],
        schnyder: ['Schnyder', 'serif'],
        schnyderScond: ['Schnyder-Scond', 'serif'],
      }
    },
  },
  plugins: [],
}
