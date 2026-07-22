import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  // hover: solo se activa en dispositivos que realmente soportan hover
  // (mouse), para que los efectos group-hover/hover no se queden
  // "pegados" al tocar en mobile/tablet.
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Paleta industrial definida en el requerimiento
        "industrial-blue": "#0F3D5E",
        "steel-gray": "#5D6673",
        "off-white": "#F8F9FA",
        "carbon-black": "#1F2328",
        "industrial-orange": "#F97316",
        // Identidad de marca "Azul corporativo"
        brand: {
          dark: "#0C2B3E",
          medium: "#3E5C6E",
          light: "#F5F6F7",
          // Oscurecido de #C97B1E a #A8650F: el tono anterior con texto
          // blanco daba 3.31:1 de contraste (bajo el mínimo WCAG AA de
          // 4.5:1 para texto normal). Este tono da ~4.63:1.
          accent: "#A8650F",
          ring: "#155E8A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
