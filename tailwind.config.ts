import type { Config } from 'tailwindcss'

const typeface = ['Times New Roman', 'Sarabun', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI','Roboto',
  'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
  'Helvetica Neue', 'sans-serif'];

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'retro-link': '#2B00FF',
        'retro-yellow': '#FFEA00',
        'retro-red': '#FF0000',
        'retro-red-1': '#B11313',
        'retro-green': '#0DFF00',
        'retro-black': '#000000',
        'retro-white': '#FFFFFF',
        'retro-light-blue': '#00CCFF',
        'retro-gray': '#ABABAB',
      }
    },
    fontFamily: {
      'bold' : typeface,
      'regular': typeface
    }
  },
  plugins: [],
} satisfies Config

