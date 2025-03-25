import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      Inter: ["Inter", "sans-serif"],
      Poppins: ["Poppins", "sans-serif"],
      "DM Sans": ["DM Sans"],
      sans: ["var(--font-poppins)", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-dark": "linear-gradient(180deg, #166534 0%, #16a34a 100%)",
      },
      colors: {
        primary: {
          DEFAULT: "#53dd6c",
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#53dd6c",
          500: "#3dc756",
          600: "#2cb340",
          700: "#27943a",
          800: "#237534",
          900: "#1a5f2d",
          950: "#0d3118",
        },
      },
    },
  },
  plugins: [],
};
export default config;
