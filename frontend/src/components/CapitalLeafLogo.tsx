import React from 'react';

interface CapitalLeafLogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large';
  className?: string;
  showSubtitle?: boolean;
  subtitle?: string;
  animated?: boolean;
}

const CapitalLeafLogo: React.FC<CapitalLeafLogoProps> = ({ 
  variant = 'default', 
  size = 'md', 
  className = '',
  showSubtitle = false,
  subtitle = 'Dynamic Defense with Microservice Isolation',
  animated = false
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
      case 'small':
        return 'text-lg';
      case 'md':
      case 'medium':
        return 'text-2xl';
      case 'lg':
      case 'large':
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
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`flex items-center ${animated ? 'logo-fadeIn' : ''}`}>
        <span className={`${sizeClass} font-bold logo-text ${colors.capital}`}>
          Capital
        </span>
        <span className={`${sizeClass} font-bold logo-text ${colors.leaf}`}>
          Leaf
        </span>
      </div>
      {showSubtitle && (
        <p className={`text-xs mt-1 ${variant === 'light' ? 'text-gray-300' : 'text-gray-600'} ${animated ? 'logo-fadeIn' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default CapitalLeafLogo;