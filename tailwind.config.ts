import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c0392b',
          dark:    '#922b21',
          mid:     '#e74c3c',
          light:   '#fef5f5',
        },
        accent:  '#ffffff',
        surface: '#f8f8f8',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
