import defaultTheme from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@hit-arc/ui/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        authority: {
          50: '#f5f8ff',
          100: '#e1e9ff',
          500: '#3658ff',
          700: '#1d2ea3',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        'authority-panel': '0 20px 60px -40px rgba(54,88,255,0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
