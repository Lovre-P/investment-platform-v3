// Site configuration for SEO and structured data
export const SITE_CONFIG = {
  name: "MegaInvest",
  shortName: "MegaInvest",
  url: "https://www.mega-invest.hr",
  logo: "https://www.mega-invest.hr/images/logo.svg",
  description: "Croatia's leading investment platform for verified, high-return projects in real estate, technology, and renewable energy.",
  
  // Contact Information
  contact: {
    phone: "+385 91 310 1512",
    email: "info@mega-invest.hr",
    address: {
      country: "HR",
      locality: "Šibenik",
      region: "Šibenik-Knin County"
    }
  },
  
  // Social Media Links
  socialLinks: [
    "https://www.linkedin.com/company/megainvest",
    "https://www.facebook.com/megainvest"
  ],
  
  // Theme and Branding
  theme: {
    primaryColor: "#214b8b",
    backgroundColor: "#ffffff"
  },
  
  // SEO Defaults
  seo: {
    defaultTitle: "MegaInvest - Premium Investment Opportunities Platform",
    defaultDescription: "Discover exclusive investment opportunities in real estate, technology, and renewable energy. Join Croatia's leading investment platform for verified, high-return projects.",
    defaultKeywords: [
      "investment opportunities",
      "Croatia investment",
      "real estate investment",
      "technology funding",
      "renewable energy projects",
      "startup funding",
      "venture capital",
      "investment platform"
    ]
  },

  // Analytics Configuration (use environment variables in production)
  analytics: {
    googleAnalyticsId: (() => {
      const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
      if (!gaId && import.meta.env.PROD) {
        console.warn('⚠️ Google Analytics ID not configured for production');
      }
      return gaId || 'G-XXXXXXXXXX';
    })(),
    searchConsoleVerification: (() => {
      const verification = import.meta.env.VITE_SEARCH_CONSOLE_VERIFICATION;
      if (!verification && import.meta.env.PROD) {
        console.warn('⚠️ Search Console verification not configured for production');
      }
      return verification || 'your-google-search-console-verification-code';
    })()
  }
};

export default SITE_CONFIG;
