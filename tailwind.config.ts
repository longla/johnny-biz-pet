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
      sans: ["Varela Round", "sans-serif"],
      Fredoka: ["Fredoka One", "cursive"],
      Comic: ["Comic Neue", "cursive"],
      Varela: ["Varela Round", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-dark": "linear-gradient(180deg, #166534 0%, #16a34a 100%)",
        "paw-pattern": "url('/images/paw-pattern.svg')",
        "cloud-bg": "url('/images/cloud-bg.svg')",
        "wavy-border": "url('/images/wavy-border.svg')",
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
        skyblue: {
          DEFAULT: "#6BBBDB",
          50: "#f0f7fa",
          100: "#e0eff5",
          200: "#c1e0eb",
          300: "#93c8db",
          400: "#6BBBDB",
          500: "#479bc0",
          600: "#377da0",
          700: "#2f6582",
          800: "#2b546c",
          900: "#28475c",
        },
        beige: {
          DEFAULT: "#F9F5EB",
          50: "#fefdfb",
          100: "#fdfbf7",
          200: "#fbf6f0",
          300: "#f9f2e6",
          400: "#F9F5EB",
          500: "#f0e6d1",
          600: "#e1cdaa",
          700: "#cbab78",
          800: "#b48d53",
          900: "#96733e",
        },
        orange: {
          DEFAULT: "#F9A03F",
          50: "#fef8f0",
          100: "#feeeda",
          200: "#fcdab6",
          300: "#fbc183",
          400: "#F9A03F",
          500: "#f7841b",
          600: "#e46a0d",
          700: "#bd510e",
          800: "#974112",
          900: "#7c3714",
        },
      },
      borderRadius: {
        cartoon: "12px",
      },
      boxShadow: {
        cartoon: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
