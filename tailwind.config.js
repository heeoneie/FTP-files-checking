import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Inter', ...defaultTheme.fontFamily.sans],
        display: ['"General Sans"', 'Space Grotesk', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
