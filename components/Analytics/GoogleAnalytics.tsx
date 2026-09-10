import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../../config/siteConfig';
import { cookieConsentService } from '../../services/cookieConsentService';

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
    const isValidMeasurementId = Boolean(
      measurementId && measurementId !== 'G-XXXXXXXXXX' && measurementId.startsWith('G-')
    );

    const removeAnalytics = () => {
      const existingScript = document.querySelector(`script[src*="${measurementId}"]`);
      existingScript?.remove();
      window.__GA_INITIALIZED__ = false;
      window.dataLayer = [];
    };

    const loadAnalytics = () => {
      if (process.env.NODE_ENV === 'development' || !isValidMeasurementId) {
        return;
      }

      if (!cookieConsentService.isCategoryEnabled('analytics') || window.__GA_INITIALIZED__) {
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });

      window.__GA_INITIALIZED__ = true;
    };

    const handleConsentChange = (event: Event) => {
      const preferences = (event as CustomEvent<{ preferences?: { analytics?: boolean } }>).detail?.preferences;
      if (preferences?.analytics) {
        loadAnalytics();
      } else {
        removeAnalytics();
      }
    };

    if (!isValidMeasurementId && import.meta.env.PROD) {
      console.warn('Google Analytics is not configured with a valid measurement ID');
    }

    window.addEventListener('cookieConsentChange', handleConsentChange);
    loadAnalytics();

    return () => {
      window.removeEventListener('cookieConsentChange', handleConsentChange);
      removeAnalytics();
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

    if (window.__GA_INITIALIZED__ && typeof window.gtag === 'function') {
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
