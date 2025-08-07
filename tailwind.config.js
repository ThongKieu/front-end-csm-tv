/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#125d0d", // Xanh chính
          foreground: "#ffffff",
          50: "#f0f9f0",
          100: "#dcf2dc",
          200: "#bce4bc",
          300: "#8dd08d",
          400: "#5bb55b",
          500: "#125d0d", // Xanh chính
          600: "#0f4c0b",
          700: "#0d3f09",
          800: "#0b3307",
          900: "#092a06",
        },
        secondary: {
          DEFAULT: "#f5d20d", // Vàng chính
          foreground: "#000000",
          50: "#fefdf0",
          100: "#fef9d1",
          200: "#fdf2a3",
          300: "#fce875",
          400: "#fbdd47",
          500: "#f5d20d", // Vàng chính
          600: "#d4b30b",
          700: "#b39409",
          800: "#927507",
          900: "#715605",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#f5d20d", // Vàng làm accent
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors cho ứng dụng
        brand: {
          yellow: "#f5d20d",
          green: "#125d0d",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} 