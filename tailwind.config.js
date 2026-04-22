/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '.dark-theme'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Semantic background tokens (CSS-variable-driven) ── */
        bg: {
          DEFAULT: 'var(--color-bg)',
          inset:   'var(--color-bg-inset)',
          overlay: 'var(--color-bg-overlay)',
        },
        /* ── Slate palette tokens ── */
        slate: {
          1: 'var(--slate-1)',
          2: 'var(--slate-2)',
          3: 'var(--slate-3)',
        },
        /* ── Primary: Steel Blue (doctorfolio primary oklch(0.55 0.12 210)) ── */
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2b74b3', // steel blue
          600: '#1e5a90',
          700: '#154270',
          800: '#0e2d50',
          900: '#071c33',
        },
        /* ── Secondary: Light Blue (doctorfolio secondary oklch(0.85 0.08 220)) ── */
        secondary: {
          50:  '#f4f8fd',
          100: '#e8f1fb',
          200: '#ccdff5',
          300: '#a4c7ec',
          400: '#71a9dc',
          500: '#4388c6',
          600: '#2e6da8',
          700: '#1e5388',
          800: '#133b68',
          900: '#0a2548',
        },
        /* ── Accent: Warm Orange (doctorfolio accent oklch(0.68 0.18 25)) ── */
        accent: {
          50:  '#fff4f0',
          100: '#ffe4d8',
          200: '#ffc5a9',
          300: '#ff9a6c',
          400: '#f76a38',
          500: '#dc6428', // warm orange
          600: '#b34d1b',
          700: '#8b3912',
          800: '#67280b',
          900: '#461a06',
        },
        success: {
          500: '#15803d',
        },
        warning: {
          500: '#d97706',
        },
        error: {
          500: '#dc2626',
        },
        /* ── Gray: Cool blue-grey slate (matches doctorfolio neutral tones) ── */
        gray: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          '"Space Grotesk"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        serif: [
          'var(--font-serif)',
          '"Playfair Display"',
          'Georgia',
          '"Times New Roman"',
          'serif',
        ],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      zIndex: {
        '-10': '-10',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}