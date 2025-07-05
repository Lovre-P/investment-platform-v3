import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cookieConsentService } from '../services/cookieConsentService';

describe('cookieConsentService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('generates a session id when saving consent', () => {
    cookieConsentService.saveConsent({
      strictlyNecessary: true,
      functional: false,
      analytics: false,
      marketing: false
    });
    const id = localStorage.getItem('megaInvestSessionId');
    expect(id).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  });
});
