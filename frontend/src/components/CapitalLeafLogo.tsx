'use client';

import React from 'react';

interface CapitalLeafLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  animated?: boolean;
}

const CapitalLeafLogo: React.FC<CapitalLeafLogoProps> = ({
  size = 'large',
  showSubtitle = true,
  subtitle = 'Zero Trust Security Framework',
  className = '',
  animated = false
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xl';
      case 'medium':
        return 'text-2xl';
      case 'large':
        return 'text-4xl';
      case 'xlarge':
        return 'text-6xl';
      default:
        return 'text-4xl';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${getSizeClasses()} font-bold tracking-tight ${animated ? 'animate-pulse' : ''}`}>
        <span className="text-slate-600 font-semibold font-sans">Capital</span>
        <span className="text-blue-600 font-normal italic font-serif ml-[-2px]">Leaf</span>
      </div>
      {showSubtitle && (
        <p className="text-sm text-gray-600 mt-2 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default CapitalLeafLogo;
