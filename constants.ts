
export const APP_NAME = "MegaInvest";
export const DEFAULT_CURRENCY = "EUR";

export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  INVESTMENTS: '/investments',
  INVESTMENT_DETAIL: '/investments/:id',
  SUBMIT_INVESTMENT: '/submit-investment',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  NOT_FOUND: '/404',
};

export const ADMIN_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin/dashboard',
  INVESTMENTS: '/admin/investments',
  LEADS: '/admin/leads',
  PENDING_INVESTMENTS: '/admin/pending-investments',
  USERS: '/admin/users',
  SETTINGS: '/admin/settings',
};

export const PLACEHOLDER_IMAGE_URL = "https://picsum.photos";

// Cookie Consent Configuration
export const COOKIE_CONSENT = {
  STORAGE_KEY: 'megaInvestCookieConsent',
  PREFERENCES_KEY: 'megaInvestCookiePreferences',
  VERSION: '1.0',
  EXPIRY_DAYS: 365,
  CATEGORIES: {
    STRICTLY_NECESSARY: 'strictly_necessary',
    ANALYTICS: 'analytics',
    MARKETING: 'marketing',
    FUNCTIONAL: 'functional'
  }
} as const;
    