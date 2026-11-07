import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        paper: "var(--color-background)",
        surface: "var(--color-surface)",
        ink: "var(--color-ink)",
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
        },
        neutral: "var(--color-neutral)",
        "border-tech": "var(--color-border)",
      },
      boxShadow: {
        editorial: "0 20px 40px -15px rgba(15, 41, 30, 0.08), 0 0 0 1px rgba(15, 41, 30, 0.08)",
        tactile: "4px 4px 0px 0px #0F291E",
        "tactile-sm": "2px 2px 0px 0px #0F291E",
        "tactile-accent": "4px 4px 0px 0px #D94E28",
      },
    },
  },
  plugins: [],
};

export default config;
