import { COOKIE_CONSENT } from '../constants';
import { CookieConsentData, CookieConsentPreferences, CookieCategory } from '../types/cookieConsent';
import { apiClient } from '../utils/apiClient'; // Import apiClient

/**
 * GDPR-compliant Cookie Consent Service
 * Manages cookie consent preferences and localStorage operations
 */
class CookieConsentService {
  private readonly storageKey = COOKIE_CONSENT.STORAGE_KEY;
  private readonly preferencesKey = COOKIE_CONSENT.PREFERENCES_KEY;
  private readonly version = COOKIE_CONSENT.VERSION;
  private readonly expiryDays = COOKIE_CONSENT.EXPIRY_DAYS;

  // Session ID for anonymous users - can be a simple timestamp or a more robust solution
  private sessionId: string | null = null;

  constructor() {
    this.initializeSessionId();
  }

  private initializeSessionId(): void {
    // Attempt to get a session ID from localStorage or generate a new one
    // This is a very basic session ID, consider a more robust solution if needed for anonymous tracking
    let sid = localStorage.getItem('megaInvestSessionId');
    if (!sid) {
      sid = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem('megaInvestSessionId', sid);
    }
    this.sessionId = sid;
  }

  private getSessionId(): string | null {
    if (!this.sessionId) {
      this.initializeSessionId();
    }
    return this.sessionId;
  }

  // Default cookie categories configuration
  private readonly defaultCategories: CookieCategory[] = [
    {
      id: COOKIE_CONSENT.CATEGORIES.STRICTLY_NECESSARY,
      name: 'Strictly Necessary',
      description: 'These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
      required: true,
      enabled: true
    },
    {
      id: COOKIE_CONSENT.CATEGORIES.FUNCTIONAL,
      name: 'Functional',
      description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.',
      required: false,
      enabled: false
    },
    {
      id: COOKIE_CONSENT.CATEGORIES.ANALYTICS,
      name: 'Analytics',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      required: false,
      enabled: false
    },
    {
      id: COOKIE_CONSENT.CATEGORIES.MARKETING,
      name: 'Marketing',
      description: 'These cookies are used to track visitors across websites to display relevant advertisements and marketing content.',
      required: false,
      enabled: false
    }
  ];

  /**
   * Check if user has given consent
   */
  hasConsent(): boolean {
    const consent = this.getConsentData();
    return consent?.hasConsented || false;
  }

  /**
   * Delete consent from the server
   */
  async deleteConsentFromServer(): Promise<void> {
    // This assumes that if a user is logged in, their token will be sent by apiClient
    // If no user is logged in, this request might be denied by the server or do nothing,
    // which is acceptable as there's no server-side anonymous consent to clear by session_id with DELETE.
    try {
      await apiClient.delete('/cookie-consent');
      console.log('Cookie consent deleted from server successfully.');
    } catch (error) {
      // Log error but don't let it break client-side clearing
      console.error('Error deleting cookie consent from server:', error);
      // If error is 401 (not authenticated), it's fine, just means nothing to delete for a user.
      if (error instanceof apiClient.ApiClientError && error.status === 401) {
        console.log('User not authenticated, no server-side consent to delete by user ID.');
      }
    }
  }

  /**
   * Check if consent is still valid (not expired)
   */
  isConsentValid(): boolean {
    const consent = this.getConsentData();
    if (!consent) return false;

    const expiryTime = consent.timestamp + (this.expiryDays * 24 * 60 * 60 * 1000);
    return Date.now() < expiryTime && consent.version === this.version;
  }

  /**
   * Get current consent data from localStorage
   */
  getConsentData(): CookieConsentData | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading cookie consent data:', error);
      return null;
    }
  }

  /**
   * Get current cookie preferences
   */
  getPreferences(): CookieConsentPreferences {
    const consent = this.getConsentData();
    if (!consent) {
      return {
        strictly_necessary: true,
        functional: false,
        analytics: false,
        marketing: false
      };
    }

    return {
      strictly_necessary: true, // Always true
      functional: consent.categories.functional || false,
      analytics: consent.categories.analytics || false,
      marketing: consent.categories.marketing || false
    };
  }

  /**
   * Save consent preferences to localStorage and server
   */
  async saveConsent(preferences: CookieConsentPreferences): Promise<void> {
    const consentData: CookieConsentData = {
      version: this.version,
      timestamp: Date.now(),
      hasConsented: true,
      categories: {
        strictly_necessary: true, // Always true
        functional: preferences.functional,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
      },
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(consentData));
      localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
      
      // Attempt to save to server (fire and forget, or handle errors as needed)
      await this.saveConsentToServer(preferences);

      // Trigger consent change event
      this.triggerConsentChangeEvent(preferences);
    } catch (error) {
      console.error('Error saving cookie consent (local):', error);
      // Still trigger event even if server save fails, as local consent is set
      this.triggerConsentChangeEvent(preferences);
    }
  }

  /**
   * Save consent preferences to the server
   */
  async saveConsentToServer(preferences: CookieConsentPreferences): Promise<void> {
    try {
      const payload = {
        preferences,
        version: this.version,
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
      };
      // apiClient handles auth headers automatically
      await apiClient.post('/cookie-consent', payload);
      console.log('Cookie consent saved to server successfully.');
    } catch (error) {
      console.error('Error saving cookie consent to server:', error);
      // Decide on error handling:
      // - Log and continue (current approach)
      // - Retry logic
      // - Inform user (though this is a background task)
    }
  }

  /**
   * Accept all cookies
   */
  async acceptAll(): Promise<void> {
    const newPreferences: CookieConsentPreferences = {
      strictly_necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    await this.saveConsent(newPreferences);
  }

  /**
   * Reject all non-essential cookies
   */
  async rejectAll(): Promise<void> {
    const newPreferences: CookieConsentPreferences = {
      strictly_necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    await this.saveConsent(newPreferences);
  }

  /**
   * Clear all consent data locally and attempt to clear from server
   */
  async clearConsent(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.preferencesKey);
      // No need to trigger event here as per original structure, but could be added.

      // Attempt to delete from server
      await this.deleteConsentFromServer();

    } catch (error) { // This catch is for localStorage errors primarily
      console.error('Error clearing local cookie consent:', error);
    }
  }

  /**
   * Get default categories configuration
   */
  getCategories(): CookieCategory[] {
    const preferences = this.getPreferences();
    return this.defaultCategories.map(category => ({
      ...category,
      enabled: preferences[category.id as keyof CookieConsentPreferences] || category.required
    }));
  }

  /**
   * Check if specific category is enabled
   */
  isCategoryEnabled(categoryId: string): boolean {
    const preferences = this.getPreferences();
    return preferences[categoryId as keyof CookieConsentPreferences] || false;
  }

  /**
   * Trigger custom event when consent changes
   */
  private triggerConsentChangeEvent(preferences: CookieConsentPreferences): void {
    const event = new CustomEvent('cookieConsentChange', {
      detail: { preferences }
    });
    window.dispatchEvent(event);
  }

  /**
   * Check if banner should be shown
   */
  shouldShowBanner(): boolean {
    return !this.hasConsent() || !this.isConsentValid();
  }
}

// Export singleton instance
export const cookieConsentService = new CookieConsentService();
export default cookieConsentService;
