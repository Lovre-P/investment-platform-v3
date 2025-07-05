// Cookie Consent Types
export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

export interface CookieConsentData {
  version: string;
  timestamp: number;
  categories: Record<string, boolean>;
  hasConsented: boolean;
}

export interface CookieConsentPreferences {
  strictly_necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface CookieConsentConfig {
  categories: CookieCategory[];
  texts: {
    title: string;
    description: string;
    acceptAll: string;
    rejectAll: string;
    managePreferences: string;
    savePreferences: string;
    policyLink: string;
    policyText: string;
  };
  links: {
    privacyPolicy: string;
    cookiePolicy: string;
  };
}

export enum CookieConsentAction {
  ACCEPT_ALL = 'accept_all',
  REJECT_ALL = 'reject_all',
  SAVE_PREFERENCES = 'save_preferences',
  SHOW_PREFERENCES = 'show_preferences'
}

// Represents the structure of consent data retrieved from the GET /api/cookie-consent endpoint
export interface CookieConsentAPIResponse {
  id: string; // The ID of the consent record in the database
  preferences: CookieConsentPreferences; // The actual consent preferences
  version: string; // The version of the consent policy agreed to
  timestamp: number; // The server timestamp (epoch milliseconds) when this consent was recorded or fetched
  createdAt: string; // ISO string format of creation date
}
