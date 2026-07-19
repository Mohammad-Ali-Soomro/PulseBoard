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
        background: "#FFFFEB", // lemon cream canvas
        "background-deep": "#E4E4D0", // nested/alternating sections
        ink: "#1A1A1A", // primary text
        "ink-darkest": "#111111",
        "text-muted": "#666666",
        brand: "#F0D7FF", // lavender, used for primary CTA pills
        "brand-hover": "#E8C6FF",
        "panel-dark": "#034F46", // fathom green, our one inverted dark surface
        accent: "#FFA946", // glow orange, used only for small badges
        "border-hairline": "rgba(26, 26, 26, 0.30)",
        "border-hairline-soft": "rgba(26, 26, 26, 0.10)",
        "focus-ring": "#2D62FF",
        success: "#16A34A",
        danger: "#DC2626",
      },
      borderRadius: {
        input: "8px",
        btn: "12px",
        card: "16px",
        pill: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-eb-garamond)", "ui-serif", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
