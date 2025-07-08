import React from 'react';

interface GeometricShapesProps {
  className?: string;
  opacity?: number;
  color?: string;
  variant?: 'triangles' | 'hexagons' | 'mixed';
  size?: 'small' | 'medium' | 'large';
}

const GeometricShapes: React.FC<GeometricShapesProps> = ({ 
  className = '', 
  opacity = 0.1, 
  color = '#214b8b', 
  variant = 'mixed',
  size = 'medium'
}) => {
  const getSizeMultiplier = () => {
    switch (size) {
      case 'small': return 0.5;
      case 'large': return 1.5;
      default: return 1;
    }
  };

  const sizeMultiplier = getSizeMultiplier();

  const generateTriangles = () => {
    const shapes = [];
    const baseSize = 3 * sizeMultiplier;
    
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = baseSize + Math.random() * baseSize;
      const rotation = Math.random() * 360;
      const shapeOpacity = opacity * (0.5 + Math.random() * 0.5);
      
      // Create triangle points
      const points = [
        [x, y - size],
        [x - size * 0.866, y + size * 0.5],
        [x + size * 0.866, y + size * 0.5]
      ].map(point => `${point[0]},${point[1]}`).join(' ');
      
      shapes.push(
        <polygon
          key={`triangle-${i}`}
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity={shapeOpacity}
          transform={`rotate(${rotation} ${x} ${y})`}
        />
      );
    }
    
    return shapes;
  };

  const generateHexagons = () => {
    const shapes = [];
    const baseSize = 2.5 * sizeMultiplier;
    
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = baseSize + Math.random() * baseSize;
      const rotation = Math.random() * 360;
      const shapeOpacity = opacity * (0.4 + Math.random() * 0.4);
      
      // Create hexagon points
      const points = [];
      for (let j = 0; j < 6; j++) {
        const angle = (j * 60) * Math.PI / 180;
        const pointX = x + size * Math.cos(angle);
        const pointY = y + size * Math.sin(angle);
        points.push(`${pointX},${pointY}`);
      }
      
      shapes.push(
        <polygon
          key={`hexagon-${i}`}
          points={points.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="0.4"
          opacity={shapeOpacity}
          transform={`rotate(${rotation} ${x} ${y})`}
        />
      );
    }
    
    return shapes;
  };

  const generateMixedShapes = () => {
    const shapes = [];
    const baseSize = 2 * sizeMultiplier;
    
    // Add some circles
    for (let i = 0; i < 4; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const radius = baseSize + Math.random() * baseSize;
      const shapeOpacity = opacity * (0.3 + Math.random() * 0.4);
      
      shapes.push(
        <circle
          key={`circle-${i}`}
          cx={`${x}%`}
          cy={`${y}%`}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="0.6"
          opacity={shapeOpacity}
        />
      );
    }
    
    // Add some rectangles
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * 90;
      const y = Math.random() * 90;
      const width = baseSize + Math.random() * baseSize * 2;
      const height = baseSize + Math.random() * baseSize;
      const rotation = Math.random() * 45;
      const shapeOpacity = opacity * (0.4 + Math.random() * 0.3);
      
      shapes.push(
        <rect
          key={`rect-${i}`}
          x={`${x}%`}
          y={`${y}%`}
          width={width}
          height={height}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity={shapeOpacity}
          transform={`rotate(${rotation} ${x + width/2} ${y + height/2})`}
        />
      );
    }
    
    // Add some diamonds
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = baseSize + Math.random() * baseSize;
      const rotation = Math.random() * 360;
      const shapeOpacity = opacity * (0.5 + Math.random() * 0.3);
      
      const points = [
        [x, y - size],
        [x + size, y],
        [x, y + size],
        [x - size, y]
      ].map(point => `${point[0]},${point[1]}`).join(' ');
      
      shapes.push(
        <polygon
          key={`diamond-${i}`}
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="0.4"
          opacity={shapeOpacity}
          transform={`rotate(${rotation} ${x} ${y})`}
        />
      );
    }
    
    return shapes;
  };

  const renderVariant = () => {
    switch (variant) {
      case 'triangles':
        return generateTriangles();
      case 'hexagons':
        return generateHexagons();
      default:
        return generateMixedShapes();
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

export default GeometricShapes;
