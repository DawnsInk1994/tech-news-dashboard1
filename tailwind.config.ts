import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Category colors
        ai: {
          DEFAULT: "#a855f7",
          bg: "#1a0a2e",
          border: "#7c3aed",
          badge: "#6d28d9",
        },
        social: {
          DEFAULT: "#3b82f6",
          bg: "#0a1628",
          border: "#2563eb",
          badge: "#1d4ed8",
        },
        security: {
          DEFAULT: "#ef4444",
          bg: "#1c0a0a",
          border: "#dc2626",
          badge: "#b91c1c",
        },
        space: {
          DEFAULT: "#14b8a6",
          bg: "#0a1e1c",
          border: "#0d9488",
          badge: "#0f766e",
        },
        siliconvalley: {
          DEFAULT: "#f59e0b",
          bg: "#1c1400",
          border: "#d97706",
          badge: "#b45309",
        },
        radar: {
          DEFAULT: "#ec4899",
          bg: "#1c0a14",
          border: "#db2777",
          badge: "#be185d",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
