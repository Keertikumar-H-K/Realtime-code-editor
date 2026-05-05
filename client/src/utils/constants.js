/**
 * Design System Constants
 * Centralized colors, spacing, and styling for consistent UI
 */

export const COLORS = {
  // Primary
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  
  // Secondary
  secondary: '#8b5cf6',
  
  // Dark theme
  dark: {
    bg: '#0f172a',
    bgAlt: '#1e293b',
    card: '#1e293b',
    cardLight: '#334155',
    border: '#334155',
    text: '#f1f5f9',
    textAlt: '#cbd5e1',
    textMuted: '#94a3b8',
  },
  
  // Status
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Gradients
  gradient: {
    primary: 'from-indigo-600 to-purple-600',
    glow: 'from-indigo-500/20 to-purple-500/20',
  },
};

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

export const ROUNDED = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  glow: '0 0 20px rgba(99, 102, 241, 0.3)',
};

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' }, // ✅ FIXED
  { name: 'About', href: '/about' },
  { name: 'Dashboard', href: '/dashboard' },
];

export const FEATURES = [
  {
    title: 'Real-time Collaboration',
    description: 'Edit code simultaneously with your team. Changes sync instantly.',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Multi-Language Support',
    description: 'JavaScript, Python, C++, Java, and more with full syntax highlighting.',
    icon: '🌐',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Integrated Chat',
    description: 'Communicate with your team without leaving the editor.',
    icon: '💬',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Code Execution',
    description: 'Run and test code directly. See output instantly.',
    icon: '▶️',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Presence Indicators',
    description: 'See who is online and their cursor positions in real-time.',
    icon: '👥',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    title: 'Responsive Design',
    description: 'Works seamlessly on desktop, tablet, and mobile devices.',
    icon: '📱',
    color: 'from-rose-500 to-pink-500',
  },
];
