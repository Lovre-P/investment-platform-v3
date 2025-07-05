import { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import { cookieConsentService } from '../services/cookieConsentService';
import { CookieConsentPreferences, CookieConsentAPIResponse } from '../types/cookieConsent';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/apiClient';

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

    // Only run initialization once auth loading is complete and it hasn't run yet
    if (!isAuthLoading && !isInitializedRef.current) {
      initializeConsent().then(() => {
        isInitializedRef.current = true; // Mark as initialized
      });
    }
  }, [isAuthLoading, isAuthenticated]); // Keep isAuthenticated to re-evaluate if needed after login for server sync
                                       // but the isInitializedRef check prevents full re-run of all logic.
                                       // A more nuanced approach might be needed if isAuthenticated changes should trigger specific parts of initializeConsent.
                                       // For now, this prevents full re-runs that overwrite things.
                                       // Let's refine: the main goal is to fetch from server if user logs in.
                                       // So, isAuthenticated IS a valid dependency for the server fetch part.
                                       // The isInitializedRef should primarily prevent re-running the *local storage* part.

  // Re-thinking the useEffect for initialization:
  // We want to load from localStorage once.
  // We want to load from server if/when user becomes authenticated.
  // The isInitializedRef should guard the entire process from running multiple times unnecessarily.

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

  // Listen for local consent changes (e.g., from banner actions, which also trigger server save)
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
