import React from 'react';
import BackgroundSVG from '../../components/BackgroundSVG';
import GeometricLines from '../../components/BackgroundSVG/GeometricLines';
import AbstractDots from '../../components/BackgroundSVG/AbstractDots';
import GeometricShapes from '../../components/BackgroundSVG/GeometricShapes';

const SVGTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">SVG Background Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Test 1: Geometric Lines */}
        <div className="relative h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
          <h2 className="absolute top-2 left-2 z-10 bg-white px-2 py-1 text-sm font-semibold">Geometric Lines</h2>
          <GeometricLines 
            opacity={0.5}
            color="#0693a9"
            variant="diagonal"
          />
        </div>

        {/* Test 2: Abstract Dots */}
        <div className="relative h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
          <h2 className="absolute top-2 left-2 z-10 bg-white px-2 py-1 text-sm font-semibold">Abstract Dots</h2>
          <AbstractDots 
            opacity={0.5}
            color="#589ff1"
            variant="scattered"
            density="medium"
          />
        </div>

        {/* Test 3: Geometric Shapes */}
        <div className="relative h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
          <h2 className="absolute top-2 left-2 z-10 bg-white px-2 py-1 text-sm font-semibold">Geometric Shapes</h2>
          <GeometricShapes 
            opacity={0.5}
            color="#214b8b"
            variant="mixed"
          />
        </div>

        {/* Test 4: Mixed Background */}
        <div className="relative h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
          <h2 className="absolute top-2 left-2 z-10 bg-white px-2 py-1 text-sm font-semibold">Mixed Background</h2>
          <BackgroundSVG 
            variant="mixed"
            opacity={0.3}
            density="medium"
            colors={{
              primary: '#0693a9',
              secondary: '#589ff1',
              accent: '#214b8b'
            }}
          />
        </div>

        {/* Test 5: Grid Lines */}
        <div className="relative h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
          <h2 className="absolute top-2 left-2 z-10 bg-white px-2 py-1 text-sm font-semibold">Grid Lines</h2>
          <GeometricLines 
            opacity={0.4}
            color="#0693a9"
            variant="grid"
          />
        </div>

        {/* Test 6: Flowing Lines */}
        <div className="relative h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
          <h2 className="absolute top-2 left-2 z-10 bg-white px-2 py-1 text-sm font-semibold">Flowing Lines</h2>
          <GeometricLines 
            opacity={0.4}
            color="#589ff1"
            variant="flowing"
          />
        </div>
      </div>

      {/* Full page test */}
      <div className="relative mt-8 h-96 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <h2 className="absolute top-2 left-2 z-10 bg-white px-2 py-1 text-sm font-semibold">Full Page Background Test</h2>
        <BackgroundSVG 
          variant="mixed"
          opacity={0.2}
          density="medium"
          colors={{
            primary: '#0693a9',
            secondary: '#589ff1',
            accent: '#214b8b'
          }}
          className="absolute inset-0"
        />
        <div className="relative z-10 p-8">
          <p className="text-lg">This is content over the background. You should see subtle SVG patterns behind this text.</p>
          <p className="mt-4">The patterns should be visible but not interfere with text readability.</p>
        </div>
      </div>
    </div>
  );
};

export default SVGTestPage;
