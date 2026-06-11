/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#050505',
          900: '#070708',
          800: '#0c0c0e',
          700: '#121215',
          600: '#1a1a1f',
        },
        graphite: {
          DEFAULT: '#1c1c20',
          light: '#2a2a30',
          soft: '#3a3a42',
        },
        gold: {
          DEFAULT: '#c8a96a',
          bright: '#e6c789',
          deep: '#9c8047',
          muted: '#b69a64',
        },
        silver: {
          DEFAULT: '#cfd2d6',
          dim: '#8b8f96',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest2: '0.35em',
      },
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(135deg, #e6c789 0%, #c8a96a 40%, #9c8047 100%)',
        'radial-fade':
          'radial-gradient(circle at 50% 0%, rgba(200,169,106,0.10), transparent 60%)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-150%)' },
          '100%': { transform: 'translateX(150%)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        floaty: 'floaty 7s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
