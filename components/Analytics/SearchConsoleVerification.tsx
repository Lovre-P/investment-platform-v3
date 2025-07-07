import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SearchConsoleVerificationProps {
  verificationCode?: string;
}

const SearchConsoleVerification: React.FC<SearchConsoleVerificationProps> = ({
  verificationCode = 'your-google-search-console-verification-code' // Replace with actual verification code
}) => {
  return (
    <Helmet>
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content={verificationCode} />
      
      {/* Bing Webmaster Tools Verification (optional) */}
      {/* <meta name="msvalidate.01" content="your-bing-verification-code" /> */}
      
      {/* Yandex Webmaster Verification (optional) */}
      {/* <meta name="yandex-verification" content="your-yandex-verification-code" /> */}
    </Helmet>
  );
};

export default SearchConsoleVerification;
