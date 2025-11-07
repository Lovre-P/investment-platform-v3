import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn()
}));

const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;

describe('useLanguage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return English as default language', () => {
    mockUseTranslation.mockReturnValue({
      i18n: { language: 'en' }
    } as any);

    const { result } = renderHook(() => useLanguage());

    expect(result.current.currentLanguage).toBe('en');
    expect(result.current.needsTranslation).toBe(false);
    expect(result.current.getLanguageParam()).toBeUndefined();
  });

  it('should detect non-English language', () => {
    mockUseTranslation.mockReturnValue({
      i18n: { language: 'hr' }
    } as any);

    const { result } = renderHook(() => useLanguage());

    expect(result.current.currentLanguage).toBe('hr');
    expect(result.current.needsTranslation).toBe(true);
    expect(result.current.getLanguageParam()).toBe('hr');
  });

  it('should handle missing language gracefully', () => {
    mockUseTranslation.mockReturnValue({
      i18n: { language: undefined }
    } as any);

    const { result } = renderHook(() => useLanguage());

    expect(result.current.currentLanguage).toBe('en');
    expect(result.current.needsTranslation).toBe(false);
  });

  describe('addLanguageToFilters', () => {
    it('should not add language parameter for English', () => {
      mockUseTranslation.mockReturnValue({
        i18n: { language: 'en' }
      } as any);

      const { result } = renderHook(() => useLanguage());
      const filters = { status: 'Open', category: 'Technology' };
      const resultFilters = result.current.addLanguageToFilters(filters);

      expect(resultFilters).toEqual(filters);
      expect(resultFilters).not.toHaveProperty('lang');
    });

    it('should add language parameter for non-English', () => {
      mockUseTranslation.mockReturnValue({
        i18n: { language: 'hr' }
      } as any);

      const { result } = renderHook(() => useLanguage());
      const filters = { status: 'Open', category: 'Technology' };
      const resultFilters = result.current.addLanguageToFilters(filters);

      expect(resultFilters).toEqual({
        ...filters,
        lang: 'hr'
      });
    });

    it('should preserve existing filter properties', () => {
      mockUseTranslation.mockReturnValue({
        i18n: { language: 'de' }
      } as any);

      const { result } = renderHook(() => useLanguage());
      const filters = { 
        status: 'Open', 
        category: 'Technology',
        page: 1,
        limit: 10
      };
      const resultFilters = result.current.addLanguageToFilters(filters);

      expect(resultFilters).toEqual({
        status: 'Open',
        category: 'Technology', 
        page: 1,
        limit: 10,
        lang: 'de'
      });
    });
  });
});
