// SEO Monitoring and Performance Tracking Utilities

interface SEOMetrics {
  pageTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  hasStructuredData: boolean;
  imageCount: number;
  imagesWithAlt: number;
  headingStructure: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  internalLinks: number;
  externalLinks: number;
  pageLoadTime?: number;
}

export const analyzePage = (): SEOMetrics => {
  const title = document.title;
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  
  // Check for structured data
  const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
  const hasStructuredData = structuredDataScripts.length > 0;
  
  // Analyze images
  const images = document.querySelectorAll('img');
  const imagesWithAlt = Array.from(images).filter(img => img.alt && img.alt.trim() !== '').length;
  
  // Analyze heading structure
  const headingStructure = {
    h1: document.querySelectorAll('h1').length,
    h2: document.querySelectorAll('h2').length,
    h3: document.querySelectorAll('h3').length,
    h4: document.querySelectorAll('h4').length,
    h5: document.querySelectorAll('h5').length,
    h6: document.querySelectorAll('h6').length,
  };
  
  // Analyze links
  const links = document.querySelectorAll('a[href]');
  let internalLinks = 0;
  let externalLinks = 0;

  Array.from(links).forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('http') && !href.includes(window.location.hostname)) {
      externalLinks++;
    } else if (href.startsWith('/') || href.includes(window.location.hostname)) {
      internalLinks++;
    }
    // Skip fragment-only links (#) as they don't count as navigation links
  });
  
  return {
    pageTitle: title,
    metaDescription,
    canonicalUrl: canonical,
    hasStructuredData,
    imageCount: images.length,
    imagesWithAlt,
    headingStructure,
    internalLinks,
    externalLinks
  };
};

export const validateSEO = (metrics: SEOMetrics): { score: number; issues: string[] } => {
  const issues: string[] = [];
  let score = 100;
  
  // Title validation
  if (!metrics.pageTitle) {
    issues.push('Missing page title');
    score -= 20;
  } else if (metrics.pageTitle.length > 60) {
    issues.push('Page title too long (>60 characters)');
    score -= 10;
  } else if (metrics.pageTitle.length < 30) {
    issues.push('Page title too short (<30 characters)');
    score -= 5;
  }
  
  // Meta description validation
  if (!metrics.metaDescription) {
    issues.push('Missing meta description');
    score -= 15;
  } else if (metrics.metaDescription.length > 160) {
    issues.push('Meta description too long (>160 characters)');
    score -= 10;
  } else if (metrics.metaDescription.length < 120) {
    issues.push('Meta description too short (<120 characters)');
    score -= 5;
  }
  
  // Canonical URL validation
  if (!metrics.canonicalUrl) {
    issues.push('Missing canonical URL');
    score -= 10;
  }
  
  // Structured data validation
  if (!metrics.hasStructuredData) {
    issues.push('No structured data found');
    score -= 15;
  }
  
  // Heading structure validation
  if (metrics.headingStructure.h1 === 0) {
    issues.push('Missing H1 tag');
    score -= 15;
  } else if (metrics.headingStructure.h1 > 1) {
    issues.push('Multiple H1 tags found');
    score -= 10;
  }
  
  // Image optimization validation
  if (metrics.imageCount > 0) {
    const altTextPercentage = (metrics.imagesWithAlt / metrics.imageCount) * 100;
    if (altTextPercentage < 90) {
      issues.push(`${Math.round(100 - altTextPercentage)}% of images missing alt text`);
      score -= 10;
    }
  }
  
  return { score: Math.max(0, score), issues };
};

export const measurePagePerformance = (): Promise<PerformanceMetrics> => {
  return new Promise((resolve) => {
    const defaultMetrics = {
      loadTime: 0,
      domContentLoaded: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      timeToInteractive: 0
    };

    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigationEntries = performance.getEntriesByType('navigation');
          const navigation = navigationEntries[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');

          if (!navigation) {
            resolve(defaultMetrics);
            return;
          }

          const metrics: PerformanceMetrics = {
            loadTime: Math.max(0, navigation.loadEventEnd - navigation.loadEventStart),
            domContentLoaded: Math.max(0, navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            timeToInteractive: Math.max(0, navigation.loadEventEnd - navigation.fetchStart)
          };

          resolve(metrics);
        }, 0);
      });
    } else {
      resolve(defaultMetrics);
    }
  });
};

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
}

export const logSEOReport = () => {
  if (process.env.NODE_ENV === 'development') {
    const metrics = analyzePage();
    const validation = validateSEO(metrics);
    
    console.group('🔍 SEO Analysis Report');
    console.log('📊 SEO Score:', validation.score + '/100');
    console.log('📄 Page Metrics:', metrics);
    
    if (validation.issues.length > 0) {
      console.group('⚠️ Issues Found:');
      validation.issues.forEach(issue => console.warn('•', issue));
      console.groupEnd();
    } else {
      console.log('✅ No SEO issues found!');
    }
    
    console.groupEnd();
  }
};
