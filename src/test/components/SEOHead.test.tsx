import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import SEOHead from '../../../components/SEO/SEOHead';

describe('SEOHead Component', () => {
  beforeEach(() => {
    // Clear document head before each test
    document.head.innerHTML = '';
    document.title = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.head.innerHTML = '';
    document.title = '';
  });

  it('should set document title correctly', () => {
    const testTitle = 'Test Page Title';
    render(<SEOHead title={testTitle} />);
    
    expect(document.title).toBe(`${testTitle} | MegaInvest`);
  });

  it('should set meta description', () => {
    const testDescription = 'Test page description';
    render(<SEOHead description={testDescription} />);
    
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription?.getAttribute('content')).toBe(testDescription);
  });

  it('should set canonical URL', () => {
    const testUrl = '/test-page';
    render(<SEOHead url={testUrl} />);
    
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe(`https://www.mega-invest.hr${testUrl}`);
  });

  it('should set Open Graph tags', () => {
    const testTitle = 'Test OG Title';
    const testDescription = 'Test OG Description';
    const testImage = 'https://example.com/image.jpg';
    
    render(<SEOHead title={testTitle} description={testDescription} image={testImage} />);
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    
    expect(ogTitle?.getAttribute('content')).toBe(`${testTitle} | MegaInvest`);
    expect(ogDescription?.getAttribute('content')).toBe(testDescription);
    expect(ogImage?.getAttribute('content')).toBe(testImage);
  });

  it('should set structured data when provided', () => {
    const testStructuredData = { '@type': 'Organization', name: 'Test' };
    render(<SEOHead structuredData={testStructuredData} />);
    
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script?.textContent).toBe(JSON.stringify(testStructuredData));
  });

  it('should set noindex robots tag when noIndex is true', () => {
    render(<SEOHead noIndex={true} />);
    
    const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toBe('noindex, nofollow');
  });

  it('should set index robots tag when noIndex is false', () => {
    render(<SEOHead noIndex={false} />);
    
    const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toBe('index, follow');
  });
});
