import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#06070a",
        surface: "#10131a",
        card: "#151922",
        border: "rgba(255,255,255,0.1)",
        accent: "#7c3aed",
        accentSoft: "#8b5cf6",
        highlight: "#22d3ee",
        gold: "#fbbf24",
        success: "#34d399",
        danger: "#fb7185",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(15, 23, 42, 0.4)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(124, 58, 237, 0.28), transparent 35%), radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.18), transparent 20%)",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
