import { useState, useEffect, useCallback } from 'react';
import { cookieConsentService } from '../services/cookieConsentService';
import { CookieConsentPreferences } from '../types/cookieConsent';

/**
 * Custom hook for managing cookie consent state and preferences
 */
export const useCookieConsent = () => {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookieConsentPreferences>({
    strictly_necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });
  const [shouldShowBanner, setShouldShowBanner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize consent state
  useEffect(() => {
    const initializeConsent = () => {
      try {
        const currentConsent = cookieConsentService.hasConsent();
        const currentPreferences = cookieConsentService.getPreferences();
        const shouldShow = cookieConsentService.shouldShowBanner();

        setHasConsent(currentConsent);
        setPreferences(currentPreferences);
        setShouldShowBanner(shouldShow);
      } catch (error) {
        console.error('Error initializing cookie consent:', error);
        // Default to showing banner on error
        setShouldShowBanner(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeConsent();
  }, []);

  // Listen for consent changes
  useEffect(() => {
    const handleConsentChange = (event: CustomEvent) => {
      const newPreferences = event.detail.preferences as CookieConsentPreferences;
      setPreferences(newPreferences);
      setHasConsent(true);
      setShouldShowBanner(false);
    };

    window.addEventListener('cookieConsentChange', handleConsentChange as EventListener);
    
    return () => {
      window.removeEventListener('cookieConsentChange', handleConsentChange as EventListener);
    };
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    try {
      cookieConsentService.acceptAll();
      const newPreferences = cookieConsentService.getPreferences();
      setPreferences(newPreferences);
      setHasConsent(true);
      setShouldShowBanner(false);
    } catch (error) {
      console.error('Error accepting all cookies:', error);
    }
  }, []);

  // Reject all non-essential cookies
  const rejectAll = useCallback(() => {
    try {
      cookieConsentService.rejectAll();
      const newPreferences = cookieConsentService.getPreferences();
      setPreferences(newPreferences);
      setHasConsent(true);
      setShouldShowBanner(false);
    } catch (error) {
      console.error('Error rejecting cookies:', error);
    }
  }, []);

  // Save custom preferences
  const savePreferences = useCallback((newPreferences: CookieConsentPreferences) => {
    try {
      cookieConsentService.saveConsent(newPreferences);
      setPreferences(newPreferences);
      setHasConsent(true);
      setShouldShowBanner(false);
    } catch (error) {
      console.error('Error saving cookie preferences:', error);
    }
  }, []);

  // Clear all consent data
  const clearConsent = useCallback(() => {
    try {
      cookieConsentService.clearConsent();
      setHasConsent(false);
      setPreferences({
        strictly_necessary: true,
        functional: false,
        analytics: false,
        marketing: false
      });
      setShouldShowBanner(true);
    } catch (error) {
      console.error('Error clearing consent:', error);
    }
  }, []);

  // Check if specific category is enabled
  const isCategoryEnabled = useCallback((category: keyof CookieConsentPreferences): boolean => {
    return preferences[category] || false;
  }, [preferences]);

  // Get categories configuration
  const getCategories = useCallback(() => {
    return cookieConsentService.getCategories();
  }, []);

  return {
    // State
    hasConsent,
    preferences,
    shouldShowBanner,
    isLoading,
    
    // Actions
    acceptAll,
    rejectAll,
    savePreferences,
    clearConsent,
    
    // Utilities
    isCategoryEnabled,
    getCategories
  };
};

export default useCookieConsent;
