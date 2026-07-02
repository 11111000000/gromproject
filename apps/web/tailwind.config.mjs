/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ГРОМ — фирменная палитра: Industrial + Nordic
        thunder: {
          DEFAULT: '#0a1929',  // грозовая синь (основной тёмный)
          light: '#1a2f48',
          dark: '#050d18',
        },
        ice: {
          DEFAULT: '#2c5a6e',  // байкальский лёд (средний синий)
          dark: '#1a3a4e',
          light: '#5b8db8',
        },
        bolt: {
          DEFAULT: '#f4b942',  // молния (главный акцент)
          dark: '#e0a830',
          light: '#ffc857',
        },
        frost: {
          DEFAULT: '#e8f1f7',  // снег
          dark: '#c9d9e6',
        },
        dawn: '#9fc2e8',        // рассвет
        steel: '#1a1a1a',        // уголь
        carbon: '#2a2a2a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'industrial': '0.12em',
        'wider-2': '0.18em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bolt-pulse': 'boltPulse 2s ease-in-out infinite',
        'frost-shift': 'frostShift 8s ease-in-out infinite',
        'skate-roll': 'skateRoll 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        boltPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        frostShift: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
        },
        skateRoll: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '200px 0' },
        },
      },
    },
  },
  plugins: [],
};
