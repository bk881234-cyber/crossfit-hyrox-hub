import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rx: {
          red: '#E8321A',
          orange: '#F97316',
          bg: '#0D0D0D',
          surface: '#1A1A1A',
          card: '#242424',
          border: '#333333',
          text: '#FFFFFF',
          muted: '#999999',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
