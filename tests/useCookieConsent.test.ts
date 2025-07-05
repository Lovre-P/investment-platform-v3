import { renderHook, act } from '@testing-library/react';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cookieConsentService } from '../services/cookieConsentService';

let prefs = {
  strictlyNecessary: true,
  functional: false,
  analytics: false,
  marketing: false
};

beforeEach(() => {
  prefs = { strictlyNecessary: true, functional: false, analytics: false, marketing: false };
  vi.spyOn(cookieConsentService, 'hasConsent').mockReturnValue(false);
  vi.spyOn(cookieConsentService, 'shouldShowBanner').mockReturnValue(true);
  vi.spyOn(cookieConsentService, 'getPreferences').mockImplementation(() => prefs);
  vi.spyOn(cookieConsentService, 'acceptAll').mockImplementation(() => {
    prefs = { strictlyNecessary: true, functional: true, analytics: true, marketing: true };
  });
  vi.spyOn(cookieConsentService, 'rejectAll').mockImplementation(() => {
    prefs = { strictlyNecessary: true, functional: false, analytics: false, marketing: false };
  });
  vi.spyOn(cookieConsentService, 'saveConsent').mockImplementation((p) => {
    prefs = p;
  });
  vi.spyOn(cookieConsentService, 'clearConsent').mockImplementation(() => {
    prefs = { strictlyNecessary: true, functional: false, analytics: false, marketing: false };
  });
  vi.spyOn(cookieConsentService, 'saveConsentToServer').mockResolvedValue();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useCookieConsent', () => {
  it('initially shows banner when no consent stored', () => {
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current.shouldShowBanner).toBe(true);
  });

  it('acceptAll sets preferences', () => {
    const { result } = renderHook(() => useCookieConsent());
    act(() => result.current.acceptAll());
    expect(result.current.preferences).toEqual({
      strictlyNecessary: true,
      functional: true,
      analytics: true,
      marketing: true
    });
    expect(result.current.shouldShowBanner).toBe(false);
    expect(cookieConsentService.saveConsentToServer).toHaveBeenCalled();
  });

  it('rejectAll disables non-essential cookies', () => {
    const { result } = renderHook(() => useCookieConsent());
    act(() => result.current.rejectAll());
    expect(result.current.preferences).toEqual({
      strictlyNecessary: true,
      functional: false,
      analytics: false,
      marketing: false
    });
  });

  it('savePreferences updates custom categories', () => {
    const { result } = renderHook(() => useCookieConsent());
    act(() => result.current.savePreferences({
      strictlyNecessary: true,
      functional: true,
      analytics: false,
      marketing: true
    }));
    expect(result.current.preferences.functional).toBe(true);
    expect(result.current.preferences.marketing).toBe(true);
  });

  it('clearConsent resets preferences', () => {
    const { result } = renderHook(() => useCookieConsent());
    act(() => result.current.acceptAll());
    act(() => result.current.clearConsent());
    expect(result.current.preferences.functional).toBe(false);
    expect(result.current.shouldShowBanner).toBe(true);
  });

  it('isCategoryEnabled returns correct value', () => {
    const { result } = renderHook(() => useCookieConsent());
    act(() => result.current.acceptAll());
    expect(result.current.isCategoryEnabled('analytics')).toBe(true);
  });
});
