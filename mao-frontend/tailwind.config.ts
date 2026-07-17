import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // PALETA CORPORATIVA ESTRICTA MAO
      colors: {
        forja: "#1A1A1A",   // Negro Forja - Estructura y Textos Principales
        roble: "#C67D3A",   // Roble Tostado - CTA y Acentos de Conversión
        cemento: "#EAEAEA", // Gris Cemento - Fondos secundarios y separación
        puro: "#FFFFFF",    // Blanco Puro - Espacio de respiración
      },
      // SISTEMA TIPOGRÁFICO
      fontFamily: {
        display: ['var(--font-montserrat)', 'sans-serif'], // Titulares
        sans: ['var(--font-inter)', 'sans-serif'],         // Cuerpos de texto
      },
    },
  },
  plugins: [],
};

export default config;