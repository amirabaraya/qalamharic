import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7EFD7",
        parchment: "#FFF9EA",
        saffron: "#D8A327",
        ember: "#B85D2A",
        leaf: "#426E4E",
        moss: "#78935C",
        charcoal: "#24211C",
        ink: "#151411",
        clay: "#C88455"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(66, 110, 78, 0.22)",
        gold: "0 18px 60px rgba(216, 163, 39, 0.22)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.35rem",
        "3xl": "1.75rem"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        }
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 7s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
