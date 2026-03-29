/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.985 0.002 247)',
        foreground: 'oklch(0.21 0.034 264)',
        card: {
          DEFAULT: 'oklch(1 0 0)',
          foreground: 'oklch(0.21 0.034 264)',
        },
        primary: {
          DEFAULT: 'oklch(0.55 0.22 264)',
          foreground: 'oklch(0.99 0.01 264)',
        },
        muted: {
          DEFAULT: 'oklch(0.96 0.01 264)',
          foreground: 'oklch(0.45 0.02 264)',
        },
        destructive: {
          DEFAULT: 'oklch(0.55 0.22 25)',
          foreground: 'oklch(0.99 0.01 25)',
        },
        border: 'oklch(0.91 0.01 264)',
        input: 'oklch(0.91 0.01 264)',
        ring: 'oklch(0.55 0.22 264)',
      },
      animation: {
        'login-enter': 'login-enter 0.5s ease-out forwards',
        shake: 'shake 0.35s ease-out',
      },
      keyframes: {
        'login-enter': {
          from: { opacity: '0', transform: 'translateY(0.5rem) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
};
