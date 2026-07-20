import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2f7d4f',   // 포레스트 그린 — 네비/버튼/포인트
          dark:    '#256240',   // 호버/프레스
          darker:  '#1c4a30',   // 그라디언트 딥 (로그인/회원가입 패널)
          mid:     '#41a06a',   // 밝은 그린 / 그라디언트 브라이트
          light:   '#eef6f0',   // 연한 그린 — hover 배경/active pill
        },
        accent:  {
          DEFAULT: '#f4b740',   // 따뜻한 앰버 — 가입신청 CTA/포인트
          dark:    '#dca21f',
          light:   '#fdf6e6',
        },
        ink:     '#16241c',     // 그린톤 near-black (텍스트)
        surface: '#ffffff',     // 순백 배경 (헤더와 동일)
        success: '#27ae60',
        warning: '#f39c12',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'slide-in':   'slideIn 0.4s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
