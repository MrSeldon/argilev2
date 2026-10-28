import type { Config } from "tailwindcss";

/**
 * Le Four Argile design tokens.
 *
 * Palette from Winnie's studio work: oatmeal cream and bare terracotta,
 * olive celadon, deep teal, iron red, matte black. Warm off-white base,
 * terracotta + celadon as quiet accents, deep charcoal for type.
 *
 * The older token names (cream, charcoal, warm, clay, glaze, ash) are kept and
 * remapped onto the same palette so every existing component restyles with it.
 */
const ink = { DEFAULT: "#22211E", 2: "#4A463F", 3: "#6B655B" };

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- core palette -------------------------------------------------
        paper: { DEFAULT: "#F5F0E8", soft: "#FBF8F3" },
        oat: "#ECE4D6",
        line: { DEFAULT: "#DCD2C1", strong: "#CBBFAB" },
        stone: "#B9AE9B",
        ink,
        terracotta: { DEFAULT: "#B4633F", deep: "#96492A", wash: "#F0DFD3" },
        rust: "#8A3A22",
        celadon: { DEFAULT: "#9BAE8E", deep: "#5C7152", wash: "#E3E9DC" },
        teal: { DEFAULT: "#2E5552", wash: "#DCE5E2" },
        matte: "#191816",

        // --- legacy names, remapped ---------------------------------------
        cream: "#F5F0E8",
        charcoal: { DEFAULT: "#22211E", dark: "#191816" },
        warm: {
          50: "#ECE4D6",
          100: "#DCD2C1",
          200: "#CBBFAB",
          300: "#B9AE9B",
          400: "#6B655B",
          500: "#6B655B",
          600: "#57524A",
          700: "#4A463F",
        },
        clay: {
          50: "#FBF8F3",
          100: "#F1EBE0",
          200: "#E3D9C8",
          300: "#CBBFAB",
          400: "#9C9384",
          500: "#6B655B",
          600: "#57524A",
          700: "#4A463F",
          800: "#34312C",
          900: "#22211E",
        },
        glaze: {
          50: "#EEF1EA",
          100: "#DDE5D6",
          200: "#C2CFB7",
          300: "#9BAE8E",
          400: "#7E9472",
          500: "#5C7152",
          600: "#4C5F44",
          700: "#3B4C36",
          800: "#2F3D2B",
          900: "#232E20",
        },
        ash: {
          50: "#FBF8F3",
          100: "#F1EBE0",
          200: "#E3D9C8",
          300: "#CBBFAB",
          400: "#9C9384",
          500: "#6B655B",
          600: "#57524A",
          700: "#4A463F",
          800: "#34312C",
          900: "#22211E",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "Inter", "Helvetica Neue", "sans-serif"],
      },
      fontSize: {
        // display (Cormorant, light)
        hero: ["4.5rem", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        "display-lg": ["3.25rem", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display-md": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-sm": ["2rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.25" }],
        "heading-md": ["1.25rem", { lineHeight: "1.3" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.35" }],
        // text (Inter)
        "body-lg": ["1.0625rem", { lineHeight: "1.7" }],
        "body-md": ["0.9375rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        caption: ["0.75rem", { lineHeight: "1.5" }],
        label: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.16em" }],
      },
      letterSpacing: {
        tightest: "-0.02em",
        tight: "-0.01em",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.16em",
        "extra-wide": "0.24em",
      },
      spacing: {
        section: "6rem",
        "section-lg": "8rem",
        "section-sm": "4rem",
        gutter: "2.5rem",
        "gutter-sm": "1.25rem",
        tabbar: "calc(3.75rem + env(safe-area-inset-bottom))",
      },
      maxWidth: {
        content: "75rem",
        narrow: "42rem",
        prose: "62ch",
      },
      borderRadius: {
        card: "2px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(34,33,30,0.05)",
        card: "0 1px 2px rgba(34,33,30,0.04), 0 6px 18px rgba(34,33,30,0.05)",
        "card-hover": "0 2px 6px rgba(34,33,30,0.06), 0 12px 28px rgba(34,33,30,0.07)",
        elevated: "0 10px 30px rgba(34,33,30,0.10), 0 20px 50px rgba(34,33,30,0.08)",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      transitionDuration: {
        400: "400ms",
        700: "700ms",
        1200: "1200ms",
      },
      animation: {
        "fade-in": "fade-in 0.9s cubic-bezier(0.22,0.61,0.36,1) both",
        "rise-in": "rise-in 1.1s cubic-bezier(0.22,0.61,0.36,1) both",
        breathe: "breathe 1.8s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
