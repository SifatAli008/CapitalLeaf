'use client';

import React from 'react';

interface CapitalLeafLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  animated?: boolean;
  variant?: 'default' | 'light';
}

const CapitalLeafLogo: React.FC<CapitalLeafLogoProps> = ({
  size = 'large',
  showSubtitle = true,
  subtitle = 'Zero Trust Security Framework',
  className = '',
  animated = false,
  variant = 'default'
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

  const getTextColors = () => {
    if (variant === 'light') {
      return {
        capital: 'text-white',
        leaf: 'text-green-300',
        subtitle: 'text-blue-200'
      };
    }
    return {
      capital: 'text-slate-700',
      leaf: 'text-green-600',
      subtitle: 'text-gray-600'
    };
  };

  const colors = getTextColors();

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${getSizeClasses()} font-bold tracking-tight ${animated ? 'animate-pulse' : ''}`}>
        <span className={`${colors.capital} font-semibold font-sans`}>Capital</span>
        <span className={`${colors.leaf} font-normal italic font-serif ml-[-2px]`}>Leaf</span>
      </div>
      {showSubtitle && (
        <p className={`text-sm ${colors.subtitle} mt-2 font-medium`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default CapitalLeafLogo;
