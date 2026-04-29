/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0A1533',
          800: '#12224A',
          700: '#1E3568',
          600: '#2A4A8A',
        },
        aurora: {
          500: '#6D59C7',
          400: '#8472DA',
          300: '#B1A5EB',
        },
      },
      boxShadow: {
        card: '0 8px 30px rgba(10, 21, 51, 0.08)',
        panel: '0 12px 40px rgba(17, 34, 74, 0.12)',
        float: '0 18px 44px rgba(19, 40, 94, 0.18)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glowPulse: 'glowPulse 3.2s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Noto Sans SC"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-surface':
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
