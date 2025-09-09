import React from 'react';

interface CapitalLeafLogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CapitalLeafLogo: React.FC<CapitalLeafLogoProps> = ({ 
  variant = 'default', 
  size = 'md', 
  className = '' 
}) => {
  const getTextColors = () => {
    switch (variant) {
      case 'light':
        return {
          capital: 'text-white',
          leaf: 'text-green-300'
        };
      case 'dark':
        return {
          capital: 'text-gray-800',
          leaf: 'text-green-600'
        };
      default:
        return {
          capital: 'text-gray-800',
          leaf: 'text-green-600'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-lg';
      case 'md':
        return 'text-2xl';
      case 'lg':
        return 'text-3xl';
      case 'xl':
        return 'text-4xl';
      default:
        return 'text-2xl';
    }
  };

  const colors = getTextColors();
  const sizeClass = getSizeClasses();

  return (
    <div className={`flex items-center ${className}`}>
      <span className={`${sizeClass} font-bold logo-text ${colors.capital}`}>
        Capital
      </span>
      <span className={`${sizeClass} font-bold logo-text ${colors.leaf}`}>
        Leaf
      </span>
    </div>
  );
};

export default CapitalLeafLogo;