import React, { useState, useEffect } from 'react';
import { XMarkIcon, CogIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { cookieConsentService } from '../services/cookieConsentService';
import { CookieConsentPreferences, CookieCategory } from '../types/cookieConsent';
import { PUBLIC_ROUTES } from '../constants';

interface CookieConsentBannerProps {
  onConsentChange?: (preferences: CookieConsentPreferences) => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onConsentChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [categories, setCategories] = useState<CookieCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if banner should be shown
    if (cookieConsentService.shouldShowBanner()) {
      setIsVisible(true);
      setCategories(cookieConsentService.getCategories());
    }
  }, []);

  const handleAcceptAll = async () => {
    setIsLoading(true);
    try {
      cookieConsentService.acceptAll();
      const preferences = cookieConsentService.getPreferences();
      onConsentChange?.(preferences);
      setIsVisible(false);
    } catch (error) {
      console.error('Error accepting cookies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectAll = async () => {
    setIsLoading(true);
    try {
      cookieConsentService.rejectAll();
      const preferences = cookieConsentService.getPreferences();
      onConsentChange?.(preferences);
      setIsVisible(false);
    } catch (error) {
      console.error('Error rejecting cookies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      const preferences: CookieConsentPreferences = {
        strictlyNecessary: true,
        functional: categories.find(c => c.id === 'functional')?.enabled || false,
        analytics: categories.find(c => c.id === 'analytics')?.enabled || false,
        marketing: categories.find(c => c.id === 'marketing')?.enabled || false
      };
      
      cookieConsentService.saveConsent(preferences);
      onConsentChange?.(preferences);
      setIsVisible(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId && !category.required
        ? { ...category, enabled: !category.enabled }
        : category
    ));
  };

  const handleShowPreferences = () => {
    setShowPreferences(true);
  };

  const handleClosePreferences = () => {
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop - Blocks interaction until consent is given */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Banner - Compact floating design */}
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl max-w-2xl mx-auto">
        <div className="p-4">
          {!showPreferences ? (
            // Main Banner - Compact Design
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    We value your privacy
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We use cookies to enhance your experience and analyze site traffic.
                    You can manage your preferences or learn more in our{' '}
                    <a
                      href={PUBLIC_ROUTES.PRIVACY}
                      className="text-primary-600 hover:text-primary-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>.
                  </p>
                </div>
              </div>

              {/* All buttons identical styling for GDPR compliance */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleRejectAll}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? 'Processing...' : 'Reject All'}
                </button>

                <button
                  onClick={handleShowPreferences}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <CogIcon className="h-4 w-4" />
                  Manage Preferences
                </button>

                <button
                  onClick={handleAcceptAll}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? 'Processing...' : 'Accept All'}
                </button>
              </div>
            </div>
          ) : (
            // Preferences Panel - Compact
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Cookie Preferences</h3>
                <button
                  onClick={handleClosePreferences}
                  className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Choose which cookies you want to accept. You can change these settings at any time.
              </p>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                          {category.required && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{category.description}</p>
                      </div>
                      <div className="ml-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={category.enabled}
                            onChange={() => handleCategoryToggle(category.id)}
                            disabled={category.required}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleClosePreferences}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSavePreferences}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CookieConsentBanner;
