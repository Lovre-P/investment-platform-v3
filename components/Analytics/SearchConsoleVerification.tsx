import React, { useEffect } from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';

interface SearchConsoleVerificationProps {
  verificationCode?: string;
}

const SearchConsoleVerification: React.FC<SearchConsoleVerificationProps> = ({
  verificationCode = SITE_CONFIG.analytics.searchConsoleVerification
}) => {
  useEffect(() => {
    // Only add verification meta tag if it's not a placeholder
    if (verificationCode &&
        verificationCode !== 'your-google-search-console-verification-code' &&
        verificationCode !== SITE_CONFIG.analytics.searchConsoleVerification) {
      let meta = document.querySelector('meta[name="google-site-verification"]') as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', verificationCode);
    }
  }, [verificationCode]);

  return null; // This component doesn't render anything visible
};

export default SearchConsoleVerification;
