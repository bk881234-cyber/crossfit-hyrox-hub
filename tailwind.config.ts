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
          pink: '#FF2D8B',
          orange: '#F97316',
          bg: '#0D0D0D',
          surface: '#1A1A1A',
          card: '#242424',
          border: '#333333',
          text: '#FFFFFF',
          muted: '#999999',
        },
      },
      backgroundImage: {
        'rx-gradient': 'linear-gradient(135deg, #E8321A, #FF2D8B)',
        'rx-gradient-r': 'linear-gradient(to right, #E8321A, #FF2D8B)',
      },
      fontFamily: {
        heading: ['var(--font-noto-sans)', 'sans-serif'],
        sans: ['var(--font-noto-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
