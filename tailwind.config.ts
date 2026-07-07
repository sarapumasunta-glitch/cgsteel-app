import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta industrial definida en el requerimiento
        "industrial-blue": "#0F3D5E",
        "steel-gray": "#5D6673",
        "off-white": "#F8F9FA",
        "carbon-black": "#1F2328",
        "industrial-orange": "#F97316",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
