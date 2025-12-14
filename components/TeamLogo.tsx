import React, { useState } from 'react';

interface TeamLogoProps {
  url: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ url, name, size = 'md', className = '' }) => {
  const [error, setError] = useState(false);

  // Size mappings matching Tailwind classes used in the design
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  };

  // Common styles for both image and placeholder
  // Added ring-2 ring-brand-700/50 for better definition against dark backgrounds
  // Added shadow-lg for depth
  const baseClasses = `rounded-full object-cover bg-brand-800 ring-2 ring-brand-700/50 shadow-lg shrink-0 flex items-center justify-center transition-all ${sizeClasses[size]} ${className}`;

  if (error || !url) {
    // Generate initials (up to 2 characters)
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    // Deterministic color based on name length for visual variety
    const bgColors = [
      'bg-blue-900/50 text-blue-400',
      'bg-emerald-900/50 text-emerald-400',
      'bg-purple-900/50 text-purple-400',
      'bg-orange-900/50 text-orange-400',
    ];
    const colorClass = bgColors[name.length % bgColors.length];

    return (
      <div className={`${baseClasses} ${colorClass} font-bold tracking-wider select-none border border-brand-700`}>
        {initials}
      </div>
    );
  }

  return (
    <img 
      src={url} 
      alt={`${name} logo`} 
      className={baseClasses}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default TeamLogo;