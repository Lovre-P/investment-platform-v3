// Preload critical resources for better performance

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadCriticalImages = async () => {
  const criticalImages = [
    '/images/hero/ChatGPT-Image-Hero.jpg',
    '/images/logo.svg'
  ];

  const results = await Promise.allSettled(criticalImages.map(preloadImage));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.warn(`Failed to preload image: ${criticalImages[index]}`, result.reason);
    }
  });
};

// Preload fonts
export const preloadFonts = () => {
  const fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
  ];

  fonts.forEach(fontUrl => {
    // First preload the CSS
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'style';
    preloadLink.href = fontUrl;
    document.head.appendChild(preloadLink);

    // Then load it as a stylesheet
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = fontUrl;
    styleLink.onload = () => {
      // Remove preload link once stylesheet is loaded
      if (preloadLink.parentNode) {
        preloadLink.parentNode.removeChild(preloadLink);
      }
    };
    document.head.appendChild(styleLink);
  });
};

// Resource hints for better performance
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const dnsPrefetchDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.tailwindcss.com'
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
  // Run on next tick to avoid blocking initial render
  setTimeout(() => {
    addResourceHints();
    preloadCriticalImages();
  }, 0);
};
