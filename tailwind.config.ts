import type { Config } from "tailwindcss";

// Tailwind CSS v4 with CSS-first configuration
// Most configuration is now done in CSS using @theme directive

const config: Config = {
  darkMode: ["class"], // Keep class-based dark mode for next-themes compatibility
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  // Theme configuration is now primarily handled in CSS via @theme directive
  // keeping minimal config here for compatibility
  plugins: [
    // Note: tailwindcss-animate may need updates for v4 compatibility
    // Check plugin compatibility before production deployment
  ],
};

export default config;
