/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#DBEAFE',
        },
        success: '#16A34A',
        warning: '#CA8A04',
        error: '#DC2626',
        diff: {
          delete: {
            bg: '#FFEBE9',
            text: '#CF222E',
          },
          add: {
            bg: '#DAFBE1',
            text: '#116329',
          },
          modify: {
            bg: '#FFF8C5',
            text: '#9A6700',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
}