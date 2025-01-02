// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          50: '#f4f7fe',
          100: '#e9effe',
          200: '#d3dffe',
          300: '#b0c7fd',
          400: '#87a9fb',
          500: '#5785f7',  // Ana renk
          600: '#3b62ef',
          700: '#2f4cdf',
          800: '#2a41b8',
          900: '#273c93',
        },
        'accent': {
          50: '#edfcf4',
          100: '#d4f7e3',
          200: '#aceece',
          300: '#77deb1',
          400: '#3fc891',
          500: '#1eaf77',  // Vurgu rengi
          600: '#12916a',
          700: '#107357',
          800: '#115b47',
          900: '#114b3c',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out',
        fadeIn: 'fadeIn 0.5s ease-out',
        slideInRight: 'slideInRight 0.5s ease-out',
        slideInLeft: 'slideInLeft 0.5s ease-out',
        bounce: 'bounce 1s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#5785f7",    // Modern mavi
          "secondary": "#1eaf77",  // Yeşil vurgu
          "accent": "#3b62ef",     // Koyu mavi
          "neutral": "#1e1e2f",    // Koyu arka plan
          "base-100": "#ffffff",   // Beyaz
          "base-200": "#f4f7fe",   // Çok açık mavi
          "base-300": "#e9effe",   // Açık mavi
          "info": "#3fc891",       // Bilgi rengi
          "success": "#1eaf77",    // Başarı rengi
          "warning": "#f7b955",    // Uyarı rengi
          "error": "#ef4444",      // Hata rengi
        },
      },
    ],
    styled: true,
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active', 'disabled'],
      borderColor: ['active', 'disabled'],
      textColor: ['active', 'disabled'],
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
};

export default config;