import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        ivymode: ['ivymode', 'sans-serif'],
        eixample: ['eixample-dip', 'sans-serif'],
      },
    },
  },
  plugins: [],
});