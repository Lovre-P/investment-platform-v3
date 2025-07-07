import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ 
  measurementId = 'G-XXXXXXXXXX' // Replace with your actual GA4 Measurement ID
}) => {
  const location = useLocation();

  useEffect(() => {
    // Only load in production or when measurement ID is provided
    if (process.env.NODE_ENV !== 'production' && measurementId === 'G-XXXXXXXXXX') {
      console.log('Google Analytics: Skipping in development mode');
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // Configure Google Analytics
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    });

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(`script[src*="${measurementId}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [measurementId]);

  // Track page views on route changes
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search + location.hash
      });
    }
  }, [location, measurementId]);

  return null; // This component doesn't render anything
};

// Helper functions for tracking events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, parameters);
  }
};

export const trackInvestmentView = (investmentId: string, investmentTitle: string) => {
  trackEvent('view_investment', {
    investment_id: investmentId,
    investment_title: investmentTitle,
    content_type: 'investment_opportunity'
  });
};

export const trackInvestmentInterest = (investmentId: string, investmentTitle: string) => {
  trackEvent('investment_interest', {
    investment_id: investmentId,
    investment_title: investmentTitle,
    content_type: 'investment_opportunity'
  });
};

export const trackFormSubmission = (formType: string, success: boolean) => {
  trackEvent('form_submit', {
    form_type: formType,
    success: success
  });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount
  });
};

export default GoogleAnalytics;
