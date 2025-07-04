import { COOKIE_CONSENT } from '../constants';
import { CookieConsentData, CookieConsentPreferences, CookieCategory } from '../types/cookieConsent';

/**
 * GDPR-compliant Cookie Consent Service
 * Manages cookie consent preferences and localStorage operations
 */
class CookieConsentService {
  private readonly storageKey = COOKIE_CONSENT.STORAGE_KEY;
  private readonly preferencesKey = COOKIE_CONSENT.PREFERENCES_KEY;
  private readonly version = COOKIE_CONSENT.VERSION;
  private readonly expiryDays = COOKIE_CONSENT.EXPIRY_DAYS;

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
   * Save consent preferences
   */
  saveConsent(preferences: CookieConsentPreferences): void {
    const consentData: CookieConsentData = {
      version: this.version,
      timestamp: Date.now(),
      hasConsented: true,
      categories: {
        strictly_necessary: true, // Always true
        functional: preferences.functional,
        analytics: preferences.analytics,
        marketing: preferences.marketing
      }
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(consentData));
      localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
      
      // Trigger consent change event
      this.triggerConsentChangeEvent(preferences);
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }

  /**
   * Accept all cookies
   */
  acceptAll(): void {
    this.saveConsent({
      strictly_necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    });
  }

  /**
   * Reject all non-essential cookies
   */
  rejectAll(): void {
    this.saveConsent({
      strictly_necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    });
  }

  /**
   * Clear all consent data
   */
  clearConsent(): void {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.preferencesKey);
    } catch (error) {
      console.error('Error clearing cookie consent:', error);
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
