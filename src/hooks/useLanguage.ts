import { useTranslation } from 'react-i18next';

/**
 * Custom hook to get the current language and provide language-aware API calls
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();
  
  /**
   * Get the current language code
   */
  const currentLanguage = i18n.language || 'en';
  
  /**
   * Check if the current language is not English (needs translation)
   */
  const needsTranslation = currentLanguage !== 'en';
  
  /**
   * Get language parameter for API calls
   * Returns undefined for English to maintain backward compatibility
   */
  const getLanguageParam = (): string | undefined => {
    return needsTranslation ? currentLanguage : undefined;
  };
  
  /**
   * Add language parameter to filters object if needed
   */
  const addLanguageToFilters = <T extends Record<string, any>>(filters: T): T & { lang?: string } => {
    const langParam = getLanguageParam();
    return langParam ? { ...filters, lang: langParam } : filters;
  };
  
  return {
    currentLanguage,
    needsTranslation,
    getLanguageParam,
    addLanguageToFilters
  };
};
