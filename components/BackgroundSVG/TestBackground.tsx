import React from 'react';

const TestBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      {/* Very visible test pattern */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Test lines - should be clearly visible */}
        <line x1="0" y1="0" x2="100" y2="100" stroke="#ff0000" strokeWidth="3" opacity="0.8" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#00ff00" strokeWidth="3" opacity="0.8" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#0000ff" strokeWidth="2" opacity="0.6" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#ff00ff" strokeWidth="2" opacity="0.6" />

        {/* Test dots */}
        <circle cx="25" cy="25" r="3" fill="#ff0000" opacity="0.8" />
        <circle cx="75" cy="25" r="3" fill="#00ff00" opacity="0.8" />
        <circle cx="25" cy="75" r="3" fill="#0000ff" opacity="0.8" />
        <circle cx="75" cy="75" r="3" fill="#ff00ff" opacity="0.8" />

        {/* Test shapes */}
        <rect x="40" y="40" width="20" height="20" fill="none" stroke="#ffff00" strokeWidth="2" opacity="0.6" />

        {/* Debug text */}
        <text x="50" y="10" textAnchor="middle" fill="#000000" fontSize="4" opacity="0.8">SVG TEST</text>
      </svg>
    </div>
  );
};

export default TestBackground;
