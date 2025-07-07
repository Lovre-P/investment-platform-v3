import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../../config/siteConfig';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    __GA_INITIALIZED__?: boolean;
  }
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({
  measurementId = SITE_CONFIG.analytics.googleAnalyticsId
}) => {
  const location = useLocation();

  useEffect(() => {
    // Skip loading in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Google Analytics: Skipping in development mode');
      return;
    }

    // Skip if measurement ID is placeholder or invalid
    if (!measurementId || measurementId === 'G-XXXXXXXXXX' || !measurementId.startsWith('G-')) {
      if (import.meta.env.PROD) {
        console.error('🚨 Google Analytics: Invalid measurement ID in production!');
      } else {
        console.warn('Google Analytics: Invalid measurement ID');
      }
      return;
    }

    // Prevent multiple initializations
    if (window.__GA_INITIALIZED__) {
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

    script.onload = () => {
      console.log('Google Analytics script loaded successfully');
    };

    script.onerror = () => {
      console.error('Failed to load Google Analytics script');
    };

    document.head.appendChild(script);

    // Initialize dataLayer and gtag only if not already defined
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }

    // Configure Google Analytics
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    });

    window.__GA_INITIALIZED__ = true;

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(`script[src*="${measurementId}"]`);
      if (existingScript) {
        existingScript.remove();
      }
      window.__GA_INITIALIZED__ = false;
    };
  }, [measurementId]);

  // Track page views on route changes
  useEffect(() => {
    // Skip if in development or invalid measurement ID
    if (process.env.NODE_ENV === 'development' ||
        !measurementId ||
        measurementId === 'G-XXXXXXXXXX' ||
        !measurementId.startsWith('G-')) {
      return;
    }

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
