import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      // (fonts will go here later)
    },
  },
  plugins: [],
});