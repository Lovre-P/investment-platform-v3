import { useState, useEffect, useCallback, useContext } from 'react';
import { cookieConsentService } from '../services/cookieConsentService';
import { CookieConsentPreferences, CookieConsentAPIResponse } from '../types/cookieConsent'; // Assuming API response type is in cookieConsent
import { useAuth } from '../contexts/AuthContext'; // To check auth state
import { apiClient } from '../utils/apiClient'; // For fetching consent

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
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Get auth status

  // Initialize consent state from localStorage and then from server if authenticated
  useEffect(() => {
    const initializeConsent = async () => {
      setIsLoading(true);
      try {
        // 1. Load from localStorage first
        let localConsentExists = cookieConsentService.hasConsent();
        let currentPreferences = cookieConsentService.getPreferences();

        setHasConsent(localConsentExists);
        setPreferences(currentPreferences);

        // 2. If authenticated and auth is not loading, try to fetch from server
        if (isAuthenticated && !isAuthLoading) {
          try {
            const serverResponse = await apiClient.get<{ success: boolean, consent: CookieConsentAPIResponse | null }>('/cookie-consent');
            if (serverResponse.success && serverResponse.consent) {
              const serverPreferences = serverResponse.consent.preferences;
              // Update local state and localStorage with server's data
              setPreferences(serverPreferences);
              setHasConsent(true); // Assuming server consent means consent is given
              // Save server preferences to local storage to keep them in sync
              // Note: cookieConsentService.saveConsent will also try to save to server again, which is fine.
              await cookieConsentService.saveConsent(serverPreferences);
              console.log('Cookie consent loaded and synced from server.');
            } else if (localConsentExists) {
              // If server has no consent, but local does, try to sync local to server
              // This is covered by saveConsentToServer in cookieConsentService when consent is next updated
              // Or we could explicitly call it: await cookieConsentService.saveConsentToServer(currentPreferences);
            }
          } catch (error) {
            console.error('Error fetching cookie consent from server:', error);
            // Fallback to local storage if server fetch fails
          }
        }

        // 3. Determine if banner should be shown based on the final state
        // Re-check after potential server sync
        const finalShouldShow = cookieConsentService.shouldShowBanner();
        setShouldShowBanner(finalShouldShow);

      } catch (error) {
        console.error('Error initializing cookie consent:', error);
        setShouldShowBanner(true); // Default to showing banner on error
      } finally {
        setIsLoading(false);
      }
    };

    // Only run initialization once auth loading is complete
    if (!isAuthLoading) {
      initializeConsent();
    }
  }, [isAuthenticated, isAuthLoading]); // Re-run if auth state changes

  // Listen for local consent changes (e.g., from banner actions)
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
  const acceptAll = useCallback(async () => {
    try {
      await cookieConsentService.acceptAll(); // This now also saves to server
      // The 'cookieConsentChange' event will update state, or we can do it manually:
      // const newPreferences = cookieConsentService.getPreferences();
      // setPreferences(newPreferences);
      // setHasConsent(true);
      // setShouldShowBanner(false);
    } catch (error) {
      console.error('Error accepting all cookies in hook:', error);
    }
  }, []);

  // Reject all non-essential cookies
  const rejectAll = useCallback(async () => {
    try {
      await cookieConsentService.rejectAll(); // This now also saves to server
      // Event will update state
    } catch (error) {
      console.error('Error rejecting cookies in hook:', error);
    }
  }, []);

  // Save custom preferences
  const savePreferences = useCallback(async (newPreferences: CookieConsentPreferences) => {
    try {
      await cookieConsentService.saveConsent(newPreferences); // This now also saves to server
      // Event will update state
    } catch (error) {
      console.error('Error saving cookie preferences in hook:', error);
    }
  }, []);

  // Clear all consent data (local only, server impact depends on next consent action)
  const clearConsent = useCallback(() => {
    try {
      cookieConsentService.clearConsent(); // This is local
      // Server consent is not explicitly cleared here. It will be overwritten on next consent.
      // Or, a DELETE /api/cookie-consent endpoint could be implemented.
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
