import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Avenir Next'", "'Segoe UI'", "sans-serif"],
        display: ["'Iowan Old Style'", "'Palatino Linotype'", "Georgia", "serif"],
        mono: ["'SFMono-Regular'", "'Menlo'", "monospace"],
      },
      colors: {
        ink: "#0B1020",
        canvas: "#F3EFE6",
        clay: "#C86D45",
        signal: "#3F8068",
        data: "#68B7D6",
        "soft-white": "#FAF8F3",
        slate: "#657080",
        error: "#B33A3A",
      },
    },
  },
  plugins: [],
};

export default config;
