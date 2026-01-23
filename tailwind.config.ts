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
        // Primary colors - gallery aesthetic
        cream: "#FAFAF8",
        charcoal: {
          DEFAULT: "#2D2D2A",
          dark: "#1A1A18",
        },
        // Warm accent palette
        warm: {
          50: "#F5F3EF",
          100: "#E5E3DF",
          200: "#C4B5A0",
          300: "#B8956E",
          500: "#8B7355",
          700: "#5C4D3C",
        },
        // Keep some of the original colors for compatibility
        clay: {
          50: "#faf8f6",
          100: "#f5f0eb",
          200: "#e8ddd2",
          300: "#d4c4b0",
          400: "#bfa78c",
          500: "#a88b6d",
          600: "#8f7359",
          700: "#735c48",
          800: "#5c4a3b",
          900: "#4a3d32",
        },
        glaze: {
          50: "#f0f7f4",
          100: "#dbede4",
          200: "#badacc",
          300: "#8cc0ac",
          400: "#5da088",
          500: "#3f836d",
          600: "#306957",
          700: "#285447",
          800: "#23443a",
          900: "#1e3830",
        },
        ash: {
          50: "#f8f8f7",
          100: "#f0efed",
          200: "#e0dedb",
          300: "#cbc7c1",
          400: "#b3ada4",
          500: "#9d958a",
          600: "#8a8177",
          700: "#726a62",
          800: "#5f5852",
          900: "#504a45",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "Inter", "Helvetica Neue", "sans-serif"],
      },
      fontSize: {
        // Hero and display sizes
        "hero": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-sm": ["2rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        // Headings
        "heading-lg": ["1.5rem", { lineHeight: "1.3" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.4" }],
        // Body
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body-md": ["1rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        // Small/captions
        "caption": ["0.75rem", { lineHeight: "1.5" }],
        "label": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.1em" }],
      },
      letterSpacing: {
        "tightest": "-0.02em",
        "tight": "-0.01em",
        "wide": "0.05em",
        "wider": "0.1em",
        "widest": "0.15em",
        "extra-wide": "0.2em",
      },
      spacing: {
        "section": "6rem",
        "section-lg": "8rem",
        "section-sm": "4rem",
        "gutter": "2rem",
        "gutter-sm": "1.5rem",
      },
      maxWidth: {
        "content": "72rem",
        "narrow": "48rem",
        "prose": "65ch",
      },
      height: {
        "hero": "60vh",
        "hero-lg": "80vh",
        "hero-full": "100vh",
      },
      minHeight: {
        "hero": "60vh",
        "hero-lg": "80vh",
      },
      borderRadius: {
        "card": "0.25rem",
      },
      boxShadow: {
        "subtle": "0 1px 2px rgba(0,0,0,0.04)",
        "card": "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
        "elevated": "0 8px 24px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.06)",
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      transitionDuration: {
        "400": "400ms",
        "500": "500ms",
      },
    },
  },
  plugins: [],
};

export default config;
