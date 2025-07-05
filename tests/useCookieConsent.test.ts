import { renderHook, act } from '@testing-library/react';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { describe, it, expect } from 'vitest';

describe('useCookieConsent', () => {
  it('initially shows banner when no consent stored', () => {
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current.shouldShowBanner).toBe(true);
  });

  it('acceptAll sets preferences', () => {
    const { result } = renderHook(() => useCookieConsent());
    act(() => result.current.acceptAll());
    expect(result.current.preferences.functional).toBe(true);
    expect(result.current.shouldShowBanner).toBe(false);
  });
});
