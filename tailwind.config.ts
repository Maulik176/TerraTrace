import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        body: ['"Manrope"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          400: '#38bdf8',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      boxShadow: {
        card: '0 12px 30px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
