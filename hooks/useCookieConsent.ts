import { useState, useEffect, useCallback, useRef } from 'react';
import { cookieConsentService } from '../services/cookieConsentService';
import { CookieConsentPreferences, CookieConsentAPIResponse } from '../types/cookieConsent';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/apiClient';
import { COOKIE_CONSENT } from '../constants'; // Import COOKIE_CONSENT

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
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isInitializedRef = useRef(false); // Ref to track initialization

  // This is the consolidated useEffect for initialization and sync
  useEffect(() => {
    const initializeAndOrSyncConsent = async () => {
      if (isAuthLoading) return; // Wait for auth to settle

      setIsLoading(true);
      try {
        let localPrefs = cookieConsentService.getPreferences();
        let localConsentGiven = cookieConsentService.hasConsent();

        if (!isInitializedRef.current) { // First time initialization
          setPreferences(localPrefs);
          setHasConsent(localConsentGiven);
          console.log('Initial consent load from local storage.');
        }

        if (isAuthenticated) {
          console.log('User is authenticated, attempting to fetch/sync server consent.');
          try {
            const serverResponse = await apiClient.get<{ success: boolean, consent: CookieConsentAPIResponse | null }>('/cookie-consent');
            if (serverResponse.success && serverResponse.consent) {
              const serverPreferences = serverResponse.consent.preferences;
              if (JSON.stringify(serverPreferences) !== JSON.stringify(preferences) || !hasConsent) {
                console.log('Server consent differs or local consent not set, applying server consent.');
                setPreferences(serverPreferences);
                setHasConsent(true);
                // Save server preferences to local storage to keep them in sync, avoid re-triggering server save
                localStorage.setItem(COOKIE_CONSENT.STORAGE_KEY, JSON.stringify({
                  version: serverResponse.consent.version,
                  timestamp: serverResponse.consent.timestamp, // or Date.now() if we want to refresh timestamp
                  hasConsented: true,
                  categories: serverPreferences
                }));
                localStorage.setItem(COOKIE_CONSENT.PREFERENCES_KEY, JSON.stringify(serverPreferences));
                // Dispatch event so other parts of app can react if necessary
                const event = new CustomEvent('cookieConsentChange', { detail: { preferences: serverPreferences } });
                window.dispatchEvent(event);
              } else {
                console.log('Server consent matches local, no update needed from server.');
              }
            } else if (localConsentGiven) {
              // Authenticated user has local consent, but no server consent. Sync local to server.
              console.log('User authenticated, local consent exists, no server consent. Syncing to server.');
              await cookieConsentService.saveConsentToServer(localPrefs); // Sync up existing local consent
            }
          } catch (error) {
            console.error('Error fetching/syncing cookie consent from/to server:', error);
            // Fallback to local storage if server fetch fails, which is already set
          }
        }

        // Determine if banner should be shown based on the final state
        const finalShouldShow = cookieConsentService.shouldShowBanner();
        setShouldShowBanner(finalShouldShow);

        if (!isInitializedRef.current) {
          isInitializedRef.current = true;
        }

      } catch (error) {
        console.error('Error in initializeAndOrSyncConsent:', error);
        setShouldShowBanner(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAndOrSyncConsent();

  }, [isAuthenticated, isAuthLoading]); // Effect runs when auth state settles or user logs in/out

  // Listen for local consent changes dispatched by cookieConsentService
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

  // Clear all consent data (local and attempt server)
  const clearConsent = useCallback(async () => {
    try {
      await cookieConsentService.clearConsent(); // This now also calls server delete
      setHasConsent(false);
      setPreferences({
        strictly_necessary: true,
        functional: false,
        analytics: false,
        marketing: false
      });
      setShouldShowBanner(true);
      // No need to dispatch 'cookieConsentChange' event as consent is removed.
      // Banner will show again.
    } catch (error) {
      console.error('Error clearing consent in hook:', error);
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
