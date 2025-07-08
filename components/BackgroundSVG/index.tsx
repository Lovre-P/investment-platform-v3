import React from 'react';
import GeometricLines from './GeometricLines';
import AbstractDots from './AbstractDots';
import GeometricShapes from './GeometricShapes';

interface BackgroundSVGProps {
  className?: string;
  variant?: 'lines' | 'dots' | 'shapes' | 'mixed';
  opacity?: number;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  density?: 'low' | 'medium' | 'high';
}

const BackgroundSVG: React.FC<BackgroundSVGProps> = ({ 
  className = '', 
  variant = 'mixed',
  opacity = 0.12,
  colors = {
    primary: '#0693a9',   // Deep Teal
    secondary: '#589ff1', // Bright Sky
    accent: '#214b8b'     // Royal Blue
  },
  density = 'medium'
}) => {
  const renderSingleVariant = () => {
    switch (variant) {
      case 'lines':
        return (
          <GeometricLines 
            className={className}
            opacity={opacity}
            color={colors.primary}
            variant="diagonal"
          />
        );
      case 'dots':
        return (
          <AbstractDots 
            className={className}
            opacity={opacity}
            color={colors.secondary}
            variant="scattered"
            density={density}
          />
        );
      case 'shapes':
        return (
          <GeometricShapes 
            className={className}
            opacity={opacity}
            color={colors.accent}
            variant="mixed"
          />
        );
      default:
        return null;
    }
  };

  const renderMixedVariant = () => (
    <div className={`absolute inset-0 ${className}`} style={{ zIndex: 0 }}>
      {/* Layer 1: Subtle lines */}
      <GeometricLines
        opacity={opacity * 0.6}
        color={colors.primary}
        variant="flowing"
      />

      {/* Layer 2: Scattered dots */}
      <AbstractDots
        opacity={opacity * 0.8}
        color={colors.secondary}
        variant="scattered"
        density={density}
      />

      {/* Layer 3: Geometric shapes */}
      <GeometricShapes
        opacity={opacity * 0.5}
        color={colors.accent}
        variant="mixed"
        size="small"
      />
    </div>
  );

  if (variant === 'mixed') {
    return renderMixedVariant();
  }

  return renderSingleVariant();
};

export default BackgroundSVG;
