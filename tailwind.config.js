/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4fe',
          100: '#e1e9fd',
          200: '#c3d4fb',
          300: '#a4bef9',
          400: '#86a9f7',
          500: '#4B6FA6', // Navy blue - trustworthy, professional education
          600: '#3c5985',
          700: '#2d4364',
          800: '#1e2c42',
          900: '#0f1621',
        },
        secondary: {
          50: '#f4f7f9',
          100: '#e9eff3',
          200: '#d3dfe7',
          300: '#bdcfdb',
          400: '#a7bfcf',
          500: '#7E57C2', // Purple - creativity and wisdom
          600: '#65469b',
          700: '#4c3474',
          800: '#32234d',
          900: '#191126',
        },
        accent: {
          50: '#fef5f3',
          100: '#fdebe7',
          200: '#fbd7cf',
          300: '#f9c3b7',
          400: '#f7af9f',
          500: '#E65100', // Deep Orange - energy and enthusiasm
          600: '#b84100',
          700: '#8a3100',
          800: '#5c2000',
          900: '#2e1000',
        },
        success: {
          500: '#2E7D32', // Forest green - growth and achievement
        },
        warning: {
          500: '#ED6C02', // Deep amber - attention and caution
        },
        error: {
          500: '#D32F2F', // Deep red - errors and important alerts
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: [
          '"Inter"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
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