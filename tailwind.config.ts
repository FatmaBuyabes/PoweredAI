import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'Cairo', 'sans-serif'],
      },
      colors: {
        adventure: {
          from: '#FB923C',
          to: '#FCD34D',
          bg: '#FFF7ED',
          text: '#C2410C',
        },
        learning: {
          from: '#A855F7',
          to: '#60A5FA',
          bg: '#FAF5FF',
          text: '#7C3AED',
        },
        islamic: {
          from: '#10B981',
          to: '#14B8A6',
          bg: '#ECFDF5',
          text: '#065F46',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
