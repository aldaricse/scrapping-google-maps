/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // For Tailwind v4, we need to use tailwindcss directly in local development
    // but Vercel requires @tailwindcss/postcss (if it exists)
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
