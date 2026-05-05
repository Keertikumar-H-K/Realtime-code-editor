import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon = null,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200';

  const variants = {
    default: 'bg-brand-card text-slate-300 border border-brand-border',
    primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
    success: 'bg-status-success/20 text-status-success border border-status-success/30',
    error: 'bg-status-error/20 text-status-error border border-status-error/30',
    warning: 'bg-status-warning/20 text-status-warning border border-status-warning/30',
    purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const variantStyles = variants[variant] || variants.default;
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <span className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </span>
  );
};

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div
      className={`animate-spin rounded-full border-primary-500 border-t-transparent ${sizes[size] || sizes.md} ${className}`}
    />
  );
};

export const LoadingSpinner = ({ fullscreen = false }) => {
  const content = (
    <div className="flex items-center justify-center flex-col gap-3">
      <Spinner size="lg" className="border-primary-500" />
      <p className="text-slate-400 text-sm">Loading...</p>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export const Tooltip = ({ children, text, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full mb-2 -translate-x-1/2 left-1/2',
    bottom: 'top-full mt-2 -translate-x-1/2 left-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div className="relative inline-flex group">
      {children}
      <div
        className={`absolute ${positionClasses[position]} hidden group-hover:block bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none`}
      >
        {text}
      </div>
    </div>
  );
};

export default Badge;
