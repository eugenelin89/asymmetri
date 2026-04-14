import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Satoshi'", "'Avenir Next'", "'Segoe UI'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "'SFMono-Regular'", "'Menlo'", "monospace"],
      },
      colors: {
        ink: "#050816",
        steel: "#0b1020",
        line: "rgba(148, 163, 184, 0.16)",
        cyan: "#62d4ff",
        glow: "#3897ff",
        mist: "#9fd5ff",
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(148,163,184,0.14), 0 24px 80px rgba(0,0,0,0.38)",
        glow: "0 0 80px rgba(56,151,255,0.22)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseLine: "pulseLine 5s ease-in-out infinite",
        orbit: "orbit 18s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.8" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
