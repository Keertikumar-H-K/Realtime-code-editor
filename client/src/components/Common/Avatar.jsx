import React from 'react';

export const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  online = false,
  className = '',
  initials = null,
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  const sizeStyle = sizes[size] || sizes.md;

  // Generate initials from name
  const getInitials = () => {
    if (initials) return initials;
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate gradient color based on name
  const getBackgroundGradient = () => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
    ];

    if (!name) return colors[0];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const onlineIndicator = online ? (
    <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success border-2 border-brand-card rounded-full" />
  ) : null;

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full font-semibold text-white bg-gradient-to-br ${getBackgroundGradient()} ${sizeStyle} ${className}`}>
      {src ? (
        <img src={src} alt={alt || name} className="w-full h-full rounded-full object-cover" />
      ) : (
        getInitials()
      )}
      {onlineIndicator}
    </div>
  );
};

export const AvatarGroup = ({ avatars, max = 3, size = 'md', className = '' }) => {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const offsetSizes = {
    xs: '-ml-1',
    sm: '-ml-2',
    md: '-ml-3',
    lg: '-ml-4',
    xl: '-ml-6',
  };

  return (
    <div className={`flex items-center ${className}`}>
      {displayAvatars.map((avatar, index) => (
        <div key={index} className={index > 0 ? offsetSizes[size] : ''}>
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div className={offsetSizes[size]}>
          <Avatar
            name={`+${remaining}`}
            size={size}
            className="bg-gradient-to-br from-slate-500 to-slate-600 cursor-default"
          />
        </div>
      )}
    </div>
  );
};

export default Avatar;
