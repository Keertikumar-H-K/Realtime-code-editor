import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = true,
  glow = false,
  ...props
}) => {
  const baseStyles = 'bg-brand-card border border-brand-border rounded-xl p-6 backdrop-blur-md';
  const hoverStyles = hover ? 'hover:border-primary-500/50 hover:shadow-card-hover hover:scale-105 transition-all duration-300' : '';
  const glowStyles = glow ? 'shadow-glow' : 'shadow-card';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-brand-border ${className}`}>
    {children}
  </div>
);

export default Card;
