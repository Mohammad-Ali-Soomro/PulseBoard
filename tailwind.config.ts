import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#F7F8FA",
        primary: "#4E5FFD",
        "text-primary": "#0A0A0F",
        "text-secondary": "#6B7280",
        success: "#16A34A",
        danger: "#DC2626",
        border: "#E5E7EB",
      },
      borderRadius: {
        card: "16px",
        pill: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
