/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium SaaS palette
        brand: {
          dark: '#020617',
          darker: '#0f172a',
          card: '#1e293b',
          border: '#334155',
        },
        // Accent colors
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        // Gradient accent
        accent: {
          purple: '#a855f7',
          blue: '#3b82f6',
          pink: '#ec4899',
        },
        // Status colors
        status: {
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
        },
      },
      backgroundColor: {
        'dark-base': '#020617',
        'dark-surface': '#0f172a',
        'dark-card': '#1e293b',
        'glass': 'rgba(15, 23, 42, 0.7)',
      },
      borderColor: {
        'dark-border': '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-lg': '0 0 30px rgba(168, 85, 247, 0.5)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-blue-lg': '0 0 40px rgba(59, 130, 246, 0.5)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(168, 85, 247, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)',
        'gradient-purple': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        'animated-gradient': 'linear-gradient(45deg, #a855f7, #3b82f6, #ec4899, #a855f7)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glowPulse: {
          '0%, 100%': { 
            opacity: '0.5',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)',
          },
          '50%': { 
            opacity: '1',
            boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}