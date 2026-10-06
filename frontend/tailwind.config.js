/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        /* Brand primary is #0e4d35 */
        primary: "#0e4d35",
        "primary-deep": "#0a2019",
        "primary-container": "#0e2820",
        "on-primary": "#ffffff",
        "on-primary-container": "#759186",
        "primary-fixed": "#cce9dc",
        "primary-fixed-dim": "#b0cdc1",
        "inverse-primary": "#b0cdc1",

        /* Green ramp used across panels and accents */
        forest: "#1b4332",
        moss: "#2d6a4f",
        leaf: "#52b788",
        mint: "#cce9dc",
        bone: "#eef4f1",
        "mint-50": "#f2f7f4",
        "mint-100": "#e4ede7",
        "mint-200": "#cce0d6",
        "mint-300": "#d5e3dc",
        "mint-400": "#dce9e2",

        /* Warm neutrals */
        surface: "#fbf9f4",
        "surface-dim": "#dbdad5",
        "surface-bright": "#fbf9f4",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3ee",
        "surface-container": "#f0eee9",
        "surface-container-high": "#eae8e3",
        "surface-container-highest": "#e4e2dd",
        "surface-variant": "#e4e2dd",
        "on-surface": "#1b1c19",
        "on-surface-variant": "#424845",
        outline: "#727975",
        "outline-variant": "#c2c8c4",
        "surface-tint": "#4a645a",

        /* Burnt orange counterpoint — used sparingly */
        secondary: "#b02e01",
        "secondary-container": "#fd6438",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#5c1400",

        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        margin: "1.5rem",
        "margin-mobile": "1.25rem",
        "margin-desktop": "4rem",
        gutter: "1.5rem",
        "gutter-mobile": "1rem",
        "gutter-desktop": "2.5rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "2rem",
        "space-xl": "4rem",
      },
      fontFamily: {
        display: ["Newsreader", "Georgia", "serif"],
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        hebrew: ['"Frank Ruhl Libre"', "serif"],
      },
      fontSize: {
        "display-xl": ["5.5rem", { lineHeight: "5.75rem", letterSpacing: "-0.03em", fontWeight: "400" }],
        "display-xl-mobile": ["3rem", { lineHeight: "3.25rem", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-lg": ["4rem", { lineHeight: "4.25rem", letterSpacing: "-0.025em", fontWeight: "400" }],
        "display-lg-mobile": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.015em", fontWeight: "400" }],
        "headline-lg": ["2.75rem", { lineHeight: "3.25rem", letterSpacing: "-0.02em", fontWeight: "400" }],
        "headline-lg-mobile": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.01em", fontWeight: "400" }],
        "headline-md": ["2rem", { lineHeight: "2.5rem", letterSpacing: "-0.015em", fontWeight: "400" }],
        "headline-sm": ["1.25rem", { lineHeight: "1.625rem", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.8rem", letterSpacing: "-0.005em", fontWeight: "400" }],
        "body-md": ["0.9375rem", { lineHeight: "1.55rem", letterSpacing: "0em", fontWeight: "400" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.35rem", letterSpacing: "0em", fontWeight: "400" }],
        "label-code": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.06em", fontWeight: "400" }],
        "label-micro": ["0.6875rem", { lineHeight: "0.875rem", letterSpacing: "0.08em", fontWeight: "500" }],
      },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "rise-in": "rise-in 1s cubic-bezier(0.2, 0.7, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};