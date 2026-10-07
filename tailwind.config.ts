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
        ink: "var(--ink)",
        "ink-secondary": "var(--ink-secondary)",
        surface: "var(--surface-base)",
        raised: "var(--surface-raised)",
        muted: "var(--surface-muted)",
        line: "var(--line)",
        brand: "var(--brand-primary)",
        sports: "var(--sports-primary)",
        labs: "var(--labs-primary)",
        focus: "var(--focus)",
      },
    },
  },
  plugins: [],
};

export default config;
