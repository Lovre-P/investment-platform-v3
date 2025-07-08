import React from 'react';

interface AbstractDotsProps {
  className?: string;
  opacity?: number;
  color?: string;
  variant?: 'scattered' | 'pattern' | 'constellation';
  density?: 'low' | 'medium' | 'high';
}

const AbstractDots: React.FC<AbstractDotsProps> = ({ 
  className = '', 
  opacity = 0.12, 
  color = '#589ff1', 
  variant = 'scattered',
  density = 'medium'
}) => {
  const getDotCount = () => {
    switch (density) {
      case 'low': return 15;
      case 'high': return 45;
      default: return 30;
    }
  };

  const generateRandomDots = () => {
    const dotCount = getDotCount();
    const dots = [];
    
    for (let i = 0; i < dotCount; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const radius = 0.5 + Math.random() * 1.5;
      const dotOpacity = opacity * (0.5 + Math.random() * 0.5);
      
      dots.push(
        <circle
          key={`dot-${i}`}
          cx={`${x}%`}
          cy={`${y}%`}
          r={radius}
          fill={color}
          opacity={dotOpacity}
        />
      );
    }
    
    return dots;
  };

  const generatePatternDots = () => {
    const dots = [];
    const spacing = 8;
    
    for (let x = 0; x <= 100; x += spacing) {
      for (let y = 0; y <= 100; y += spacing) {
        // Add some randomness to avoid perfect grid
        const offsetX = (Math.random() - 0.5) * 2;
        const offsetY = (Math.random() - 0.5) * 2;
        const radius = 0.2 + Math.random() * 0.4;
        const dotOpacity = opacity * (0.4 + Math.random() * 0.4);
        
        dots.push(
          <circle
            key={`pattern-${x}-${y}`}
            cx={`${x + offsetX}%`}
            cy={`${y + offsetY}%`}
            r={radius}
            fill={color}
            opacity={dotOpacity}
          />
        );
      }
    }
    
    return dots;
  };

  const generateConstellationDots = () => {
    const dots = [];
    const lines = [];
    const points = [];
    
    // Generate constellation points
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const radius = 0.4 + Math.random() * 0.6;
      
      points.push({ x, y });
      
      dots.push(
        <circle
          key={`star-${i}`}
          cx={`${x}%`}
          cy={`${y}%`}
          r={radius}
          fill={color}
          opacity={opacity * 0.8}
        />
      );
    }
    
    // Connect some dots with lines
    for (let i = 0; i < points.length - 1; i++) {
      if (Math.random() > 0.6) { // Only connect some dots
        const point1 = points[i];
        const point2 = points[i + 1];
        
        lines.push(
          <line
            key={`line-${i}`}
            x1={`${point1.x}%`}
            y1={`${point1.y}%`}
            x2={`${point2.x}%`}
            y2={`${point2.y}%`}
            stroke={color}
            strokeWidth="0.3"
            opacity={opacity * 0.4}
          />
        );
      }
    }
    
    return [...lines, ...dots];
  };

  const renderVariant = () => {
    switch (variant) {
      case 'pattern':
        return generatePatternDots();
      case 'constellation':
        return generateConstellationDots();
      default:
        return generateRandomDots();
    }
  };

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{ zIndex: 0 }}
    >
      {renderVariant()}
    </svg>
  );
};

export default AbstractDots;
