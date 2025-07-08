import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BackgroundSVG from '../../../components/BackgroundSVG';
import GeometricLines from '../../../components/BackgroundSVG/GeometricLines';
import AbstractDots from '../../../components/BackgroundSVG/AbstractDots';
import GeometricShapes from '../../../components/BackgroundSVG/GeometricShapes';

describe('BackgroundSVG Components', () => {
  describe('BackgroundSVG Main Component', () => {
    it('renders without crashing', () => {
      render(<BackgroundSVG />);
      // Should not throw any errors
    });

    it('applies correct CSS classes for accessibility', () => {
      const { container } = render(<BackgroundSVG className="test-class" />);
      const svgElements = container.querySelectorAll('svg');
      
      svgElements.forEach(svg => {
        expect(svg).toHaveClass('pointer-events-none');
        expect(svg).toHaveStyle({ zIndex: '-1' });
      });
    });

    it('renders different variants correctly', () => {
      const { rerender, container } = render(<BackgroundSVG variant="lines" />);
      expect(container.querySelector('svg')).toBeInTheDocument();

      rerender(<BackgroundSVG variant="dots" />);
      expect(container.querySelector('svg')).toBeInTheDocument();

      rerender(<BackgroundSVG variant="shapes" />);
      expect(container.querySelector('svg')).toBeInTheDocument();

      rerender(<BackgroundSVG variant="mixed" />);
      expect(container.querySelectorAll('svg')).toHaveLength(3); // Mixed should have 3 layers
    });

    it('respects opacity settings', () => {
      const { container } = render(<BackgroundSVG opacity={0.5} variant="lines" />);
      const svgElements = container.querySelectorAll('line, circle, polygon, path');
      
      // Check that elements have opacity attributes
      svgElements.forEach(element => {
        const opacity = element.getAttribute('opacity');
        if (opacity) {
          expect(parseFloat(opacity)).toBeLessThanOrEqual(0.5);
        }
      });
    });
  });

  describe('GeometricLines Component', () => {
    it('renders SVG with correct structure', () => {
      const { container } = render(<GeometricLines />);
      const svg = container.querySelector('svg');
      
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 100 100');
      expect(svg).toHaveAttribute('preserveAspectRatio', 'none');
    });

    it('generates different line variants', () => {
      const { rerender, container } = render(<GeometricLines variant="diagonal" />);
      expect(container.querySelectorAll('line').length).toBeGreaterThan(0);

      rerender(<GeometricLines variant="grid" />);
      expect(container.querySelectorAll('line').length).toBeGreaterThan(0);

      rerender(<GeometricLines variant="flowing" />);
      expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    });
  });

  describe('AbstractDots Component', () => {
    it('renders SVG with dots', () => {
      const { container } = render(<AbstractDots />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(container.querySelectorAll('circle').length).toBeGreaterThan(0);
    });

    it('respects density settings', () => {
      const { rerender, container } = render(<AbstractDots density="low" />);
      const lowDensityDots = container.querySelectorAll('circle').length;

      rerender(<AbstractDots density="high" />);
      const highDensityDots = container.querySelectorAll('circle').length;

      expect(highDensityDots).toBeGreaterThan(lowDensityDots);
    });
  });

  describe('GeometricShapes Component', () => {
    it('renders SVG with shapes', () => {
      const { container } = render(<GeometricShapes />);
      const svg = container.querySelector('svg');
      
      expect(svg).toBeInTheDocument();
      
      // Should have various shape elements
      const shapes = container.querySelectorAll('polygon, circle, rect');
      expect(shapes.length).toBeGreaterThan(0);
    });

    it('generates different shape variants', () => {
      const { rerender, container } = render(<GeometricShapes variant="triangles" />);
      expect(container.querySelectorAll('polygon').length).toBeGreaterThan(0);

      rerender(<GeometricShapes variant="hexagons" />);
      expect(container.querySelectorAll('polygon').length).toBeGreaterThan(0);

      rerender(<GeometricShapes variant="mixed" />);
      // Mixed should have various shape types
      const allShapes = container.querySelectorAll('polygon, circle, rect');
      expect(allShapes.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility Features', () => {
    it('ensures SVG elements do not interfere with screen readers', () => {
      const { container } = render(<BackgroundSVG />);
      const svgElements = container.querySelectorAll('svg');
      
      svgElements.forEach(svg => {
        // SVG backgrounds should not be focusable
        expect(svg).toHaveClass('pointer-events-none');
        
        // Should have appropriate ARIA attributes or be hidden from screen readers
        expect(svg).not.toHaveAttribute('role');
        expect(svg).not.toHaveAttribute('aria-label');
      });
    });

    it('maintains proper z-index layering', () => {
      const { container } = render(<BackgroundSVG />);
      const svgElements = container.querySelectorAll('svg');
      
      svgElements.forEach(svg => {
        const zIndex = window.getComputedStyle(svg).zIndex;
        expect(zIndex).toBe('-1');
      });
    });
  });

  describe('Performance Considerations', () => {
    it('uses efficient SVG structure', () => {
      const { container } = render(<BackgroundSVG variant="mixed" />);
      
      // Check that we don't have excessive number of elements
      const allSvgElements = container.querySelectorAll('svg *');
      expect(allSvgElements.length).toBeLessThan(100); // Reasonable limit
    });

    it('applies performance-friendly attributes', () => {
      const { container } = render(<BackgroundSVG />);
      const svgElements = container.querySelectorAll('svg');
      
      svgElements.forEach(svg => {
        // Should have viewBox for scalability
        expect(svg).toHaveAttribute('viewBox');
        
        // Should have preserveAspectRatio for responsive behavior
        expect(svg).toHaveAttribute('preserveAspectRatio');
      });
    });
  });
});
