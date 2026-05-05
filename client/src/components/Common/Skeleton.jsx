import React from 'react';

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-slate-800/50 rounded-xl p-6 animate-pulse ${className}`}>
    <div className="h-6 bg-slate-700/50 rounded w-2/3 mb-4" />
    <div className="h-4 bg-slate-700/50 rounded w-full mb-3" />
    <div className="h-4 bg-slate-700/50 rounded w-5/6" />
  </div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-slate-700/50 rounded animate-pulse ${i < lines - 1 ? 'mb-3' : ''}`}
        style={{ width: i === lines - 1 ? '80%' : '100%' }}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  return <div className={`${sizeClass} bg-slate-700/50 rounded-full animate-pulse ${className}`} />;
};

export const SkeletonButton = ({ className = '' }) => (
  <div className={`h-10 bg-slate-700/50 rounded-lg animate-pulse ${className}`} />
);

export const SkeletonEditor = () => (
  <div className="flex gap-4 h-full">
    {/* Sidebar */}
    <div className="w-64 bg-slate-800/50 rounded-lg p-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="mb-4 h-6 bg-slate-700/50 rounded w-3/4" />
      ))}
    </div>

    {/* Editor */}
    <div className="flex-1 flex flex-col">
      <div className="h-12 bg-slate-800/50 rounded mb-4 animate-pulse" />
      <div className="flex-1 bg-slate-800/50 rounded animate-pulse" />
    </div>

    {/* Chat */}
    <div className="w-80 bg-slate-800/50 rounded-lg p-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="mb-4 h-12 bg-slate-700/50 rounded" />
      ))}
    </div>
  </div>
);

export const SkeletonDashboard = () => (
  <div className="space-y-6">
    <div className="h-12 bg-slate-800/50 rounded-lg w-1/3 animate-pulse" />
    
    <div className="grid md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);
