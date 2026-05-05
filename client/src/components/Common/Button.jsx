import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-purple hover:shadow-glow text-white hover:scale-105',
    secondary: 'bg-brand-card border border-brand-border text-slate-200 hover:border-primary-500 hover:shadow-glow',
    outline: 'border border-brand-border text-slate-300 hover:bg-brand-card hover:border-primary-500',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-brand-card/50',
    success: 'bg-status-success hover:bg-status-success/90 text-white hover:shadow-glow',
    error: 'bg-status-error hover:bg-status-error/90 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-2 rounded-md',
    md: 'px-4 py-2 text-sm gap-2 rounded-lg',
    lg: 'px-6 py-3 text-base gap-2 rounded-lg',
    xl: 'px-8 py-4 text-lg gap-3 rounded-xl',
  };

  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </button>
  );
};

export default Button;
