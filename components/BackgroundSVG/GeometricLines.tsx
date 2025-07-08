import React from 'react';

interface GeometricLinesProps {
  className?: string;
  opacity?: number;
  color?: string;
  variant?: 'diagonal' | 'grid' | 'flowing';
}

const GeometricLines: React.FC<GeometricLinesProps> = ({ 
  className = '', 
  opacity = 0.15, 
  color = '#0693a9', 
  variant = 'diagonal' 
}) => {
  const renderDiagonalLines = () => (
    <g>
      {/* Diagonal lines from top-left to bottom-right */}
      <line x1="0" y1="0" x2="100" y2="100" stroke={color} strokeWidth="2" opacity={opacity} />
      <line x1="10" y1="0" x2="110" y2="100" stroke={color} strokeWidth="1.5" opacity={opacity * 0.7} />
      <line x1="20" y1="0" x2="120" y2="100" stroke={color} strokeWidth="1" opacity={opacity * 0.5} />
      <line x1="-10" y1="0" x2="90" y2="100" stroke={color} strokeWidth="1.5" opacity={opacity * 0.7} />
      <line x1="-20" y1="0" x2="80" y2="100" stroke={color} strokeWidth="1" opacity={opacity * 0.5} />

      {/* Diagonal lines from top-right to bottom-left */}
      <line x1="100" y1="0" x2="0" y2="100" stroke={color} strokeWidth="1.5" opacity={opacity * 0.6} />
      <line x1="90" y1="0" x2="-10" y2="100" stroke={color} strokeWidth="1" opacity={opacity * 0.4} />
      <line x1="110" y1="0" x2="10" y2="100" stroke={color} strokeWidth="1" opacity={opacity * 0.4} />
    </g>
  );

  const renderGridLines = () => (
    <g>
      {/* Vertical lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={`v-${i}`}
          x1={(i + 1) * 12.5}
          y1="0"
          x2={(i + 1) * 12.5}
          y2="100"
          stroke={color}
          strokeWidth="1"
          opacity={opacity * (0.3 + Math.random() * 0.4)}
        />
      ))}

      {/* Horizontal lines */}
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={(i + 1) * 16.67}
          x2="100"
          y2={(i + 1) * 16.67}
          stroke={color}
          strokeWidth="1"
          opacity={opacity * (0.2 + Math.random() * 0.3)}
        />
      ))}
    </g>
  );

  const renderFlowingLines = () => (
    <g>
      {/* Curved flowing lines */}
      <path
        d="M0,20 Q25,10 50,25 T100,15"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity={opacity}
      />
      <path
        d="M0,40 Q30,30 60,45 T100,35"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity={opacity * 0.7}
      />
      <path
        d="M0,60 Q20,50 40,65 T100,55"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity={opacity * 0.5}
      />
      <path
        d="M0,80 Q35,70 70,85 T100,75"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity={opacity * 0.6}
      />
    </g>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'grid':
        return renderGridLines();
      case 'flowing':
        return renderFlowingLines();
      default:
        return renderDiagonalLines();
    }
  };

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 0 }}
    >
      {renderVariant()}
    </svg>
  );
};

export default GeometricLines;
