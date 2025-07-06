import React, { useState } from 'react';
import { CogIcon } from '@heroicons/react/24/outline';
import { cookieConsentService } from '../services/cookieConsentService';
import { CookieConsentPreferences, CookieCategory } from '../types/cookieConsent';
import { XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { PUBLIC_ROUTES } from '../constants';

interface CookiePreferencesButtonProps {
  onConsentChange?: (preferences: CookieConsentPreferences) => void;
  className?: string;
  variant?: 'button' | 'link';
}

const CookiePreferencesButton: React.FC<CookiePreferencesButtonProps> = ({ 
  onConsentChange, 
  className = '',
  variant = 'button'
}) => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<CookieCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = () => {
    setCategories(cookieConsentService.getCategories());
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      const preferences: CookieConsentPreferences = {
        strictly_necessary: true,
        functional: categories.find(c => c.id === 'functional')?.enabled || false,
        analytics: categories.find(c => c.id === 'analytics')?.enabled || false,
        marketing: categories.find(c => c.id === 'marketing')?.enabled || false
      };
      
      cookieConsentService.saveConsent(preferences);
      onConsentChange?.(preferences);
      setShowModal(false);
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

  const ButtonComponent = variant === 'link' ? 'button' : 'button';
  const buttonClasses = variant === 'link' 
    ? `text-sm text-accent-300 hover:text-accent-400 underline ${className}`
    : `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 ${className}`;

  return (
    <>
      <ButtonComponent
        onClick={handleOpenModal}
        className={buttonClasses}
        type="button"
      >
        {variant === 'button' && <CogIcon className="h-4 w-4" />}
        Cookie Preferences
      </ButtonComponent>

      {/* Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Cookie Preferences</h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <p className="text-sm text-gray-600 mb-6">
                  Manage your cookie preferences below. These settings control how we collect and use data 
                  to improve your experience. You can change these settings at any time. Learn more in our{' '}
                  <a 
                    href={PUBLIC_ROUTES.PRIVACY} 
                    className="text-primary-600 hover:text-primary-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>.
                </p>
                
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                            {category.required && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                Always Active
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={category.enabled}
                              onChange={() => handleCategoryToggle(category.id)}
                              disabled={category.required}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSavePreferences}
                  disabled={isLoading}
                  className="px-6 py-3 text-sm font-medium text-white bg-primary-600 border border-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CookiePreferencesButton;
