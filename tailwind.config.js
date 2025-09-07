/**
 * [ПОДСКАЗКА] Настройка TailwindCSS.
 * - Работает для сборки (Vite) и не мешает HTML-превью с CDN.
 * - Добавляйте сюда токены для ауры, рамок, чата тренера и планов.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          50: '#f5f7ff',
          100: '#eef2ff',
          200: '#e0e7ff',
          300: '#c7d2fe',
          400: '#a5b4fc',
          500: '#818cf8',
          600: '#6366f1',
          700: '#4f46e5',
          800: '#4338ca',
          900: '#3730a3'
        }
      },
      boxShadow: {
        aura: '0 0 40px rgba(99, 102, 241, 0.35)',
        auraSoft: '0 0 30px rgba(148, 163, 184, 0.25)'
      }
    }
  },
  plugins: []
}


